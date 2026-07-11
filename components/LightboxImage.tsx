'use client';

import { useCallback, useEffect, useState } from 'react';
import Image from 'next/image';

/**
 * A Next/Image that opens a cinematic full-screen lightbox on click, showing
 * the ORIGINAL file bytes at natural resolution (no upscaling, no optimizer
 * downscale) — i.e. the sharpest possible "vue nette" of archival documents.
 */
export default function LightboxImage({
  src,
  alt,
  width,
  height,
  sizes,
  caption,
  className,
  priority,
  style,
}: {
  src: string;
  alt: string;
  width: number;
  height: number;
  sizes?: string;
  caption?: string;
  className?: string;
  priority?: boolean;
  style?: React.CSSProperties;
}) {
  const [open, setOpen] = useState(false);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close();
    document.addEventListener('keydown', onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  return (
    <>
      <button
        type="button"
        className={`lightbox-trigger ${className ?? ''}`}
        onClick={() => setOpen(true)}
        aria-label={`${alt} — agrandir / enlarge`}
      >
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          priority={priority}
          quality={92}
          style={style}
        />
        <span className="lightbox-hint" aria-hidden="true">⤢</span>
      </button>

      {open && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label={alt} onClick={close}>
          <div className="lightbox-bars" aria-hidden="true" />
          <button className="lightbox-close" onClick={close} aria-label="Fermer / Close">
            ✕
          </button>
          <figure className="lightbox-figure" onClick={(e) => e.stopPropagation()}>
            {/* Raw file — original pixels, maximum sharpness. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} alt={alt} className="lightbox-img" />
            {caption && <figcaption dangerouslySetInnerHTML={{ __html: caption }} />}
          </figure>
        </div>
      )}
    </>
  );
}
