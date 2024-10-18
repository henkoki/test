import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LanguageProvider } from './contexts/LanguageContext';
import { FavoritesProvider } from './contexts/FavoritesContext'; // Make sure to create this
import Header from './components/Header';
import AppRoutes from './Routes';
import ErrorBoundary from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <FavoritesProvider>
          <LanguageProvider>
            <Router>
              <Header />
              <AppRoutes />
            </Router>
          </LanguageProvider>
        </FavoritesProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;