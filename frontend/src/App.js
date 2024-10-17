import React, { useState } from 'react';
import './App.css';
import JobDetails from './components/JobDetails'; 
import AdBanner from './components/ads/AdBanner'; 

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [viewForm, setViewForm] = useState(false);
  const [recommendations, setRecommendations] = useState([]); 
  const [jobInfo, setJobInfo] = useState({
    nombre: '',
    habilidades: ['', '', '', '', ''],
    experiencia: '',
    intereses: ''
  });

  const opcionesExperiencia = [
    { value: '0', label: 'Sin experiencia' },
    { value: '1', label: '1 año' },
    { value: '2', label: '2 años' },
    { value: '3', label: '3 años' },
    { value: '4', label: 'Más de 3 años' }
  ];

  const handleSearch = () => {
    setSearchResults([
      { id: 1, title: 'Desarrollador Web', location: 'Santiago', description: 'Trabajo de desarrollo web en React.' },
      { id: 2, title: 'Diseñador Gráfico', location: 'Valparaíso', description: 'Diseño gráfico para campañas digitales.' },
    ]);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job); 
  };

  const handleInputChange = (index, value) => {
    const updatedSkills = [...jobInfo.habilidades];
    updatedSkills[index] = value;
    setJobInfo({ ...jobInfo, habilidades: updatedSkills });
  };

  const handleChange = (e) => {
    setJobInfo({ ...jobInfo, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    console.log("handleSubmit fue llamado"); 
  
    const jobDescription = {
      aptitudes: jobInfo.habilidades.filter(skill => skill.trim() !== ''),
    };
  
    console.log("Enviando información al chat:", jobDescription);
  
    try {
      const response = await fetch('http://localhost:3000/recomendaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobDescription),
      });
  
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
  
      const data = await response.json();
      console.log("Datos recibidos del servidor:", data); 

      const receivedRecommendations = data.recomendaciones.split('\n').map(item => item.trim());
      setRecommendations(receivedRecommendations); 
  
    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
  
    setViewForm(false); 
  };

  const handleToggleForm = () => {
    setViewForm(!viewForm);
    if (!viewForm) {
      setRecommendations([]);  
    }
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

          <AdBanner />

          <section className="job-list">
            {searchResults.map((job) => (
              <JobItem key={job.id} job={job} onViewDetails={() => handleViewDetails(job)} />
            ))}
          </section>

          <button className="search-button" onClick={handleToggleForm}>
            {viewForm ? 'Ocultar Formulario' : 'Añadir Detalles del Trabajo'}
          </button>

          {viewForm && (
            <section className="search-section">
              <input
                type="text"
                name="nombre"
                placeholder="Nombre"
                className="input-field"
                value={jobInfo.nombre}
                onChange={handleChange}
              />

              {jobInfo.habilidades.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  placeholder={`Habilidad ${index + 1}`}
                  className="input-field"
                  value={skill}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                />
              ))}

              <select
                name="experiencia"
                className="input-field"
                value={jobInfo.experiencia}
                onChange={handleChange}
              >
                <option value="">Selecciona la experiencia</option>
                {opcionesExperiencia.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <input
                type="text"
                name="intereses"
                placeholder="Intereses"
                className="input-field"
                value={jobInfo.intereses}
                onChange={handleChange}
              />

              <button className="search-button" onClick={handleSubmit}>Enviar Datos</button>
            </section>
          )}

          {recommendations.length > 0 && (
            <section className="recommendations-section">
              <h2>Recomendaciones basadas en tu perfil:</h2>
              <div className="recommendations-list">
                {recommendations.map((rec, index) => (
                  <div key={index} className="recommendation-card">
                    <p>{rec}</p>
                  </div>
                ))}
              </div>
            </section>
          )}
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
