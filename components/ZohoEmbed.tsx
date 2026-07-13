'use client';

import { isConfigured } from '@/content/forms';

// Responsive wrapper around a Zoho Forms public embed. Renders the form in an
// iframe when a real URL is configured; otherwise a graceful placeholder so the
// page never shows a broken frame.
export default function ZohoEmbed({
  url,
  title,
  notConfigured,
  minHeight = 720,
}: {
  url: string;
  title: string;
  notConfigured: string;
  minHeight?: number;
}) {
  if (!isConfigured(url)) {
    return (
      <div className="zoho-embed zoho-embed--empty" role="note">
        <p>{notConfigured}</p>
      </div>
    );
  }

  return (
    <div className="zoho-embed">
      <iframe
        src={url}
        title={title}
        loading="lazy"
        style={{ width: '100%', minHeight, border: 0, background: 'transparent' }}
        allow="clipboard-write"
        referrerPolicy="strict-origin-when-cross-origin"
      />
    </div>
  );
}
