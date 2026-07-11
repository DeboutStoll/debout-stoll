import type { VideoItem } from './types';

// Section V — Films. Kept as YouTube embeds (unlimited bandwidth), per PROMPT §4.
//
// The films are narrated in French. For English visitors we surface:
//  1. YouTube's own auto-translated captions (cc_lang_pref=en, set in the embed);
//  2. the English narration guide below (transcriptEn), a faithful summary of
//     what each film shows — not a fabricated verbatim transcript.
export const videos: VideoItem[] = [
  {
    id: 'college-images',
    youtubeId: 'Vt2B5T9VRN4',
    title: {
      fr: "Le Collège Stoll d'Akono en images",
      en: 'Collège Stoll d’Akono in images',
    },
    caption: {
      fr: '<b>Le Collège Stoll d\'Akono en images.</b> Reportage vidéo sur le collège, son cadre et sa vie.',
      en: '<b>Collège Stoll d’Akono in images.</b> A filmed portrait of the college, its setting and its life.',
    },
    transcriptEn:
      '<p>A filmed portrait of Collège Stoll d’Akono, deep in the equatorial forest of central Cameroon. The camera moves across the campus raised by the Marist Brothers from Quebec — its classroom blocks, its boarding houses, and the vast grounds that surround them.</p>' +
      '<p>The French narration retraces the school’s standing: an institution once built for two thousand of the young, celebrated for its discipline and its academic distinction across the region. Long shots of the church of Our Lady of the Seven Sorrows, of the sports grounds and of the wooded estate give the measure of the place.</p>' +
      '<p><em>English summary provided for non-French speakers. Turn on the video’s CC button for YouTube’s auto-translated English captions.</em></p>',
  },
  {
    id: 'akono-sky',
    youtubeId: 'wAgNCMe1OeY',
    title: { fr: 'Akono vue du ciel', en: 'Akono from the sky' },
    caption: {
      fr: '<b>Akono vue du ciel.</b> Vue aérienne de la ville et du domaine de la mission.',
      en: '<b>Akono from the sky.</b> An aerial view of the town and the estate of the mission.',
    },
    transcriptEn:
      '<p>Aerial footage carries the eye over the town of Akono and the mission estate. From above, the dome bell tower of Our Lady of the Seven Sorrows stands out against the forest canopy — the silhouette that has marked the Beti landscape since 1938.</p>' +
      '<p>The drone follows the fourteen-hectare grounds: the two campuses, the boarding houses, and the broad sports complex, all held within a sea of green. There is little spoken narration; the images speak for the scale and isolation of the place.</p>' +
      '<p><em>English summary provided for non-French speakers.</em></p>',
  },
  {
    id: 'akono-visit',
    youtubeId: 'rilJroaUW3k',
    start: 30,
    title: { fr: 'Akono, la visite', en: 'Akono, the tour' },
    caption: {
      fr: '<b>Akono, la visite.</b> Promenade dans Akono et son patrimoine (dès 0:30).',
      en: '<b>Akono, the tour.</b> A walk through Akono and its heritage (from 0:30).',
    },
    transcriptEn:
      '<p>A walking tour through Akono and its heritage. The film moves from the heart of the town to the mission, pausing on the great church and the buildings raised by the Spiritan fathers and the Marist Brothers.</p>' +
      '<p>The French commentary places each site within the century of shared history between Akono and Alsace (1906–2016). Everyday scenes of the town frame the visit.</p>' +
      '<p><em>English summary provided for non-French speakers. Turn on the video’s CC button for auto-translated captions.</em></p>',
  },
];

// The 16-minute testimony video ("Le constat").
export const constatVideo = {
  youtubeId: '3TXAMJ-rBXw',
  title: {
    fr: 'Le constat — dégradation du Collège Stoll d\'Akono',
    en: 'The reckoning — the decline of Collège Stoll d’Akono',
  },
  caption: {
    fr: '<b>Document-témoignage (16 min) — « Le Collège Stoll d\'Akono ».</b> Un état des lieux filmé du domaine et de ses installations, hier fierté de toute une région, aujourd\'hui menacées de disparition. <span style="opacity:.7">Production Antheal Vision & Collège Stoll d\'Akono.</span>',
    en: '<b>A filmed testimony (16 min) —“Collège Stoll d’Akono.”</b> A survey of the estate and its buildings, once the pride of an entire region, now threatened with oblivion. <span style="opacity:.7">Produced by Antheal Vision & Collège Stoll d’Akono.</span>',
  },
  transcriptEn:
    '<p>This sixteen-minute testimony, filmed on site by Antheal Vision, is the heart of the case. It walks the viewer through what Collège Stoll once was — a self-contained, modern and self-sufficient institution — and through what has become of it.</p>' +
    '<p><strong>The campus (from 1:00).</strong> The classroom blocks and boarding houses, once new and immaculate, now worn and half-empty.</p>' +
    '<p><strong>The classrooms (from 3:00).</strong> Rooms that held generations of pupils; the French narration recalls the school’s former discipline and standing.</p>' +
    '<p><strong>The library (from 8:00) and the computer suite (from 10:00).</strong> A documentary collection and an early computer room — signs of a school ahead of its time — now neglected.</p>' +
    '<p><strong>The cultural hall (from 11:40).</strong> The arts centre that seated 2,500, with its red roof and decorative friezes.</p>' +
    '<p><strong>The testimonies (from 13:20).</strong> Former pupils and members of the community speak, in French, of what the college gave them and of their fear of seeing it disappear.</p>' +
    '<p><em>English summary provided for non-French speakers. Turn on the video’s CC button for YouTube’s auto-translated English captions.</em></p>',
};
