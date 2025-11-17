import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-gray-800 shadow-md p-4">
      <div className="container mx-auto flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-indigo-400 mr-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 3a9 9 0 0 1 9 9 9 9 0 0 1-9 9 9 9 0 0 1-9-9 9 9 0 0 1 9-9z"/><path d="M12 8l-2 4h4l-2 4"/><path d="M12 15l-2 4h4l-2 4"/></svg>
        <div>
           <h1 className="text-2xl font-bold text-white tracking-wider">AI Content Catalyst</h1>
           <p className="text-sm text-gray-400">Spark Your Social Media Strategy</p>
        </div>
      </div>
    </header>
  );
};