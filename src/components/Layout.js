import React from 'react';

const Layout = ({ children, wide = false }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className={`bg-white bg-opacity-40 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-full ${wide ? 'max-w-6xl' : 'max-w-md'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;