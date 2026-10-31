import React, { useState, useEffect } from 'react';
import { X, Volume2, VolumeX, Send, Sparkles, Headphones, Languages } from 'lucide-react';
import { speechAgent, VoiceLanguage } from '../../utils/speechAgent';

interface LiveVoiceCoachModalProps {
  isOpen: boolean;
  onClose: () => void;
  isMuted: boolean;
  onToggleMute: () => void;
}

export const LiveVoiceCoachModal: React.FC<LiveVoiceCoachModalProps> = ({
  isOpen,
  onClose,
  isMuted,
  onToggleMute,
}) => {
  const [voiceLang, setVoiceLang] = useState<VoiceLanguage>('en');
  const [messages, setMessages] = useState<
    { sender: 'user' | 'agent'; text: string; time: string }[]
  >([
    {
      sender: 'agent',
      text: 'Hello! I am your Stock Simplified AI Voice Mentor. Ask me any question about Forex pairs, PIP calculations, leverage risk, session overlaps, or candlestick patterns.',
      time: 'Just now',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    return () => {
      speechAgent.stop();
    };
  }, []);

  if (!isOpen) return null;

  const handleLanguageChange = (lang: VoiceLanguage) => {
    setVoiceLang(lang);
    speechAgent.setLanguage(lang);
    const greeting =
      lang === 'hi'
        ? 'नमस्ते! मैं आपका स्टॉक सिम्पलीफाइड वॉइस मेंटर हूँ। फॉरेक्स, पिप्स, लीवरेज या तकनीकी चार्टिंग के बारे में कुछ भी पूछें।'
        : lang === 'pa'
        ? 'ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ ਸਟਾਕ ਸਿੰਪਲੀਫਾਈਡ ਵਾਇਸ ਮੈਂਟਰ ਹਾਂ। ਫੋਰੈਕਸ ਕਰੰਸੀਆਂ, ਪਿੱਪਸ, ਲੀਵਰੇਜ ਜਾਂ ਚਾਰਟਿੰਗ ਬਾਰੇ ਕੋਈ ਵੀ ਸਵਾਲ ਪੁੱਛੋ।'
        : 'Hello! I am your Stock Simplified AI Voice Mentor. Ask me any question about Forex pairs, PIP calculations, leverage risk, session overlaps, or candlestick patterns.';

    setMessages((prev) => [
      ...prev,
      {
        sender: 'agent',
        text: greeting,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      },
    ]);
  };

  const handleSend = async (textToSend?: string) => {
    const q = (textToSend || inputText).trim();
    if (!q) return;

    const userMsg = {
      sender: 'user' as const,
      text: q,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/voice-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q, topic: 'Forex Education', language: voiceLang }),
      });
      const data = await res.json();
      const replyText = data.reply || 'Trade with a defined plan and always manage your downside.';

      const agentMsg = {
        sender: 'agent' as const,
        text: replyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, agentMsg]);

      // Speak reply via Web Speech API in chosen voice language
      if (!isMuted) {
        setIsSpeaking(true);
        speechAgent.speak(replyText, () => {
          setIsSpeaking(false);
        }, voiceLang);
      }
    } catch (err) {
      console.error(err);
      const fallbackMsg = {
        sender: 'agent' as const,
        text:
          voiceLang === 'hi'
            ? 'पिप (PIP) फॉरेक्स का सबसे महत्वपूर्ण पैमाना है। हमेशा स्टॉप लॉस के साथ जोखिम प्रबंधन करें।'
            : voiceLang === 'pa'
            ? 'ਪਿੱਪ (PIP) ਫੋਰੈਕਸ ਦਾ ਮੁੱਢਲਾ ਮਾਪ ਹੈ। ਹਮੇਸ਼ਾ ਸਟਾਪ ਲਾਸ ਲਗਾ ਕੇ ਆਪਣੀ ਪੂੰਜੀ ਸੁਰੱਖਿਅਤ ਰੱਖੋ।'
            : 'A PIP (Percentage in Point) is typically the 4th decimal (0.0001). Always use Stop Losses to protect your capital.',
        time: 'Just now',
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const sampleQuestions = [
    'How do I calculate PIP value for EUR/USD?',
    'What is the difference between Base and Quote currency?',
    'Why is the London & New York overlap so volatile?',
    'How does 1:100 leverage work in simple terms?',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 flex flex-col h-[580px] overflow-hidden text-slate-100">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold shadow-md shadow-cyan-500/20">
              <Headphones className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white">Live Voice Mentor</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                  REAL-TIME AUDIO
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Interactive Trading & Education Companion</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={onToggleMute}
              className="p-2 rounded-xl bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-rose-400" /> : <Volume2 className="w-4 h-4 text-emerald-400" />}
            </button>
            <button
              onClick={() => {
                speechAgent.stop();
                onClose();
              }}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Voice Agent Language Selector Bar */}
        <div className="my-2.5 px-3 py-2 bg-slate-950/80 rounded-xl border border-slate-800 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5">
            <Languages className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs text-slate-400 font-medium">Voice Language:</span>
          </div>
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                voiceLang === 'en'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                voiceLang === 'hi'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              हिन्दी
            </button>
            <button
              type="button"
              onClick={() => handleLanguageChange('pa')}
              className={`px-2 py-0.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                voiceLang === 'pa'
                  ? 'bg-cyan-500 text-slate-950 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              ਪੰਜਾਬੀ
            </button>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-3 space-y-3">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex flex-col ${m.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user'
                    ? 'bg-cyan-600 text-white rounded-br-none'
                    : 'bg-slate-950 border border-slate-800 text-slate-200 rounded-bl-none'
                }`}
              >
                {m.text}
              </div>
              <span className="text-[10px] text-slate-500 mt-1 px-1">{m.time}</span>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-cyan-400 p-2">
              <Sparkles className="w-4 h-4 animate-spin" />
              <span>Mentor is thinking...</span>
            </div>
          )}
        </div>

        {/* Quick Question Chips */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 text-[11px]">
          {sampleQuestions.map((q, i) => (
            <button
              key={i}
              onClick={() => handleSend(q)}
              className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white whitespace-nowrap border border-slate-700/60 transition-colors cursor-pointer"
            >
              {q}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="pt-2 border-t border-slate-800 flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask mentor anything..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />
          <button
            type="submit"
            disabled={isLoading || !inputText.trim()}
            className="p-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold transition-colors cursor-pointer"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
