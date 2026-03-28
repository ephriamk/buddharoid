import { getMeditation, listMeditations } from './meditations.js';
import { lookupWisdom } from './wisdom.js';

const BREATHING_EXERCISES = {
  'box-breathing': {
    name: 'Box Breathing (Sama Vritti)',
    description: 'Equal-count breathing for calm and focus',
    pattern: { inhale: 4, hold: 4, exhale: 4, holdEmpty: 4 },
    rounds: 6,
    benefits: 'Activates parasympathetic nervous system, reduces stress hormones',
  },
  '4-7-8': {
    name: '4-7-8 Relaxation Breath',
    description: 'A powerful technique for anxiety and sleep',
    pattern: { inhale: 4, hold: 7, exhale: 8, holdEmpty: 0 },
    rounds: 4,
    benefits: 'Natural tranquilizer for the nervous system, promotes deep relaxation',
  },
  'alternate-nostril': {
    name: 'Alternate Nostril (Nadi Shodhana)',
    description: 'Balances the left and right hemispheres of the brain',
    pattern: { inhale: 4, hold: 2, exhale: 4, holdEmpty: 0 },
    rounds: 8,
    instructions: [
      'Close right nostril with thumb. Inhale through left.',
      'Close left nostril with ring finger. Hold briefly.',
      'Release right nostril. Exhale through right.',
      'Inhale through right nostril.',
      'Close right, release left. Exhale through left.',
      'This is one round. Continue alternating.',
    ],
    benefits: 'Harmonizes the nervous system, calms the mind, improves focus',
  },
  'ocean-breath': {
    name: 'Ocean Breath (Ujjayi)',
    description: 'Warming breath that sounds like ocean waves',
    pattern: { inhale: 5, hold: 0, exhale: 5, holdEmpty: 0 },
    rounds: 10,
    instructions: [
      'Slightly constrict the back of your throat.',
      'Breathe in through the nose — you should hear a soft hissing sound.',
      'Exhale through the nose with the same gentle constriction.',
      'The sound should resemble distant ocean waves.',
    ],
    benefits: 'Builds internal heat, enhances concentration, calms the mind',
  },
};

const JOURNAL_THEMES = [
  { theme: 'gratitude', prompts: [
    'What are three things from today that brought you a moment of peace?',
    'Who in your life has been a teacher — even unknowingly? What did they teach you?',
    'What is something your body did today that you can be grateful for?',
  ]},
  { theme: 'self-inquiry', prompts: [
    'Who would you be without your most persistent worry?',
    'What story about yourself have you outgrown? What new story is emerging?',
    'If your wisest self could send you a message right now, what would it say?',
  ]},
  { theme: 'impermanence', prompts: [
    'What has changed in your life that you once thought was permanent?',
    'How does knowing that this moment will pass affect how you experience it?',
    'What are you holding onto that is ready to be released?',
  ]},
  { theme: 'compassion', prompts: [
    'Where in your life could you offer yourself more gentleness?',
    'Think of someone who is struggling. What would you wish for them?',
    'What act of kindness — given or received — has stayed with you?',
  ]},
  { theme: 'awareness', prompts: [
    'What emotions visited you today? Could you observe them without becoming them?',
    'Describe a moment today when you were fully present. What did it feel like?',
    'What habitual pattern have you noticed in yourself recently?',
  ]},
  { theme: 'purpose', prompts: [
    'What would you do if you knew you could not fail? What stops you now?',
    'How do you want to be remembered? Are your daily actions aligned with that?',
    'What brings you alive? When did you last feel truly engaged?',
  ]},
];

