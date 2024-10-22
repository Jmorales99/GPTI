import React, { useState } from 'react';
import '../styles/JobDetails.css';

function JobDetails({ job, onBack }) {
  const [coverLetter, setCoverLetter] = useState('');

  const generateCoverLetter = () => {
    setCoverLetter(`Querido empleador, estoy muy interesado en el puesto de ${job.title}. Con mi experiencia en ${job.description}, estoy seguro de que soy el candidato ideal.`);
  };

  return (
    <div className="job-details">
      <button className="back-button" onClick={onBack}>Volver</button>
      <h2>{job.title}</h2>
      <p>{job.description}</p>
      <button className="generate-button" onClick={generateCoverLetter}>Generar Carta de Presentación</button>

      {coverLetter && (
        <div className="cover-letter">
          <h3>Carta de Presentación:</h3>
          <p>{coverLetter}</p>
        </div>
      )}
    </div>
  );
}

export default JobDetails;
