import React from 'react';
import { NavLinkWithIcon } from '../../../types/navigation';

interface NavLinksProps {
  links: NavLinkWithIcon[];
  onClick?: () => void;
  className?: string;
  itemClassName?: string;
}

export const NavLinks: React.FC<NavLinksProps> = ({ 
  links, 
  onClick, 
  className = "flex items-center space-x-6",
  itemClassName = "text-xs font-medium text-sui-gray-300 hover:text-sui-blue-400 transition-colors flex items-center space-x-1.5"
}) => {
  return (
    <div className={className}>
      {links.map((link) => (
        <a 
          key={link.label} 
          href={link.href}
          className={itemClassName}
          onClick={onClick}
        >
          {link.icon && <link.icon className="w-5 h-5 opacity-70" />}
          <span>{link.label}</span>
        </a>
      ))}
    </div>
  );
};
