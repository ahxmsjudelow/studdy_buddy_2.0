import React, { useState, useRef, useEffect } from 'react';
import { Subject } from '../data/subjects';
import { api, playWavBase64, stopAudio } from '../utils/api';
import { MarkdownText } from './MarkdownText';
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Sparkles,
  Bot,
  User,
  Loader2,
  RotateCcw,
  BookOpen,
  CheckCircle,
} from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  audioBase64?: string;
  /** true when answered by the built-in offline tutor (no AI) */
  offline?: boolean;
  timestamp: string;
}

interface StudyChatbotProps {
  currentSubject?: Subject;
  allSubjects: Subject[];
  onAddPoints: (amount: number, reason: string) => void;
  darkMode?: boolean;
}

export const StudyChatbot: React.FC<StudyChatbotProps> = ({
  currentSubject,
  allSubjects,
  onAddPoints,
  darkMode,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    currentSubject || allSubjects.find((s) => s.code === '0580') || allSubjects[0]
  );
  const [role, setRole] = useState<'socratic' | 'examiner' | 'flashcard_coach'>('socratic');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I'm your Study Buddy Cambridge tutor for ${selectedSubject.name} ${selectedSubject.code ? `(${selectedSubject.code})` : ''}. Ask me to explain any difficult concept, test your understanding with Socratic questioning, or review mark scheme keywords!`,
      timestamp: 'Just now',
    },
  ]);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Audio Recording (Microphone -> gemini-3.5-transcribe)
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const [audioChunks, setAudioChunks] = useState<Blob[]>([]);
  const [isTranscribing, setIsTranscribing] = useState(false);

  // Audio TTS Playback
  const [activeAudioPlayingId, setActiveAudioPlayingId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);

  const threadEndRef = useRef<HTMLDivElement>(null);

  // Stop speech / mic when leaving the tab
  useEffect(() => () => { stopAudio(); }, []);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = (textToSend || inputPrompt).trim();
    if (!text || isSending) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputPrompt('');
    setIsSending(true);

    try {
      const chatHistory = [...messages, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      const data = await api<{ reply: string; offline?: boolean }>('/api/gemini/chat', {
        body: {
          messages: chatHistory,
          subject: selectedSubject.name + (selectedSubject.code ? ` (${selectedSubject.code})` : ''),
          role,
        },
      });

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        role: 'assistant',
        content: data.reply,
        offline: Boolean(data.offline),
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, botMsg]);
      if (!data.offline) onAddPoints(10, 'Completed Socratic tutoring discussion');
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          role: 'assistant',
          content: `I couldn't reach the Study Buddy server (${err?.message || 'unknown error'}). Please try again in a moment.`,
          timestamp: 'Just now',
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  // Audio Recording using MediaRecorder and sending base64 to /api/gemini/transcribe
  const startRecording = async () => {
    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === 'undefined') {
        alert('Voice dictation is not supported in this browser.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream);
      const chunks: Blob[] = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunks.push(e.data);
      };

      recorder.onstop = async () => {
        const mime = recorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(chunks, { type: mime });
        stream.getTracks().forEach((track) => track.stop());

        // Convert Blob to base64
        const reader = new FileReader();
        reader.readAsDataURL(audioBlob);
        reader.onloadend = async () => {
          const base64Data = (reader.result as string).split(',')[1];
          setIsTranscribing(true);
          try {
            const data = await api<{ transcript?: string }>('/api/gemini/transcribe', {
              body: { audioBase64: base64Data, mimeType: mime.split(';')[0] },
            });
            if (data.transcript) {
              setInputPrompt(data.transcript);
            }
          } catch (err: any) {
            console.error('Transcription error:', err);
            alert(`Voice dictation is unavailable right now (${err.message}). Please type your question.`);
          } finally {
            setIsTranscribing(false);
          }
        };
      };

      recorder.start();
      setMediaRecorder(recorder);
      setIsRecording(true);
    } catch (err) {
      console.warn('Microphone permission or hardware unavailable:', err);
      alert('Microphone access was not permitted. Please allow microphone permissions in your browser.');
    }
  };

  const stopRecording = () => {
    if (mediaRecorder && isRecording) {
      mediaRecorder.stop();
      setIsRecording(false);
    }
  };

  // Play assistant message aloud via Gemini 3.8 Flash TTS
  const handlePlayTTS = async (msg: Message) => {
    if (activeAudioPlayingId === msg.id) {
      stopAudio();
      setActiveAudioPlayingId(null);
      return;
    }

    if (msg.audioBase64) {
      try {
        setActiveAudioPlayingId(msg.id);
        await playWavBase64(msg.audioBase64, () => setActiveAudioPlayingId(null));
      } catch { setActiveAudioPlayingId(null); }
      return;
    }

    setAudioLoadingId(msg.id);
    try {
      // Filter out markdown bullets for natural speech
      const cleanText = msg.content.replace(/[*#_`]/g, '').slice(0, 600);
      const data = await api<{ audioBase64?: string }>('/api/gemini/tts', { body: { text: cleanText, voice: 'Kore' } });
      if (data.audioBase64) {
        setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, audioBase64: data.audioBase64 } : m)));
        setActiveAudioPlayingId(msg.id);
        await playWavBase64(data.audioBase64, () => setActiveAudioPlayingId(null));
      }
    } catch (err: any) {
      console.error('TTS error:', err);
      setActiveAudioPlayingId(null);
      alert(`Read-aloud is unavailable right now (${err.message}).`);
    } finally {
      setAudioLoadingId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b goodness-border">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5" />
            <span>Multi-turn Gemini Study Chatbot</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            AI Cambridge Socratic Tutor
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
            Voice dictation with Gemini 3.5 Transcribe & vocalized feedback with Gemini 3.8 Flash TTS.
          </p>
        </div>

        {/* Subject & Role Switchers */}
        <div className="flex flex-wrap items-center gap-2">
          <select
            value={selectedSubject.id}
            onChange={(e) => {
              const s = allSubjects.find((x) => x.id === e.target.value);
              if (s) {
                setSelectedSubject(s);
                setMessages([
                  {
                    id: 'switch',
                    role: 'assistant',
                    content: `Switched context to ${s.name} ${s.code ? `(${s.code})` : ''}. How can I assist with this syllabus today?`,
                    timestamp: 'Just now',
                  },
                ]);
              }
            }}
            className="px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
          >
            {allSubjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.code ? `(${s.code})` : ''}
              </option>
            ))}
          </select>

          <div className="flex items-center p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              onClick={() => setRole('socratic')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                role === 'socratic' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              Socratic
            </button>
            <button
              onClick={() => setRole('examiner')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                role === 'examiner' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              Examiner
            </button>
            <button
              onClick={() => setRole('flashcard_coach')}
              className={`px-2.5 py-1 text-xs rounded-lg font-medium transition-colors ${
                role === 'flashcard_coach' ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 font-bold shadow-xs' : 'text-slate-500'
              }`}
            >
              Drill Coach
            </button>
          </div>
        </div>
      </div>

      {/* Main Chat Thread Box */}
      <div className="rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs flex flex-col h-[560px] overflow-hidden">
        {/* Messages scrollable area */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <div
                key={m.id}
                className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                <div
                  className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 font-bold text-xs ${
                    isUser
                      ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950'
                      : 'bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 border border-teal-200/60 dark:border-teal-800/40'
                  }`}
                >
                  {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-teal-600 text-white rounded-tr-none'
                      : 'bg-slate-50 dark:bg-slate-800/60 text-slate-800 dark:text-slate-200 border border-slate-200/60 dark:border-slate-700/50 rounded-tl-none whitespace-pre-wrap'
                  }`}
                >
                  {isUser ? <div className="whitespace-pre-wrap">{m.content}</div> : <MarkdownText text={m.content} />}
                  {m.offline && (
                    <div className="mt-2 inline-block px-2 py-0.5 rounded-md bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-[10px] font-semibold">Offline tutor · built-in syllabus notes</div>
                  )}

                  <div className="flex items-center justify-between gap-3 mt-2 pt-2 border-t border-black/10 dark:border-white/10 text-[10px]">
                    <span className={isUser ? 'text-teal-100' : 'text-slate-400'}>
                      {m.timestamp}
                    </span>

                    {!isUser && (
                      <button
                        onClick={() => handlePlayTTS(m)}
                        disabled={audioLoadingId === m.id}
                        className="flex items-center gap-1 text-teal-600 dark:text-teal-400 hover:underline font-semibold"
                      >
                        {audioLoadingId === m.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : activeAudioPlayingId === m.id ? (
                          <VolumeX className="w-3 h-3" />
                        ) : (
                          <Volume2 className="w-3 h-3" />
                        )}
                        <span>{activeAudioPlayingId === m.id ? 'Stop' : 'Read aloud'}</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
          {isSending && (
            <div className="flex gap-3 max-w-md mr-auto">
              <div className="w-8 h-8 rounded-xl bg-teal-50 dark:bg-teal-950/60 text-teal-600 dark:text-teal-400 flex items-center justify-center shrink-0">
                <Loader2 className="w-4 h-4 animate-spin" />
              </div>
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 text-xs text-slate-500 italic">
                Socratic tutor is thinking...
              </div>
            </div>
          )}
          <div ref={threadEndRef} />
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Quick Prompts Suggestions */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 mb-2 text-xs">
            {[
              'Give me a 4-mark exam question on this topic',
              'Explain this with a real-world example',
              'What common mistakes do students make in Paper 2?',
              'Show me the step-by-step formula derivation',
            ].map((suggestion, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(suggestion)}
                className="shrink-0 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {/* Audio Recording / Transcription Button */}
            <button
              onClick={isRecording ? stopRecording : startRecording}
              disabled={isTranscribing}
              title={isRecording ? 'Stop recording & transcribe' : 'Dictate question with microphone'}
              className={`p-3 rounded-2xl transition-all ${
                isRecording
                  ? 'bg-rose-500 text-white animate-pulse'
                  : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-teal-500'
              }`}
            >
              {isTranscribing ? (
                <Loader2 className="w-4 h-4 animate-spin text-teal-500" />
              ) : isRecording ? (
                <MicOff className="w-4 h-4" />
              ) : (
                <Mic className="w-4 h-4" />
              )}
            </button>

            {/* Input Field */}
            <input
              type="text"
              value={inputPrompt}
              onChange={(e) => setInputPrompt(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.nativeEvent?.isComposing) handleSendMessage();
              }}
              placeholder={
                isRecording
                  ? 'Listening to microphone...'
                  : isTranscribing
                  ? 'Transcribing audio with Gemini 3.5...'
                  : 'Type your study question or math equation...'
              }
              className="flex-1 px-4 py-3 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/20"
            />

            {/* Send Button */}
            <button
              onClick={() => handleSendMessage()}
              disabled={!inputPrompt.trim() || isSending}
              className="p-3 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-slate-950 hover:opacity-90 disabled:opacity-40 transition-opacity"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
