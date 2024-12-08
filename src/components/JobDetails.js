import React from 'react';
import { FaClipboard } from 'react-icons/fa'; // Importa el ícono del clipboard
import './JobDetails.css';

const JobDetails = ({ job, onBack, jobInfo, onInputChange, onChange, onSubmit, opcionesExperiencia, coverLetter }) => {
  // Función para dividir la descripción en secciones
  const parseDescription = (description) => {
    const sections = {};
    const keys = [
      "Objetivo del cargo",
      "Requisitos",
      "Funciones",
      "Beneficios",
      "Jornada laboral",
      "Instrucciones"
    ];
  
    const requisitosKeywords = [
      "Manejo de", "Experiencia en", "Conocimiento en", "Habilidad para", "Capacidad de",
      "Ser", "Tener", "Puntualidad", "Responsabilidad", "Excel", "Atención telefónica",
      "Planificación", "Caja chica", "Proactividad"
    ];
  
    let currentKey = "General";
  
    description.split("\n").forEach((line) => {
      const trimmedLine = line.trim();
      if (!trimmedLine) return; // Ignorar líneas vacías
  
      const matchedKey = keys.find((key) => trimmedLine.startsWith(`${key}:`));
      const isRequisito = requisitosKeywords.some((word) => trimmedLine.includes(word));
  
      if (matchedKey) {
        currentKey = matchedKey;
        sections[currentKey] = [];
      } else if (isRequisito) {
        currentKey = "Requisitos";
        if (!sections[currentKey]) {
          sections[currentKey] = [];
        }
        sections[currentKey].push(trimmedLine);
      } else if (currentKey) {
        if (!sections[currentKey]) {
          sections[currentKey] = [];
        }
        sections[currentKey].push(trimmedLine);
      }
    });
  
    return sections;
  };

  // Divide la descripción del trabajo
  const sections = parseDescription(job.description);

  // Función para copiar al portapapeles
  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter).then(() => {
        alert('¡Carta copiada al portapapeles!');
      }).catch((err) => {
        console.error('Error al copiar al portapapeles:', err);
      });
    }
  };

  return (
    <div className="job-details-container">
      {/* Encabezado */}
      <div className="job-header">
        <button className="back-button" onClick={onBack}>← Volver</button>
        <h1 className="job-title">{job.title}</h1>
        <p className="job-location">{job.city}</p>
      </div>

      {/* Descripción del trabajo */}
      <div className="job-description">
        {Object.entries(sections).map(([key, lines], index) => (
          <div key={index} className="job-section">
            <h2 className="section-title">{key}</h2>
            <ul className="section-list">
              {lines.map((line, idx) => (
                <li key={idx} className="section-item">{line}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Formulario */}
      <div className="form-section">
        <h2 className="form-title">Completa tu información</h2>
        <form className="user-form">
          <div className="form-group">
            <label htmlFor="nombre" className="form-label">Nombre completo:</label>
            <input
              id="nombre"
              type="text"
              name="nombre"
              placeholder="Nombre completo"
              className="form-input"
              value={jobInfo.nombre}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="telefono" className="form-label">Teléfono:</label>
            <input
              id="telefono"
              type="text"
              name="telefono"
              placeholder="Teléfono"
              className="form-input"
              value={jobInfo.telefono}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="correo" className="form-label">Correo electrónico:</label>
            <input
              id="correo"
              type="email"
              name="correo"
              placeholder="Correo electrónico"
              className="form-input"
              value={jobInfo.correo}
              onChange={onChange}
            />
          </div>

          {jobInfo.habilidades.map((skill, index) => (
            <div className="form-group" key={index}>
              <label htmlFor={`habilidad-${index}`} className="form-label">Habilidad {index + 1}:</label>
              <input
                id={`habilidad-${index}`}
                type="text"
                placeholder={`Ingresa Habilidad`}
                className="form-input"
                value={skill}
                onChange={(e) => onInputChange(index, e.target.value)}
              />
            </div>
          ))}

          <div className="form-group">
            <label htmlFor="experiencia" className="form-label">Nivel de experiencia:</label>
            <select
              id="experiencia"
              name="experiencia"
              className="form-input"
              value={jobInfo.experiencia}
              onChange={onChange}
            >
              <option value="">Selecciona tu experiencia</option>
              {opcionesExperiencia.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="intereses" className="form-label">Intereses:</label>
            <input
              id="intereses"
              type="text"
              name="intereses"
              placeholder="Intereses"
              className="form-input"
              value={jobInfo.intereses}
              onChange={onChange}
            />
          </div>

          <div className="form-group">
            <label htmlFor="porque" className="form-label">¿Por qué quieres trabajar con nosotros?</label>
            <textarea
              id="porque"
              name="porque"
              placeholder="Explica tus motivaciones"
              className="form-textarea"
              value={jobInfo.porque}
              onChange={onChange}
            />
          </div>

          <button type="button" className="submit-button" onClick={onSubmit}>
            Generar Carta de Presentación
          </button>
        </form>
      </div>

      {/* Carta de presentación generada */}
      {coverLetter && (
        <div className="cover-letter-section">
          <h2 className="cover-letter-title">Carta de Presentación Generada</h2>
          <div className="cover-letter-box">
            <p>{coverLetter}</p>
            <button className="copy-button" onClick={copyToClipboard}>
              <FaClipboard /> Copiar al portapapeles
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobDetails;
