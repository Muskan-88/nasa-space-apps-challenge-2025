import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { summarizeDocument } from '../services/claudeAPI';
import './SummaryPage.css';

const SummaryPage = () => {
  const { accession } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const publication = location.state?.publication;

  const [selectedSections, setSelectedSections] = useState([]);
  const [summaries, setSummaries] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const availableSections = [
    'Introduction',
    'Methods',
    'Results',
    'Discussion',
    'Conclusion'
  ];

  useEffect(() => {
    if (!publication) {
      // If no publication data, redirect back to home
      navigate('/');
    }
  }, [publication, navigate]);

  const handleSectionToggle = (section) => {
    setSelectedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  const handleSummarize = async () => {
    if (selectedSections.length === 0) {
      setError('Please select at least one section.');
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // Combine available text from the publication
      const documentText = `
Title: ${publication['Study Title'] || 'N/A'}
Accession: ${publication['Accession'] || 'N/A'}
Description: ${publication['Study Description'] || 'N/A'}
Organism: ${publication['organism'] || 'N/A'}
Assay Type: ${publication['Study Assay Technology Type'] || 'N/A'}
      `.trim();

      const response = await summarizeDocument(documentText, selectedSections);
      setSummaries(response.summaries);
    } catch (err) {
      setError(err.response?.data?.error || 'An error occurred while summarizing');
    } finally {
      setLoading(false);
    }
  };

  if (!publication) {
    return <div>Loading...</div>;
  }

  return (
    <div className="summary-page">
        <div className="summary-page-content">
            <button onClick={() => navigate(-1)} className="back-button">
                ← Back to Results
            </button>

            <div className="publication-info">
                <h1>{publication['Study Title'] || 'Untitled Study'}</h1>
                <p className="accession-info">Accession: {accession}</p>
                <p className="description">{publication['Study Description']}</p>
            </div>

        <div className="summarizer-section">
            <h2>Generate AI Summary</h2>
            
            <div className="section-selector">
            <label>Select sections to summarize:</label>
            <div className="section-buttons">
                {availableSections.map(section => (
                <button
                    key={section}
                    onClick={() => handleSectionToggle(section)}
                    className={`section-button ${
                    selectedSections.includes(section) ? 'selected' : ''
                    }`}
                >
                    {section}
                </button>
                ))}
            </div>
            </div>

            <button
            onClick={handleSummarize}
            disabled={loading || selectedSections.length === 0}
            className="summarize-action-button"
            >
            {loading ? 'Summarizing...' : 'Generate Summary'}
            </button>

            {error && (
            <div className="error-message">
                {error}
            </div>
            )}

            {summaries && (
            <div className="summaries-result">
                <h3>Summary Results</h3>
                {selectedSections.map(section => (
                summaries[section] && (
                    <div key={section} className="summary-section">
                    <h4>{section}</h4>
                    <p>{summaries[section]}</p>
                    </div>
                )
                ))}
            </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default SummaryPage;