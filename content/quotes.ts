import type { Quote, Anecdote } from './types';

// Section IV — La voix des fondateurs.
export const quotes: Quote[] = [
  {
    id: 'q1',
    text: {
      fr: '« Des élèves lui disaient : <em>Nous ne verrons jamais ce collège !</em> Il répondait : <em>Si vous ne le voyez pas, vos enfants le verront un jour et en profiteront !</em> »',
      en: '“Pupils would say to him: <em>We shall never see this college!</em> He would answer: <em>If you do not see it, your children will behold it one day, and reap its fruits!</em>”',
    },
    cite: {
      fr: 'Sur le défrichage à la machette de la forêt équatoriale, 1963',
      en: 'On the clearing of the equatorial forest by machete, 1963',
    },
  },
  {
    id: 'q2',
    text: {
      fr: '« Nous sommes des Frères Maristes. Nous voulons participer au développement de votre pays par l\'éducation de vos enfants. » — <em>Allez ! Vous êtes les bienvenus. Passez !</em>',
      en: '“We are Marist Brothers. We wish to share in the development of your country through the education of its children.” — <em>Go on! You are welcome. Come through!</em>',
    },
    cite: {
      fr: 'À la frontière camerounaise, après la fuite du Congo, 1965',
      en: 'At the Cameroonian frontier, after the flight from the Congo, 1965',
    },
  },
  {
    id: 'q3',
    text: {
      fr: '« Si nous assistons avec peine au déclin d\'une œuvre commencée dans l\'enthousiasme, nous espérons qu\'elle connaîtra des lendemains exaltants entre les mains de Camerounais désireux de poursuivre l\'éducation de la jeunesse. »',
      en: '“Though we look on with sorrow at the decline of a work begun in fervour, we trust it will know exalting days to come in the hands of Cameroonians eager to carry forward the education of the young.”',
    },
    cite: {
      fr: 'Fr. Laurent Potvin, en confiant l\'avenir aux anciens — 2003',
      en: 'Br. Laurent Potvin, entrusting the future to the alumni — 2003',
    },
  },
];

export const anecdotes: Anecdote[] = [
  {
    id: 'saladiers',
    title: { fr: 'Les « saladiers » de Mgr Graffin', en: 'Bishop Graffin’s “salad bowls”' },
    body: {
      fr: "Agacé par le style grandiose de cette église « dans un coin perdu de la brousse », Mgr Graffin qualifia ses bénitiers de « saladiers » et refusa de la consacrer. Le Père Stoll la consacra lui-même. On parle aujourd'hui d'en faire une cathédrale.",
      en: 'Vexed by the grandeur of this church “in a lost corner of the bush,” Bishop Graffin dismissed its holy-water fonts as “salad bowls” and declined to consecrate it. Father Stoll consecrated it himself. Today there is talk of raising it to a cathedral.',
    },
  },
  {
    id: 'remorque',
    title: { fr: 'La remorque rouge dans Yaoundé', en: 'The red trailer through Yaoundé' },
    body: {
      fr: "« Notre arrivée à Yaoundé avec un tracteur tirant une grosse remorque rouge dans les rues de la capitale ne passa pas inaperçue ! » — l'entrée des Maristes réfugiés, avec pour tout bagage une petite malle.",
      en: '“Our arrival in Yaoundé, a tractor hauling a great red trailer through the streets of the capital, did not go unnoticed!” — the entrance of the refugee Marists, a single small trunk for all their worldly goods.',
    },
  },
  {
    id: 'ewondo',
    title: { fr: 'La plaque en éwondo', en: 'The plaque in Ewondo' },
    body: {
      fr: "« Il faut traiter avec respect les choses de Dieu. » La parole du Père Stoll, fixée en langue éwondo sur une plaque, veille toujours à l'entrée du collège.",
      en: '“The things of God must be treated with respect.” Father Stoll’s words, cast in the Ewondo tongue upon a plaque, still keep watch over the entrance to the college.',
    },
  },
  {
    id: 'criaud',
    title: { fr: 'Le don du Père Criaud', en: 'Father Criaud’s gift' },
    body: {
      fr: "Les premiers deux millions de francs CFA pour lancer la construction vinrent d'un bienfaiteur spiritain, le Père Criaud. Tout commença avec cette somme et une équipe d'ouvriers sans expérience.",
      en: 'The first two million CFA francs to set construction in motion came from a Spiritan benefactor, Father Criaud. It all began with that sum and a team of untrained workmen.',
    },
  },
];
