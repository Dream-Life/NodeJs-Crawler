const http = require('http');
const https = require('https');
const fs = require('fs');
const path = require('path')
const { promisify } = require('util')

module.exports = async(src, dir, index) => {
    // console.log(src);
    if (/\.(jpg|png|gif)$/.test(src)) {
        await urlToImg(src, dir, index);
    } else {
        await base64ToImg(src, dir, index);
    }
};

// url => img
const urlToImg = promisify((url, dir, index, callback) => {
    const mod = /^https:/.test(url) ? https : http;
    const ext = path.extname(url);
    const file = path.join(dir, `${Date.now()}_${index}${ext}`);

    mod.get(url, res => {
        res.pipe(fs.createWriteStream(file))
            .on('finish', () => {
                callback();
                console.log(file);
            });
    });
});

// base64 => img
const writeFile = promisify(fs.writeFile);
const base64ToImg = async(base64Str, dir, index) => {
    // data:image/jpeg;base64,/asadsda....

    // ?是非贪婪模式，遇到‘；’就停止；没有？就是贪婪模式，尽可能的不停止
    const matches = base64Str.match(/^data:(.+?);base64,(.+)$/);
    // console.log(matches);

    try {
        const ext = matches[1].split('/')[1]
            .replace('jpeg', 'jpg');
        const file = path.join(dir, `${Date.now()}_${index}.${ext}`);

        await writeFile(file, matches[2], 'base64');
        console.log(file);
    } catch (error) {
        console.log('非法 base64 字符串');
    }
};