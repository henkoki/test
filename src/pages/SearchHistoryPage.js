import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { getSearchHistory, clearSearchHistory } from '../utils/searchHistory';
import Layout from '../components/Layout';
import { Star } from 'lucide-react';

const SearchHistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const { t } = useLanguage();
  const { user } = useAuth();
  const { addFavorite, removeFavorite, favorites } = useFavorites();

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  useEffect(() => {
    console.log('Favorites updated:', favorites);
  }, [favorites]);

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  const handleSearchClick = (search) => {
    const [name, address] = search.split(', ');
    navigate(`/results?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`);
  };

  const handleToggleFavorite = (search) => {
    const [name, address] = search.split(', ');
    const gymId = `${name}-${address}`.replace(/\s+/g, '-').toLowerCase();

    console.log('Toggling favorite for gym:', gymId);
    console.log('Current favorites:', favorites);

    const isFavorite = favorites.some(fav => fav.id === gymId);

    if (isFavorite) {
      console.log('Removing from favorites');
      removeFavorite(gymId);
    } else {
      console.log('Adding to favorites');
      addFavorite({
        id: gymId,
        name,
        address,
      });
    }

    // Force a re-render
    setSearchHistory([...searchHistory]);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">{t('searchHistory')}</h1>
      {searchHistory.length > 0 ? (
        <>
          <ul className="space-y-2 mb-6">
            {searchHistory.map((search, index) => {
              const [name, address] = search.split(', ');
              const gymId = `${name}-${address}`.replace(/\s+/g, '-').toLowerCase();
              const isFavorite = favorites.some(fav => fav.id === gymId);

              console.log(`Gym ${gymId} isFavorite:`, isFavorite);

              return (
                <li 
                  key={index} 
                  className="bg-white bg-opacity-50 p-4 rounded-md hover:bg-opacity-75 transition-colors duration-200 flex justify-between items-center"
                >
                  <p 
                    className="font-medium text-blue-600 cursor-pointer"
                    onClick={() => handleSearchClick(search)}
                  >
                    {search}
                  </p>
                  {user && (
                    <button
                      onClick={() => handleToggleFavorite(search)}
                      className={`ml-2 ${isFavorite ? 'text-yellow-500' : 'text-gray-400'} hover:text-yellow-500`}
                    >
                      <Star size={24} fill={isFavorite ? 'currentColor' : 'none'} />
                    </button>
                  )}
                </li>
              );
            })}
          </ul>
          <button
            onClick={handleClearHistory}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >
            {t('Clear History')}
          </button>
        </>
      ) : (
        <p className="text-center text-gray-600">{t('No Search History')}</p>
      )}
    </Layout>
  );
};

export default SearchHistoryPage;