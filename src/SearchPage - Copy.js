import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [gymName, setGymName] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBUE_42ctF3i-1x77Wec5d3bSRLQpzzWN0&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = initAutocomplete;
    };

    loadGoogleMapsScript();
  }, []);

  const initAutocomplete = () => {
    if (!window.google) return;

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('gym-name-input'),
      { types: ['establishment'] }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      setGymName(place.name);
      setGymAddress(place.formatted_address);
    });

    setAutocomplete(autocomplete);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gymName && gymAddress) {
      navigate(`/results?name=${encodeURIComponent(gymName)}&address=${encodeURIComponent(gymAddress)}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">GymSpotCheck</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="gym-name-input" className="block text-sm font-medium text-gray-700 mb-1">
              Gym Name
            </label>
            <input
              id="gym-name-input"
              type="text"
              value={gymName}
              onChange={(e) => setGymName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for a gym"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="gym-address-input" className="block text-sm font-medium text-gray-700 mb-1">
              Gym Address
            </label>
            <input
              id="gym-address-input"
              type="text"
              value={gymAddress}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100"
              placeholder="Address will appear here"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            See Foot Traffic
          </button>
        </form>
      </div>
    </div>
  );
};

export default SearchPage;