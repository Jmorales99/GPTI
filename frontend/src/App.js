import React, { useState, useEffect } from 'react';
import './App.css';
import AdBanner from './AdBanner';

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
    porque: '',
    oferta: '',
  });

  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    pageSize: 5,
    totalJobs: 0,
  });

  const opcionesExperiencia = [
    { value: '0', label: 'Sin experiencia' },
    { value: '1', label: '1 año' },
    { value: '2', label: '2 años' },
    { value: '3', label: '3 años' },
    { value: '4', label: 'Más de 3 años' }
  ];

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('http://localhost:3000/categories');
        if (!response.ok) throw new Error('Error al obtener categorías desde el servidor');
        
        const categoriesData = await response.json();
        setCategories(categoriesData.map(category => ({ category, jobs: [] })));
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  const fetchJobs = async (page = 1) => {
    try {
      const response = await fetch(`http://localhost:3000/jobs?page=${page}`);
      if (!response.ok) throw new Error('Error al obtener trabajos desde el servidor');
      
      const data = await response.json();
      setFilteredJobs(data.jobs); 
      setPagination(data.pagination);  
    } catch (error) {
      console.error("Error al obtener trabajos:", error);
    }
  };

  useEffect(() => {
    fetchJobs(pagination.currentPage);
  }, [pagination.currentPage]);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setPagination({ ...pagination, currentPage: 1 });
    fetchJobs(1); 
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setCoverLetter('');
    setJobInfo({
      nombre: '',
      telefono: '',
      correo: '',
      habilidades: ['', '', '', '', ''],
      experiencia: '',
      intereses: '',
      porque: '',
    });
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
    // Información del usuario que va a acompañar la oferta
    const userData = {
      nombre: jobInfo.nombre,        // Nombre del usuario
      telefono: jobInfo.telefono,    // Teléfono del usuario
      correo: jobInfo.correo,        // Correo del usuario
      habilidades: jobInfo.habilidades,  // Habilidades del usuario
      experiencia: jobInfo.experiencia, // Experiencia del usuario
      intereses: jobInfo.intereses,   // Intereses del usuario
      porque: jobInfo.porque,         // Motivación del usuario para el puesto
      oferta: selectedJob.description,        // Descripción del trabajo que viene del trabajo seleccionado
    };
    console.log(userData);
  
    try {
      const response = await fetch('http://localhost:3001/recomendaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData), // Enviar los datos del usuario junto con la oferta de trabajo
      });
  
      if (!response.ok) throw new Error('Error en la respuesta del servidor');
  
      const data = await response.json();
      setCoverLetter(data.carta || 'No se generó una carta de presentación');
    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
  };
  

  // const handleSubmit = async () => {
  //   try {
  //     const response = await fetch('http://localhost:3001/recomendaciones', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(jobInfo),
  //     });

  //     if (!response.ok) throw new Error('Error en la respuesta del servidor');
      
  //     const data = await response.json();
  //     setCoverLetter(data.carta || 'No se generó una carta de presentación');
  //   } catch (error) {
  //     console.error("Error al enviar datos al backend:", error);
  //   }
  // };

  const handleNextPage = () => {
    if (pagination.currentPage < pagination.totalPages) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage + 1 }));
    }
  };

  const handlePrevPage = () => {
    if (pagination.currentPage > 1) {
      setPagination((prev) => ({ ...prev, currentPage: prev.currentPage - 1 }));
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
              <div className="pagination-controls">
                <button onClick={handlePrevPage} disabled={pagination.currentPage === 1}>
                  Anterior
                </button>
                <span>Página {pagination.currentPage} de {pagination.totalPages}</span>
                <button onClick={handleNextPage} disabled={pagination.currentPage === pagination.totalPages}>
                  Siguiente
                </button>
              </div>
            </section>
          )}
        </>
      )}

      {/* Fila de banners en la parte inferior */}
      <div className="ad-banner-row">
        <AdBanner position="bottom" />
        <AdBanner position="bottom" />
        <AdBanner position="bottom" />
      </div>
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
    <p>{job.city}</p>
    <p>{job.description}</p>

    <section className="search-section">
      <input type="text" name="nombre" placeholder="Nombre" className="input-field" value={jobInfo.nombre} onChange={onChange} />
      <input type="text" name="telefono" placeholder="Teléfono" className="input-field" value={jobInfo.telefono} onChange={onChange} />
      <input type="text" name="correo" placeholder="Correo Electrónico" className="input-field" value={jobInfo.correo} onChange={onChange} />
      
      {jobInfo.habilidades.map((skill, index) => (
        <input key={index} type="text" placeholder={`Habilidad ${index + 1}`} className="input-field" value={skill} onChange={(e) => onInputChange(index, e.target.value)} />
      ))}

      <select name="experiencia" className="input-field" value={jobInfo.experiencia} onChange={onChange}>
        <option value="">Selecciona la experiencia</option>
        {opcionesExperiencia.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>

      <input type="text" name="intereses" placeholder="Intereses" className="input-field" value={jobInfo.intereses} onChange={onChange} />
      <input type="text" name="porque" placeholder="¿Por qué quieres trabajar con nosotros?" className="input-field" value={jobInfo.porque} onChange={onChange} />

      <button className="search-button" onClick={onSubmit}>Generar Carta de Presentación</button>
    </section>

    {coverLetter && (
      <section className="cover-letter">
        <h3>Carta de Presentación Generada:</h3>
        <div className="cover-letter-box">
          <p>{coverLetter}</p>
        </div>
      </section>
    )}
  </div>
);

const JobItem = ({ job, onViewDetails }) => (
  <div className="job-item">
    <h2>{job.title}</h2>
    <p>{job.city}</p>
    <button onClick={onViewDetails}>Abrir Detalles</button>
  </div>
);

export default App;
