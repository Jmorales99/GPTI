import React, { useState, useEffect } from 'react';
import adsData from './adsData';
import './AdBanner.css';

const AdBanner = () => {
  const [currentAdIndex, setCurrentAdIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(true); // Controla si el anuncio está visible
  let interactionTimeout = null;

  useEffect(() => {
    const handleUserInteraction = () => {
      setIsPaused(true);
      clearTimeout(interactionTimeout);
      interactionTimeout = setTimeout(() => setIsPaused(false), 5000); // Reanuda después de 5 segundos sin interacción
    };

    // Agrega eventos de interacción
    window.addEventListener('keydown', handleUserInteraction);
    window.addEventListener('click', handleUserInteraction);

    return () => {
      // Limpia los eventos
      window.removeEventListener('keydown', handleUserInteraction);
      window.removeEventListener('click', handleUserInteraction);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || isPaused) return; // No rota anuncios si están cerrados o pausados

    const interval = setInterval(() => {
      setCurrentAdIndex((prevIndex) => (prevIndex + 1) % adsData.length);
    }, 5000); // Cambia cada 5 segundos

    return () => clearInterval(interval); // Limpia el intervalo al desmontar
  }, [isPaused, isVisible]);

  const currentAd = adsData[currentAdIndex];

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
      <a href={currentAd.link} target="_blank" rel="noopener noreferrer" className="ad-content">
        <img src={currentAd.imageUrl} alt={currentAd.title} className="ad-image" />
        <div className="ad-info">
          <h3 className="ad-title">{currentAd.title}</h3>
          <a href={currentAd.link} target="_blank" rel="noopener noreferrer">
            <button className="ad-button">Haz Click</button>
          </a>
        </div>
      </a>
    </div>
  );
};

export default AdBanner;
