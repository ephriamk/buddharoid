import { useState, useCallback } from 'react';
import Scene from './components/Scene';
import ChatPanel from './components/ChatPanel';
import SettingsModal from './components/SettingsModal';
import LoadingScreen from './components/LoadingScreen';
import Onboarding from './components/Onboarding';
import SceneToggle from './components/SceneToggle';
import { useChat } from './hooks/useChat';
import { useMemory } from './hooks/useMemory';
import { useSettings } from './hooks/useSettings';
import { useMood } from './hooks/useMood';

export default function App() {
  const {
    userId,
    isFirstVisit,
    sessionCount,
    userName,
    memoryCount,
    clearMemories,
    saveJournalEntry,
  } = useMemory();

  const {
    settings,
    showSettings,
    setShowSettings,
    completeSetup,
    clearKeys,
    hasAnyKey,
    availableProviders,
  } = useSettings();

  const getApiKey = useCallback(
    (provider) => {
      if (provider === 'claude') return settings.anthropicKey || undefined;
      if (provider === 'openai') return settings.openaiKey || undefined;
      return undefined;
    },
    [settings.anthropicKey, settings.openaiKey]
  );

  const {
    messages,
    isLoading,
    isSpeaking,
    provider,
    setProvider,
    sendMessage,
    clearChat,
  } = useChat(userId, isFirstVisit, sessionCount, userName, getApiKey);

  const mood = useMood(messages);

  // Loading state
  const [loadProgress, setLoadProgress] = useState(0);
  const [loaded, setLoaded] = useState(false);

  // Onboarding state
  const [showOnboarding, setShowOnboarding] = useState(() => {
    return !localStorage.getItem('buddharoid_onboarded');
  });

  // Mobile scene toggle
  const [sceneExpanded, setSceneExpanded] = useState(true);

  const handleProgress = useCallback((progress) => {
    setLoadProgress(progress);
  }, []);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  const handleOnboardingComplete = useCallback((name) => {
    setShowOnboarding(false);
    if (name && userId) {
      fetch(`/api/memory/${userId}/profile`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      }).catch(() => {});
    }
  }, [userId]);

  return (
    <>
      {/* Loading screen overlay */}
      {!loaded && (
        <LoadingScreen progress={loadProgress} onFadeComplete={handleLoadComplete} />
      )}

      {/* Onboarding overlay */}
      {loaded && showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      <div className="app">
        <div className={`scene-container ${!sceneExpanded ? 'scene-collapsed' : ''}`}>
          <Scene
            isSpeaking={isSpeaking}
            mood={mood}
            onProgress={handleProgress}
            paused={!sceneExpanded}
          />
          <div className="scene-overlay">
            <h1 className="title-overlay">BUDDHAROID</h1>
            <p className="subtitle-overlay">Seek Enlightenment Through Code</p>
          </div>
        </div>

        {/* Mobile scene toggle */}
        <SceneToggle
          expanded={sceneExpanded}
          onToggle={() => setSceneExpanded(e => !e)}
        />

        <ChatPanel
          messages={messages}
          isLoading={isLoading}
          provider={provider}
          setProvider={setProvider}
          sendMessage={sendMessage}
          clearChat={clearChat}
          memoryCount={memoryCount}
          sessionCount={sessionCount}
          userName={userName}
          onClearMemories={clearMemories}
          onJournalSave={saveJournalEntry}
          onOpenSettings={() => setShowSettings(true)}
          availableProviders={availableProviders}
          hasAnyKey={hasAnyKey}
        />

        {/* Settings / API Key Modal */}
        {showSettings && (
          <SettingsModal
            isSetup={!settings.hasCompletedSetup}
            settings={settings}
            onSave={completeSetup}
            onClose={() => setShowSettings(false)}
            onClearKeys={clearKeys}
          />
        )}
      </div>
    </>
  );
}
