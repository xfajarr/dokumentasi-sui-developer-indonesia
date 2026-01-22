import React from 'react';
import { Menu, X, Sparkles } from 'lucide-react';
import { useScrollState } from '../../../hooks';
import { cn } from '../../../lib/utils';
import { Button } from '../../ui';
import { NavLinks } from './NavLinks';
import { MobileMenu } from './MobileMenu';
import NAV_LINKS from './constants';

interface NavbarProps {
  onOpenAi: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAi }) => {
  const isScrolled = useScrollState();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  return (
    <>
      <nav 
        className={cn(
          "fixed top-0 left-0 right-0 z-[100] transition-all duration-300 border-b",
          isScrolled 
            ? "bg-sui-gray-900/80 backdrop-blur-lg border-sui-gray-800 py-2" 
            : "bg-transparent border-transparent py-3"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer">
            <div className="w-7 h-7 rounded-full flex items-center justify-center transition-all">
              <img src="/img/sui_ascii.svg" alt="" className="w-full h-full" />
            </div>
            <span className="font-bold text-base tracking-tight text-white group-hover:text-sui-blue-200 transition-colors">
              Sui <span className="text-sui-blue-400">Indonesia</span>
            </span>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-6">
            <NavLinks links={NAV_LINKS} className="flex items-center space-x-6" />
          </div>

          {/* Actions */}
          <div className="hidden md:flex items-center space-x-3">
            <button 
              onClick={onOpenAi}
              className="group flex items-center space-x-2 bg-sui-gray-800/50 hover:bg-sui-gray-800 border border-sui-gray-700 hover:border-sui-blue-500/30 text-sui-gray-300 hover:text-sui-blue-300 px-4 py-2 rounded-full transition-all text-sm"
            >
              <span>Ask AI...</span>
              <span className="bg-sui-gray-700/50 text-[10px] px-1.5 rounded text-sui-gray-400 ml-1 group-hover:bg-sui-gray-700 transition-colors">⌘K</span>
            </button>
            <Button size="sm">Get Started</Button>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden text-sui-gray-300 hover:text-white"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      <MobileMenu 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenAi={onOpenAi}
        links={NAV_LINKS}
      />
    </>
  );
};
