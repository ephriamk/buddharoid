const MEDITATIONS = [
  {
    id: 'mindful-breathing',
    name: 'Mindful Breathing',
    level: 'beginner',
    duration: 5,
    technique: 'breath-awareness',
    steps: [
      'Find a comfortable seated position. Let your spine be straight but relaxed.',
      'Gently close your eyes or soften your gaze downward.',
      'Bring your full attention to the natural rhythm of your breath.',
      'Notice the cool air entering your nostrils, the warmth as it leaves.',
      'When your mind wanders — and it will — gently return to the breath without judgment.',
      'Each return to the breath is not a failure, but a strengthening of awareness.',
      'Continue for the remaining minutes, resting in the simplicity of breathing.',
      'When ready, slowly open your eyes. Carry this awareness with you.',
    ],
  },
  {
    id: 'body-scan',
    name: 'Body Scan Meditation',
    level: 'beginner',
    duration: 10,
    technique: 'body-awareness',
    steps: [
      'Lie down or sit comfortably. Close your eyes.',
      'Take three deep breaths, releasing tension with each exhale.',
      'Bring attention to the top of your head. Notice any sensations.',
      'Slowly move your awareness down: forehead, eyes, jaw — releasing tension.',
      'Flow down through neck and shoulders. Let them drop and soften.',
      'Scan through your arms to your fingertips. Feel the aliveness.',
      'Move through your chest and belly. Notice the breath moving here.',
      'Continue down through hips, legs, and feet.',
      'Now hold your entire body in awareness — one unified field of sensation.',
      'Rest here for a few moments. You are complete as you are.',
    ],
  },
  {
    id: 'loving-kindness',
    name: 'Loving-Kindness (Metta)',
    level: 'intermediate',
    duration: 15,
    technique: 'metta',
    steps: [
      'Sit comfortably. Place your hand on your heart if it helps.',
      'Begin by directing loving-kindness to yourself: "May I be happy. May I be healthy. May I be safe. May I live with ease."',
      'Feel the warmth of these wishes. Let them resonate.',
      'Now think of someone you love. Direct the same wishes to them.',
      'Extend to a neutral person — someone you neither like nor dislike.',
      'Now the challenge: extend to someone difficult. This is the deepest practice.',
      'Finally, radiate loving-kindness outward to all beings everywhere.',
      '"May all beings be happy. May all beings be free from suffering."',
      'Rest in this boundless compassion. You are connected to all life.',
    ],
  },
  {
    id: 'zen-sitting',
    name: 'Zazen (Just Sitting)',
    level: 'intermediate',
    duration: 20,
    technique: 'shikantaza',
    steps: [
      'Assume a stable seated posture. Hands in cosmic mudra — left hand on right, thumbs touching.',
      'Eyes half-open, gaze resting 2-3 feet ahead on the floor.',
      'There is no object of meditation. Just sit.',
      'Thoughts will arise. Do not chase them. Do not push them away.',
      'Be like a mirror — reflecting everything, grasping nothing.',
      'When you notice you have been lost in thought, simply return to sitting.',
      'There is nothing to achieve. This moment is already complete.',
      'Continue sitting. The practice is the goal itself.',
    ],
  },
  {
    id: 'visualization',
    name: 'Inner Light Visualization',
    level: 'advanced',
    duration: 20,
    technique: 'visualization',
    steps: [
      'Close your eyes. Take several deep, cleansing breaths.',
      'Imagine a small point of golden light at the center of your chest.',
      'With each breath, this light grows — warm, radiant, peaceful.',
      'Let it expand to fill your entire body with luminous awareness.',
      'The light extends beyond your body, filling the room.',
      'It continues expanding — through walls, through the city, across the earth.',
      'You are this light. Boundless, interconnected, aware.',
      'All boundaries dissolve. Subject and object are one.',
      'Rest in this expansive awareness for as long as feels right.',
      'Slowly, let the light concentrate back to the point in your heart.',
      'It remains there always — your inner lamp of wisdom.',
    ],
  },
  {
    id: 'walking',
    name: 'Walking Meditation (Kinhin)',
    level: 'beginner',
    duration: 10,
    technique: 'movement',
    steps: [
      'Stand still. Feel your feet firmly on the ground.',
      'Clasp your hands gently at your waist or let them hang naturally.',
      'Begin walking very slowly — much slower than normal.',
      'Lifting the foot: notice the muscles, the shift in weight.',
      'Moving forward: feel the leg swing through space.',
      'Placing the foot: heel, then ball, then toes — with full attention.',
      'Each step is a complete universe of sensation.',
      'If your mind wanders, stop walking. Return attention to your feet.',
      'Resume when you feel grounded. The earth supports every step.',
      'After your walk, stand still again. Notice how awareness has shifted.',
    ],
  },
];

export function getMeditation(params = {}) {
  const { level, technique, duration } = params;
  let candidates = [...MEDITATIONS];

  if (level) candidates = candidates.filter((m) => m.level === level);
  if (technique) candidates = candidates.filter((m) => m.technique === technique);
  if (duration) {
    candidates.sort((a, b) => Math.abs(a.duration - duration) - Math.abs(b.duration - duration));
  }

  const selected = candidates[0] || MEDITATIONS[0];
  return {
    type: 'meditation',
    ...selected,
  };
}

export function listMeditations() {
  return MEDITATIONS.map((m) => ({
    id: m.id,
    name: m.name,
    level: m.level,
    duration: m.duration,
    technique: m.technique,
  }));
}
