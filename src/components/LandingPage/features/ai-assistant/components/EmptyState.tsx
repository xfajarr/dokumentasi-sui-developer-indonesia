import React from 'react';
import { Terminal } from 'lucide-react';

export const EmptyState: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center text-sui-gray-500 mt-10">
      <div className="w-16 h-16 rounded-2xl bg-sui-gray-900 flex items-center justify-center mb-6 border border-sui-gray-800 shadow-inner">
        <Terminal className="w-8 h-8 text-sui-blue-500/50" />
      </div>
      <p className="text-lg font-medium text-white mb-2">Ask anything about Sui</p>
      <p className="text-sm max-w-xs text-sui-gray-400">
        &quot;How do I create a Sui Move object?&quot;<br/>
        &quot;Explain Programmable Transaction Blocks.&quot;
      </p>
    </div>
  );
};
