import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Folder, X, Terminal, BookOpen, Wrench } from 'lucide-react';
import { cn } from '../../lib/utils';

interface FileContent {
  title: string;
  description: string;
  icon: React.ElementType;
  content: React.ReactNode;
}

const folderContents: Record<string, FileContent> = {
  docs: {
    title: 'Documentation',
    description: 'Comprehensive guides and API references',
    icon: BookOpen,
    content: (
      <div className="space-y-4">
        <div className="p-3 bg-sui-gray-900 rounded-lg border border-sui-gray-800">
          <h4 className="text-sui-blue-400 font-mono text-xs mb-2">structure.md</h4>
          <pre className="text-[10px] text-sui-gray-400 font-mono">
{`# Sui Docs Structure
├── concepts
│   ├── objects.md
│   └── ownership.md
├── guides
│   ├── move-basics.md
│   └── zklogin.md
└── references
    └── framework.md`}
          </pre>
        </div>
        <p className="text-sm text-sui-gray-300">
          Learn about object-centric data models, programmable transaction blocks, and the Move language fundamentals.
        </p>
      </div>
    )
  },
  start: {
    title: 'Getting Started',
    description: 'Zero to Hero in 5 minutes',
    icon: Terminal,
    content: (
      <div className="space-y-3">
        <div className="flex items-center space-x-2 text-xs text-sui-gray-400 bg-sui-gray-950 p-2 rounded border border-sui-gray-800 font-mono">
          <span className="text-green-400">$</span>
          <span>npm create @mysten/create-sui-dapp</span>
        </div>
        <div className="flex items-center space-x-2 text-xs text-sui-gray-400 bg-sui-gray-950 p-2 rounded border border-sui-gray-800 font-mono">
          <span className="text-green-400">$</span>
          <span>sui client publish --gas-budget 20000000</span>
        </div>
        <p className="text-sm text-sui-gray-300">
          Bootstrap your first dApp with our scaffold tool and deploy directly to Testnet.
        </p>
      </div>
    )
  },
  tools: {
    title: 'Developer Tools',
    description: 'Essential toolkit for builders',
    icon: Wrench,
    content: (
      <div className="grid grid-cols-2 gap-2">
        {['Sui CLI', 'VS Code Extension', 'Explore', 'Wallet'].map((tool) => (
          <div key={tool} className="p-2 bg-sui-gray-900 rounded border border-sui-gray-800 text-center">
            <span className="text-xs text-sui-blue-300 font-medium">{tool}</span>
          </div>
        ))}
        <div className="col-span-2 mt-2">
           <p className="text-sm text-sui-gray-300">
             Integrated environment for writing, testing, and debugging Move smart contracts.
           </p>
        </div>
      </div>
    )
  }
};

export const Folders: React.FC = () => {
  const [openFolder, setOpenFolder] = useState<string | null>(null);

  return (
    <div className="w-full max-w-4xl mx-auto py-20 px-4">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold text-white mb-4">Explore Resources</h2>
        <p className="text-sui-gray-400">Dive into the ecosystem files</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 min-h-[300px]">
        {Object.entries(folderContents).map(([key, data], index) => (
          <motion.div
            key={key}
            layout
            // Scroll Animation: Fade in/up when in view, Fade out when out of view
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, margin: "-50px" }} // Repeats animation on re-entry
            transition={{ duration: 0.5, delay: index * 0.1 }} // Stagger effect

            onClick={() => setOpenFolder(openFolder === key ? null : key)}
            className={cn(
              "relative cursor-pointer rounded-2xl p-6 border transition-colors overflow-hidden",
              openFolder === key 
                ? "bg-sui-gray-900 border-sui-blue-500/50 shadow-2xl shadow-sui-blue-900/10 md:col-span-3"
                : "bg-sui-gray-900/40 border-sui-gray-800 hover:border-sui-gray-700 hover:bg-sui-gray-800/60 h-full"
            )}
          >
            <AnimatePresence mode="wait">
              {openFolder === key ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col md:flex-row gap-6"
                >
                   {/* Expanded State */}
                   <div className="flex-shrink-0">
                      <div className="w-12 h-12 rounded-xl bg-sui-blue-500/20 flex items-center justify-center text-sui-blue-400 mb-4">
                        <data.icon size={24} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-1">{data.title}</h3>
                      <p className="text-sui-gray-500 text-sm">{data.description}</p>
                   </div>
                   
                   <div className="flex-grow bg-sui-gray-950/50 rounded-xl p-4 border border-sui-gray-800/50">
                      {data.content}
                   </div>

                   <button 
                     onClick={(e) => { e.stopPropagation(); setOpenFolder(null); }}
                     className="absolute top-4 right-4 p-2 rounded-full hover:bg-sui-gray-800 text-sui-gray-500 hover:text-white"
                   >
                     <X size={20} />
                   </button>
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center justify-center h-full text-center space-y-4"
                >
                  {/* Collapsed State */}
                  <motion.div 
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="w-16 h-16 text-sui-blue-500/80 fill-current"
                  >
                     <Folder size={64} strokeWidth={1} />
                  </motion.div>
                  <div>
                    <h3 className="text-lg font-medium text-sui-gray-200">{data.title}</h3>
                    <p className="text-xs text-sui-gray-500 mt-1">{data.description}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>
    </div>
  );
};
