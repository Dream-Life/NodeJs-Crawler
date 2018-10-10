const puppeteer = require('puppeteer');
const { pdf } = require('./config/default.js');

(async() => {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://www.baidu.com', { waitUntil: 'networkidle2' });
    await page.pdf({
        path: `${pdf}/${Date.now()}.pdf`,
        format: 'A4'
    });
    await browser.close();
})();