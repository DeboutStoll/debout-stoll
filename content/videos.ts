import type { VideoItem } from './types';

// Section V — Films. Kept as YouTube embeds (unlimited bandwidth), per PROMPT §4.
//
// The films are narrated in French. For English visitors we surface:
//  1. YouTube's own auto-translated captions (cc_lang_pref=en, set in the embed);
//  2. the English narration guide below (transcriptEn), a faithful summary of
//     what each film shows — not a fabricated verbatim transcript.
export const videos: VideoItem[] = [
  {
    id: 'eglise-images',
    youtubeId: 'Vt2B5T9VRN4',
    title: {
      fr: "L'église d'Akono en images",
      en: 'The church of Akono in images',
    },
    caption: {
      fr: '<b>L\'église d\'Akono en images.</b> Un portrait filmé de Notre-Dame des Sept Douleurs — le joyau de la mission, son architecture et son cadre.',
      en: '<b>The church of Akono in images.</b> A filmed portrait of Our Lady of the Seven Sorrows — the jewel of the mission, its architecture and its setting.',
    },
    transcriptEn:
      '<p>A filmed portrait of the church of Akono — Our Lady of the Seven Sorrows — the great edifice raised between 1933 and 1938 to Father Stoll’s designs, deep in the equatorial forest. The camera lingers on its ochre-and-white façade, its dome bell tower, its long nave and its Alsatian vaults.</p>' +
      '<p>The French commentary recalls the church as one of the noblest monuments of Catholic faith in the region — beaver-tail tiles, brick and timber, room for more than three thousand faithful, and acoustics without equal. It is this church, mother of the whole work, from which the mission and later the college sprang.</p>' +
      '<p><em>A faithful English description of the film’s content (the narration is in French; no verified transcript is available). Turn on the video’s CC button for any auto-translated captions.</em></p>',
  },
  {
    id: 'akono-sky',
    youtubeId: 'wAgNCMe1OeY',
    title: { fr: 'Akono vue du ciel', en: 'Akono from the sky' },
    caption: {
      fr: '<b>Akono vue du ciel.</b> Vue aérienne de la ville et du domaine de la mission. En plein cours de musique au centre artistique du collège Stoll d\'Akono.',
      en: '<b>Akono from the sky.</b> An aerial view of the town and the estate of the mission — and a music lesson under way at the arts centre of Collège Stoll d\'Akono.',
    },
    transcriptEn:
      '<p>Aerial footage carries the eye over the town of Akono and the mission estate. From above, the dome bell tower of Our Lady of the Seven Sorrows stands out against the forest canopy — the silhouette that has marked the Beti landscape since 1938.</p>' +
      '<p>The drone follows the fourteen-hectare grounds: the two campuses, the boarding houses, and the broad sports complex, all held within a sea of green. The film also carries us inside the arts centre, where a music lesson is under way — the living present of a school still teaching.</p>' +
      '<p><em>A faithful English description of the film’s content (no captions are available for this film).</em></p>',
  },
  {
    id: 'akono-visit',
    youtubeId: 'rilJroaUW3k',
    start: 30,
    title: { fr: 'Akono, la visite', en: 'Akono, the tour' },
    caption: {
      fr: '<b>Akono, la visite.</b> Promenade dans Akono et son patrimoine.',
      en: '<b>Akono, the tour.</b> A walk through Akono and its heritage.',
    },
    transcriptEn:
      '<p>A walking tour through Akono and its heritage. The film moves from the heart of the town to the mission, pausing on the great church and the buildings raised by the Spiritan fathers and the Marist Brothers.</p>' +
      '<p>The French commentary places each site within the century of shared history between Akono and Alsace (1906–2016). Everyday scenes of the town frame the visit.</p>' +
      '<p><em>A faithful English description of the film’s content (no captions are available for this film).</em></p>',
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
    '<p><em>A faithful English overview of the film’s content, keyed to the chapter timecodes above (a verified word-for-word transcript of the French narration is not available).</em></p>',
};
