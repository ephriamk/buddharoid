const WISDOM_COLLECTION = [
  // Koans
  {
    category: 'koan',
    title: 'The Sound of One Hand',
    source: 'Hakuin Ekaku',
    tradition: 'Zen',
    text: 'You know the sound of two hands clapping. What is the sound of one hand?',
    teaching: 'Points to the nature of non-duality and the limits of conceptual thinking.',
  },
  {
    category: 'koan',
    title: 'Original Face',
    source: 'Huineng, Sixth Patriarch',
    tradition: 'Zen',
    text: 'What was your original face before your parents were born?',
    teaching: 'Invites inquiry into the nature of self beyond conditioned identity.',
  },
  {
    category: 'koan',
    title: 'Joshu\'s Dog',
    source: 'The Gateless Gate',
    tradition: 'Zen',
    text: 'A monk asked Joshu: "Does a dog have Buddha-nature?" Joshu said: "Mu."',
    teaching: 'Mu (nothing/no) is not a negation but a doorway beyond yes and no.',
  },
  {
    category: 'koan',
    title: 'The Cypress Tree',
    source: 'Joshu',
    tradition: 'Zen',
    text: 'A monk asked: "What is the meaning of the Patriarch\'s coming from the West?" Joshu said: "The cypress tree in the garden."',
    teaching: 'Truth is not hidden in abstractions — it is right here, in the ordinary.',
  },

  // Sutras
  {
    category: 'sutra',
    title: 'The Heart Sutra (Core)',
    source: 'Prajnaparamita',
    tradition: 'Mahayana',
    text: 'Form is emptiness, emptiness is form. Emptiness is not other than form, form is not other than emptiness.',
    teaching: 'The ultimate reality is that all phenomena are empty of inherent existence, yet vividly appear.',
  },
  {
    category: 'sutra',
    title: 'The Diamond Sutra',
    source: 'Vajracchedika Prajnaparamita',
    tradition: 'Mahayana',
    text: 'All conditioned phenomena are like a dream, an illusion, a bubble, a shadow, like dew or a flash of lightning; thus we shall perceive them.',
    teaching: 'Nothing in the conditioned world is permanent or ultimately real.',
  },
  {
    category: 'sutra',
    title: 'The Dhammapada — Mind',
    source: 'Dhammapada, Chapter 1',
    tradition: 'Theravada',
    text: 'Mind is the forerunner of all actions. All deeds are led by mind, created by mind. If one speaks or acts with a corrupt mind, suffering follows as the wheel follows the hoof of the ox.',
    teaching: 'Our experience of reality is shaped by the quality of our thoughts.',
  },
  {
    category: 'sutra',
    title: 'The Dhammapada — Self',
    source: 'Dhammapada, Chapter 12',
    tradition: 'Theravada',
    text: 'You yourself must strive. The Buddhas only point the way. Those who have entered the path and who meditate will be freed from the bonds of illusion.',
    teaching: 'Liberation comes through personal effort, not from external saviors.',
  },

  // Teachings
  {
    category: 'teaching',
    title: 'The Four Noble Truths',
    source: 'Siddhartha Gautama',
    tradition: 'All Buddhist',
    text: '1. Life involves suffering (dukkha). 2. Suffering arises from craving and attachment (samudaya). 3. Suffering can cease (nirodha). 4. The path to cessation is the Eightfold Path (magga).',
    teaching: 'The foundational framework of all Buddhist practice.',
  },
  {
    category: 'teaching',
    title: 'The Eightfold Path',
    source: 'Siddhartha Gautama',
    tradition: 'All Buddhist',
    text: 'Right View, Right Intention, Right Speech, Right Action, Right Livelihood, Right Effort, Right Mindfulness, Right Concentration.',
    teaching: 'A practical guide for ethical conduct, mental discipline, and wisdom.',
  },
  {
    category: 'teaching',
    title: 'The Three Marks of Existence',
    source: 'Siddhartha Gautama',
    tradition: 'All Buddhist',
    text: 'All conditioned phenomena are impermanent (anicca). All conditioned phenomena are unsatisfactory (dukkha). All phenomena are without self (anatta).',
    teaching: 'Understanding these three characteristics is key to liberation.',
  },
  {
    category: 'teaching',
    title: 'Thich Nhat Hanh on Mindfulness',
    source: 'Thich Nhat Hanh',
    tradition: 'Zen / Engaged Buddhism',
    text: 'Feelings come and go like clouds in a windy sky. Conscious breathing is my anchor.',
    teaching: 'Mindfulness of breath provides stability amidst emotional storms.',
  },
  {
    category: 'teaching',
    title: 'Pema Chodron on Groundlessness',
    source: 'Pema Chodron',
    tradition: 'Tibetan',
    text: 'To be fully alive, fully human, and completely awake is to be continually thrown out of the nest.',
    teaching: 'Growth requires embracing uncertainty rather than seeking solid ground.',
  },
  {
    category: 'teaching',
    title: 'Shunryu Suzuki on Beginner\'s Mind',
    source: 'Shunryu Suzuki',
    tradition: 'Zen',
    text: 'In the beginner\'s mind there are many possibilities, but in the expert\'s mind there are few.',
    teaching: 'Approaching each moment with openness and curiosity is the essence of practice.',
  },

  // Parables
  {
    category: 'parable',
    title: 'The Mustard Seed',
    source: 'Kisa Gotami Story',
    tradition: 'Theravada',
    text: 'A grieving mother asked the Buddha to revive her dead child. He said: "Bring me a mustard seed from a household where no one has died." She searched every home and found none. She understood: death touches all. She found peace not by escaping loss, but by seeing its universality.',
    teaching: 'Suffering is universal. Understanding this connects us and brings compassion.',
  },
  {
    category: 'parable',
    title: 'The Raft',
    source: 'Alagaddupama Sutta',
    tradition: 'Theravada',
    text: 'The Buddha compared his teachings to a raft used to cross a river. Once you reach the other shore, you do not carry the raft on your head. Even the dharma must eventually be let go.',
    teaching: 'Teachings are tools, not possessions. Do not cling even to wisdom.',
  },
  {
    category: 'parable',
    title: 'The Blind Men and the Elephant',
    source: 'Udana',
    tradition: 'All Buddhist',
    text: 'Each blind man touched a different part of the elephant and declared he knew the whole truth. The one who touched the leg said it was a pillar. The one who touched the tail said it was a rope. Each was right, yet all were wrong.',
    teaching: 'Partial perspectives create conflict. Humility is seeing the limits of our view.',
  },
];

export function lookupWisdom(params = {}) {
  const { category, tradition, topic } = params;
  let candidates = [...WISDOM_COLLECTION];

  if (category) candidates = candidates.filter((w) => w.category === category);
  if (tradition) candidates = candidates.filter((w) => w.tradition.toLowerCase().includes(tradition.toLowerCase()));

  if (topic) {
    // Simple keyword matching
    const keywords = topic.toLowerCase().split(/\s+/);
    candidates = candidates.filter((w) => {
      const searchable = `${w.title} ${w.text} ${w.teaching} ${w.category}`.toLowerCase();
      return keywords.some((kw) => searchable.includes(kw));
    });
  }

  if (candidates.length === 0) {
    // Fallback: random wisdom
    candidates = [WISDOM_COLLECTION[Math.floor(Math.random() * WISDOM_COLLECTION.length)]];
  }

  // Return 1-3 pieces
  const count = Math.min(candidates.length, params.count || 1);
  const shuffled = candidates.sort(() => Math.random() - 0.5);
  return {
    type: 'wisdom',
    results: shuffled.slice(0, count),
  };
}
