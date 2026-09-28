'use client';

import { useEffect, useRef } from 'react';

const DURATION = 1400; // ms; long enough to read as deliberate
const easeOut = (t: number) => 1 - Math.pow(1 - t, 3);

/**
 * Counts from zero to `to` once, the first time it enters view. The server
 * renders the final value, so the fact is correct without JavaScript, for
 * crawlers and under prefers-reduced-motion. Screen readers always get the
 * final value from the visually hidden copy.
 */
export default function CountUp({ to, value }: { to: number; value: string }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // Already on screen at load (very tall viewports): leave the final value alone.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    let frame = 0;
    el.textContent = '0';

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min((now - start) / DURATION, 1);
          el.textContent = String(Math.round(easeOut(progress) * to));
          if (progress < 1) frame = requestAnimationFrame(tick);
          else el.textContent = value;
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    observer.observe(el);

    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
      el.textContent = value;
    };
  }, [to, value]);

  return (
    <>
      <span ref={ref} aria-hidden="true">
        {value}
      </span>
      <span className="sr-only">{value}</span>
    </>
  );
}
