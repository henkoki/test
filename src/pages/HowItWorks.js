import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const InfoPage = () => {
  const { t } = useLanguage();

  return (
    <Layout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{t('How It Works')}</h1>
        
        <ol className="list-decimal pl-6 space-y-4 mb-8">
          <li>
            <h3 className="font-semibold">{t('Search Your Gym')}</h3>
            <p>{t('Simply enter your gyms name or search by location to find gyms near you or anywhere in the world.')}</p>
          </li>
          <li>
            <h3 className="font-semibold">{t('Check the Traffic')}</h3>
            <p>{t('View real-time data showing gym occupancy and equipment availability, so you know exactly what to expect before you head out.')}</p>
          </li>
	  z<li>
            <h3 className="font-semibold">{t('How is it different to any other foot traffic analyzer?')}</h3>
            <p>{t('We are using custom trained AI models to gather the foot traffic data from various sources, analyze it and provide with the most accurate results')}</p>
          </li>
          <li>
            <h3 className="font-semibold">{t('Hit the Gym with Confidence')}</h3>
            <p>{t('With up-to-the-minute traffic data, you can walk into the gym with confidence, ready to work out without any delays.')}</p>
          </li>
        </ol>

        <div className="bg-blue-100 border-l-4 border-blue-500 p-4 mb-8">
           <h2 className="text-3xl font-bold mb-6 text-center text-blue-600">{t('Account Types')}</h2>
          <ul className="list-disc pl-6 space-y-4">
            <li>
              <h3 className="font-semibold">{t('Guest')}</h3>
              <p>{t('Can search 1 time a week')}</p>
              <p>{t('Advertising')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Registered user')}</h3>
              <p>{t('Can search 3 times a week')}</p>
              <p>{t('Advertising')}</p>
            </li>
            <li className="bg-green-100 p-2 rounded">
              <h3 className="font-semibold text-green-700">{t('Premium user')}</h3>
              <p>{t('Can search unlimited times a week')}</p>
              <p>{t('No Advertising')}</p>
			  <p>{t('Search history')}</p>
            </li>
          </ul>
        </div>
      </div>
    </Layout>
  );
};


export default InfoPage;
