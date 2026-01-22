import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import { NavLinkWithIcon } from '../../../types/navigation';
import { Button } from '../../ui';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAi: () => void;
  links: NavLinkWithIcon[];
}

export const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose, onOpenAi, links }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="fixed inset-0 z-40 bg-sui-gray-900 pt-24 px-4 md:hidden overflow-y-auto"
        >
          <div className="flex flex-col space-y-6">
            <button 
              onClick={() => {
                onClose();
                onOpenAi();
              }}
              className="w-full flex items-center justify-center space-x-2 bg-sui-gray-800/50 border border-sui-gray-700 p-3 rounded-lg text-sui-gray-300"
            >
              <span>Ask AI Assistant</span>
            </button>

            <div className="space-y-1">
              {links.map((link) => (
                <a 
                  key={link.label}
                  href={link.href}
                  className="flex items-center space-x-3 p-3 rounded-lg text-sui-gray-300 hover:bg-sui-gray-800/50 hover:text-sui-blue-400 transition-all"
                  onClick={onClose}
                >
                  <link.icon className="w-5 h-5 opacity-70" />
                  <span className="text-lg font-medium">{link.label}</span>
                </a>
              ))}
            </div>

            <Button className="w-full">
              Get Started
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
