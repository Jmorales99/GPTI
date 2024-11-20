import React from 'react';

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

export default JobDetails;
