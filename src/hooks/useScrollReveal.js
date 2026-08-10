'use client';

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook: animate children of a container ref with a staggered scroll-triggered
 * fade-up reveal using GSAP ScrollTrigger.
 *
 * @param {string} selector - CSS selector for child elements to animate (default: ':scope > *')
 * @param {object} opts - Options: { stagger, y, duration, start }
 */
export function useScrollReveal(ref, selector = ':scope > *', opts = {}) {
  useEffect(() => {
    if (!ref.current) return;
    const { stagger = 0.12, y = 30, duration = 0.7, start = 'top 85%' } = opts;

    const ctx = gsap.context(() => {
      const elements = ref.current.querySelectorAll(selector);
      if (!elements.length) return;

      gsap.fromTo(
        elements,
        { y, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration,
          stagger,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: ref.current,
            start,
            once: true,
          },
        }
      );
    }, ref);

    return () => ctx.revert();
  }, []);
}
