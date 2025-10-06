// src/services/osdrApi.js
import axios from 'axios';
import { fetchCSVPublications, searchCSVPublications } from './csvParser';

export const searchPublications = async (searchQuery, from = 0, size = 50, source = 'all') => {
  try {
    console.log(`Searching for "${searchQuery}" from=${from} size=${size}, source=${source}`);

    let osdrHits = [];
    let osdrTotal = 0;
    let csvHits = [];
    let csvTotal = 0;

    // NASA OSDR search via backend proxy
    if (source === 'all' || source === 'nasa') {
      try {
        console.log(`NASA OSDR Search via backend: term="${searchQuery}" size=${size} from=${from}`);
        
        // Use backend proxy to avoid CORS issues
        const response = await axios.get('/api/nasa-search', {
          params: {
            term: searchQuery,
            type: 'cgene',
            size: size,
            from: from
          },
          timeout: 15000,
        });

        const osdrData = response.data;
        osdrHits = osdrData?.hits?.hits || [];
        osdrTotal = osdrData?.hits?.total?.value ?? osdrData?.hits?.total ?? 0;
        console.log(`NASA OSDR via backend: ${osdrHits.length} results out of ${osdrTotal} total`);
      } catch (osdrError) {
        console.error('NASA OSDR Backend Error:', osdrError.message);
        console.error('NASA OSDR Error Details:', osdrError.response?.data || osdrError);
        // Continue with CSV only if NASA fails
      }
    }

    // CSV Publications search
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

    // Combine results
    const combinedHits = [...csvHits, ...osdrHits];
    const combinedTotal = osdrTotal + csvTotal;

    return { hits: combinedHits, total: combinedTotal };

  } catch (error) {
    console.error('Error searching publications:', error);
    throw error;
  }
};

export const getAllStudies = async () => {
  try {
    console.log('Fetching all studies...');
    
    const response = await axios.get('/api/nasa-search', {
      params: {
        term: '*',
        type: 'cgene',
        size: 100,
        from: 0
      },
      timeout: 15000
    });
    
    const data = response.data;
    
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
    
    const response = await axios.get('/api/nasa-search', {
      params: params,
      timeout: 15000
    });
    
    const data = response.data;
    
    if (data && data.hits) {
      return data.hits.hits || [];
    }
    
    return [];
  } catch (error) {
    console.error('Error with advanced search:', error);
    throw error;
  }
};
