import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { getFavorites, removeFromFavorites } from '../utils/favorites'; // Create these utility functions
import Layout from '../components/Layout';

const FavoritesPage = () => {
  const [favorites, setFavorites] = useState([]);
  const { t } = useLanguage();
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user]);

  const loadFavorites = async () => {
    const userFavorites = await getFavorites(user.uid);
    setFavorites(userFavorites);
  };

  const handleRemoveFromFavorites = async (gymId) => {
    await removeFromFavorites(user.uid, gymId);
    setFavorites(favorites.filter(fav => fav.id !== gymId));
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">{t('My Favorite Gyms')}</h1>
        {favorites.length === 0 ? (
          <p>{t('You haven\'t added any gyms to your favorites yet.')}</p>
        ) : (
          <ul className="space-y-4">
            {favorites.map((gym) => (
              <li key={gym.id} className="border p-4 rounded-md">
                <h2 className="text-xl font-semibold">{gym.name}</h2>
                <p>{gym.address}</p>
                <div className="mt-2">
                  <Link to={`/results?name=${encodeURIComponent(gym.name)}&address=${encodeURIComponent(gym.address)}`} className="text-blue-600 hover:underline mr-4">
                    {t('View Traffic')}
                  </Link>
                  <button onClick={() => handleRemoveFromFavorites(gym.id)} className="text-red-600 hover:underline">
                    {t('Remove from Favorites')}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </Layout>
  );
};

export default FavoritesPage;