import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SearchPage = () => {
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
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
      document.getElementById('venue-input'),
      {
        types: ['establishment'],
        strictBounds: false,
        fields: ['name', 'formatted_address', 'geometry', 'types'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) return;

      // Check if the selected place is a gym, fitness center, or health club
      const relevantTypes = ['gym', 'health', 'fitness'];
      const isRelevantPlace = place.types.some(type => 
        relevantTypes.some(relevantType => type.includes(relevantType))
      );

      if (isRelevantPlace) {
        setVenueName(place.name);
        setVenueAddress(place.formatted_address);
      } else {
        alert('Please select a gym, fitness center, or health club.');
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (venueName && venueAddress) {
      navigate(`/results?name=${encodeURIComponent(venueName)}&address=${encodeURIComponent(venueAddress)}`);
    } else {
      alert('Please select a valid gym, fitness center, or health club.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">GymSpotCheck</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="venue-input" className="block text-sm font-medium text-gray-700 mb-1">
              Gym, Fitness Center, or Health Club
            </label>
            <input
              id="venue-input"
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search for a gym or fitness center"
              required
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