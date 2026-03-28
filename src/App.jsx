import { useCallback } from 'react';
import Scene from './components/Scene';
import ChatPanel from './components/ChatPanel';
import SettingsModal from './components/SettingsModal';
import { useChat } from './hooks/useChat';
import { useMemory } from './hooks/useMemory';
import { useSettings } from './hooks/useSettings';

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

  // Returns the appropriate API key for the given provider
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

  return (
    <div className="app">
      <div className="scene-container">
        <Scene isSpeaking={isSpeaking} />
        <div className="scene-overlay">
          <h1 className="title-overlay">BUDDHAROID</h1>
          <p className="subtitle-overlay">Seek Enlightenment Through Code</p>
        </div>
      </div>
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
  );
}
