'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';

const TEXTS: Record<string, string> = {
  fr: "SOS Collège Stoll d'Akono — un héritage en péril. Rejoignez l'appel des anciens, d'hier, d'aujourd'hui et de demain.",
  en: 'SOS Collège Stoll d’Akono — a heritage in peril. Join the alumni’s call, of yesterday, today and tomorrow.',
};

// Social sharing of the SOS call (WhatsApp / Facebook / copy-or-native-share).
export default function ShareBar() {
  const locale = useLocale();
  const [copied, setCopied] = useState(false);
  const shareText = TEXTS[locale] ?? TEXTS.fr;

  const url = () => (typeof window !== 'undefined' ? window.location.href : 'https://debout-stoll.org');

  const onShare = (type: 'whatsapp' | 'facebook' | 'copy') => {
    const link = url();
    if (type === 'whatsapp') {
      window.open('https://wa.me/?text=' + encodeURIComponent(shareText + ' ' + link), '_blank');
    } else if (type === 'facebook') {
      window.open('https://www.facebook.com/sharer/sharer.php?u=' + encodeURIComponent(link), '_blank');
    } else if (navigator.share) {
      navigator.share({ title: "SOS Collège Stoll d'Akono", text: shareText, url: link }).catch(() => {});
    } else if (navigator.clipboard) {
      navigator.clipboard.writeText(link).then(() => {
        setCopied(true);
        window.setTimeout(() => setCopied(false), 1600);
      });
    }
  };

  return (
    <>
      <button className="share-btn" onClick={() => onShare('whatsapp')} title="WhatsApp" aria-label="WhatsApp">
        W
      </button>
      <button className="share-btn" onClick={() => onShare('facebook')} title="Facebook" aria-label="Facebook">
        f
      </button>
      <button className="share-btn" onClick={() => onShare('copy')} title="Copy link" aria-label="Copy link">
        {copied ? '✓' : '🔗'}
      </button>
    </>
  );
}
