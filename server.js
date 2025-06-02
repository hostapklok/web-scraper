const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Axios Scraper is running');
});

app.get('/scrape', async (req, res) => {
  const url = req.query.url;
  
  if (!url) {
    return res.status(400).send('Missing URL parameter');
  }

  try {
    const response = await axios.get(url, {
      timeout: 30000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
        'Accept-Encoding': 'gzip, deflate',
        'Connection': 'keep-alive'
      },
      maxRedirects: 5,
      validateStatus: function (status) {
        return status < 500; // Accept anything less than 500
      }
    });

    res.setHeader('Content-Type', 'text/html');
    res.send(response.data);

  } catch (error) {
    console.error('Scraping error:', error.message);
    res.status(500).send(`Scraping failed: ${error.message}`);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
