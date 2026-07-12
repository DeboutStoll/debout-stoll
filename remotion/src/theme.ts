// Shared palette — mirrors the website's design system so the film and the
// site read as one production.
export const COLORS = {
  paper: '#050403',
  paper2: '#0f0c0a',
  laterite: '#b0552f',
  laterite2: '#c9683c',
  gold: '#c9a24b',
  goldSoft: '#d8bd7e',
  bone: '#e9e0d2',
  boneDim: '#b6a894',
  moss: '#4a5d3a',
};

export const SERIF =
  '"Iowan Old Style","Palatino Linotype",Palatino,Georgia,"Times New Roman",serif';

// A film-grain data URI (SVG turbulence), reused across compositions.
export const GRAIN_URI =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='140' height='140'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")";
