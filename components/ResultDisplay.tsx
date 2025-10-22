
import React from 'react';

interface ResultDisplayProps {
  imageUrl: string | null;
  isLoading: boolean;
}

const LoadingSpinner: React.FC = () => (
  <div className="flex flex-col items-center justify-center text-center">
    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mb-4"></div>
    <p className="text-lg font-semibold text-indigo-600">Creating your moment...</p>
    <p className="text-slate-500 mt-2">This may take a moment. The AI is working its magic!</p>
  </div>
);

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ imageUrl, isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full min-h-[300px] flex items-center justify-center p-4 bg-slate-50 rounded-lg">
        <LoadingSpinner />
      </div>
    );
  }

  if (imageUrl) {
    return (
      <div className="w-full">
        <h2 className="text-2xl font-bold text-center mb-4 text-slate-800">Your Fused Photo</h2>
        <div className="rounded-lg overflow-hidden shadow-lg border border-slate-200">
          <img src={imageUrl} alt="Generated hug" className="w-full h-auto object-contain" />
        </div>
      </div>
    );
  }

  return null;
};
