import React from 'react';
import { motion } from 'framer-motion';
import { CipherText } from '../../../components/ui';

export const AsciiShowcase: React.FC = () => {
  return (
    <section className="py-24 overflow-hidden relative border-t border-sui-gray-800 bg-sui-gray-900/50">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay pointer-events-none"></div>
       
       <div className="container mx-auto relative z-10 px-4">
          <div className="flex flex-col items-center justify-center text-center relative">
             <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 0.2, scale: 1 }}
              transition={{ duration: 1 }}
              className="absolute w-[400px] h-[400px] md:w-[500px] md:h-[500px] -z-100 pointer-events-none"
             >
                <img 
                  src="/img/sui_ascii.svg" 
                  alt="Sui Logo" 
                  className="w-full h-full object-contain"
                />
             </motion.div>
             
             <div className="w-full max-w-2xl mx-auto">
                <div className="relative bg-sui-gray-950 border border-sui-gray-800 rounded-xl overflow-hidden font-mono text-sm text-left shadow-none">
                  <div className="flex items-center px-4 py-3 bg-sui-gray-900 border-b border-sui-gray-800">
                    <div className="flex space-x-2 opacity-50">
                      <div className="w-3 h-3 rounded-full bg-red-500" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500" />
                      <div className="w-3 h-3 rounded-full bg-green-500" />
                    </div>
                    <div className="ml-4 text-xs text-sui-gray-600 flex-1 text-center font-medium">
                      root@sui-node:~
                    </div>
                  </div>

                  <div className="p-6 space-y-2 min-h-[220px]">
                    <div className="flex items-center">
                      <span className="text-sui-blue-500 mr-2">➜</span>
                      <CipherText text="sui move build" />
                    </div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.0, duration: 0.5 }}
                      className="text-sui-gray-400"
                    >
                      UPDATING GIT DEPENDENCY <span className="text-sui-blue-400">https://github.com/MystenLabs/sui.git</span>
                    </motion.div>
                    
                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.5, duration: 0.5 }}
                      className="text-sui-gray-400"
                    >
                      INCLUDING DEPENDENCY <span className="text-white">Sui</span>
                    </motion.div>
                    
                     <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 1.8, duration: 0.5 }}
                      className="text-sui-gray-400"
                    >
                      INCLUDING DEPENDENCY <span className="text-white">MoveStdlib</span>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 2.2, duration: 0.5 }}
                      className="text-sui-gray-400"
                    >
                      BUILDING <span className="text-white">my_first_package</span>
                    </motion.div>

                    <motion.div 
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ delay: 3.0, duration: 0.2 }}
                      className="flex items-center pt-2"
                    >
                      <span className="text-green-400 font-bold bg-green-400/10 px-2 py-0.5 rounded text-xs">BUILD SUCCESSFUL</span>
                      <span className="ml-auto text-sui-gray-600 text-xs">1.2s</span>
                    </motion.div>
                  </div>
                </div>
             </div>
             
             <p className="mt-12 text-sui-gray-500 font-mono text-sm tracking-widest">
                Ready to deploy your first smart contract on Sui?
             </p>
          </div>
       </div>
    </section>
  );
};
