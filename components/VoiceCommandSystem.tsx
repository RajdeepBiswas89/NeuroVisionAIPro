import React, { useState, useEffect, useRef } from 'react';
import { Mic, Volume2, Power, Zap, Activity, Brain, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppRoute } from '../types';
import { api } from '../services/api';

interface VoiceCommandSystemProps {
  onNavigate: (route: AppRoute) => void;
  onAction?: (action: string, params?: any) => void;
}

const VoiceCommandSystem: React.FC<VoiceCommandSystemProps> = ({ onNavigate, onAction }) => {
  const [isListening, setIsListening] = useState(false);
  const [isActive, setIsActive] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isSupported, setIsSupported] = useState(true);
  const [isAwake, setIsAwake] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [aiResponse, setAiResponse] = useState('');

  const recognitionRef = useRef<any>(null);
  const restartTimeoutRef = useRef<any>(null);
  const isAwakeRef = useRef<boolean>(false);

  // Auto-start continuous listening
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setFeedback('❌ Voice not supported. Use Chrome or Edge.');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onresult = (event: any) => {
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          }
        }

        if (finalTranscript) {
          const text = finalTranscript.toLowerCase().trim();
          console.log('🎤 Heard:', text);
          setTranscript(text);
          handleVoiceInput(text);
        }
      };

      recognition.onerror = (event: any) => {
        console.error('Speech error:', event.error);
        if (event.error === 'not-allowed') {
          setIsActive(false);
        } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
          scheduleRestart();
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        if (isActive) scheduleRestart();
      };

      recognitionRef.current = recognition;
      recognition.start();

    } catch (error) {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {
          // Ignore errors on cleanup in case it's already stopped
        }
      }
    };
  }, []);

  const scheduleRestart = () => {
    if (restartTimeoutRef.current) clearTimeout(restartTimeoutRef.current);
    restartTimeoutRef.current = setTimeout(() => {
      if (isActive && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Ignore start errors
        }
      }
    }, 500);
  };

  const handleVoiceInput = async (text: string) => {
    // Wake word detection
    if (!isAwakeRef.current) {
      if (text.includes('rajdeep activate') || text.includes('hey rajdeep') || text.includes('system activate')) {
        isAwakeRef.current = true;
        setIsAwake(true);
        speak('Identity verified. Clinical Assistant Online.');
        setFeedback('ONLINE');
        return;
      }
      return;
    }

    // If awake, check for system commands first
    if (processSystemCommand(text)) return;

    // If not a system command, treat as AI Query
    await processAIQuery(text);
  };

  const processSystemCommand = (text: string): boolean => {
    // SYSTEM CONTROL
    if (text.match(/(?:sleep|stop|deactivate|turn off)/i)) {
      isAwakeRef.current = false;
      setIsAwake(false);
      speak('Entering standby mode.');
      setAiResponse('');
      return true;
    }

    // NAVIGATION
    const navMap: { [key: string]: AppRoute } = {
      'dashboard': AppRoute.DASHBOARD,
      'scan': AppRoute.SCAN,
      'results': AppRoute.RESULTS,
      'medicine': AppRoute.MEDICINE_ORDER,
      'map': AppRoute.PHARMACY_MAP,
      '3d': AppRoute.TUMOR_3D,
      'ambulance': AppRoute.AMBULANCE,
      'growth': AppRoute.GROWTH_PREDICTION,
      'neuro': AppRoute.NEURO_ANALYSIS,
      'analytics': AppRoute.ANALYTICS,
      'research': AppRoute.KNOWLEDGE_BASE // Assuming new route
    };

    for (const [key, route] of Object.entries(navMap)) {
      if (text.includes(key) && (text.includes('go to') || text.includes('open') || text.includes('show'))) {
        onNavigate(route);
        speak(`Navigating to ${key}.`);
        return true;
      }
    }

    return false;
  };

  const processAIQuery = async (text: string) => {
    setIsThinking(true);
    setFeedback('Processing Query...');
    setAiResponse(''); // Clear previous response

    try {
      // Check for "alien" keywords locally (optional Easter egg from previous code)
      if (text.includes('alien') || text.includes('magic')) {
        const resp = "I cannot analyze non-biological anomalies.";
        speak(resp);
        setAiResponse(resp);
        setIsThinking(false);
        return;
      }

      const response = await api.chat(text);
      const aiText = response.response;

      setAiResponse(aiText);
      speak(aiText);

    } catch (e) {
      const errMsg = "I am unable to reach the neural core.";
      speak(errMsg);
      setAiResponse(errMsg);
    } finally {
      setIsThinking(false);
    }
  };

  const speak = (text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  const toggleActive = () => {
    if (isAwake) {
      isAwakeRef.current = false;
      setIsAwake(false);
      setAiResponse('');
    } else {
      isAwakeRef.current = true;
      setIsAwake(true);
      speak('System Activated.');
    }
  };

  if (!isSupported) return null;

  return (
    <>
      {/* Floating Trigger Button (Always Visible) */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 transition-colors ${isAwake ? 'bg-red-500 border-red-400 animate-pulse' : 'bg-gray-900 border-gray-700'}`}
          onClick={toggleActive}
        >
          {isAwake ? <Mic className="text-white" /> : <Power className="text-gray-400" />}
        </motion.button>
      </div>

      {/* Global Holographic Overlay */}
      <AnimatePresence>
        {isAwake && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 pointer-events-none flex items-center justify-center bg-black/40 backdrop-blur-sm"
          >
            <div className="relative w-full max-w-2xl p-8 pointer-events-auto">
              {/* Hologram Box */}
              <div className="bg-black/80 border border-[#4CC9F0]/50 rounded-3xl p-8 shadow-[0_0_50px_rgba(76,201,240,0.3)] relative overflow-hidden backdrop-blur-xl">
                {/* Scanning Line Animation */}
                <motion.div
                  className="absolute top-0 left-0 w-full h-1 bg-[#4CC9F0]/50 shadow-[0_0_20px_#4CC9F0]"
                  animate={{ top: ['0%', '100%', '0%'] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                />

                <div className="flex items-start gap-6">
                  {/* Visualizer */}
                  <div className="w-24 h-24 rounded-full border-4 border-[#4CC9F0]/30 flex items-center justify-center relative bg-black/50">
                    <Activity className="text-[#4CC9F0] animate-pulse" size={40} />
                    <div className="absolute inset-0 border-t-2 border-[#4CC9F0] rounded-full animate-spin" style={{ animationDuration: '3s' }} />
                  </div>

                  <div className="flex-1 space-y-4">
                    <div className="flex justify-between items-center border-b border-white/10 pb-2">
                      <h2 className="text-2xl font-black text-white tracking-widest uppercase flex items-center gap-2">
                        <Brain className="text-[#4CC9F0]" />
                        RAJDEEP AI
                      </h2>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-xs font-mono text-[#4CC9F0]">ONLINE</span>
                      </div>
                    </div>

                    {/* Transcript */}
                    <div className="min-h-[60px]">
                      <p className="text-gray-400 text-sm font-bold uppercase tracking-wider mb-1">User Input</p>
                      <p className="text-xl text-white font-medium">
                        {transcript || "Listening..."}
                        <span className="animate-pulse">_</span>
                      </p>
                    </div>

                    {/* AI Response */}
                    <AnimatePresence>
                      {(aiResponse || isThinking) && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="bg-white/5 rounded-xl p-4 border border-white/10"
                        >
                          <p className="text-[#4CC9F0] text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2">
                            {isThinking ? <Zap size={14} className="animate-bounce" /> : <Volume2 size={14} />}
                            {isThinking ? "Processing..." : "System Response"}
                          </p>
                          <p className="text-lg text-gray-200 leading-relaxed">
                            {isThinking ? "Analyzing inputs..." : aiResponse}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => {
                    isAwakeRef.current = false;
                    setIsAwake(false);
                  }}
                  className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoiceCommandSystem;
