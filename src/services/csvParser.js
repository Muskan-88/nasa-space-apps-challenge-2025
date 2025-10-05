// src/services/csvParser.js
import Papa from 'papaparse';

const CSV_URL = 'https://raw.githubusercontent.com/jgalazka/SB_publications/main/SB_publication_PMC.csv';

let cachedCSVData = null;

export const fetchCSVPublications = async () => {
  if (cachedCSVData) {
    return cachedCSVData;
  }

  try {
    const response = await fetch(CSV_URL);
    const csvText = await response.text();
    
    return new Promise((resolve, reject) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          console.log('CSV loaded:', results.data.length, 'entries');
          console.log('Sample CSV entry:', results.data[0]); // See column names
          cachedCSVData = results.data;
          resolve(results.data);
        },
        error: (error) => {
          reject(error);
        }
      });
    });
  } catch (error) {
    console.error('Error fetching CSV:', error);
    throw error;
  }
};

export const searchCSVPublications = (data, query) => {
  if (!query.trim()) return [];
  
  const lowerQuery = query.toLowerCase();
  
  return data.filter(pub => {
    // Check the actual column names - adjust these based on console.log above
    const title = (pub.Title || pub.title || pub.TITLE || '').toLowerCase();
    return title.includes(lowerQuery);
  }).map(pub => ({
    // Normalize to match NASA format
    _source: {
      'Study Title': pub.Title || pub.title || pub.TITLE,
      'Accession': 'PMC-' + (pub.PMCID || Math.random().toString(36).substr(2, 9)),
      'Study Description': 'Publication from PubMed Central database',
      'Data Source Type': 'csv',
      'Link': pub.Link || pub.link || pub.URL || pub.url
    }
  }));
};