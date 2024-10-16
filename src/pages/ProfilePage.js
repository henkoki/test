import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/Layout';
import { getSearchesRemaining } from '../utils/searchLimits';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchesRemaining, setSearchesRemaining] = useState(null);
  const navigate = useNavigate();
  const { t } = useLanguage();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = { id: currentUser.uid, ...userDoc.data() };
            setUser(userData);
            const remaining = await getSearchesRemaining(currentUser.uid);
            setSearchesRemaining(remaining);
          } else {
            setError('User document not found');
          }
        } catch (err) {
          console.error('Error fetching user data:', err);
          setError('Failed to fetch user data. Please try again.');
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
        navigate('/login');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  useEffect(() => {
    // Load Stripe script
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/buy-button.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const updatePremiumStatus = async () => {
    if (!user) return;
    try {
      const userDocRef = doc(db, 'users', user.id);
      await updateDoc(userDocRef, { isPremium: true });
      setUser({ ...user, isPremium: true });
    } catch (err) {
      console.error('Error updating premium status:', err);
    }
  };

  if (loading) {
    return <Layout><div className="text-center">Loading...</div></Layout>;
  }

  if (error) {
    return <Layout><div className="text-center text-red-500">{error}</div></Layout>;
  }

  return (
    <Layout>
      <h2 className="text-3xl font-bold text-center mb-6">{t('Profile')}</h2>
      <div className="space-y-4">
        <p><strong>{t('Username')}:</strong> {user.username}</p>
        <p><strong>{t('Email')}:</strong> {user.email}</p>
        <p><strong>{t('Member Since')}:</strong> {new Date(user.createdAt.seconds * 1000).toLocaleDateString()}</p>
        <p><strong>{t('Account Type: ')}</strong> 
          <span className={`font-semibold ${user.isPremium ? 'text-green-600' : 'text-yellow-600'}`}>
            {user.isPremium ? t('Premium') : t('free')}
          </span>
        </p>
        {!user.isPremium && (
          <p><strong>{t('Searches Remaining')}:</strong> {searchesRemaining}</p>
        )}
      </div>
      {!user.isPremium && (
        <div className="mt-6 mb-4">
          <h3 className="text-xl font-semibold mb-2">{t('Upgrade to Unlimited Search')}</h3>
          <stripe-buy-button
            buy-button-id="buy_btn_1Q9thWJTiI4ZDFSaRs7ZUIdb"
            publishable-key="pk_live_51Q9qoXJTiI4ZDFSasKPYyJnOg49uVYQU6YKaFnpTKOdI9LShJ3KswWjm30NB3ZZwz9Xd4Z6TwufpXRkhxCIXF9NX005IJxPzB0"
          >
          </stripe-buy-button>
        </div>
      )}
      <button
        onClick={handleLogout}
        className="mt-6 w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
      >
        {t('Logout')}
      </button>
    </Layout>
  );
};

export default ProfilePage;