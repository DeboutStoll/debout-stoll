import type { Locale } from '@/lib/i18n-config';

/** A string available in both project languages. */
export type Localized = Record<Locale, string>;

/** Resolve a Localized value for the active locale (falls back to FR). */
export function t(value: Localized, locale: Locale): string {
  return value[locale] ?? value.fr;
}

export interface TimelineEntry {
  id: string;
  year: Localized;
  title: Localized;
  body: Localized;
}

export interface Figure {
  id: string;
  /** Image under /public/img, or null for a portrait still to be gathered. */
  image: string | null;
  imageAlt: Localized;
  badge: Localized;
  badgeKind: 'have' | 'seek';
  role: Localized;
  name: string; // proper name — usually not translated
  dates: Localized;
  bio: Localized;
}

export interface GalleryItem {
  id: string;
  image: string;
  alt: Localized;
  caption: Localized;
}

export interface Quote {
  id: string;
  text: Localized;
  cite: Localized;
}

export interface Anecdote {
  id: string;
  title: Localized;
  body: Localized;
}

export interface InventoryItem {
  id: string;
  icon: string;
  title: Localized;
  detail: Localized;
}

export interface SourceItem {
  id: string;
  title: Localized;
  body: Localized;
  href?: string;
}

export interface VideoItem {
  id: string;
  youtubeId: string;
  start?: number;
  title: Localized;
  caption: Localized;
  /** English narration guide, shown to EN visitors (the films are in French). */
  transcriptEn?: string;
}

export interface ChapterMark {
  seconds: number;
  label: Localized;
}
