import React, { useState, Suspense } from 'react';
import Layout from '@theme/Layout';
import Head from '@docusaurus/Head';
import { Navbar, Footer } from '../components/LandingPage/components/layout';
import { LoadingAnimation } from '../components/LandingPage/components/ui';
import { useKeyboardShortcut } from '../components/LandingPage/hooks';

// Helper to add artificial delay for aesthetic purposes (preserved from landing page)
const lazyWithDelay = <T,>(importPromise: Promise<T>) => 
  Promise.all([
    importPromise,
    // new Promise(resolve => setTimeout(resolve, 500))
  ]).then(([module]) => module);

// Lazy load feature components with delay
const HeroSection = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/hero')).then(module => ({ default: module.HeroSection })));
const BentoGrid = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/documentation')).then(module => ({ default: module.BentoGrid })));
const AsciiShowcase = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/showcase')).then(module => ({ default: module.AsciiShowcase })));
const WhySuiSection = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/landing')).then(module => ({ default: module.WhySuiSection })));
const ResourceFolders = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/landing')).then(module => ({ default: module.ResourceFolders })));
const CommunitySection = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/landing')).then(module => ({ default: module.CommunitySection })));
const AiModal = React.lazy(() => lazyWithDelay(import('../components/LandingPage/features/ai-assistant')).then(module => ({ default: module.AiModal })));

export default function Home(): React.JSX.Element {
  const [isAiModalOpen, setIsAiModalOpen] = useState(false);

  // Global shortcut to open AI Assistant (Cmd/Ctrl + K)
  useKeyboardShortcut('k', () => setIsAiModalOpen(true), { meta: true, ctrl: true });

  return (
    <Layout
      title="Home"
      description="Sui Developer Documentation - Build the Future on Sui"
    >
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        {/* Hide default Docusaurus navbar and footer on this page only via inline style */}
        <style>{`
          .navbar { display: none !important; }
          .footer { display: none !important; }
          #__docusaurus > div[class^='announcementBar'] { display: none; }
        `}</style>
      </Head>
      
      <div className="min-h-screen bg-sui-gray-900 text-sui-gray-50 selection:bg-sui-blue-500/30 selection:text-sui-blue-100 overflow-x-hidden relative landing-page-root">
        {/* Ambient background glow */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute top-[-20%] left-[20%] w-[500px] h-[500px] bg-sui-blue-700/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[10%] w-[600px] h-[600px] bg-sui-blue-600/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10">
          <Navbar onOpenAi={() => setIsAiModalOpen(true)} />
          
          <main className="container mx-auto px-4 pt-16 pb-12 space-y-12">
            <Suspense fallback={<LoadingAnimation />}>
              <HeroSection />
              <ResourceFolders />
              <WhySuiSection />
              <BentoGrid />
              <AsciiShowcase />
              <CommunitySection />
              <Footer />
            </Suspense>
          </main>
        </div>

        <Suspense fallback={null}>
          <AiModal isOpen={isAiModalOpen} onClose={() => setIsAiModalOpen(false)} />
        </Suspense>
      </div>
    </Layout>
  );
}
