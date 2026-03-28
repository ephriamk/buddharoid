import { useState, useCallback } from 'react';

const STORAGE_KEY = 'buddharoid_settings';

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch {}
  return {
    anthropicKey: '',
    openaiKey: '',
    hasCompletedSetup: false,
  };
}

function saveSettings(settings) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
}

export function useSettings() {
  const [settings, setSettings] = useState(loadSettings);
  const [showSettings, setShowSettings] = useState(!settings.hasCompletedSetup);

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => {
      const next = { ...prev, ...updates };
      saveSettings(next);
      return next;
    });
  }, []);

  const completeSetup = useCallback((anthropicKey, openaiKey) => {
    const updates = {
      anthropicKey: anthropicKey || '',
      openaiKey: openaiKey || '',
      hasCompletedSetup: true,
    };
    updateSettings(updates);
    setShowSettings(false);
  }, [updateSettings]);

  const clearKeys = useCallback(() => {
    updateSettings({ anthropicKey: '', openaiKey: '', hasCompletedSetup: false });
    setShowSettings(true);
  }, [updateSettings]);

  const hasAnthropicKey = settings.anthropicKey.length > 0;
  const hasOpenaiKey = settings.openaiKey.length > 0;
  const hasAnyKey = hasAnthropicKey || hasOpenaiKey;

  // Determine which providers are available
  const availableProviders = [];
  if (hasAnthropicKey) availableProviders.push('claude');
  if (hasOpenaiKey) availableProviders.push('openai');

  return {
    settings,
    showSettings,
    setShowSettings,
    updateSettings,
    completeSetup,
    clearKeys,
    hasAnthropicKey,
    hasOpenaiKey,
    hasAnyKey,
    availableProviders,
  };
}
