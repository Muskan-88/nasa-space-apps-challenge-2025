const express = require('express');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb' }));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/summarize', async (req, res) => {
  try {
    const { documentText, sections } = req.body;
    const sectionsList = sections.join(', ');
    
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });
    
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

    const result = await model.generateContent(prompt);
    const response = result.response;
    const responseText = response.text();
    
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
    const models = await genAI.listModels();
    res.json({ models });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});