// AdBanner.js
import React from 'react';
import adsData from './adsData';
import './AdBanner.css';

const AdBanner = ({ position }) => {
  const randomAd = adsData[Math.floor(Math.random() * adsData.length)];

  return (
    <div className={`ad-banner ad-banner-${position}`}>
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
