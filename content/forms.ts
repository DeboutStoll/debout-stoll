// ---------------------------------------------------------------------------
// Zoho Forms — public embed URLs
// ---------------------------------------------------------------------------
// On a static host there is no server to receive form posts, so both forms are
// handled by Zoho Forms (submissions + email notifications to
// contact@debout-stoll.com happen inside Zoho).
//
// HOW TO FILL THIS IN
//   1. Create two forms in Zoho Forms (see GO-LIVE-GITHUB-PAGES.md for the exact
//      fields to add — they mirror the original app forms).
//   2. For each form: Share → Embed → "Permalink" (or "Website" iframe URL).
//      Paste that https://forms.zohopublic… URL below.
//
// Until a real URL is set (i.e. it still starts with "PASTE_"), the form area
// shows a friendly "coming soon" note instead of a broken iframe.

export const zohoForms = {
  // "Rejoindre l'appel" — membership / alumni sign-up
  join: 'PASTE_ZOHO_MEMBERSHIP_FORM_URL',

  // "Contribution mémoire" — photo / testimony submission (with file upload)
  contribute: 'PASTE_ZOHO_CONTRIBUTION_FORM_URL',
} as const;

export function isConfigured(url: string): boolean {
  return typeof url === 'string' && url.startsWith('http');
}
