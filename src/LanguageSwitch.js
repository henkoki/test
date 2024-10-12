import React from 'react';
import { useLanguage } from './LanguageContext';

const LanguageSwitch = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      onClick={toggleLanguage} 
      className="absolute top-4 right-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
    >
      {language === 'nl' ? 'English' : 'Nederlands'}
    </button>
  );
};

export default LanguageSwitch;