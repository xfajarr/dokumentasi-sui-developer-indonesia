import { Terminal, BookOpen, ShieldCheck, Rocket, Code2, Database } from 'lucide-react';
import { GridItem } from './types';

export const DOCUMENTATION_MODULES: GridItem[] = [
  {
    title: "Getting Started",
    description: "Install the Sui CLI, set up your wallet, and get test tokens.",
    icon: Rocket,
    href: "#getting-started",
    span: "md:col-span-2"
  },
  {
    title: "Sui Developer Basics",
    description: "Understand Objects, Ownership, and the Sui Move programming model.",
    icon: Terminal,
    href: "#developer-basics",
    span: "md:col-span-1"
  },
  {
    title: "Move Language",
    description: "Deep dive into Move syntax, modules, and safe smart contract patterns.",
    icon: Code2,
    href: "#move-language",
    span: "md:col-span-1"
  },
  {
    title: "Validating & Nodes",
    description: "Run a Full node or Validator. Participate in network security.",
    icon: ShieldCheck,
    href: "#validating",
    span: "md:col-span-2"
  },
  {
    title: "dApp Kit",
    description: "React hooks and UI components for building frontends.",
    icon: Database,
    href: "#dapp-kit",
    span: "md:col-span-1"
  },
   {
    title: "Tutorials",
    description: "Step-by-step guides for building NFTs, DeFi, and Games.",
    icon: BookOpen,
    href: "#tutorials",
    span: "md:col-span-2"
  },
];
