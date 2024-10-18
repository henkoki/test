// src/contexts/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { addToFavorites, removeFromFavorites, getFavorites } from '../firebase';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadFavorites();
    } else {
      setFavorites([]);
    }
  }, [user]);

  const loadFavorites = async () => {
    if (user) {
      const userFavorites = await getFavorites(user.uid);
      setFavorites(userFavorites);
    }
  };

  const addFavorite = async (gymData) => {
    if (user) {
      await addToFavorites(user.uid, gymData);
      setFavorites([...favorites, gymData]);
    }
  };

  const removeFavorite = async (gymId) => {
    if (user) {
      await removeFromFavorites(user.uid, gymId);
      setFavorites(favorites.filter(fav => fav.id !== gymId));
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};