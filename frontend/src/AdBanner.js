import React, { useState } from 'react';
import adsData from './adsData';
import './AdBanner.css';

const AdBanner = () => {
  // Estado para controlar la visibilidad del banner
  const [isVisible, setIsVisible] = useState(true);
  
  // Selecciona un anuncio aleatorio
  const randomAd = adsData[Math.floor(Math.random() * adsData.length)];

  // Maneja el cierre del banner
  const handleClose = () => {
    setIsVisible(false); // Oculta el banner
  };

  // Si el banner no está visible, no renderiza nada
  if (!isVisible) return null;

  return (
    <div className="ad-banner">
      {/* Botón de cerrar */}
      <button 
        className="close-button" 
        onClick={handleClose}
        aria-label="Cerrar anuncio" // Accesibilidad
      >
        X
      </button>

      {/* Contenido del anuncio */}
      <a href={randomAd.link} target="_blank" rel="noopener noreferrer" className="ad-content">
        <img src={randomAd.imageUrl} alt={randomAd.title} className="ad-image" />
        <div className="ad-info">
          <h3 className="ad-title">{randomAd.title}</h3>
          <a href={randomAd.link} target="_blank" rel="noopener noreferrer">
            <button className="ad-button">Haz Click</button>
          </a>
        </div>
      </a>
    </div>
  );
};

export default AdBanner;
