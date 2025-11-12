import React, { useState } from 'react';
import Navbar from './components/Navbar';
import ToolsPage from './pages/ToolsPage';
import InfoPage from './pages/InfoPage';

const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState('tools');

  return (
    <div className="min-h-screen bg-gray-900 text-gray-200 font-sans">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        <header className="text-center mb-16">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500">
            The Creative Hub
          </h1>
          <p className="mt-4 text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            A comprehensive, interactive suite of next-generation AI video and image generator tools.
          </p>
        </header>

        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} />

        {currentPage === 'tools' && <ToolsPage />}
        {currentPage === 'info' && <InfoPage />}
        
      </main>
    </div>
  );
};

export default App;