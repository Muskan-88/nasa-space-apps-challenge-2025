// Test NASA OSDR API connection
import axios from 'axios';

export const testNASAConnection = async () => {
  try {
    console.log('🔍 Testing NASA OSDR API...');
    
    // Test direct approach (should fail due to CORS)
    try {
      const directResponse = await axios.get('https://osdr.nasa.gov/osdr/data/search', {
        params: {
          term: 'gene',
          type: 'cgene',
          size: 5,
          from: 0
        },
        timeout: 10000
      });
      console.log('✅ Direct NASA OSDR works:', directResponse.data.hits?.hits?.length || 0);
    } catch (directError) {
      console.log('❌ Direct NASA failed (expected):', directError.message);
      
      // Test via CORS proxy
      try {
        const proxyResponse = await axios.get('https://api.allorigins.win/get', {
          params: {
            url: 'https://osdr.nasa.gov/osdr/data/search?term=gene&type=cgene&size=5&from=0'
          },
          timeout: 15000
        });
        
        const data = JSON.parse(proxyResponse.data.contents);
        console.log('✅ NASA OSDR via proxy works:', data.hits?.hits?.length || 0);
        console.log('Sample result:', data.hits?.hits?.[0]?._source?.accession || 'No data');
        return data;
      } catch (proxyError) {
        console.log('❌ NASA proxy failed:', proxyError.message);
        throw proxyError;
      }
    }
  } catch (error) {
    console.error('❌ NASA OSDR test failed:', error.message);
    throw error;
  }
};

export const testBackendConnection = async () => {
  try {
    console.log('🔍 Testing Backend API...');
    
    const response = await axios.get('http://localhost:3001/api/test-models', {
      timeout: 5000
    });
    
    console.log('✅ Backend API works:', response.data.status || response.data);
    return response.data;
  } catch (error) {
    console.error('❌ Backend API failed:', error.message);
    throw error;
  }
};

// Test function to call from browser console
window.testConnections = async () => {
  console.log('🚀 Starting connection tests...');
  
  try {
    await testNASAConnection();
  } catch (e) {
    console.error('NASA test failed:', e.message);
  }
  
  try {
    await testBackendConnection();
  } catch (e) {
    console.error('Backend test failed:', e.message);
  }
  
  console.log('✅ Connection tests completed!');
};