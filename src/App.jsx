import { useState, useCallback, useEffect, useRef } from 'react';
import Scene from './components/Scene';
import ChatPanel from './components/ChatPanel';
import SettingsModal from './components/SettingsModal';
import LoadingScreen from './components/LoadingScreen';
import Onboarding from './components/Onboarding';
import SceneToggle from './components/SceneToggle';
import SocialBar from './components/SocialBar';
import { useChat } from './hooks/useChat';
import { useMemory } from './hooks/useMemory';
import { useSettings } from './hooks/useSettings';
import { useMood } from './hooks/useMood';
import { useVoice } from './hooks/useVoice';
import { useJourney } from './hooks/useJourney';
import { useDayNightCycle } from './hooks/useDayNightCycle';
import { useAmbientAudio } from './hooks/useAmbientAudio';
import { MOOD_PRESETS } from './config/moodPresets';

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

  // Voice
  const voice = useVoice();
  const lastMessageCount = useRef(messages.length);

  // Auto-speak new assistant messages when voice is enabled
  useEffect(() => {
    if (voice.voiceEnabled && messages.length > lastMessageCount.current) {
      const lastMsg = messages[messages.length - 1];
      if (lastMsg?.role === 'assistant') {
        voice.speak(lastMsg.content);
      }
    }
    lastMessageCount.current = messages.length;
  }, [messages, voice.voiceEnabled]);

  // Mood
  const chatMood = useMood(messages);

  // Journey
  const journey = useJourney();

  // Merge mood: journey override takes priority
  const effectiveMood = journey.moodOverride
    ? { ...chatMood, mood: journey.moodOverride, preset: MOOD_PRESETS[journey.moodOverride] || chatMood.preset }
    : chatMood;

  // Speaking: TTS-driven when voice active, fallback to chat heuristic
  const effectiveSpeaking = voice.voiceEnabled ? voice.isVoiceSpeaking : isSpeaking;

  // Day/Night
  const dayNight = useDayNightCycle();

  // Ambient Audio
  const ambientAudio = useAmbientAudio();

  // Update audio for phase changes
  useEffect(() => {
    ambientAudio.updateForPhase(dayNight.phase);
  }, [dayNight.phase, ambientAudio.updateForPhase]);

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

  const handleToggleVoice = useCallback(() => {
    if (voice.isListening) {
      voice.stopListening();
    } else {
      voice.startListening((transcript) => {
        if (transcript && hasAnyKey) {
          sendMessage(transcript);
        }
      });
    }
  }, [voice, hasAnyKey, sendMessage]);

  const handleStartJourney = useCallback((journeyId) => {
    journey.startJourney(journeyId);
  }, [journey]);

  // Speak journey narration when voice enabled
  const prevNarration = useRef('');
  useEffect(() => {
    if (voice.voiceEnabled && journey.narration && journey.narration !== prevNarration.current) {
      voice.speak(journey.narration);
    }
    prevNarration.current = journey.narration;
  }, [journey.narration, voice.voiceEnabled]);

  return (
    <>
      {!loaded && (
        <LoadingScreen progress={loadProgress} onFadeComplete={handleLoadComplete} />
      )}

      {loaded && showOnboarding && (
        <Onboarding onComplete={handleOnboardingComplete} />
      )}

      <div className="app">
        <div className={`scene-container ${!sceneExpanded ? 'scene-collapsed' : ''}`}>
          <Scene
            isSpeaking={effectiveSpeaking}
            mood={effectiveMood}
            onProgress={handleProgress}
            paused={!sceneExpanded}
            getTimeOfDay={dayNight.getTimeOfDay}
            phase={dayNight.phase}
            journeyCameraTarget={journey.cameraTarget}
            journeyActive={!!journey.activeJourney}
          />
          <div className="scene-overlay">
            <h1 className="title-overlay">BUDDHAROID</h1>
            <p className="subtitle-overlay">Seek Enlightenment Through Code</p>
            <SocialBar />
          </div>
        </div>

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
          voiceSupported={voice.voiceSupported}
          isListening={voice.isListening}
          transcript={voice.transcript}
          voiceEnabled={voice.voiceEnabled}
          onToggleVoice={handleToggleVoice}
          onToggleVoiceEnabled={() => voice.setVoiceEnabled(v => !v)}
          journey={journey}
          onStartJourney={handleStartJourney}
          audioEnabled={ambientAudio.audioEnabled}
          onToggleAudio={ambientAudio.toggleAudio}
        />

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
