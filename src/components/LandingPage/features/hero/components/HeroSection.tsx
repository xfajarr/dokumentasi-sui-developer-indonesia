import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { BackgroundCode } from './BackgroundCode';
import { ActionLinks } from './ActionLinks';

export const HeroSection: React.FC = () => {
  const containerRef = useRef<HTMLElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  // Parallax Layers
  // Background moves slowly to create depth
  const yBackground = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]); 
  
  // Content moves faster than background but slower than scroll
  const yContent = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  
  // Opacity fades out slightly later to keep content visible longer
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  
  // Tag animations
  const tagScale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const tagRotate = useTransform(scrollYProgress, [0, 0.5], [0, -5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <section
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-30 w-screen min-h-screen overflow-hidden bg-sui-gray-900 flex flex-col items-center justify-center pt-24 pb-20 md:pt-32 md:pb-32 border-b border-sui-gray-800 left-0 right-0"
      style={{
        '--mouse-x': `${mousePosition.x}px`,
        '--mouse-y': `${mousePosition.y}px`,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
      } as React.CSSProperties}
    >
      
      <motion.div style={{ y: yBackground }}>
         <BackgroundCode />
      </motion.div>

      {/* Main Content */}
      <motion.div 
        style={{ y: yContent, opacity }}
        className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center text-center"
      >
        
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center"
        >
          {/* Headline */}
          <h1 className="text-6xl md:text-8xl lg:text-[7rem] font-medium tracking-tight text-white leading-[1.05] md:leading-[1] mb-8">
            Build the Future <br className="hidden md:block" />
            on the <motion.span 
              style={{ scale: tagScale, rotate: tagRotate }}
              className="inline-flex items-center align-middle mx-1 md:mx-2 cursor-default"
            >
              <span className="bg-white text-sui-gray-900 px-3 md:px-6 py-1 md:py-2 rounded-l-sm tracking-tighter font-medium">Sui</span>
              <span className="bg-sui-blue-500 text-white px-3 md:px-6 py-1 md:py-2 rounded-r-sm tracking-tighter font-medium">Network</span>
            </motion.span>
          </h1>

          {/* Subtext */}
          <p className="max-w-4xl mx-auto text-xl md:text-2xl text-sui-gray-300 font-normal leading-relaxed mb-12">
            Join the fastest growing developer ecosystem in Indonesia. <br className="hidden md:block" />
            Master <strong>Move</strong>, build scalable dApps, and redefine ownership.
          </p>
        </motion.div>
      </motion.div>

      <div className="relative z-20 mt-12">
        <ActionLinks />
      </div>
    </section>
  );
};
