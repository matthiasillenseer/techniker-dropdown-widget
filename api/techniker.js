const fetch = require('node-fetch');

module.exports = async (req, res) => {
  // Dein echter API-Endpunkt, z.B. https://meine-backend.de/techniker
  const BACKEND_URL = 'https://meine-backend.de/techniker';
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'API_KEY not configured' });
  }

  try {
    const response = await fetch(BACKEND_URL, {
      headers: { 'Authorization': `Bearer ${apiKey}` }
    });
    if (!response.ok) {
      throw new Error(`Upstream error ${response.status}`);
    }
    const data = await response.json();
    // erwartet: { items: ["Max","Lisa",…] }
    res.setHeader('Cache-Control', 's-maxage=60, stale-while-revalidate');
    return res.json(data);
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Bad Gateway', details: err.message });
  }
};
