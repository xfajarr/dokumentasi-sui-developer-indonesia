import React from 'react';
import { BACKGROUND_CODE } from '../constants';

export const BackgroundCode: React.FC = () => {
  return (
    <>
      {/* Base dim layer */}
      <div className="absolute inset-0 z-0 overflow-hidden select-none">
        <div className="font-mono text-sui-gray-400 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words opacity-10 w-full h-full">
           {BACKGROUND_CODE}
        </div>
      </div>

      <div
        className="absolute inset-0 z-0 overflow-hidden select-none pointer-events-none mix-blend-screen"
        style={{
          maskImage: 'radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), black, transparent)',
          WebkitMaskImage: 'radial-gradient(circle 350px at var(--mouse-x) var(--mouse-y), black, transparent)',
        }}
      >
        <div className="font-mono text-cyan-100 text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words opacity-100 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)] w-full h-full">
           {BACKGROUND_CODE}
        </div>
      </div>

      {/* Radial fade for background code */}
      <div className="absolute inset-0 z-1 bg-gradient-to-r from-sui-gray-900/90 via-sui-gray-900/60 to-sui-gray-900/90" />
      <div className="absolute inset-0 z-1 bg-gradient-to-b from-sui-gray-900/80 via-transparent to-sui-gray-900" />
    </>
  );
};
