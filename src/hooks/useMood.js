import { useRef, useMemo } from 'react';
import { MOOD_PRESETS } from '../config/moodPresets';

const MOOD_KEYWORDS = {
  joyful: ['joy', 'happy', 'gratitude', 'grateful', 'thank', 'wonderful', 'beautiful', 'love', 'bliss', 'delight', 'breakthrough', 'amazing', 'celebrate'],
  solemn: ['grief', 'loss', 'suffer', 'pain', 'sad', 'death', 'mourn', 'fear', 'anxiety', 'depressed', 'lonely', 'hurt', 'struggle', 'difficult'],
  contemplative: ['think', 'wonder', 'question', 'meaning', 'purpose', 'why', 'understand', 'reflect', 'ponder', 'philosophy', 'nature', 'consciousness', 'reality'],
  energized: ['energy', 'motivation', 'action', 'change', 'transform', 'power', 'strength', 'courage', 'determined', 'ready', 'excited', 'alive'],
};

const TOOL_TO_MOOD = {
  meditation: 'serene',
  breathing: 'serene',
  journal: 'contemplative',
  wisdom: 'contemplative',
  assessment: 'contemplative',
};

function detectMood(messages) {
  if (!messages || messages.length < 2) return { mood: 'serene', intensity: 0.5 };

  // Analyze last 3 messages
  const recent = messages.slice(-3);
  const text = recent.map(m => m.content).join(' ').toLowerCase();

  // Check for tool results in most recent assistant message
  const lastAssistant = [...messages].reverse().find(m => m.role === 'assistant');
  let toolActive = null;
  if (lastAssistant?.toolResults?.length > 0) {
    const lastTool = lastAssistant.toolResults[lastAssistant.toolResults.length - 1];
    toolActive = lastTool?.type || null;
  }

  // If tool is active, that mood takes priority
  if (toolActive && TOOL_TO_MOOD[toolActive]) {
    return { mood: TOOL_TO_MOOD[toolActive], intensity: 0.8, toolActive };
  }

  // Score each mood by keyword matches
  const scores = {};
  for (const [mood, keywords] of Object.entries(MOOD_KEYWORDS)) {
    scores[mood] = keywords.reduce((count, kw) => {
      const regex = new RegExp(kw, 'gi');
      const matches = text.match(regex);
      return count + (matches ? matches.length : 0);
    }, 0);
  }

  // Find highest scoring mood
  let bestMood = 'serene';
  let bestScore = 0;
  for (const [mood, score] of Object.entries(scores)) {
    if (score > bestScore) {
      bestScore = score;
      bestMood = mood;
    }
  }

  // Intensity based on how many keywords matched
  const intensity = bestScore === 0 ? 0.5 : Math.min(0.3 + bestScore * 0.15, 1.0);

  return { mood: bestMood, intensity, toolActive };
}

function lerpValue(current, target, speed) {
  return current + (target - speed) * 0.03;
}

export function useMood(messages) {
  const detected = useMemo(() => detectMood(messages), [messages]);

  // Get the full preset for the detected mood
  const preset = MOOD_PRESETS[detected.mood] || MOOD_PRESETS.serene;

  return {
    mood: detected.mood,
    intensity: detected.intensity,
    toolActive: detected.toolActive,
    preset,
  };
}
