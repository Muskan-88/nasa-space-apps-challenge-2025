import axios from 'axios';

export const summarizeDocument = async (documentText, sections) => {
  try {
    const response = await axios.post('/api/summarize', {
      documentText,
      sections
    });
    return response.data;
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw error;
  }
};