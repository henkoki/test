import React from 'react';
import { useLanguage } from './LanguageContext';

const LanguageSwitch = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'nl' : 'en')}
      className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded transition duration-150 ease-in-out"
    >
      {language === 'en' ? 'Nederlands' : 'English'}
    </button>
  );
};

export default LanguageSwitch;