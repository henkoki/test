import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useLanguage } from '../contexts/LanguageContext';
import Layout from '../components/Layout';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { t } = useLanguage();

  const { email, password } = formData;

  const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

  const onSubmit = async e => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate('/profile');
    } catch (err) {
      setError(t('Wrong Credentials'));
      console.error(err);
    }
  };

  return (
    <Layout>
      <h2 className="text-2xl font-bold text-center mb-6">{t('login')}</h2>
      {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
      <form onSubmit={onSubmit} className="space-y-4">
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
        <button
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          type="submit"
        >
          {t('login')}
        </button>
      </form>
    </Layout>
  );
};

export default LoginPage;