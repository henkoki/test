import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';

const Header = () => {
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <header className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center">
              Gym Traffic
              <span className="ml-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                LIVE
              </span>
            </Link>
            <nav className="ml-10 flex space-x-4">
              <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('Home')}</Link>
              <Link to="/info" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('Info')}</Link>
              <Link to="/howitworks" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('How it works')}</Link>
              {user && (
                <Link to="/search-history" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('Search history')}</Link>
              )}
            </nav>
          </div>
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link to="/profile" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('Profile')}</Link>
                <button onClick={handleLogout} className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('Logout')}</button>
              </>
            ) : (
              <>
                <Link to="/login" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('login')}</Link>
                <Link to="/register" className="text-gray-700 hover:text-blue-600 transition-colors duration-200">{t('register')}</Link>
              </>
            )}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="bg-white bg-opacity-20 text-gray-700 border border-gray-300 rounded-md px-2 py-1"
            >
              <option value="en">English</option>
              <option value="nl">Nederlands</option>
            </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;