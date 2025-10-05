import PublicationCard from './PublicationCard';
import './SearchResults.css';

const SearchResults = ({ publications, loading, searchPerformed, onLoadMore, hasMore, loadingMore }) => {
  if (loading) {
    return (
      <div className="results-container">
        <div className="loading-spinner">
          <div className="spinner"></div>
          <p>Searching NASA OSDR database...</p>
        </div>
      </div>
    );
  }

  if (!searchPerformed) {
    return (
      <div className="results-container">
        <div className="no-search">
          <p>Enter a search term to find publications</p>
        </div>
      </div>
    );
  }

  if (publications.length === 0) {
    return (
      <div className="results-container">
        <div className="no-results">
          <p>No results found. Try a different search term.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="results-container">
      <div className="results-header">
        <p>{publications.length} result{publications.length !== 1 ? 's' : ''} displayed</p>
      </div>
      <div className="results-grid">
        {publications.map((pub, index) => (
          <PublicationCard key={index} publication={pub} />
        ))}
      </div>

      {hasMore && (
        <div className="load-more-container">
          <button 
            className="load-more-button"
            onClick={onLoadMore}
            disabled={loadingMore}
          >
            {loadingMore ? 'Loading more...' : 'Load More'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchResults;
