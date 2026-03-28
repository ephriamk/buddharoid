import Scene from './components/Scene';
import ChatPanel from './components/ChatPanel';
import { useChat } from './hooks/useChat';
import { useMemory } from './hooks/useMemory';

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
    messages,
    isLoading,
    isSpeaking,
    provider,
    setProvider,
    sendMessage,
    clearChat,
  } = useChat(userId, isFirstVisit, sessionCount, userName);

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
      />
    </div>
  );
}
