const puppeteer = require('puppeteer');
const { mn } = require('./config/default.js');
const srcToImg = require('./helper/srcToimg.js');

(async() => {
    // 进入百度图片
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://image.baidu.com/');
    console.log('go to https://image.baidu.com/');

    // 自定义浏览器的大小
    await page.setViewport({
        width: 1920,
        height: 1080
    });
    console.log('reset viewport');

    // 输入搜索信息，点击搜索
    await page.focus('#kw');
    await page.keyboard.sendCharacter('神兽');
    await page.click('.s_search');
    console.log('go to search list');

    // 进入搜索页面，页面加载完成执行操作
    page.on('load', async() => {
        console.log('page loading done, start fetch...');

        const srcs = await page.evaluate(() => {
            const images = document.querySelectorAll('img.main_img');
            return Array.prototype.map.call(images, img => img.src);
        });
        console.log(`get ${srcs.length} images, start download`);

        srcs.forEach(async(src, index) => {
            // sleep 将爬数据低频，防止反爬虫；过于频繁爬数据，会出发反爬虫
            await page.waitFor(200);
            await srcToImg(src, mn, index);
        });

        await browser.close();
    });
})();