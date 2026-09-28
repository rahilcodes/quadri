'use client';

import { useEffect } from 'react';

/**
 * One IntersectionObserver for the whole page. Anything marked data-reveal
 * (fade-and-rise) or data-draw (hairlines) gets .is-visible the first time it
 * enters the viewport, then is never observed again. The CSS lives in
 * app/globals.css and collapses to an instant change under reduced motion.
 */
export default function Motion() {
  useEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('[data-reveal], [data-draw]');
    if (!('IntersectionObserver' in window)) {
      targets.forEach((el) => el.classList.add('is-visible'));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: '0px 0px -12% 0px', threshold: 0.05 },
    );
    targets.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
