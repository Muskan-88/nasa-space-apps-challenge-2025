# NASA Research Explorer - AI-Powered Search Engine

An intelligent search engine that leverages AI to make NASA's scientific publications more accessible and understandable. This project combines NASA's Open Repository API with Cohere's AI capabilities to provide smart search and customizable summarization of scientific papers.

Visit at: https://aura-nasa-space-apps-challenge.vercel.app/

## Key Features
- **Smart Search**: Search through 608+ NASA scientific publications using natural language queries
- **AI-Powered Summaries**: Generate customizable summaries of complex research papers using Cohere AI
- **Interactive Interface**: User-friendly interface for exploring NASA's research repository
- **Customizable Summary Length**: Adjust summary length based on your needs
- **Publication Details**: Access full publication metadata, including authors, dates, and citations

## Technology Stack
### Frontend
- React 19 for dynamic UI components
- React Bootstrap for responsive design
- React Router for seamless navigation
- Modern ES6+ JavaScript

### Backend & AI Integration
- Express.js server for API handling
- Cohere AI API for intelligent text summarization
- NASA Open Repository API integration
- Environment variable management with dotenv
- CORS-enabled API security

### Deployment
- Frontend hosted on GitHub Pages
- Full-stack deployment on Vercel
- Automated build pipeline

## Development
```bash
# Install dependencies
npm install

# Start development server
npm start

# Build for production
npm run build
```

## How It Works
1. **Search**: Users can search through NASA's publication database using natural language queries
2. **AI Processing**: Cohere AI processes the search results and publication content
3. **Smart Summaries**: The system generates intelligent summaries of technical papers
4. **Customization**: Users can adjust summary length and focus areas

## Technical Implementation
- RESTful API integration with NASA's repository
- AI-powered text processing using Cohere's advanced NLP models
- Responsive React components for seamless user experience
- Efficient state management for search results and summaries

## Performance & Accessibility
- Optimized API calls and response caching
- Mobile-first responsive design
- Modern web vitals compliance
- Accessible UI components

## Future Enhancements
- Advanced filtering options
- Multi-language support
- Citation export functionality
- Collaborative research features
