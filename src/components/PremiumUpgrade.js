import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import axios from 'axios';

const PremiumUpgrade = ({ userId }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true);

    if (!stripe || !elements) {
      return;
    }

    // Create PaymentIntent on the server
    const { data: clientSecret } = await axios.post('/create-payment-intent', { userId });

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      }
    });

    if (result.error) {
      setError(result.error.message);
      setProcessing(false);
    } else {
      // Payment succeeded, check status on server and update user
      const response = await axios.post('/check-payment-status', { 
        paymentIntentId: result.paymentIntent.id,
        userId 
      });
      
      if (response.data.success) {
        // Update UI to show premium status
        // You might want to trigger a state update in a parent component
        console.log('Upgrade to premium successful');
      } else {
        setError('Payment successful, but upgrade failed. Please contact support.');
      }
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <CardElement />
      <button type="submit" disabled={!stripe || processing}>
        Upgrade to Premium
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default PremiumUpgrade;