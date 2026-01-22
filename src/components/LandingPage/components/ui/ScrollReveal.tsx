import React from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import { cn } from '../../lib/utils';

interface ScrollRevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  threshold?: number;
  mode?: 'fade-up' | 'blur-up' | 'scale-up';
}

export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  className,
  delay = 0,
  duration = 0.8,
  threshold = 0.2,
  mode = 'blur-up'
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: threshold });

  const variants = {
    'fade-up': {
      initial: { opacity: 0, y: 30 },
      animate: { opacity: 1, y: 0 }
    },
    'blur-up': {
      initial: { opacity: 0, y: 30, filter: 'blur(10px)' },
      animate: { opacity: 1, y: 0, filter: 'blur(0px)' }
    },
    'scale-up': {
      initial: { opacity: 0, scale: 0.95 },
      animate: { opacity: 1, scale: 1 }
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={variants[mode].initial}
      animate={isInView ? variants[mode].animate : variants[mode].initial}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1] // Custom "premium" easing (similar to Apple/GSAP easeOutQuart)
      }}
      className={cn("will-change-transform", className)}
    >
      {children}
    </motion.div>
  );
};
