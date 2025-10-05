// src/components/Home.js
import React, { useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import { searchPublications } from '../services/osdrApi';
import './Home.css';

const Home = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [searchPerformed, setSearchPerformed] = useState(false);

  // pagination state
  const [query, setQuery] = useState('');
  const [from, setFrom] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const PAGE_SIZE = 50; // NASA API limit

  // Inside Home.js
  const handleSearch = async (newQuery, source = 'all') => {
    if (!newQuery.trim()) {
      setResults([]);
      setSearchPerformed(false);
      return;
    }

    setLoading(true);
    setError(null);
    setSearchPerformed(true);
    setQuery(newQuery);
    setFrom(0);

    try {
      const { hits, total } = await searchPublications(newQuery, 0, PAGE_SIZE, source); // <--- pass source
      setResults(hits);
      setTotalResults(total);
      setFrom(PAGE_SIZE);
    } catch (err) {
      console.error('Search error:', err);
      setError('Failed to fetch results. Please try again.');
      setResults([]);
    } finally {
      setLoading(false);
    }
  };


  // Load more results
  const handleLoadMore = async () => {
    setLoadingMore(true);
    try {
      const { hits } = await searchPublications(query, from, PAGE_SIZE);
      setResults((prev) => [...prev, ...hits]);
      setFrom((prev) => prev + PAGE_SIZE);
    } catch (err) {
      console.error('Error loading more:', err);
      setError('Could not load more results.');
    } finally {
      setLoadingMore(false);
    }
  };

  const hasMore = results.length < totalResults;

  return (
    <div className="home-container">
      <div className="content">
        <h1>Astrobiological Understanding & Research Assistant</h1>
        <h2>Explore Biological and Physical Science Data</h2>
        <p>
          Explore space biology research datasets from NASA's Open Science Data Repository and the 
          608 Space Biology. Search by keywords, organisms, authors, and more.
        </p>

        <SearchBar onSearch={handleSearch} loading={loading || loadingMore} />

        {error && (
          <div className="error-message">
            <p>{error}</p>
          </div>
        )}

        <SearchResults 
          publications={results}
          totalResults={totalResults} 
          loading={loading}
          searchPerformed={searchPerformed}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
          loadingMore={loadingMore}
        />
      </div>
    </div>
  );
};

export default Home;
