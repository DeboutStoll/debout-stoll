// Official channels. Add a URL here and it appears in the footer / actions —
// no code change. Leave a value empty ('') to hide that channel until it's
// ready (WhatsApp Business, YouTube, X, TikTok coming later).
export type SocialKey = 'facebookGroup' | 'whatsapp' | 'youtube' | 'x' | 'tiktok';

// Number of members in the Facebook group, shown in the counter.
// Update this by hand from the group's real figure (or 0 to hide the tile).
// Everything runs on Facebook now, so this is the single source for the count.
export const facebookMembers = 0;

export const social: Record<SocialKey, string> = {
  facebookGroup: 'https://www.facebook.com/groups/2246960062720670/',
  whatsapp: '', // WhatsApp Business invite link
  youtube: '',
  x: '',
  tiktok: '',
};

export const socialMeta: Record<SocialKey, { glyph: string; label: string }> = {
  facebookGroup: { glyph: 'f', label: 'Facebook' },
  whatsapp: { glyph: 'W', label: 'WhatsApp' },
  youtube: { glyph: '▶', label: 'YouTube' },
  x: { glyph: '𝕏', label: 'X' },
  tiktok: { glyph: '♪', label: 'TikTok' },
};

// The channels that have a URL set, in display order.
export const activeSocials = (Object.keys(social) as SocialKey[]).filter(
  (k) => social[k].length > 0,
);
