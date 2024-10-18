import { db } from '../firebase';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';

export const addToFavorites = async (userId, gymData) => {
  const favRef = doc(db, 'users', userId, 'favorites', gymData.id);
  await setDoc(favRef, gymData);
};

export const removeFromFavorites = async (userId, gymId) => {
  const favRef = doc(db, 'users', userId, 'favorites', gymId);
  await deleteDoc(favRef);
};

export const getFavorites = async (userId) => {
  const favRef = collection(db, 'users', userId, 'favorites');
  const snapshot = await getDocs(favRef);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};