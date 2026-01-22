import React, { useState, useEffect } from 'react';

const FRAMES = [
  "[=----]",
  "[-=---]",
  "[--=--]",
  "[---=-]",
  "[----=]",
  "[---=-]",
  "[--=--]",
  "[-=---]"
];

export const LoadingAnimation: React.FC = () => {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame((prev) => (prev + 1) % FRAMES.length);
    }, 100);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="w-full h-64 flex flex-col items-center justify-center space-y-4">
      <div className="font-mono text-sui-blue-400 text-xl md:text-2xl font-bold tracking-widest">
        {FRAMES[frame]}
      </div>
      <p className="font-mono text-sui-gray-500 text-sm animate-pulse tracking-widest uppercase">
        Compiling Move Bytecode...
      </p>
    </div>
  );
};
