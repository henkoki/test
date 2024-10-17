import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { addToSearchHistory, getSearchHistory } from '../utils/searchHistory';
import { checkAndUpdateSearchLimit, getSearchesRemaining } from '../utils/searchLimits';
import Layout from '../components/Layout';

const SearchPage = () => {
  const [gymName, setGymName] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [recentSearch, setRecentSearch] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState('');
  const [searchesRemaining, setSearchesRemaining] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBUE_42ctF3i-1x77Wec5d3bSRLQpzzWN0&libraries=places`;
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
      script.onload = initAutocomplete;
    };

  if (!window.google) {
    loadGoogleMapsScript();
  } else {
    initAutocomplete();
  }
}, []);

  const updateSearchesRemaining = async () => {
    const remaining = await getSearchesRemaining(user?.uid);
    setSearchesRemaining(remaining);
  };

const initAutocomplete = () => {
  if (!window.google) return;

  const autocomplete = new window.google.maps.places.Autocomplete(
    document.getElementById('gym-name-input'),
    { 
      types: ['establishment'],
      strictBounds: false,
      fields: ['place_id', 'geometry', 'name', 'formatted_address'],
    }
  );

  autocomplete.addListener('place_changed', () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    setGymName(place.name);
    setGymAddress(place.formatted_address);
    setError(''); // Clear any previous error
  });

  setAutocomplete(autocomplete);
};

  const loadRecentSearch = () => {
    const recentSearches = getSearchHistory();
    if (recentSearches.length > 0) {
      setRecentSearch(recentSearches[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
	console.log('Is gym related before:', isGymRelated);
    try {
      const canSearch = await checkAndUpdateSearchLimit(user?.uid);
      if (!canSearch) {
        setError(t('You have reached your daily limit. Please register or upgrade to unlimited just for 0.99$'));
        return;
      }

      if (gymName && gymAddress) {
        addToSearchHistory(`${gymName}, ${gymAddress}`);
        navigate(`/results?name=${encodeURIComponent(gymName)}&address=${encodeURIComponent(gymAddress)}`);
		console.log('Place name:', place.name);
		console.log('Is gym related:', isGymRelated);
      }
      
      // Update searches remaining
      updateSearchesRemaining();
    } catch (error) {
      console.error('Error checking search limit:', error);
      setError(t('errorCheckingSearchLimit'));
    }
  };

  return (
    <Layout wide>
      <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{t('searchGym')}</h1>
      {error && <p className="text-red-500 text-center mb-4">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="gym-name-input" className="block text-sm font-medium text-gray-700 mb-1">
            {t('Gym Name')}
          </label>
          <input
            id="gym-name-input"
            type="text"
            value={gymName}
            onChange={(e) => setGymName(e.target.value)}
            className="w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700 placeholder-gray-500"
            placeholder={t('Type Any Gym Worldwide')}
            required
          />
        </div>
        <div>
          <label htmlFor="gym-address-input" className="block text-sm font-medium text-gray-700 mb-1">
            {t('Gym Address')}
          </label>
          <input
            id="gym-address-input"
            type="text"
            value={gymAddress}
            readOnly
            className="w-full px-3 py-2 bg-white bg-opacity-50 border border-gray-300 rounded-md text-gray-700"
            placeholder={t('Gym Address Will Appear Here')}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md font-semibold transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-blue-100"
        >
          {t('See Gym Traffic')}
        </button>
      </form>
      {recentSearch && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold mb-2 text-gray-700">{t('Recent Searches')}</h2>
          <p className="text-sm text-blue-600 hover:text-blue-800 cursor-pointer transition-colors duration-200 break-words"
             onClick={() => {
               const [name, address] = recentSearch.split(', ');
               setGymName(name);
               setGymAddress(address);
             }}>
            {recentSearch}
          </p>
        </div>
      )}
      <p className="mt-4 text-sm text-gray-600">
        {user?.isPremium
          ? t('For any matters contact GymTraffic.live@gmail.com')
          : user
          ? t('For any matters contact GymTraffic.live@gmail.com', { count: searchesRemaining })
          : t('For any matters contact GymTraffic.live@gmail.com', { count: searchesRemaining })}
      </p>
    </Layout>
  );
};

export default SearchPage;