// src/services/osdrApi.js
import axios from 'axios';

// Use relative URL - the proxy will forward to https://osdr.nasa.gov
const BASE_URL = '/osdr/data';

/**
 * Get all studies
 */
export const getAllStudies = async () => {
  try {
    console.log('Fetching all studies...');
    
    const response = await axios.get(`${BASE_URL}/search`, {
      params: {
        'term': '*',
        'type': 'cgene',
        'size': 100,
        'from': 0
      },
      timeout: 15000
    });
    
    console.log('All studies response:', response.data);
    
    if (response.data && response.data.hits) {
      return response.data.hits.hits || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error fetching all studies:', error);
    throw error;
  }
};

/**
 * Search publications
 */
// src/services/osdrApi.js
export const searchPublications = async (searchQuery, from = 0, size = 50) => {
  try {
    console.log(`Searching for "${searchQuery}" from=${from} size=${size}`);

    const response = await axios.get(`${BASE_URL}/search`, {
      params: { term: searchQuery, type: 'cgene', size, from },
      timeout: 10000,
    });

    if (response.data && response.data.hits) {
      const hits = response.data.hits.hits || [];
      // NASA sometimes sends total as a number or as an object with a 'value'
      const total = response.data.hits.total?.value ?? response.data.hits.total ?? 0;
      return { hits, total };
    }

    return { hits: [], total: 0 };
  } catch (error) {
    console.error('Error searching publications:', error);
    throw error;
  }
};


/**
 * Advanced search
 */
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
    
    const response = await axios.get(`${BASE_URL}/search`, { params });
    
    if (response.data && response.data.hits) {
      return response.data.hits.hits || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error with advanced search:', error);
    throw error;
  }
};