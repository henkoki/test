import React, { useState, useEffect } from 'react';

const ApiTestPage = () => {
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const testApiConnection = async () => {
      try {
        const response = await fetch('https://besttime.app/api/v1/keys/pri_070565f833f9459aad223978a7a19b74');
        const data = await response.json();
        setApiResponse(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    testApiConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-4">BestTime API Connection Test</h1>
        
        {loading && <p className="text-gray-600">Testing API connection...</p>}
        
        {error && (
          <div className="text-red-500 mb-4">
            <p>Error: {error}</p>
            <p>Failed to connect to the API. Please check your internet connection and try again.</p>
          </div>
        )}
        
        {apiResponse && (
          <div>
            <h2 className="text-xl font-semibold mb-2">API Response:</h2>
            <pre className="bg-gray-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
            
            {apiResponse.status === 'OK' && apiResponse.valid && (
              <p className="mt-4 text-green-600 font-semibold">
                API connection successful! Your API key is valid and active.
              </p>
            )}
            
            {(!apiResponse.valid || apiResponse.status !== 'OK') && (
              <p className="mt-4 text-red-600 font-semibold">
                API connection failed. Please check your API key and try again.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ApiTestPage;