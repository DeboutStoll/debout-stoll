import type { GalleryItem } from './types';

// Section VI — Lieux. Drop a new image in /public/img and add an entry here.
export const gallery: GalleryItem[] = [
  {
    id: 'eglise-couleur',
    image: '/img/eglise-aujourdhui.jpg',
    alt: { fr: 'Église Notre-Dame des Sept Douleurs en couleur', en: 'Church of Our Lady of the Seven Sorrows, in colour' },
    caption: {
      fr: "<b>Le joyau aujourd'hui.</b> Façade ocre et blanche. © GESCOD / M. Weyland.",
      en: '<b>The jewel today.</b> Its façade of ochre and white. © GESCOD / M. Weyland.',
    },
  },
  {
    id: 'nef',
    image: '/img/nef.jpg',
    alt: { fr: "Nef intérieure de l'église d'Akono", en: 'Interior nave of the Akono church' },
    caption: {
      fr: '<b>Nef & intérieur.</b> 70 m de long, 3 000 fidèles, une acoustique exceptionnelle sous voûtes alsaciennes.',
      en: '<b>Nave & interior.</b> 70 m in length, 3,000 faithful, acoustics without equal beneath Alsatian vaults.',
    },
  },
  {
    id: 'vue-aerienne',
    image: '/img/vue-aerienne.jpg',
    alt: { fr: "Vue aérienne d'Akono depuis le clocher", en: 'Aerial view of Akono from the bell tower' },
    caption: {
      fr: "<b>Le domaine en forêt.</b> Vue d'Akono depuis le clocher de l'église. © Michel Weyland, GESCOD.",
      en: '<b>The estate amid the forest.</b> Akono seen from the church bell tower. © Michel Weyland, GESCOD.',
    },
  },
  {
    id: 'chantier-1923',
    image: '/img/chantier-1923.jpg',
    alt: { fr: "Chantier de la mission d'Akono 1923", en: 'The Akono mission under construction, 1923' },
    caption: {
      fr: "<b>Le chantier fondateur.</b> Le Père Stoll et les colonnes de l'église naissante.",
      en: '<b>The founding worksite.</b> Father Stoll among the columns of the rising church.',
    },
  },
  {
    id: 'stoll-chantier',
    image: '/img/stoll-chantier.jpg',
    alt: { fr: 'Le Père Stoll sur le chantier', en: 'Father Stoll on the worksite' },
    caption: {
      fr: "<b>Le bâtisseur à l'œuvre.</b> Archives spiritaines de Chevilly-Larue.",
      en: '<b>The builder at his work.</b> Spiritan archives, Chevilly-Larue.',
    },
  },
  {
    id: 'allee-fete',
    image: '/img/allee-fete.jpg',
    alt: { fr: "Allée de l'église un jour de fête", en: 'The church aisle on a feast day' },
    caption: {
      fr: "<b>Jour de fête.</b> L'allée centrale et la foule, vers 1937.",
      en: '<b>A feast day.</b> The central aisle and the gathered throng, around 1937.',
    },
  },
  {
    id: 'inauguration-1969',
    image: '/img/inauguration-1969.jpg',
    alt: { fr: 'Inauguration du Collège Stoll 1969', en: 'Inauguration of Collège Stoll, 1969' },
    caption: {
      fr: "<b>Inauguration, 1969.</b> Paul Biya, ancien séminariste d'Akono, revenu inaugurer le collège. Document couleur d'époque.",
      en: '<b>Inauguration, 1969.</b> Paul Biya, once a seminarian of Akono, returned to inaugurate the college. A colour document of the period.',
    },
  },
  {
    id: 'clocher',
    image: '/img/clocher.jpg',
    alt: { fr: "Clocher-dôme de l'église d'Akono", en: 'Dome bell tower of the Akono church' },
    caption: {
      fr: '<b>Le clocher-dôme.</b> Une silhouette qui marque le paysage béti depuis 1938.',
      en: '<b>The dome tower.</b> A silhouette that has marked the Beti landscape since 1938.',
    },
  },
  {
    id: 'ferronnerie',
    image: '/img/ferronnerie.jpg',
    alt: { fr: "Croix en ferronnerie, mission d'Akono", en: 'Wrought-iron cross, Akono mission' },
    caption: {
      fr: "<b>Ferronnerie d'art.</b> Le détail des portes de l'église, savoir-faire alsacien.",
      en: '<b>Wrought-iron artistry.</b> A detail of the church doors — Alsatian craftsmanship.',
    },
  },
  {
    id: 'porte-peinte',
    image: '/img/porte-peinte.jpg',
    alt: { fr: "Détail peint d'une porte de l'église", en: 'Painted detail of a church door' },
    caption: {
      fr: "<b>L'art de la mission.</b> Motif peint — l'héritage décoratif que prolongera Atini Charles.",
      en: '<b>The art of the mission.</b> A painted motif — the decorative legacy Atini Charles would carry forward.',
    },
  },
  {
    id: 'eleves-cortege',
    image: '/img/eleves-cortege.jpg',
    alt: { fr: 'Élèves en cortège à Akono', en: 'Pupils in procession at Akono' },
    caption: {
      fr: "<b>La jeunesse d'Akono.</b> Cortège d'élèves sur le site — la vie qui continue.",
      en: '<b>The youth of Akono.</b> A procession of pupils across the grounds — life carrying on.',
    },
  },
  {
    id: 'akono-ville',
    image: '/img/akono-ville.jpg',
    alt: { fr: 'Akono, le village et son patrimoine', en: 'Akono, the town and its heritage' },
    caption: {
      fr: "<b>Akono, la ville.</b> Le centre d'Akono et son cadre, extrait de la visite filmée.",
      en: '<b>Akono, the town.</b> The heart of Akono and its setting, drawn from the filmed tour.',
    },
  },
  {
    id: 'complexe-sportif',
    image: '/img/complexe-sportif.jpg',
    alt: { fr: 'Le complexe sportif du domaine', en: 'The estate’s sports complex' },
    caption: {
      fr: '<b>Le complexe sportif.</b> Vaste pelouse du domaine — le complexe sportif d’Akono, dans le cadre des 14 hectares.',
      en: '<b>The sports complex.</b> The estate’s broad greensward — the Akono sports complex, set within the 14-hectare grounds.',
    },
  },
  {
    id: '14-hectares',
    image: '/img/14-hectares.jpg',
    alt: { fr: 'Le complexe sportif du domaine', en: 'The estate’s sports complex' },
    caption: {
      fr: '<b>Les 14 hectares.</b> Le grand terrain herbeux du complexe sportif, unique dans la sous-région.',
      en: '<b>The 14 hectares.</b> The great grass field of the sports complex, without rival in the sub-region.',
    },
  },
  {
    id: 'rugby',
    image: '/img/rugby.jpg',
    alt: { fr: "Tournoi de rugby à 7 au Collège Stoll d'Akono", en: 'Rugby sevens tournament at Collège Stoll d’Akono' },
    caption: {
      fr: '<b>Rugby à 7 à Stoll.</b> Un tournoi sur le terrain du collège, poteaux dressés et campus en toile de fond. La tradition sportive, toujours vivante.',
      en: '<b>Rugby sevens at Stoll.</b> A tournament on the college pitch, posts raised and the campus beyond. The sporting tradition, alive still.',
    },
  },
  {
    id: 'centre-artistique',
    image: '/img/centre-artistique.jpg',
    alt: { fr: "Le Centre artistique du Collège Stoll d'Akono", en: 'The Arts Centre of Collège Stoll d’Akono' },
    caption: {
      fr: '<b>Le Centre artistique.</b> La grande salle de 2 500 places, au toit rouge et aux frises décoratives — lieu de rassemblement du collège.',
      en: '<b>The Arts Centre.</b> The great hall seating 2,500, with its red roof and decorative friezes — the gathering place of the college.',
    },
  },
];
