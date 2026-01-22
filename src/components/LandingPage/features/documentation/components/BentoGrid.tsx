import React from 'react';
import { DOCUMENTATION_MODULES } from '../constants';
import { BentoCard } from './BentoCard';

export const BentoGrid: React.FC = () => {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-white tracking-tight">Documentation Modules</h2>
        <div className="h-[1px] flex-grow bg-sui-gray-800 ml-6"></div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {DOCUMENTATION_MODULES.map((item, index) => (
          <BentoCard key={index} item={item} index={index} />
        ))}
      </div>
    </section>
  );
};
