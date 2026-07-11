import type { Figure } from './types';

// Section III — Le panthéon. Add a figure here (with an image in /public/img)
// and it appears on the site — no code change required.
export const figures: Figure[] = [
  {
    id: 'p-stoll',
    image: '/img/p-stoll.jpg',
    imageAlt: { fr: 'Père Antoine Stoll', en: 'Father Antoine Stoll' },
    badge: { fr: 'Archive', en: 'Archive' },
    badgeKind: 'have',
    role: { fr: 'Spiritain · Gingsheim, Alsace', en: 'Spiritan · Gingsheim, Alsace' },
    name: 'P. Antoine Stoll',
    dates: { fr: '1890 – 1973', en: '1890 – 1973' },
    bio: {
      fr: "L'éponyme. « Un géant de la mission ». Fondateur de la mission (1923), curé jusqu'en 1943. Rentré en Alsace en 1940, enterré à Wolxheim.",
      en: 'The namesake. “A giant of the mission.” Its founder in 1923, parish priest until 1943. He returned to Alsace in 1940 and rests at Wolxheim.',
    },
  },
  {
    id: 'jean-zoa',
    image: '/img/jean-zoa.jpg',
    imageAlt: { fr: 'Mgr Jean Zoa', en: 'Archbishop Jean Zoa' },
    badge: { fr: 'Archive', en: 'Archive' },
    badgeKind: 'have',
    role: { fr: 'Archevêque · Yaoundé', en: 'Archbishop · Yaoundé' },
    name: 'Mgr Jean Zoa',
    dates: { fr: 'Fondateur du Collège, 1963', en: 'Founder of the college, 1963' },
    bio: {
      fr: "« Bienfaiteur insigne » des Maristes, qu'il accueillit réfugiés « à bras ouverts ». Il voulut ouvrir le collège aux jeunes filles dès 1970.",
      en: 'A “distinguished benefactor” of the Marists, whom he received as refugees “with open arms.” He sought to open the college to young women as early as 1970.',
    },
  },
  {
    id: 'vogt',
    image: '/img/vogt.jpg',
    imageAlt: { fr: 'Mgr François-Xavier Vogt', en: 'Bishop François-Xavier Vogt' },
    badge: { fr: 'Archive', en: 'Archive' },
    badgeKind: 'have',
    role: { fr: 'Spiritain · Marlenheim, Alsace', en: 'Spiritan · Marlenheim, Alsace' },
    name: 'Mgr F.-X. Vogt',
    dates: { fr: '1870 – 1943', en: '1870 – 1943' },
    bio: {
      fr: "Premier évêque français au Cameroun. Il installe le Petit Séminaire à Akono et appuie la mission du Père Stoll.",
      en: 'The first French bishop in Cameroon. He established the minor seminary at Akono and lent his support to Father Stoll’s mission.',
    },
  },
  {
    id: 'andre-cote',
    image: '/img/andre-cote.jpg',
    imageAlt: { fr: 'Frère André Côté', en: 'Brother André Côté' },
    badge: { fr: 'Archive', en: 'Archive' },
    badgeKind: 'have',
    role: { fr: 'Frère Mariste · Canada', en: 'Marist Brother · Canada' },
    name: 'Fr. André Côté',
    dates: { fr: 'Bâtisseur du collège, 1963–68', en: 'Builder of the college, 1963–68' },
    bio: {
      fr: "Avec le Frère Paul-André Lavoie, il mène les travaux permanents du Collège Stoll et quitte les locaux temporaires en moins de deux ans.",
      en: 'With Brother Paul-André Lavoie, he led the permanent construction of Collège Stoll, leaving the temporary quarters behind within two years.',
    },
  },
  {
    id: 'messi',
    image: '/img/messi.jpg',
    imageAlt: { fr: 'Messi Évariste dit Iso', en: 'Messi Évariste, known as “Iso”' },
    badge: { fr: 'Mémoire vive', en: 'Living memory' },
    badgeKind: 'have',
    role: { fr: 'Figure du collège · Akono', en: 'A figure of the college · Akono' },
    name: 'Messi Évariste « Iso »',
    dates: {
      fr: '« Forever » — dans le cœur des anciens',
      en: '“Forever” — in the hearts of the alumni',
    },
    bio: {
      fr: "Figure aimée, transmise par la mémoire orale des Stollois. Introuvable dans les archives écrites : ce portrait est une source primaire à préserver.",
      en: 'A cherished figure, kept alive by the oral memory of the Stoll community. Absent from the written record, this portrait stands as a primary source to be preserved.',
    },
  },
  {
    id: 'kayou',
    image: '/img/kayou.jpg',
    imageAlt: {
      fr: 'Kayou, saxophoniste de Kayou Roots, ancien du Collège Stoll',
      en: 'Kayou, saxophonist of Kayou Roots, a Collège Stoll alumnus',
    },
    badge: { fr: 'Ancien élève', en: 'Alumnus' },
    badgeKind: 'have',
    role: { fr: 'Saxophoniste · Kayou Roots', en: 'Saxophonist · Kayou Roots' },
    name: 'Kayou',
    dates: {
      fr: 'Ancien élève — rayonnement mondial',
      en: 'Former pupil — worldwide renown',
    },
    bio: {
      fr: "Formé au Collège Stoll, devenu saxophoniste de renommée internationale avec Kayou Roots. La preuve vivante de ce que la maison sait faire éclore.",
      en: 'Formed at Collège Stoll, now a saxophonist of international standing with Kayou Roots. Living proof of what this house can bring to flower.',
    },
  },
  {
    id: 'potvin',
    image: '/img/potvin.jpg',
    imageAlt: { fr: 'Frère Laurent Potvin', en: 'Brother Laurent Potvin' },
    badge: { fr: 'Archive', en: 'Archive' },
    badgeKind: 'have',
    role: { fr: 'Chroniqueur · Québec', en: 'Chronicler · Quebec' },
    name: 'Fr. Laurent Potvin',
    dates: { fr: '17 ans au Cameroun', en: '17 years in Cameroon' },
    bio: {
      fr: "Auteur de « L'Afrique aux mille couleurs » (2003), la chronique fondatrice. Le témoin qui a tout consigné.",
      en: 'Author of “L’Afrique aux mille couleurs” (2003), the founding chronicle. The witness who set it all down.',
    },
  },
];
