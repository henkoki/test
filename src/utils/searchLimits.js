import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const DAILY_LIMITS = {
  unregistered: 1,
  registered: 2,
  premium: Infinity
};

export const checkAndUpdateSearchLimit = async (userId) => {
  if (!userId) {
    // Unregistered user
    const lastSearch = localStorage.getItem('lastUnregisteredSearch');
    const searchCount = parseInt(localStorage.getItem('unregisteredSearchCount') || '0', 10);
    const now = new Date().getTime();

    if (lastSearch && now - parseInt(lastSearch, 10) < 24 * 60 * 60 * 1000) {
      if (searchCount >= DAILY_LIMITS.unregistered) {
        return false;
      }
      localStorage.setItem('unregisteredSearchCount', (searchCount + 1).toString());
    } else {
      localStorage.setItem('lastUnregisteredSearch', now.toString());
      localStorage.setItem('unregisteredSearchCount', '1');
    }
    return true;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  if (userData.isPremium) {
    return true; // Premium users have unlimited searches
  }

  const limit = DAILY_LIMITS.registered;

  if (userData.lastSearchDate === today) {
    if (userData.searchCount >= limit) {
      return false; // User has reached their daily limit
    } else {
      // Increment search count
      await updateDoc(userRef, {
        searchCount: userData.searchCount + 1
      });
      return true;
    }
  } else {
    // It's a new day, reset the count
    await updateDoc(userRef, {
      lastSearchDate: today,
      searchCount: 1
    });
    return true;
  }
};

export const getSearchesRemaining = async (userId) => {
  if (!userId) {
    const lastSearch = localStorage.getItem('lastUnregisteredSearch');
    const searchCount = parseInt(localStorage.getItem('unregisteredSearchCount') || '0', 10);
    const now = new Date().getTime();

    if (lastSearch && now - parseInt(lastSearch, 10) < 24 * 60 * 60 * 1000) {
      return Math.max(0, DAILY_LIMITS.unregistered - searchCount);
    }
    return DAILY_LIMITS.unregistered;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();
  const today = new Date().toISOString().split('T')[0];

  if (userData.isPremium) {
    return Infinity;
  }

  if (userData.lastSearchDate === today) {
    return Math.max(0, DAILY_LIMITS.registered - (userData.searchCount || 0));
  }

  return DAILY_LIMITS.registered;
};

export const resetSearchCount = async (userId) => {
  if (!userId) {
    localStorage.removeItem('lastUnregisteredSearch');
    localStorage.removeItem('unregisteredSearchCount');
  } else {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastSearchDate: null,
      searchCount: 0
    });
  }
};