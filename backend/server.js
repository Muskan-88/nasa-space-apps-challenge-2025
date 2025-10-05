const express = require('express');
const { CohereClient } = require('cohere-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const cohere = new CohereClient({
  token: 'GX6kcXRmtY8IKIyvawKuzlO3uZYX2vzZrtDJ7kzv'
});

app.post('/api/summarize', async (req, res) => {
  try {
    const { documentText, sections } = req.body;
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
    
    res.json({ summaries });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.get('/api/test-models', async (req, res) => {
  try {
    // Test Cohere connection with a simple request
    const response = await cohere.chat({
      message: 'Hello, this is a test message.',
      model: 'command-r-plus-08-2024',
      max_tokens: 10
    });
    res.json({ 
      status: 'Cohere API connected successfully',
      test_response: response.text 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});