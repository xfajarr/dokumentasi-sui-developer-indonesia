import React from 'react';
import { ScrollReveal } from '../../../components/ui';
import { GridItem } from '../types';
import { cn } from '../../../lib/utils';

interface BentoCardProps {
  item: GridItem;
  index: number;
}

export const BentoCard: React.FC<BentoCardProps> = ({ item, index }) => {
  return (
    <ScrollReveal delay={index * 0.1}>
      <a
        href={item.href}
        className={cn(
          item.span || 'md:col-span-1',
          "group block relative overflow-hidden h-full border border-sui-gray-800 bg-sui-gray-800/40 p-6 backdrop-blur-sm",
          "hover:bg-sui-gray-800 hover:border-sui-blue-500/30 transition-all duration-300"
        )}
      >
        {/* Hover Glow Effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-sui-blue-500/0 via-sui-blue-500/0 to-sui-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="relative z-10 flex flex-col h-full">
          <div className="mb-4 text-sui-blue-400 group-hover:text-sui-blue-300 group-hover:scale-110 transition-all duration-300 origin-left">
            <item.icon size={32} strokeWidth={1.5} />
          </div>
          
          <h3 className="text-xl font-bold text-white mb-2 group-hover:text-sui-blue-200 transition-colors">
            {item.title}
          </h3>
          
          <p className="text-sui-gray-400 text-sm leading-relaxed group-hover:text-sui-gray-300">
            {item.description}
          </p>

          <div className="mt-auto pt-4 flex items-center text-sui-blue-500 text-xs font-bold uppercase tracking-wider opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
            Learn more <span className="ml-1">&rarr;</span>
          </div>
        </div>
      </a>
    </ScrollReveal>
  );
};
