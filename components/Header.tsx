
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-indigo-600">
          ShurGee
        </h1>
        <p className="text-slate-500 mt-2 text-lg">A Project By R Tasaduk</p>
      </div>
    </header>
  );
};
