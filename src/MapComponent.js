import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker } from '@react-google-maps/api';

const MapComponent = ({ address }) => {
  const [mapCenter, setMapCenter] = useState({ lat: 52.3676, lng: 4.9041 }); // Default to Amsterdam
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ address: address }, (results, status) => {
      if (status === 'OK' && results[0]) {
        const location = results[0].geometry.location;
        setMapCenter({
          lat: location.lat(),
          lng: location.lng(),
        });
        setIsLoading(false);
      } else {
        console.error('Geocode was not successful for the following reason: ' + status);
        setError('Failed to locate the gym on the map');
        setIsLoading(false);
      }
    });
  }, [address]);

  if (isLoading) {
    return <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">Loading map...</div>;
  }

  if (error) {
    return <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center text-red-500">{error}</div>;
  }

  return (
    <GoogleMap
      mapContainerStyle={{ width: '100%', height: '300px' }}
      center={mapCenter}
      zoom={15}
    >
      <Marker position={mapCenter} />
    </GoogleMap>
  );
};

export default MapComponent;