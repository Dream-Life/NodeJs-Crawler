const puppeteer = require('puppeteer');
const { screenshot } = require('./config/default.js');

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://www.baidu.com');
    await page.screenshot({
        path: `${screenshot}/${Date.now()}.png`
    });
    await browser.close();
})();

// 'use strict';

// const puppeteer = require('puppeteer');

// (async() => {
//     const browser = await puppeteer.launch();
//     const page = await browser.newPage();
//     await page.goto('http://www.baidu.com');
//     await page.screenshot({ path: 'baidu.png' });
//     await browser.close();
// })();