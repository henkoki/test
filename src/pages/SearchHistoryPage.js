import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { getSearchHistory, clearSearchHistory } from '../utils/searchHistory';
import Layout from '../components/Layout';

const SearchHistoryPage = () => {
  const [searchHistory, setSearchHistory] = useState([]);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    setSearchHistory(getSearchHistory());
  }, []);

  const handleClearHistory = () => {
    clearSearchHistory();
    setSearchHistory([]);
  };

  const handleSearchClick = (search) => {
    const [name, address] = search.split(', ');
    navigate(`/results?name=${encodeURIComponent(name)}&address=${encodeURIComponent(address)}`);
  };

  return (
    <Layout>
      <h1 className="text-3xl font-bold text-center text-blue-600 mb-8">{t('searchHistory')}</h1>
      {searchHistory.length > 0 ? (
        <>
          <ul className="space-y-2 mb-6">
            {searchHistory.map((search, index) => (
              <li 
                key={index} 
                className="bg-white bg-opacity-50 p-4 rounded-md cursor-pointer hover:bg-opacity-75 transition-colors duration-200"
                onClick={() => handleSearchClick(search)}
              >
                <p className="font-medium text-blue-600">{search}</p>
              </li>
            ))}
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