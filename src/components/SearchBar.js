// src/components/SearchBar.js
import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');
  const [source, setSource] = useState('all'); // <--- NEW: filter state

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query, source); // <--- pass both query & filter
  };

  const handleClear = () => {
    setQuery('');
    onSearch('', source); // clear results but keep filter
  };

  return (
    <div className="search-bar-container">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, author, organism, keywords..."
            className="search-input"
            disabled={loading}
          />
          {query && (
            <button 
              type="button" 
              onClick={handleClear} 
              className="clear-button"
              disabled={loading}
            >
              ✕
            </button>
          )}
        </div>

        {/* 🔽 New: Filter dropdown */}
        <div className="filter-wrapper">
          <label htmlFor="source" className="filter-label">Data Source:</label>
          <select
            id="source"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            disabled={loading}
            className="filter-select"
          >
            <option value="all">All</option>
            <option value="nasa">NASA OSDR</option>
            <option value="csv">CSV Publications</option>
          </select>
        </div>

        <button 
          type="submit" 
          className="search-button"
          disabled={loading || !query.trim()}
        >
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>
    </div>
  );
};

export default SearchBar;
