import type { InventoryItem, ChapterMark } from './types';

// Section VIII — Le constat. The patrimony now at risk.
export const inventory: InventoryItem[] = [
  {
    id: 'agriculture',
    icon: '🌱',
    title: { fr: 'Exploitation agricole', en: 'Farm estate' },
    detail: {
      fr: "Autosuffisance alimentaire, apprentissage de la terre",
      en: 'Food self-sufficiency, learning to work the land',
    },
  },
  {
    id: 'technical',
    icon: '🔧',
    title: { fr: 'Plateau technique de premier plan', en: 'Leading technical facilities' },
    detail: {
      fr: 'Ateliers, unités de formation professionnelle',
      en: 'Workshops, vocational training units',
    },
  },
  {
    id: 'joinery',
    icon: '🪚',
    title: { fr: 'Menuiserie', en: 'Joinery workshop' },
    detail: { fr: 'Atelier professionnel de travail du bois', en: 'Professional woodworking workshop' },
  },
  {
    id: 'garage',
    icon: '🚗',
    title: { fr: 'Garage professionnel', en: 'Professional garage' },
    detail: { fr: 'Entretien et mécanique sur site', en: 'On-site maintenance and mechanics' },
  },
  {
    id: 'coldroom',
    icon: '❄',
    title: { fr: 'Chambre froide', en: 'Cold room' },
    detail: { fr: 'Conservation, chaîne du froid', en: 'Preservation, cold chain' },
  },
  {
    id: 'generators',
    icon: '⚡',
    title: { fr: 'Groupes électrogènes', en: 'Power generators' },
    detail: { fr: 'Énergie autonome pour tout le domaine', en: 'Independent power for the whole estate' },
  },
  {
    id: 'sports',
    icon: '🏟',
    title: { fr: 'Parc sportif de dernière génération', en: 'State-of-the-art sports grounds' },
    detail: {
      fr: 'Stades, terrains, complexe unique dans la sous-région',
      en: 'Stadiums, pitches, a complex unique in the sub-region',
    },
  },
  {
    id: 'library',
    icon: '📚',
    title: { fr: 'Bibliothèque', en: 'Library' },
    detail: { fr: "Fonds documentaire, lieu d'étude", en: 'Document collection, a place of study' },
  },
  {
    id: 'computers',
    icon: '💻',
    title: { fr: 'Parc informatique', en: 'Computer suite' },
    detail: {
      fr: 'Salle informatique, initiation aux nouvelles technologies',
      en: 'Computer room, introduction to new technologies',
    },
  },
  {
    id: 'culture',
    icon: '🎭',
    title: { fr: 'Salle culturelle', en: 'Cultural hall' },
    detail: { fr: 'Centre artistique, 2 500 places', en: 'Arts centre, seating 2,500' },
  },
  {
    id: 'technical-unit',
    icon: '🛠',
    title: { fr: 'Unité technique', en: 'Technical unit' },
    detail: { fr: 'Maintenance et savoir-faire intégrés', en: 'Integrated maintenance and know-how' },
  },
];

export const chapters: ChapterMark[] = [
  { seconds: 0, label: { fr: '▶ Début', en: '▶ Start' } },
  { seconds: 60, label: { fr: 'Le campus', en: 'The campus' } },
  { seconds: 180, label: { fr: 'Les salles de classe', en: 'The classrooms' } },
  { seconds: 480, label: { fr: 'La bibliothèque', en: 'The library' } },
  { seconds: 600, label: { fr: 'Le parc informatique', en: 'The computer suite' } },
  { seconds: 700, label: { fr: 'La salle culturelle', en: 'The cultural hall' } },
  { seconds: 800, label: { fr: 'Les témoignages', en: 'The testimonies' } },
];
