import React, { useState, useRef, useEffect } from 'react';
// Mock implementation due to type resolution issue
const motion = {
  div: (props: any) => <div {...props} />,
  input: (props: any) => <input {...props} />,
  button: (props: any) => <button {...props} />,
  textarea: (props: any) => <textarea {...props} />
};

const AnimatePresence = ({ children }: { children?: React.ReactNode }) => {
  return <>{children}</>;
};

import { MessageSquare, Mic, MicOff, Send, X, Volume2, VolumeX, Sparkles, Zap, Brain } from 'lucide-react';
import { api } from '../services/api';


interface Message {
  id: string;
  role: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const FuturisticAIChat: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'ai',
      content: 'Hello! I\'m your advanced NeuroVision AI assistant. I can help you understand scan results, explain medical terminology, and answer questions about brain tumor detection. How can I assist you today?',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isThinking, setIsThinking] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initialize speech recognition - DISABLED to prevent conflict with VoiceCommandSystem
  // The main VoiceCommandSystem component handles all voice commands
  useEffect(() => {
    // Speech recognition is handled by VoiceCommandSystem component
    // Keeping this commented out to avoid multiple SpeechRecognition instances
    // which causes "aborted" errors

    /* 
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;

      recognitionRef.current.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        handleSendMessage(transcript);
      };

      recognitionRef.current.onerror = () => setIsListening(false);
      recognitionRef.current.onend = () => setIsListening(false);
    }
    */
  }, []);

  const speakMessage = (text: string) => {
    if (!voiceEnabled) return;

    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.0;
    utterance.volume = 1;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v =>
      v.name.includes('Female') || v.name.includes('Samantha')
    );
    if (preferredVoice) utterance.voice = preferredVoice;

    setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };


  const handleSendMessage = async (customInput?: string) => {
    const messageText = customInput || input;
    if (!messageText.trim() || isThinking) return;

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsThinking(true);

    try {
      // Simulate a network delay
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate 1 second delay

      // Add explicit "I Don't Know" logic for specific keywords or low confidence
      const lowerInput = messageText.toLowerCase();
      if (lowerInput.includes("unknown") || lowerInput.includes("alien") || lowerInput.includes("magic")) {
        const uncertainMsg: Message = {
          id: Date.now().toString(),
          role: 'ai',
          content: "I cannot safely predict this case based on my current training distribution. I recommend reviewing with a specialist.",
          timestamp: new Date()
        };
        setMessages(prev => [...prev, uncertainMsg]);
        speakMessage(uncertainMsg.content);
        setIsThinking(false); // Ensure thinking state is reset
        return;
      }

      // Call Backend API
      const response = await api.chat(messageText);
      const aiResponse = response.response;

      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: aiResponse,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMsg]);
      speakMessage(aiResponse);
    } catch (error) {
      console.error("Chat Error:", error);
      // Fallback for offline mode or error
      const fallbackMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: "I'm having trouble connecting to the neural network. Please check your connection.",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, fallbackMsg]);
      speakMessage("I'm having trouble connecting to the neural network.");
    } finally {
      setIsThinking(false);
    }
  };


  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Voice recognition not supported in this browser');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-8 right-8 w-20 h-20 bg-gradient-to-br from-[#4361EE] to-[#7209B7] rounded-full shadow-2xl flex items-center justify-center z-[999] group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-[#4CC9F0] to-[#2A9D8F] rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
            <MessageSquare className="text-white w-10 h-10 relative z-10" strokeWidth={2} />
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute -top-1 -right-1 w-4 h-4 bg-[#2A9D8F] rounded-full border-4 border-white"
            />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.9 }}
            className="fixed bottom-8 right-8 w-[450px] h-[650px] bg-gradient-to-br from-[#0A2463] via-[#0A2463] to-[#4361EE] rounded-3xl shadow-2xl z-[999] flex flex-col overflow-hidden border-2 border-[#4CC9F0]/30"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: 'radial-gradient(circle, #4CC9F0 1px, transparent 1px)',
                backgroundSize: '30px 30px'
              }} />
            </div>

            {/* Header */}
            <div className="relative z-10 p-6 border-b border-white/10 backdrop-blur-xl">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-3">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    className="w-12 h-12 bg-gradient-to-br from-[#4CC9F0] to-[#2A9D8F] rounded-full flex items-center justify-center"
                  >
                    <Brain className="text-white w-6 h-6" />
                  </motion.div>
                  <div>
                    <h3 className="text-white font-black text-lg">AI Assistant</h3>
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="w-2 h-2 bg-[#2A9D8F] rounded-full"
                      />
                      <span className="text-white/60 text-xs font-bold">Active & Learning</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setVoiceEnabled(!voiceEnabled);
                      if (!voiceEnabled) window.speechSynthesis.cancel();
                    }}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    {voiceEnabled ? (
                      <Volume2 className="text-white w-5 h-5" />
                    ) : (
                      <VolumeX className="text-white/50 w-5 h-5" />
                    )}
                  </button>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-white/10 rounded-xl transition-colors"
                  >
                    <X className="text-white w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 relative z-10">
              {messages.map((msg, idx) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className={`max-w-[80%] ${msg.role === 'user'
                    ? 'bg-gradient-to-br from-[#2A9D8F] to-[#4CC9F0] text-white'
                    : 'bg-white/10 backdrop-blur-xl text-white border border-white/20'
                    } rounded-2xl p-4 shadow-lg`}>
                    {msg.role === 'ai' && (
                      <div className="flex items-center gap-2 mb-2">
                        <Sparkles className="w-4 h-4 text-[#4CC9F0]" />
                        <span className="text-xs font-black text-[#4CC9F0] uppercase tracking-wider">AI Response</span>
                      </div>
                    )}
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                    <span className="text-xs opacity-50 mt-2 block">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </motion.div>
              ))}

              {isThinking && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start"
                >
                  <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-4 border border-white/20">
                    <div className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                      >
                        <Zap className="w-4 h-4 text-[#4CC9F0]" />
                      </motion.div>
                      <span className="text-white text-sm">AI is thinking...</span>
                    </div>
                  </div>
                </motion.div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="relative z-10 p-4 border-t border-white/10 backdrop-blur-xl">
              <div className="flex items-center gap-2">
                <div className="flex-1 relative">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder={isListening ? "Listening..." : "Ask me anything..."}
                    disabled={isThinking || isListening}
                    className="w-full bg-white/10 border border-white/20 rounded-2xl px-4 py-3 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#4CC9F0] disabled:opacity-50"
                  />
                  {isSpeaking && (
                    <motion.div
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 0.5, repeat: Infinity }}
                      className="absolute right-3 top-1/2 -translate-y-1/2"
                    >
                      <Volume2 className="w-5 h-5 text-[#2A9D8F]" />
                    </motion.div>
                  )}
                </div>
                <button
                  onClick={toggleListening}
                  disabled={true}
                  title="Voice commands are handled by the main voice assistant (bottom-right corner)"
                  className={`p-3 rounded-2xl transition-all opacity-50 cursor-not-allowed bg-white/10 border border-white/20`}
                >
                  <Mic className="text-white w-5 h-5" />
                </button>
                <button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isThinking}
                  className="p-3 bg-gradient-to-br from-[#2A9D8F] to-[#4CC9F0] rounded-2xl hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg"
                >
                  <Send className="text-white w-5 h-5" />
                </button>
              </div>
              <p className="text-white/40 text-xs mt-2 text-center font-bold">
                Powered by NeuroVision AI • Created by Rajdeep
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FuturisticAIChat;
