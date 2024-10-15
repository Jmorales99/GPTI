import React, { useState } from 'react';
import './App.css';
import JobDetails from './components/JobDetails'; 
import AdBanner from './components/ads/AdBanner'; 

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);

  const handleSearch = () => {
    setSearchResults([
      { id: 1, title: 'Desarrollador Web', location: 'Santiago', description: 'Trabajo de desarrollo web en React.' },
      { id: 2, title: 'Diseñador Gráfico', location: 'Valparaíso', description: 'Diseño gráfico para campañas digitales.' },
    ]);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job); 
  };

  return (
    <div className="app-container">
      <Navbar />

      {selectedJob ? (
        <JobDetails job={selectedJob} onBack={() => setSelectedJob(null)} />
      ) : (
        <>
          <header className="app-header">
            <h1>Encuentra tu trabajo ideal</h1>
          </header>

          <section className="search-section">
            <input type="text" placeholder="Buscar título del trabajo" className="input-field" />
            <input type="text" placeholder="Ubicación" className="input-field" />
            <button className="search-button" onClick={handleSearch}>Buscar</button>
          </section>
          <AdBanner />

          <section className="job-list">
            {searchResults.map((job) => (
              <JobItem key={job.id} job={job} onViewDetails={() => handleViewDetails(job)} />
            ))}
          </section>
        </>
      )}
    </div>
  );
}

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">GPTJOB</div>
  </nav>
);

const JobItem = ({ job, onViewDetails }) => (
  <div className="job-item">
    <h2>{job.title}</h2>
    <p>{job.location}</p>
    <button onClick={onViewDetails}>Abrir Detalles</button>
  </div>
);

export default App;
