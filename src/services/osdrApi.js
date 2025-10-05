// src/services/osdrApi.js
import axios from 'axios';
import { fetchCSVPublications, searchCSVPublications } from './csvParser';

const BASE_URL = '/osdr/data';  // Relative URL - proxy handles it

// src/services/osdrApi.js
export const searchPublications = async (searchQuery, from = 0, size = 50, source = 'all') => {
  try {
    console.log(`Searching for "${searchQuery}" from=${from} size=${size}, source=${source}`);

    let osdrHits = [];
    let osdrTotal = 0;
    let csvHits = [];
    let csvTotal = 0;

    // 🔹 NASA OSDR search
    if (source === 'all' || source === 'nasa') {
      const osdrResponse = await axios.get(`${BASE_URL}/search`, {
        params: {
          term: searchQuery,
          type: 'cgene',
          size: size,
          from: from
        },
        timeout: 10000,
      });

      const osdrData = osdrResponse.data;
      osdrHits = osdrData?.hits?.hits || [];
      osdrTotal = osdrData?.hits?.total?.value ?? osdrData?.hits?.total ?? 0;
      console.log(`NASA OSDR: ${osdrHits.length} results`);
    }

    // 🔹 CSV Publications search
    if ((source === 'all' || source === 'csv') && from === 0) {
      try {
        const csvData = await fetchCSVPublications();
        csvHits = searchCSVPublications(csvData, searchQuery);
        csvTotal = csvHits.length;
        console.log(`CSV: ${csvHits.length} results`);
      } catch (csvError) {
        console.warn('CSV search failed, continuing with NASA only:', csvError);
      }
    }

    // 🔹 Combine results
    const combinedHits = [...csvHits, ...osdrHits];
    const combinedTotal = osdrTotal + csvTotal;

    return { hits: combinedHits, total: combinedTotal };

  } catch (error) {
    console.error('Error searching publications:', error);
    throw error;
  }
};


// Keep your existing getAllStudies and advancedSearch functions
export const getAllStudies = async () => {
  try {
    console.log('Fetching all studies...');
    
    const searchUrl = `${BASE_URL}/search?term=*&type=cgene&size=100&from=0`;
    
    const response = await axios.get(`https://api.allorigins.win/get`, {
      params: { url: searchUrl },
      timeout: 15000
    });
    
    const data = JSON.parse(response.data.contents);
    
    if (data && data.hits) {
      return data.hits.hits || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching all studies:', error);
    throw error;
  }
};

export const advancedSearch = async (filters) => {
  try {
    const params = {
      'type': 'cgene',
      'size': 50,
      'from': 0
    };

    if (filters.query && filters.query.trim()) {
      params.term = filters.query;
    }

    if (filters.organism && filters.organism.trim()) {
      params.ffield = 'organism';
      params.fvalue = filters.organism;
    }

    console.log('Advanced search params:', params);
    
    const searchUrl = `${BASE_URL}/search`;
    const response = await axios.get(`https://api.allorigins.win/get`, {
      params: { url: `${searchUrl}?${new URLSearchParams(params)}` }
    });
    
    const data = JSON.parse(response.data.contents);
    
    if (data && data.hits) {
      return data.hits.hits || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error with advanced search:', error);
    throw error;
  }
};