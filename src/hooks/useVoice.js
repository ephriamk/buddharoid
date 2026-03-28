import { useState, useRef, useCallback, useEffect } from 'react';

const SpeechRecognition = typeof window !== 'undefined'
  ? window.SpeechRecognition || window.webkitSpeechRecognition
  : null;

function selectVoice() {
  const voices = window.speechSynthesis.getVoices();
  // Prefer calm-sounding English voices
  const preferred = ['Samantha', 'Google UK English Female', 'Karen', 'Moira', 'Tessa'];
  for (const name of preferred) {
    const v = voices.find(v => v.name.includes(name));
    if (v) return v;
  }
  return voices.find(v => v.lang.startsWith('en')) || voices[0] || null;
}

export function useVoice() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isVoiceSpeaking, setIsVoiceSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const recognitionRef = useRef(null);
  const onFinalizeRef = useRef(null);

  const voiceSupported = !!SpeechRecognition;
  const ttsSupported = typeof window !== 'undefined' && 'speechSynthesis' in window;

  // Ensure voices are loaded
  useEffect(() => {
    if (ttsSupported) {
      window.speechSynthesis.getVoices();
      window.speechSynthesis.onvoiceschanged = () => window.speechSynthesis.getVoices();
    }
  }, [ttsSupported]);

  const startListening = useCallback((onFinalize) => {
    if (!voiceSupported) return;
    onFinalizeRef.current = onFinalize;

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      let interim = '';
      let final = '';
      for (let i = 0; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          final += event.results[i][0].transcript;
        } else {
          interim += event.results[i][0].transcript;
        }
      }
      setTranscript(final || interim);
    };

    recognition.onend = () => {
      setIsListening(false);
      // Use the final transcript
      setTranscript(prev => {
        if (prev.trim() && onFinalizeRef.current) {
          onFinalizeRef.current(prev.trim());
        }
        return '';
      });
    };

    recognition.onerror = (e) => {
      console.error('Speech recognition error:', e.error);
      setIsListening(false);
      setTranscript('');
    };

    recognitionRef.current = recognition;
    recognition.start();
  }, [voiceSupported]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
    }
  }, []);

  const speak = useCallback((text) => {
    if (!ttsSupported) return Promise.resolve();

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      // Clean text: strip emojis and markdown
      const clean = text
        .replace(/[\u{1F600}-\u{1F9FF}]/gu, '')
        .replace(/[_*#]/g, '')
        .trim();

      if (!clean) { resolve(); return; }

      const utterance = new SpeechSynthesisUtterance(clean);
      const voice = selectVoice();
      if (voice) utterance.voice = voice;
      utterance.rate = 0.9;
      utterance.pitch = 0.95;
      utterance.volume = 0.8;

      utterance.onstart = () => setIsVoiceSpeaking(true);
      utterance.onend = () => { setIsVoiceSpeaking(false); resolve(); };
      utterance.onerror = () => { setIsVoiceSpeaking(false); resolve(); };

      window.speechSynthesis.speak(utterance);
    });
  }, [ttsSupported]);

  const cancelSpeech = useCallback(() => {
    if (ttsSupported) {
      window.speechSynthesis.cancel();
      setIsVoiceSpeaking(false);
    }
  }, [ttsSupported]);

  return {
    isListening,
    transcript,
    isVoiceSpeaking,
    voiceEnabled,
    setVoiceEnabled,
    startListening,
    stopListening,
    speak,
    cancelSpeech,
    voiceSupported,
    ttsSupported,
  };
}
