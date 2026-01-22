import { LucideIcon } from 'lucide-react';

export interface NavLink {
  label: string;
  href: string;
}

export interface NavLinkWithIcon extends NavLink {
  icon: LucideIcon;
}
