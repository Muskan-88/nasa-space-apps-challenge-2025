import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_BACKEND_URL || 'http://localhost:3001';

export const summarizeDocument = async (documentText, sections) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/summarize`, {
      documentText,
      sections
    });
    return response.data;
  } catch (error) {
    console.error('Error summarizing document:', error);
    throw error;
  }
};