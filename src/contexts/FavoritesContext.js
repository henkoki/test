// src/contexts/FavoritesContext.js
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState(null);
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
      try {
        const favoritesRef = collection(db, 'users', user.uid, 'favorites');
        const snapshot = await getDocs(favoritesRef);
        const favoritesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setFavorites(favoritesData);
        setError(null);
      } catch (err) {
        console.error('Error loading favorites:', err);
        setError('Failed to load favorites. Please try again.');
      }
    }
  };

  const addFavorite = async (gymData) => {
    if (user) {
      try {
        const favoriteRef = doc(db, 'users', user.uid, 'favorites', gymData.id);
        await setDoc(favoriteRef, gymData);
        setFavorites([...favorites, gymData]);
        setError(null);
      } catch (err) {
        console.error('Error adding favorite:', err);
        setError('Failed to add favorite. Please try again.');
      }
    }
  };

  const removeFavorite = async (gymId) => {
    if (user) {
      try {
        const favoriteRef = doc(db, 'users', user.uid, 'favorites', gymId);
        await deleteDoc(favoriteRef);
        setFavorites(favorites.filter(fav => fav.id !== gymId));
        setError(null);
      } catch (err) {
        console.error('Error removing favorite:', err);
        setError('Failed to remove favorite. Please try again.');
      }
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, error }}>
      {children}
    </FavoritesContext.Provider>
  );
};