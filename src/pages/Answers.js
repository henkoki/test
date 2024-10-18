import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const SuccessPage = () => {
  const [updateStatus, setUpdateStatus] = useState('updating');
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const updatePremiumStatus = async () => {
      if (!user) {
        console.error('No user found');
        setUpdateStatus('error');
        return;
      }

      try {
        const userRef = doc(db, 'users', user.uid);
        await updateDoc(userRef, {
          isPremium: true,
          premiumSince: new Date()
        });
        console.log('Premium status updated successfully');
        await refreshUser();
        setUpdateStatus('success');
        setTimeout(() => navigate('/profile'), 3000);
      } catch (error) {
        console.error('Error updating premium status:', error);
        setUpdateStatus('error');
      }
    };

    updatePremiumStatus();
  }, [user, refreshUser, navigate]);

  return (
    <div className="text-center mt-8">
      <h1 className="text-2xl font-bold mb-4">Payment Successful</h1>
      <p>Thank you for your payment. Your account will be updated shortly.</p>
      {updateStatus === 'updating' && <p>Updating your account status...</p>}
      {updateStatus === 'success' && <p>Your account has been upgraded to Premium!</p>}
      {updateStatus === 'error' && <p>There was an error updating your account. Please contact support.</p>}
    </div>
  );
};

export default SuccessPage;