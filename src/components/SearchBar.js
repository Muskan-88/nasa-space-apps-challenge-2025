// src/components/SearchBar.js
import { useState } from 'react';
import './SearchBar.css';

const SearchBar = ({ onSearch, loading }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(query);
  };

  const handleClear = () => {
    setQuery('');
    onSearch(''); // Clear results
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