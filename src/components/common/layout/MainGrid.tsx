import React from 'react';

interface MainGridProps {
  children: React.ReactNode;
  className?: string;
}

const MainGrid: React.FC<MainGridProps> = ({ children, className = '' }) => {
  return (
    <main className={`ml-64 pt-16 min-h-screen bg-gray-50 ${className}`}>
      <div className="max-w-7xl mx-auto p-4 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {children}
        </div>
      </div>
    </main>
  );
};

export default MainGrid;
