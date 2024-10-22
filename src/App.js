import React, { useState, useEffect } from 'react';
import './App.css';
import AdBanner from './components/ads/AdBanner';
import archivoJson from './trabajos.json';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [recommendations, setRecommendations] = useState([]); 
  const [jobInfo, setJobInfo] = useState({
    nombre: '',
    habilidades: ['', '', '', '', ''],
    experiencia: '',
    intereses: ''
  });

  // Definir opciones de experiencia
  const opcionesExperiencia = [
    { value: '0', label: 'Sin experiencia' },
    { value: '1', label: '1 año' },
    { value: '2', label: '2 años' },
    { value: '3', label: '3 años' },
    { value: '4', label: 'Más de 3 años' }
  ];

  useEffect(() => {
    // Cargar el archivo JSON y asignarlo al estado
    setCategories(archivoJson.categories);
  }, []);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFilteredJobs(category.jobs);
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
  
    // Crear una descripción de trabajo y del usuario para enviar al chat
    const jobDescriptionText = `
      Me gustaría postularme al siguiente trabajo:
      - Título del trabajo: ${selectedJob.title}
      - Ubicación: ${selectedJob.location}
      - Descripción del trabajo: ${selectedJob.description}
      
      A continuación mis detalles:
      - Nombre: ${jobInfo.nombre}
      - Habilidades: ${jobInfo.habilidades.filter(skill => skill.trim() !== '').join(', ')}
      - Experiencia: ${opcionesExperiencia.find(opt => opt.value === jobInfo.experiencia)?.label || 'No especificada'}
      - Intereses: ${jobInfo.intereses || 'No especificados'}
    `;
  
    console.log("Enviando el siguiente texto al chat:", jobDescriptionText);
  
    try {
      const response = await fetch('http://localhost:3000/recomendaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: jobDescriptionText }),
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
  };
  

  return (
    <div className="app-container">
      <Navbar />

      {selectedJob ? (
        <JobDetails 
          job={selectedJob} 
          onBack={() => setSelectedJob(null)} 
          jobInfo={jobInfo} 
          onInputChange={handleInputChange} 
          onChange={handleChange} 
          onSubmit={handleSubmit} // Pasamos la función submit aquí
          opcionesExperiencia={opcionesExperiencia} // Pasamos las opciones de experiencia también
        />
      ) : (
        <>
          <header className="app-header">
            <h1>Encuentra tu trabajo ideal</h1>
          </header>

          <AdBanner />

          <section className="category-list">
            {categories.map((category, index) => (
              <button 
                key={index} 
                onClick={() => handleCategoryClick(category)} 
                className="category-button"
              >
                {category.category}
              </button>
            ))}
          </section>


          {filteredJobs.length > 0 && (
            <section className="job-list">
              {filteredJobs.map((job) => (
                <JobItem key={job.id} job={job} onViewDetails={() => handleViewDetails(job)} />
              ))}
            </section>
          )}
        </>
      )}
    </div>
  );
}

const JobDetails = ({ job, onBack, jobInfo, onInputChange, onChange, onSubmit, opcionesExperiencia }) => (
  <div className="job-details">
    <button onClick={onBack}>Volver</button>
    <h2>{job.title}</h2>
    <p>{job.location}</p>
    <p>{job.description}</p>

    <section className="search-section">
      <input
        type="text"
        name="nombre"
        placeholder="Nombre"
        className="input-field"
        value={jobInfo.nombre}
        onChange={onChange}
      />

      {jobInfo.habilidades.map((skill, index) => (
        <input
          key={index}
          type="text"
          placeholder={`Habilidad ${index + 1}`}
          className="input-field"
          value={skill}
          onChange={(e) => onInputChange(index, e.target.value)}
        />
      ))}

      <select
        name="experiencia"
        className="input-field"
        value={jobInfo.experiencia}
        onChange={onChange}
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
        onChange={onChange}
      />

      <button className="search-button" onClick={onSubmit}>Generar Carta de Presentación</button>
    </section>
  </div>
);

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
