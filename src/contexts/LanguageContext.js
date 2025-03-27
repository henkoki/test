import React, { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => useContext(LanguageContext);

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  const t = (key) => {
    const translations = {
      en: {
        // English translations
        home: 'Home',
        searchHistory: 'Search History',
		searchGym: 'Real Time Gym Traffic at Your Fingertips with help of AI',
        login: 'Login',
        register: 'Register',
        // Add more translations as needed
      },
      nl: {
        // Dutch translations
        home: 'Home',
		searchGym: 'Zoek Sportschool',
        searchHistory: 'Zoekgeschiedenis',
        login: 'Inloggen',
        register: 'Registreren',
        // Add more translations as needed
      },
    };
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
