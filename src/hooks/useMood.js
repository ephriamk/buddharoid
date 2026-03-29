import { useMemo } from 'react';
import { MOOD_PRESETS } from '../config/moodPresets';

const MOOD_KEYWORDS = {
  joyful: ['joy', 'happy', 'gratitude', 'grateful', 'thank', 'wonderful', 'beautiful', 'love', 'bliss', 'delight', 'breakthrough', 'amazing', 'celebrate', 'peace', 'free', 'liberated', 'enlighten', 'awaken', 'bright', 'warm', 'smile', 'laugh', 'blessed'],
  solemn: ['grief', 'loss', 'suffer', 'pain', 'sad', 'death', 'mourn', 'fear', 'anxiety', 'depressed', 'lonely', 'hurt', 'struggle', 'difficult', 'dark', 'despair', 'hopeless', 'empty', 'numb', 'broken', 'cry', 'tears', 'worried', 'scared', 'angry', 'frustrat'],
  contemplative: ['think', 'wonder', 'question', 'meaning', 'purpose', 'why', 'understand', 'reflect', 'ponder', 'philosophy', 'nature', 'consciousness', 'reality', 'truth', 'wisdom', 'dharma', 'karma', 'impermanence', 'self', 'ego', 'mind', 'awareness', 'existence', 'universe', 'soul'],
  energized: ['energy', 'motivation', 'action', 'change', 'transform', 'power', 'strength', 'courage', 'determined', 'ready', 'excited', 'alive', 'practice', 'discipline', 'commit', 'journey', 'path', 'begin', 'start', 'grow', 'rise'],
};

// Maps mood + context to a specific robot animation
const EMOTION_KEYWORDS = {
  greeting: ['hello', 'hi ', 'hey', 'greet', 'namaste', 'welcome', 'good morning', 'good evening', 'howdy'],
  agreement: ['yes', 'agree', 'exactly', 'right', 'correct', 'true', 'indeed', 'absolutely', 'certainly', 'of course', 'definitely'],
  disagreement: ['no ', 'disagree', 'wrong', 'incorrect', 'not quite', 'actually', 'but ', "don't think", 'however'],
  celebration: ['celebrate', 'congratulat', 'achievement', 'milestone', 'accomplished', 'breakthrough', 'wonderful news', 'amazing', 'fantastic', 'great job', 'well done'],
  compassion: ['sorry to hear', 'understand your', 'feel your', 'with you', 'here for you', 'not alone', 'compassion', 'empathy', 'gentle', 'kind'],
};

const TOOL_TO_MOOD = {
  meditation: 'serene',
  breathing: 'serene',
  journal: 'contemplative',
  wisdom: 'contemplative',
  assessment: 'contemplative',
};

function detectEmotion(text) {
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    for (const kw of keywords) {
      if (text.includes(kw)) return emotion;
    }
  }
  return null;
}

function detectMood(messages) {
  if (!messages || messages.length < 2) return { mood: 'serene', intensity: 0.5, emotion: null };

  const recent = messages.slice(-3);
  const text = recent.map(m => m.content).join(' ').toLowerCase();

  // Detect specific emotion from last assistant message
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  let emotion = null;

  // Check assistant response for emotion cues
  if (lastAssistant) {
    emotion = detectEmotion(lastAssistant.content.toLowerCase());
  }
  // Also check user message for greeting/agreement
  if (!emotion && lastUser) {
    emotion = detectEmotion(lastUser.content.toLowerCase());
  }

  // Check for AI-directed animation tag
  const aiAnimation = lastAssistant?.animation || null;

  // Check for tool results
  let toolActive = null;
  if (lastAssistant?.toolResults?.length > 0) {
    const lastTool = lastAssistant.toolResults[lastAssistant.toolResults.length - 1];
    toolActive = lastTool?.type || null;
  }

  if (toolActive && TOOL_TO_MOOD[toolActive]) {
    return { mood: TOOL_TO_MOOD[toolActive], intensity: 0.8, toolActive, emotion, aiAnimation };
  }

  // Score each mood
  const scores = {};
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    scores[mood] = keywords.reduce((count, kw) => {
      const regex = new RegExp(kw, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  let bestMood = 'serene';
  let bestScore = 0;
  for (const [mood, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    }
  }

  const intensity = bestScore === 0 ? 0.5 : Math.min(0.3 + bestScore * 0.15, 1.0);

  return { mood: bestMood, intensity, toolActive, emotion, aiAnimation };
}

export function useMood(messages) {
  const detected = useMemo(() => detectMood(messages), [messages]);
  const preset = MOOD_PRESETS[detected.mood] || MOOD_PRESETS.serene;

  return {
    mood: detected.mood,
    intensity: detected.intensity,
    toolActive: detected.toolActive,
    emotion: detected.emotion,
    aiAnimation: detected.aiAnimation,
    preset,
  };
}
