// src/components/PublicationCard.js
import './PublicationCard.css';

const PublicationCard = ({ publication }) => {
  // The data is in publication._source
  const data = publication._source || publication;
  
  console.log('Publication data:', data); // DEBUG - check what fields exist
  
  const handleOpenPublication = () => {
    const accession = data['Accession'] || data['Study Identifier'] || data['accession'];
    if (accession) {
      window.open(`https://osdr.nasa.gov/bio/repo/data/studies/${accession}`, '_blank');
    }
  };

  // Try multiple possible field names
  const title = data['Study Title'] || data['title'] || data['Study_Title'] || 'Untitled Study';
  const accession = data['Accession'] || data['Study Identifier'] || data['accession'] || 'N/A';
  const description = data['Study Description'] || data['description'] || data['Study_Description'] || 'No description available';
  const organism = data['organism'] || data['Organism'] || null;
  const assayType = data['Study Assay Technology Type'] || data['assayType'] || null;
  const authors = data['Study Publication Author List'] || data['authors'] || null;

  return (
    <div className="publication-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className="card-accession">{accession}</span>
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
      
      <button onClick={handleOpenPublication} className="view-button">
        View Full Dataset →
      </button>
    </div>
  );
};

export default PublicationCard;