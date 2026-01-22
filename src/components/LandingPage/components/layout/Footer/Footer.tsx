import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-sui-gray-800 bg-sui-gray-900/80 backdrop-blur-md py-8 mt-12">
      <div className="container mx-auto px-4 text-center text-sui-gray-500 text-sm">
        <p>&copy; {new Date().getFullYear()} Sui Indonesia Community. Built for builders.</p>
      </div>
    </footer>
  );
};
