import React from 'react';

const LoadingSpinner: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center pt-20">
      <div className="glassmorphism-card p-8 text-center">
        <div className="spinner mx-auto mb-4"></div>
        <p className="text-white/80">載入中...</p>
      </div>
    </div>
  );
};

export default LoadingSpinner;