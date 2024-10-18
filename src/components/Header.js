import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Star } from 'lucide-react'; // Import the Star icon

const Header = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { t, language, setLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  const MainNavItems = () => (
    <>
      <Link to="/" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Home')}</Link>
      <Link to="/info" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Info')}</Link>
      <Link to="/howitworks" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('How it works')}</Link>
      {user && <Link to="/search-history" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Search history')}</Link>}
      {user && (
        <Link to="/favorites" className="text-gray-700 hover:text-blue-600 px-3 py-2 flex items-center">
          <Star className="mr-1" size={18} />
          {t('Favorites')}
        </Link>
      )}
    </>
  );

  const AuthNavItems = () => (
    <>
      {user ? (
        <>
          <Link to="/profile" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Profile')}</Link>
          <button onClick={logout} className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Logout')}</button>
        </>
      ) : (
        <>
          <Link to="/login" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Login')}</Link>
          <Link to="/register" className="text-gray-700 hover:text-blue-600 px-3 py-2">{t('Register')}</Link>
        </>
      )}
    </>
  );

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="flex items-center">
            <span className="text-2xl font-bold text-blue-600">Gym Traffic</span>
            <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">LIVE</span>
          </Link>
          
          {/* Hamburger menu for mobile */}
          <button className="md:hidden" onClick={toggleSidebar}>
            ☰
          </button>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center justify-between flex-grow ml-4">
            <div className="flex">
              <MainNavItems />
            </div>
            <div className="flex items-center">
              <AuthNavItems />
              {/* Language selector */}
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-white text-gray-700 border rounded-md px-2 py-1 ml-4"
              >
                <option value="en">English</option>
                <option value="nl">Nederlands</option>
              </select>
            </div>
          </nav>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-75 md:hidden">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl p-6">
            <button className="absolute top-4 right-4" onClick={toggleSidebar}>
              ✕
            </button>
            <nav className="mt-8 flex flex-col space-y-4">
              <MainNavItems />
              <hr className="my-4" />
              <AuthNavItems />
            </nav>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;