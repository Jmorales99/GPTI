import React from 'react';
import AdSense from 'react-adsense';

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

export default AdBanner;
