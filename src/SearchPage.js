import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

const SearchPage = () => {
  const [gymName, setGymName] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBUE_42ctF3i-1x77Wec5d3bSRLQpzzWN0&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onerror = () => setError('Failed to load Google Maps. Please try again later.');
      document.head.appendChild(script);
      script.onload = initAutocomplete;
    };

    loadGoogleMapsScript();
  }, []);

  const initAutocomplete = () => {
    if (!window.google) {
      setError('Google Maps failed to initialize. Please refresh the page.');
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('gym-name-input'),
      { 
        types: ['establishment'],
        componentRestrictions: { country: 'nl' },
        fields: ['place_id', 'geometry', 'name', 'formatted_address', 'address_components', 'types'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        setError('No details available for this gym. Please try another.');
        return;
      }

      // Check if the place is a gym or fitness-related establishment
      const gymRelatedTypes = ['gym', 'health', 'fitness'];
      const isGymRelated = place.types.some(type => 
        gymRelatedTypes.some(gymType => type.toLowerCase().includes(gymType))
      );

      if (!isGymRelated) {
        setError('Please select a gym or fitness-related establishment.');
        return;
      }

      setGymName(place.name);
      setGymAddress(place.formatted_address);
      setError('');
    });

    setAutocomplete(autocomplete);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (gymName && gymAddress) {
      navigate(`/results?name=${encodeURIComponent(gymName)}&address=${encodeURIComponent(gymAddress)}`);
    } else {
      setError('Please select a gym from the suggestions.');
    }
  };

  return (
    <>
      <Helmet>
        <title>Gym Traffic | Real-time Gym Occupancy in the Netherlands</title>
        <meta name="description" content="Check real-time gym occupancy and foot traffic for fitness centers in the Netherlands. Plan your workout with up-to-date information on gym crowdedness." />
        <meta name="keywords" content="gym traffic, gym occupancy, fitness center crowdedness, Netherlands gyms, workout planning" />
        <link rel="canonical" href="https://www.gymtraffic.live" />
      </Helmet>
      <main className="min-h-screen bg-gray-100 flex flex-col justify-between">
        <div className="flex-grow flex items-center justify-center px-4">
          <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
            <h1 className="text-3xl font-bold text-blue-600 text-center mb-8">Gym Traffic <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">LIVE</span></h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="gym-name-input" className="block text-lg font-medium text-gray-700 mb-2">
                  Gym, Fitness Center, or Health Club in the Netherlands
                </label>
                <input
                  id="gym-name-input"
                  type="text"
                  value={gymName}
                  onChange={(e) => setGymName(e.target.value)}
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Search for a gym in the Netherlands"
                  required
                />
              </div>
              <div>
                <label htmlFor="gym-address-input" className="block text-lg font-medium text-gray-700 mb-2">
                  Gym Address
                </label>
                <input
                  id="gym-address-input"
                  type="text"
                  value={gymAddress}
                  readOnly
                  className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md bg-gray-100"
                  placeholder="Address will appear here"
                />
              </div>
              {error && (
                <div className="text-red-500 text-sm">{error}</div>
              )}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                See Foot Traffic
              </button>
            </form>
          </div>
        </div>
        <footer className="text-center py-4 text-gray-500 text-sm">
          <p>Contact for issues: <a href="mailto:gymtraffic.live@gmail.com" className="text-blue-600 hover:underline">gymtraffic.live@gmail.com</a></p>
        </footer>
      </main>
    </>
  );
};

export default SearchPage;