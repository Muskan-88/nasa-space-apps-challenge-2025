const { CohereClient } = require('cohere-ai');

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { documentText, sections } = req.body;
    
    if (!documentText || !sections) {
      return res.status(400).json({ error: 'documentText and sections are required' });
    }

    const cohere = new CohereClient({
      token: process.env.COHERE_API_KEY
    });

    const sectionsList = sections.join(', ');
    
    const prompt = `You are analyzing a scientific document about space biology. 

Please provide summaries for the following sections: ${sectionsList}

Document:
${documentText}

For each requested section (${sectionsList}), provide:
1. A clear heading with the section name
2. A concise summary (3-5 sentences) of the key points

Format your response as JSON with this structure:
{
  "Introduction": "summary text here",
  "Methods": "summary text here",
  "Results": "summary text here",
  "Discussion": "summary text here",
  "Conclusion": "summary text here"
}

Only include the sections that were requested: ${sectionsList}`;

    const response = await cohere.chat({
      message: prompt,
      model: 'command-r-plus-08-2024',
      max_tokens: 1000,
      temperature: 0.3
    });
    
    const responseText = response.text;
    
    // Parse JSON from response
    let summaries;
    try {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      summaries = jsonMatch ? JSON.parse(jsonMatch[0]) : {};
    } catch (e) {
      summaries = { raw: responseText };
    }
    
    res.status(200).json({ summaries });
    
  } catch (error) {
    console.error('Cohere API Error:', error.message);
    res.status(500).json({ 
      error: 'Failed to generate summary',
      details: error.message 
    });
  }
};