// src/components/PublicationCard.js
import './PublicationCard.css';

const PublicationCard = ({ publication }) => {
  const data = publication._source || publication;
  const isFromCSV = data['Data Source Type'] === 'csv';
  
  const handleOpenPublication = () => {
    if (isFromCSV && data.Link) {
      // CSV entry - open PMC link
      window.open(data.Link, '_blank');
    } else {
      // NASA entry - open OSDR page
      const accession = data.Accession;
      if (accession && !accession.startsWith('PMC-')) {
        window.open(`https://osdr.nasa.gov/bio/repo/data/studies/${accession}`, '_blank');
      }
    }
  };

  const title = data['Study Title'] || 'Untitled Study';
  const accession = data.Accession || 'N/A';
  const description = data['Study Description'] || 'No description available';
  const organism = data.organism || null;
  const assayType = data['Study Assay Technology Type'] || null;
  const authors = data['Study Publication Author List'] || null;

  return (
    <div className="publication-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <div className="card-badges">
          <span className="card-accession">{accession}</span>
          {isFromCSV && <span className="source-badge csv-badge">PubMed Central</span>}
        </div>
      </div>
      
      <p className="card-description">
        {description.length > 200 ? `${description.substring(0, 200)}...` : description}
      </p>
      
      {/* Only show NASA-specific metadata for non-CSV entries */}
      {!isFromCSV && (
        <div className="card-metadata">
          {organism && (
            <span className="metadata-tag">
              <strong>Organism:</strong> {organism}
            </span>
          )}
          {assayType && (
            <span className="metadata-tag">
              <strong>Assay Type:</strong> {assayType}
            </span>
          )}
          {authors && (
            <span className="metadata-tag metadata-authors">
              <strong>Authors:</strong> {authors.substring(0, 50)}{authors.length > 50 ? '...' : ''}
            </span>
          )}
        </div>
      )}
      
      <button onClick={handleOpenPublication} className="view-button">
        {isFromCSV ? 'Read on PubMed Central →' : 'View Full Dataset →'}
      </button>
    </div>
  );
};

export default PublicationCard;