'use client';

import { useEffect } from 'react';

// Registers the service worker (installable PWA + offline text/images).
export default function PwaRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') return;
    if (!('serviceWorker' in navigator)) return;
    const register = () =>
      navigator.serviceWorker.register('/sw.js').catch(() => {
        /* offline support is progressive — failure is non-fatal */
      });
    window.addEventListener('load', register);
    return () => window.removeEventListener('load', register);
  }, []);

  return null;
}