const ASSESSMENT_QUESTIONS = [
  {
    id: 'q1',
    category: 'mindfulness',
    question: 'How often do you notice your thoughts without getting caught up in them?',
    options: ['Rarely', 'Sometimes', 'Often', 'Almost always'],
  },
  {
    id: 'q2',
    category: 'compassion',
    question: 'When someone upsets you, how quickly can you access empathy for their perspective?',
    options: ['Very slowly', 'It takes effort', 'Fairly naturally', 'Almost immediately'],
  },
  {
    id: 'q3',
    category: 'equanimity',
    question: 'When unexpected challenges arise, how would you describe your typical response?',
    options: ['Reactive and stressed', 'Somewhat unsettled', 'Generally steady', 'Calm and accepting'],
  },
  {
    id: 'q4',
    category: 'presence',
    question: 'During daily activities (eating, walking, working), how present are you?',
    options: ['Mostly on autopilot', 'Occasionally present', 'Often mindful', 'Deeply present'],
  },
  {
    id: 'q5',
    category: 'attachment',
    question: 'How easily can you let go of outcomes you were hoping for?',
    options: ['I hold on tightly', 'With significant effort', 'With some acceptance', 'With grace and openness'],
  },
  {
    id: 'q6',
    category: 'self-knowledge',
    question: 'How well do you understand the root causes of your own suffering?',
    options: ['Not at all', 'Beginning to see patterns', 'Have good awareness', 'Deep understanding'],
  },
];

// Execute a tool by name
export async function executeTool(name, params = {}) {
  switch (name) {
    case 'meditation_guide':
      return getMeditation(params);

    case 'breathing_exercise': {
      const exerciseId = params.type || 'box-breathing';
      const exercise = BREATHING_EXERCISES[exerciseId] || BREATHING_EXERCISES['box-breathing'];
      return { type: 'breathing', ...exercise };
    }

    case 'journal_prompt': {
      const theme = params.theme || JOURNAL_THEMES[Math.floor(Math.random() * JOURNAL_THEMES.length)].theme;
      const themeData = JOURNAL_THEMES.find((t) => t.theme === theme) || JOURNAL_THEMES[0];
      const prompt = themeData.prompts[Math.floor(Math.random() * themeData.prompts.length)];
      return { type: 'journal', theme: themeData.theme, prompt };
    }

    case 'wisdom_lookup':
      return lookupWisdom(params);

    case 'spiritual_assessment':
      return { type: 'assessment', questions: ASSESSMENT_QUESTIONS };

    case 'list_meditations':
      return { type: 'meditation_list', meditations: listMeditations() };

    default:
      return { type: 'error', message: `Unknown tool: ${name}` };
  }
}

// Tool descriptions for the system prompt
export const TOOL_DESCRIPTIONS = `
## Available Tools
You can invoke tools by including XML tags in your response. The system will execute them and show interactive results to the user.

Available tools:
1. <tool name="meditation_guide">{"level": "beginner|intermediate|advanced", "duration": 10, "technique": "breath-awareness|body-awareness|metta|shikantaza|visualization|movement"}</tool>
   Use when the user asks for a guided meditation.

2. <tool name="breathing_exercise">{"type": "box-breathing|4-7-8|alternate-nostril|ocean-breath"}</tool>
   Use when the user needs a breathing exercise for calm, anxiety, or focus.

3. <tool name="journal_prompt">{"theme": "gratitude|self-inquiry|impermanence|compassion|awareness|purpose"}</tool>
   Use when the user wants to reflect or journal. Pick a theme that fits the conversation.

4. <tool name="wisdom_lookup">{"category": "koan|sutra|teaching|parable", "topic": "search terms", "tradition": "Zen|Theravada|Mahayana|Tibetan"}</tool>
   Use when the user asks about Buddhist teachings, or when a teaching would enrich the conversation.

5. <tool name="spiritual_assessment">{}</tool>
   Use when the user wants to assess their spiritual progress or when you want to understand where they are on their path.

## Memory Instructions
When the user shares important personal information (their name, spiritual background, breakthroughs, struggles, preferences), save it by including a memory tag:
<memory type="insight|preference|milestone|context">What you want to remember</memory>

Memory types:
- insight: A realization or understanding the user has shared
- preference: How the user likes to practice or communicate
- milestone: An achievement in their practice
- context: Background information about the user
`;
