import { db } from '../firebase';
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore';

const WEEKLY_LIMITS = {
  unregistered: 1,
  registered: 3,
  premium: Infinity
};

const getWeekStart = () => {
  const now = new Date();
  const dayOfWeek = now.getUTCDay();
  const diff = now.getUTCDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
  return new Date(now.setUTCDate(diff)).toISOString().split('T')[0];
};

export const checkAndUpdateSearchLimit = async (userId) => {
  const weekStart = getWeekStart();

  if (!userId) {
    // Unregistered user
    const lastSearch = localStorage.getItem('lastUnregisteredSearch');
    const searchCount = parseInt(localStorage.getItem('unregisteredSearchCount') || '0', 10);

    if (lastSearch && lastSearch >= weekStart) {
      if (searchCount >= WEEKLY_LIMITS.unregistered) {
        return false;
      }
      localStorage.setItem('unregisteredSearchCount', (searchCount + 1).toString());
    } else {
      localStorage.setItem('lastUnregisteredSearch', weekStart);
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

  if (userData.isPremium) {
    return true; // Premium users have unlimited searches
  }

  const limit = WEEKLY_LIMITS.registered;

  if (userData.lastSearchWeek === weekStart) {
    if (userData.weeklySearchCount >= limit) {
      return false; // User has reached their weekly limit
    } else {
      // Increment search count
      await updateDoc(userRef, {
        weeklySearchCount: (userData.weeklySearchCount || 0) + 1
      });
      return true;
    }
  } else {
    // It's a new week, reset the count
    await updateDoc(userRef, {
      lastSearchWeek: weekStart,
      weeklySearchCount: 1
    });
    return true;
  }
};

export const getSearchesRemaining = async (userId) => {
  const weekStart = getWeekStart();

  if (!userId) {
    const lastSearch = localStorage.getItem('lastUnregisteredSearch');
    const searchCount = parseInt(localStorage.getItem('unregisteredSearchCount') || '0', 10);

    if (lastSearch && lastSearch >= weekStart) {
      return Math.max(0, WEEKLY_LIMITS.unregistered - searchCount);
    }
    return WEEKLY_LIMITS.unregistered;
  }

  const userRef = doc(db, 'users', userId);
  const userSnap = await getDoc(userRef);

  if (!userSnap.exists()) {
    throw new Error("User not found");
  }

  const userData = userSnap.data();

  if (userData.isPremium) {
    return Infinity;
  }

  if (userData.lastSearchWeek === weekStart) {
    return Math.max(0, WEEKLY_LIMITS.registered - (userData.weeklySearchCount || 0));
  }

  return WEEKLY_LIMITS.registered;
};

export const resetSearchCount = async (userId) => {
  if (!userId) {
    localStorage.removeItem('lastUnregisteredSearch');
    localStorage.removeItem('unregisteredSearchCount');
  } else {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      lastSearchWeek: null,
      weeklySearchCount: 0
    });
  }
};