// AdBanner.js
import React, { useState } from 'react';
import adsData from './adsData';
import './AdBanner.css';

const AdBanner = () => {
  const [isVisible, setIsVisible] = useState(true);
  const randomAd = adsData[Math.floor(Math.random() * adsData.length)];

  const handleClose = () => {
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="ad-banner">
      <button className="close-button" onClick={handleClose}>X</button>
      <a href={randomAd.link} target="_blank" rel="noopener noreferrer" className="ad-content">
        <img src={randomAd.imageUrl} alt={randomAd.title} className="ad-image" />
        <div className="ad-info">
          <h3 className="ad-title">{randomAd.title}</h3>
          <p className="ad-views">{Math.floor(Math.random() * 1000) + 'K views'}</p>
        </div>
      </a>
      <a href={randomAd.link} target="_blank" rel="noopener noreferrer">
        <button className="ad-button">Click Here</button>
      </a>
    </div>
  );
};

export default AdBanner;
