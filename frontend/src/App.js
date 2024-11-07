// App.js
import React, { useState, useEffect } from 'react';
import './App.css';
import AdBanner from './AdBanner';
import archivoJson from './trabajos.json';

function App() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [coverLetter, setCoverLetter] = useState('');
  const [jobInfo, setJobInfo] = useState({
    nombre: '',
    telefono: '',
    correo: '',
    habilidades: ['', '', '', '', ''],
    experiencia: '',
    intereses: '',
    porque: ''
  });

  const opcionesExperiencia = [
    { value: '0', label: 'Sin experiencia' },
    { value: '1', label: '1 año' },
    { value: '2', label: '2 años' },
    { value: '3', label: '3 años' },
    { value: '4', label: 'Más de 3 años' }
  ];

  useEffect(() => {
    setCategories(archivoJson.categories);
  }, []);
  
  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFilteredJobs(category.jobs);
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
  };

  const handleInputChange = (index, value) => {
    const updatedSkills = [...jobInfo.habilidades];
    updatedSkills[index] = value;
    setJobInfo({ ...jobInfo, habilidades: updatedSkills });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJobInfo({ ...jobInfo, [name]: value });
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch('http://localhost:3000/recomendaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jobInfo),
      });

      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
  
      const data = await response.json();
      const generatedCoverLetter = data.carta || 'No se generó una carta de presentación';
      setCoverLetter(generatedCoverLetter);

    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
  };
  
  return (
    <div className="app-container">
      <Navbar />

      {/* Left and Right ad banners */}
      <AdBanner position="left" />
      <AdBanner position="right" />

      {selectedJob ? (
        <JobDetails 
          job={selectedJob} 
          onBack={() => setSelectedJob(null)} 
          jobInfo={jobInfo} 
          onInputChange={handleInputChange} 
          onChange={handleChange} 
          onSubmit={handleSubmit}
          opcionesExperiencia={opcionesExperiencia}
          coverLetter={coverLetter}
        />
      ) : (
        <>
          <header className="app-header">
            <h1>Encuentra tu trabajo ideal</h1>
          </header>

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

      {/* Bottom ad banner */}
      <AdBanner position="bottom" />
    </div>
  );
}

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">GPTJOB</div>
  </nav>
);

const JobDetails = ({ job, onBack, jobInfo, onInputChange, onChange, onSubmit, opcionesExperiencia, coverLetter }) => (
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

      <input
        type="text"
        name="telefono"
        placeholder="Teléfono"
        className="input-field"
        value={jobInfo.telefono}
        onChange={onChange}
      />

      <input
        type="text"
        name="correo"
        placeholder="Correo Electrónico"
        className="input-field"
        value={jobInfo.correo}
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

      <input
        type="text"
        name="porque"
        placeholder="¿Por qué quieres trabajar con nosotros?"
        className="input-field"
        value={jobInfo.porque}
        onChange={onChange}
      />

      <button className="search-button" onClick={onSubmit}>Generar Carta de Presentación</button>
    </section>

    {coverLetter && (
      <section className="cover-letter">
      <h3>Carta de Presentación Generada:</h3>
      <div className="cover-letter-box">
        {coverLetter.split('\n').map((line, index) => (
          <p key={index}>{line}</p>
        ))}
      </div>
    </section>
    )}
  </div>
);

const JobItem = ({ job, onViewDetails }) => (
  <div className="job-item">
    <h2>{job.title}</h2>
    <p>{job.location}</p>
    <button onClick={onViewDetails}>Abrir Detalles</button>
  </div>
);

export default App;
