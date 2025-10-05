// src/components/PublicationCard.js
import { useNavigate } from 'react-router-dom';
import './PublicationCard.css';

const PublicationCard = ({ publication }) => {
  // The data is in publication._source
  const navigate = useNavigate();
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

  const handleSummarize = () => {
    // Pass publication data via state
    navigate(`/summary/${accession}`, { 
      state: { 
        publication: data 
      } 
    });
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

      <div className="card-actions">
        <button onClick={handleOpenPublication} className="view-button">
          {isFromCSV ? 'View Full Publication →' : 'View Full Dataset →'}
        </button>
        <button onClick={handleSummarize} className="summarize-button">
          📄 Summarize with AI
        </button>
      </div>
    </div>
  );
};

export default PublicationCard;
