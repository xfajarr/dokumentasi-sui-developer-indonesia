import React, { useEffect, useState } from 'react';
import { FileText, BookOpen, Wrench, ArrowUpRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ActionLinks: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { href: "/docs/intro", label: "Documentation", icon: FileText, short: "Docs" },
    { href: "/docs/intro", label: "Getting Started", icon: BookOpen, short: "Start" },
    { href: "#tools", label: "Tools", icon: Wrench, short: "Tools" },
  ];

  return (
    <div className="relative w-full">
      {/* State 1: Hero Inline - Reserved space to prevent layout jump */}
      <div className="h-16 mt-12 flex justify-center items-center">
        <AnimatePresence mode="wait">
          {!isScrolled && (
            <motion.div 
              key="inline-links"
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, scale: 0.95, y: 10, transition: { duration: 0.2 } }}
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1,
                    delayChildren: 0.1
                  }
                }
              }}
              className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-white font-medium text-sm md:text-base w-full"
            >
              {links.map((link) => (
                <motion.a 
                  key={link.href}
                  href={link.href} 
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: { opacity: 1, y: 0 }
                  }}
                  whileHover={{ scale: 1.05 }}
                  className="group flex items-center space-x-2 hover:text-sui-blue-300 transition-colors"
                >
                  <link.icon className="w-4 h-4" />
                  <span>{link.label}</span>
                  <ArrowUpRight className="w-3 h-3 opacity-50 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </motion.a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>


      {/* State 2: Fixed Scroll Dock (Visible when scrolled) */}
      <AnimatePresence>
        {isScrolled && (
          <motion.div 
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="fixed bottom-0 left-0 right-0 z-[999] flex justify-center pointer-events-none pb-8"
          >
            <motion.div 
              className="pointer-events-auto bg-sui-gray-900/80 backdrop-blur-xl border border-sui-gray-800 px-8 py-4 shadow-2xl shadow-black/50 rounded-full min-w-[320px] md:min-w-[500px]"
              initial="hidden"
              animate="visible"
              variants={{
                visible: {
                  transition: {
                    staggerChildren: 0.1
                  }
                }
              }}
            >
              <div className="flex justify-around items-center gap-6 text-sui-gray-300 font-medium text-sm md:text-base whitespace-nowrap">
                {links.map((link) => (
                  <motion.a 
                    key={link.href}
                    href={link.href} 
                    variants={{
                      hidden: { opacity: 0, y: 10 },
                      visible: { opacity: 1, y: 0 }
                    }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group flex items-center space-x-2 hover:text-white transition-colors relative py-1"
                  >
                    <link.icon className="w-4 h-4 text-sui-blue-500 group-hover:text-sui-blue-400" />
                    <span className="hidden sm:inline">{link.label}</span>
                    <span className="sm:hidden">{link.short}</span>
                    <span className="absolute -bottom-0 left-0 w-0 h-[2px] bg-sui-blue-500 group-hover:w-full transition-all duration-300" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
