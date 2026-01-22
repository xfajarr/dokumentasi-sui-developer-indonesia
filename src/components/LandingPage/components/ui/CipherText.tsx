import React, { useEffect, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()_+";

interface CipherTextProps {
  text: string;
  className?: string;
  delay?: number;
}

export const CipherText: React.FC<CipherTextProps> = ({ text, className, delay = 0 }) => {
  const [display, setDisplay] = useState('');
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    let iterations = 0;
    const interval = setInterval(() => {
      setDisplay(
        text
          .split('')
          .map((char, index) => {
            if (index < iterations) return char;
            return CHARS[Math.floor(Math.random() * CHARS.length)];
          })
          .join('')
      );

      if (iterations >= text.length) {
        clearInterval(interval);
      }
      iterations += 1 / 3; // Speed control
    }, 30);

    const timeout = setTimeout(() => {
        // start delay
    }, delay);

    return () => clearInterval(interval);
  }, [text, isInView, delay]);

  return <span ref={ref} className={className}>{display}</span>;
};
