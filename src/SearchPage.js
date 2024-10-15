import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { useLanguage } from './LanguageContext';
import LanguageSwitch from './LanguageSwitch';

const SearchPage = () => {
  const { t } = useLanguage();
  const [gymName, setGymName] = useState('');
  const [gymAddress, setGymAddress] = useState('');
  const [autocomplete, setAutocomplete] = useState(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  
  <script type="text/javascript">
      aclib.runPop({
          zoneId: '8892450',
      });
  </script>

  useEffect(() => {
    const loadGoogleMapsScript = () => {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBUE_42ctF3i-1x77Wec5d3bSRLQpzzWN0&libraries=places`;
      script.async = true;
      script.defer = true;
      script.onerror = () => setError(t('failedToLoadGoogleMaps'));
      document.head.appendChild(script);
      script.onload = initAutocomplete;
    };

    loadGoogleMapsScript();
  }, [t]);

  const initAutocomplete = () => {
    if (!window.google) {
      setError(t('googleMapsFailedToInitialize'));
      return;
    }

    const autocomplete = new window.google.maps.places.Autocomplete(
      document.getElementById('gym-name-input'),
      { 
        types: ['establishment'],
        componentRestrictions: { country: 'nl' },
        fields: ['place_id', 'geometry', 'name', 'formatted_address'],
      }
    );

    autocomplete.addListener('place_changed', () => {
      const place = autocomplete.getPlace();
      if (!place.geometry) {
        setError(t('noDetailsAvailableForThisGym'));
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
      setError(t('pleaseSelectAGym'));
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-between relative">
      <LanguageSwitch />
      <div className="flex-grow flex items-center justify-center px-4">
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
          <div className="flex items-center justify-center mb-8">
            <h1 className="text-3xl font-bold text-blue-600 mr-2">{t('gymTraffic')}</h1>
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">{t('live')}</span>
          </div>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="gym-name-input" className="block text-lg font-medium text-gray-700 mb-2">
                {t('gymFitnessCenter')}
              </label>
              <input
                id="gym-name-input"
                type="text"
                value={gymName}
                onChange={(e) => setGymName(e.target.value)}
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('searchForGym')}
                required
              />
            </div>
            <div>
              <label htmlFor="gym-address-input" className="block text-lg font-medium text-gray-700 mb-2">
                {t('gymAddress')}
              </label>
              <input
                id="gym-address-input"
                type="text"
                value={gymAddress}
                readOnly
                className="w-full px-4 py-3 text-lg border border-gray-300 rounded-md bg-gray-100"
                placeholder={t('addressWillAppear')}
              />
            </div>
            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-md text-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {t('seeFootTraffic')}
            </button>
          </form>
        </div>
      </div>
      <div className="text-center py-4 text-gray-500 text-sm">
        {t('dataProvidedBy')} <a href="mailto:gymtraffic.live@gmail.com" className="text-blue-600 hover:underline">gymtraffic.live@gmail.com</a>
      </div>
    </div>
  );
};

export default SearchPage;
