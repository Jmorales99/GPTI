import React, { useState, useEffect } from 'react';
import './App.css';
import AdBanner from './AdBanner';
import JobDetails from './components/JobDetails';
import adsData from './adsData';

function App() {
  const [selectedAds, setSelectedAds] = useState([]);
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

  const [pagination, setPagination] = useState({}); // Paginación por categoría

  const opcionesExperiencia = [
    { value: '0', label: 'Sin experiencia' },
    { value: '1', label: '1 año' },
    { value: '2', label: '2 años' },
    { value: '3', label: '3 años' },
    { value: '4', label: 'Más de 3 años' }
  ];

  // Función para seleccionar anuncios únicos
  const selectUniqueAds = (count) => {
    const shuffledAds = [...adsData].sort(() => Math.random() - 0.5); // Mezcla los anuncios
    return shuffledAds.slice(0, count); // Selecciona `count` anuncios únicos
  };

  useEffect(() => {
    setSelectedAds(selectUniqueAds(2)); // Seleccionar 2 anuncios únicos
  }, []);

  // Fetch de categorías
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        //const response = await fetch('http://localhost:3000/categories');
        const response = await fetch('https://gptjob-r4ne.onrender.com/categories');
        if (!response.ok) throw new Error('Error al obtener categorías desde el servidor');

        const categoriesData = await response.json();
        setCategories(categoriesData.map(category => ({ category, jobs: [] })));
      } catch (error) {
        console.error("Error al obtener categorías:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch de trabajos según categoría y página
  const fetchJobs = async (category, page = 1) => {
    try {
      //const response = await fetch(`http://localhost:3000/jobs?category=${category}&page=${page}`);
      const response = await fetch(`https://gptjob-r4ne.onrender.com/jobs?category=${category}&page=${page}`);

      console.log('response Fetch de trabajos según categoría y página: ', response)

      if (!response.ok) throw new Error('Error al obtener trabajos desde el servidor');
      
  
      const data = await response.json();

      console.log('Body de la respuesta:', data);
      setFilteredJobs(data.jobs);

      setPagination((prev) => ({
        ...prev,
        [category]: {
          currentPage: page,
          totalPages: data.pagination.totalPages,
          totalJobs: data.pagination.totalJobs,
          pageSize: data.pagination.pageSize,
        },
      }));
    } catch (error) {
      console.error("Error al obtener trabajos:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setFilteredJobs([]);
    fetchJobs(category, 1); // Reinicia la página a 1 para la nueva categoría
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
      oferta: '',
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
    const userData = {
      ...jobInfo,
      oferta: selectedJob.description, // Información del trabajo seleccionado
    };

    try {
      
      //const response = await fetch('http://localhost:3001/recomendaciones', {
        const response = await fetch('https://gptjob-r4ne.onrender.com/recomendaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();
      setCoverLetter(data.carta || 'No se generó una carta de presentación');
    } catch (error) {
      console.error("Error al enviar datos al backend:", error);
    }
  };

  const handleNextPage = () => {
    if (selectedCategory && pagination[selectedCategory]?.currentPage < pagination[selectedCategory]?.totalPages) {
      fetchJobs(selectedCategory, pagination[selectedCategory].currentPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (selectedCategory && pagination[selectedCategory]?.currentPage > 1) {
      fetchJobs(selectedCategory, pagination[selectedCategory].currentPage - 1);
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
                onClick={() => handleCategoryClick(category.category)}
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
          <div className="pagination-controls">
            {selectedCategory && (
              <>
                <button
                  onClick={handlePrevPage}
                  disabled={pagination[selectedCategory]?.currentPage === 1}
                >
                  Anterior
                </button>
                <span>
                  Página {pagination[selectedCategory]?.currentPage || 1} de{' '}
                  {pagination[selectedCategory]?.totalPages || 1}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={
                    pagination[selectedCategory]?.currentPage === pagination[selectedCategory]?.totalPages
                  }
                >
                  Siguiente
                </button>
              </>
            )}
          </div>

        </>
      )}
      <Footer />
    </div>
  );
}

const Navbar = () => (
  <nav className="navbar">
    <div className="navbar-brand">GPTJOB</div>
  </nav>
);

const Footer = () => (
  <footer className="footer">
    <AdBanner position="bottom" />
  </footer>
);

const JobItem = ({ job, onViewDetails }) => (
  <div className="job-item">
    <h2>{job.title}</h2>
    <p>Ubicación: {job.city}</p>
    <button onClick={onViewDetails}>Abrir Detalles</button>
  </div>
);

export default App;
