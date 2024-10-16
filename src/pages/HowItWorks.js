import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const InfoPage = () => {
  const { t } = useLanguage();

  return (
    <Layout wide>
      <div className="max-w-5xl mx-auto">
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('How It Works:')}</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <h3 className="font-semibold">{t('Search Your Gym')}</h3>
              <p>{t('Simply enter your gyms name or search by location to find gyms near you or anywhere in the world.')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Check the Traffic')}</h3>
              <p>{t('View real-time data showing gym occupancy and equipment availability, so you know exactly what to expect before you head out.')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Hit the Gym with Confidence')}</h3>
              <p>{t('With up-to-the-minute traffic data, you can walk into the gym with confidence, ready to work out without any delays.')}</p>
            </li>
          </ol>
        </section>
      </div>
    </Layout>
  );
};

export default InfoPage;