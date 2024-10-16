import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/Layout';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { username, email, password, confirmPassword } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t('Passwords Do Not Match'));
      return;
    }
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        username,
        email,
        createdAt: new Date(),
        isPremium: false
      });

      navigate('/profile');
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-center mb-6">{t('Register')}</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
        <input
          type="text"
          placeholder={t('Username')}
          name="username"
          value={username}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="email"
          placeholder={t('Email')}
          name="email"
          value={email}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder={t('Password')}
          name="password"
          value={password}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder={t('Confirm Password')}
          name="confirmPassword"
          value={confirmPassword}
          onChange={onChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          type="submit"
        >
          {t('Register')}
        </button>
      </form>
    </Layout>
  );
};

export default RegisterPage;