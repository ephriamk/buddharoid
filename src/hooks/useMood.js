import { useRef, useMemo } from 'react';
import { MOOD_PRESETS } from '../config/moodPresets';

const MOOD_KEYWORDS = {
  joyful: ['joy', 'happy', 'gratitude', 'grateful', 'thank', 'wonderful', 'beautiful', 'love', 'bliss', 'delight', 'breakthrough', 'amazing', 'celebrate', 'peace', 'free', 'liberated', 'enlighten', 'awaken', 'bright', 'warm', 'smile', 'laugh', 'blessed'],
  solemn: ['grief', 'loss', 'suffer', 'pain', 'sad', 'death', 'mourn', 'fear', 'anxiety', 'depressed', 'lonely', 'hurt', 'struggle', 'difficult', 'dark', 'despair', 'hopeless', 'empty', 'numb', 'broken', 'cry', 'tears', 'worried', 'scared', 'angry'],
  contemplative: ['think', 'wonder', 'question', 'meaning', 'purpose', 'understand', 'reflect', 'ponder', 'philosophy', 'nature', 'consciousness', 'reality', 'truth', 'wisdom', 'dharma', 'karma', 'impermanence', 'self', 'ego', 'mind', 'awareness', 'existence', 'universe', 'soul'],
  energized: ['energy', 'motivation', 'action', 'change', 'transform', 'power', 'strength', 'courage', 'determined', 'ready', 'excited', 'alive', 'practice', 'discipline', 'commit', 'journey', 'path', 'begin', 'start', 'grow', 'rise'],
};

const EMOTION_KEYWORDS = {
  greeting: ['hello', 'hi', 'hey', 'greet', 'namaste', 'welcome', 'good morning', 'good evening'],
  agreement: ['yes', 'agree', 'exactly', 'right', 'correct', 'true', 'indeed', 'absolutely', 'certainly', 'definitely'],
  disagreement: ['disagree', 'wrong', 'incorrect', 'not quite', 'actually', 'however'],
  celebration: ['celebrate', 'congratulat', 'achievement', 'milestone', 'accomplished', 'breakthrough', 'wonderful news', 'fantastic', 'great job', 'well done'],
  compassion: ['sorry to hear', 'understand your', 'feel your', 'with you', 'here for you', 'not alone', 'compassion', 'empathy'],
};

const TOOL_TO_MOOD = {
  meditation: 'serene',
  breathing: 'serene',
  journal: 'contemplative',
  wisdom: 'contemplative',
  assessment: 'contemplative',
};

// Word-boundary matching to avoid false positives
function countKeywordMatches(text, keywords) {
  let total = 0;
  for (const kw of keywords) {
    // Multi-word keywords use includes, single words use word boundary
    if (kw.includes(' ')) {
      if (text.includes(kw)) total++;
    } else {
      const regex = new RegExp(`\\b${kw}\\w*\\b`, 'gi');
      const matches = text.match(regex);
      if (matches) total += matches.length;
    }
  }
  return total;
}

function detectEmotion(text) {
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS)) {
    for (const kw of keywords) {
      if (kw.includes(' ')) {
        if (text.includes(kw)) return emotion;
      } else {
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        if (regex.test(text)) return emotion;
      }
    }
  }
  return null;
}

function detectMood(messages, prevMood) {
  if (!messages || messages.length < 2) return { mood: 'serene', intensity: 0.5, emotion: null, aiAnimation: null };

  // Weight recent messages higher
  const weights = [1.0, 0.7, 0.4];
  const recent = messages.slice(-3);
  let weightedText = '';
  recent.reverse().forEach((m, i) => {
    const w = weights[i] || 0.3;
    // Repeat text proportional to weight for scoring
    const repeats = Math.round(w * 3);
    for (let r = 0; r < repeats; r++) {
      weightedText += ' ' + m.content.toLowerCase();
    }
  });

  // Detect emotion from last assistant + user message
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  const lastUser = [...messages].reverse().find(m => m.role === 'user');
  let emotion = null;
  if (lastAssistant) emotion = detectEmotion(lastAssistant.content.toLowerCase());
  if (!emotion && lastUser) emotion = detectEmotion(lastUser.content.toLowerCase());

  // AI-directed animation
  const aiAnimation = lastAssistant?.animation || null;

  // Tool detection
  let toolActive = null;
  if (lastAssistant?.toolResults?.length > 0) {
    const lastTool = lastAssistant.toolResults[lastAssistant.toolResults.length - 1];
    toolActive = lastTool?.type || null;
  }

  if (toolActive && TOOL_TO_MOOD[toolActive]) {
    return { mood: TOOL_TO_MOOD[toolActive], intensity: 0.8, toolActive, emotion, aiAnimation };
  }

  // Score each mood with word-boundary matching
  const scores = {};
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    scores[mood] = countKeywordMatches(weightedText, keywords);
  }

  let bestMood = 'serene';
  let bestScore = 0;
  for (const [mood, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    }
  }

  // Momentum: require 2+ keyword matches to override previous mood
  if (bestScore < 2 && prevMood) {
    bestMood = prevMood;
  }

  const intensity = bestScore === 0 ? 0.5 : Math.min(0.3 + bestScore * 0.1, 1.0);

  return { mood: bestMood, intensity, toolActive, emotion, aiAnimation };
}

export function useMood(messages) {
  const prevMoodRef = useRef('serene');

  const detected = useMemo(() => {
    const result = detectMood(messages, prevMoodRef.current);
    prevMoodRef.current = result.mood;
    return result;
  }, [messages]);

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
