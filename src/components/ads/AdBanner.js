
import AdSense from 'react-adsense';
/*
const AdBanner = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '20px' }}>
      <AdSense.Google
        client='ca-pub-3940256099942544' 
        slot='6300978111'                
        style={{ display: 'block' }}
        format='auto'
        responsive='true'
      />
    </div>
  );
};
 */
// src/components/ads/AdBanner.js

import React, { useEffect } from 'react';

const AdBanner = () => {
  useEffect(() => {
    // Ensure adsbygoogle array is available
    if (window.adsbygoogle) {
      window.adsbygoogle.push({});
    }
  }, []);

  return (
    <div className="adsense-container">
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-0000000000000000" // Test Ad Client
        data-ad-slot="0000000000" // Test Ad Slot
        data-ad-format="auto"
        data-full-width-responsive="true"
        data-adtest="on" // Test mode
      ></ins>
    </div>
  );
};

export default AdBanner;


