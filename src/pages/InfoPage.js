import React from 'react';
import Layout from '../components/Layout';
import { useLanguage } from '../contexts/LanguageContext';

const InfoPage = () => {
  const { t } = useLanguage();

  return (
    <Layout wide>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">{t('Welcome to GymTraffic.live')}</h1>
        <p className="mb-6 text-center text-lg">{t('Your ultimate tool for avoiding crowded gyms and maximizing your workout experience, no matter where you are!')}</p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('What is GymTraffic.live?')}</h2>
          <p>{t('GymTraffic.live is a global platform that allows you to check real-time equipment usage and foot traffic at gyms anywhere in the world. Whether youre working out locally or traveling abroad, you can now search for any gym worldwide and find the best time to hit the gym without the crowds.')}</p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('Key Features:')}</h2>
          <ol className="list-decimal pl-6 space-y-4">
            <li>
              <h3 className="font-semibold">{t('Search for Any Gym Worldwide')}</h3>
              <p>{t('No matter where you are, whether in your hometown or on the other side of the globe, GymTraffic.live allows you to search for any gym worldwide. Instantly see how busy it is and plan your workout accordingly.')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Real-Time Traffic Data')}</h3>
              <p>{t('Avoid overcrowded gyms and equipment delays by checking the real-time status of gym traffic. GymTraffic.live provides you with live data on how busy a gym is and which equipment is available.')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Simple and User-Friendly Interface')}</h3>
              <p>{t('With an easy-to-navigate design, GymTraffic.live ensures you can find the gym data you need in just a few taps. Whether youre using your phone or laptop, the interface is optimized for a seamless experience.')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Personalized Gym Alerts')}</h3>
              <p>{t('Set up custom alerts for your favorite gyms. Get notified when your local gym quiets down or when your preferred equipment becomes available—never miss the perfect workout window.')}</p>
            </li>
            <li>
              <h3 className="font-semibold">{t('Plan Your Workouts')}</h3>
              <p>{t('GymTraffic.live helps you stay ahead by letting you plan your workouts around peak traffic times. Choose the most convenient time for a stress-free workout, without the frustration of long waits.')}</p>
            </li>
          </ol>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 text-blue-600">{t('Why Choose GymTraffic.live?')}</h2>
          <ul className="list-disc pl-6 space-y-2">
            <li>{t('Save Time: No more wasted trips to a packed gym. Find out the best time to go in real-time.')}</li>
            <li>{t('Global Reach: Whether at home or traveling, you can track gym traffic anywhere in the world.')}</li>
            <li>{t('Stress-Free Workouts: No waiting for machines or dealing with overcrowded areas. Enjoy your workout, your way.')}</li>
            <li>{t('Efficiency: Focus on your fitness goals without the distractions of a busy gym.')}</li>
            <li>{t('Stay Ahead: Be in control—always one step ahead of the crowd with GymTraffic.live.')}</li>
          </ul>
        </section>
		
      </div>
    </Layout>
  );
};

export default InfoPage;