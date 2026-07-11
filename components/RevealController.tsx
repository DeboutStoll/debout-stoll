'use client';

import { useEffect } from 'react';

/**
 * Reproduces the original scroll-reveal choreography 1:1 by driving the exact
 * same CSS classes ([data-reveal], [data-stagger], .timeline.in …) with an
 * IntersectionObserver. This guarantees zero visual loss versus the static
 * site. Hero entrance motion is handled separately by Framer Motion.
 *
 * Runs once after hydration and re-runs on locale/route change (keyed by
 * pathname from the parent) so freshly rendered sections are observed.
 */
export default function RevealController() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!('IntersectionObserver' in window) || reduce) {
      document
        .querySelectorAll('[data-reveal],[data-stagger],.timeline')
        .forEach((el) => el.classList.add('in'));
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add('in');
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -8% 0px' },
    );

    const targets = document.querySelectorAll(
      'section .sec-head, section .sec-intro, .timeline, .feature, .archive-strip, ' +
        '.people, .videos, .gallery, .anecdotes, .sources, .quote, .sos, footer .wrap',
    );
    targets.forEach((el) => {
      if (el.matches('.people, .videos, .gallery, .anecdotes, .sources')) {
        el.setAttribute('data-stagger', '');
      } else if (!el.hasAttribute('data-reveal')) {
        el.setAttribute('data-reveal', '');
      }
      io.observe(el);
    });

    return () => io.disconnect();
  }, []);

  return null;
}
