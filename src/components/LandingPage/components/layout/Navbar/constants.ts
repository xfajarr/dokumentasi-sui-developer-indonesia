import { Terminal, Book, Layers, FileText } from 'lucide-react';
import { NavLinkWithIcon } from '../../../types';

export const NAV_LINKS: NavLinkWithIcon[] = [
  { label: 'Guides', href: '#guides', icon: Book },
  { label: 'Concepts', href: '#concepts', icon: Layers },
  { label: 'Standards', href: '#standards', icon: FileText },
  { label: 'References', href: '#references', icon: Terminal },
];

export default NAV_LINKS;