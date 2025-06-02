const express = require('express');
const puppeteer = require('puppeteer');
const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Scraper is running');
});

app.get('/scrape', async (req, res) => {
    const url = req.query.url;
    if (!url) {
        return res.status(400).send('Missing URL parameter');
    }
    try {
        const browser = await puppeteer.launch({
            headless: 'new',
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url, { waitUntil: 'networkidle2', timeout: 60000 });
        const content = await page.content();
        await browser.close();
        res.send(content);
    } catch (error) {
        console.error('Scraping error:', error);
        res.status(500).send(`Scraping failed: ${error.message}`);
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});