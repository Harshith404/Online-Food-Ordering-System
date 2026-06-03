import React from 'react';

const Loader = ({ fullPage = false }) => {
  if (fullPage) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-900/30 backdrop-blur-md">
        <div className="relative flex items-center justify-center">
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-t-primary-500 border-r-transparent border-b-primary-500 border-l-transparent"></div>
          <div className="absolute h-10 w-10 animate-ping rounded-full border-2 border-primary-300 opacity-75"></div>
        </div>
        <p className="mt-4 font-display text-lg font-semibold text-slate-800 drop-shadow">Preparing deliciousness...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center p-8">
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-t-primary-500 border-r-transparent border-b-primary-500 border-l-transparent"></div>
    </div>
  );
};

export default Loader;
