const axios = require('axios');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { term, type = 'cgene', size = 50, from = 0 } = req.query;
    
    if (!term) {
      return res.status(400).json({ error: 'Search term is required' });
    }
    
    console.log(`🔍 NASA OSDR Search: term="${term}" type="${type}" size="${size}" from="${from}"`);
    
    const nasaUrl = 'https://osdr.nasa.gov/osdr/data/search';
    const response = await axios.get(nasaUrl, {
      params: { term, type, size, from },
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36'
      }
    });
    
    console.log(`✅ NASA OSDR Success: ${response.data?.hits?.hits?.length || 0} results`);
    res.status(200).json(response.data);
    
  } catch (error) {
    console.error('❌ NASA OSDR Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to fetch NASA OSDR data',
      details: error.message 
    });
  }
};