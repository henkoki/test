import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SearchPage from './pages/SearchPage';
import ResultsPage from './pages/ResultsPage';
import SearchHistoryPage from './pages/SearchHistoryPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import SuccessPage from './pages/SuccessPage';
import InfoPage from './pages/InfoPage';
import HowItWorks from './pages/HowItWorks'

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<SearchPage />} />
      <Route path="/results" element={<ResultsPage />} />
      <Route path="/search-history" element={<SearchHistoryPage />} />
	  <Route path="/info" element={<InfoPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/profile" element={<ProfilePage />} />
      <Route path="/success" element={<SuccessPage />} />
	  <Route path="/howitworks" element={<HowItWorks />} />
    </Routes>
  );
};

export default AppRoutes;