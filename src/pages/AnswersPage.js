// src/pages/AnswersPage.js

import React from 'react';
import Layout from '../components/Layout';

const AnswersPage = () => {
  return (
    <Layout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-6">Answers</h1>
        
        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">What is Gym Traffic?</h2>
            <p>Answers: 1-A, 2-C, 3-A.</p>
          </div>

        </div>
      </div>
    </Layout>
  );
};

export default AnswersPage;