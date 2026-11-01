import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Play,
  Pause,
  RotateCcw,
  Sparkles,
  Volume2,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerProps {
  isOpen: boolean;
  onClose: () => void;
  onSessionComplete: (durationMinutes: number) => void;
  darkMode?: boolean;
}

export const PomodoroTimer: React.FC<PomodoroTimerProps> = ({
  isOpen,
  onClose,
  onSessionComplete,
  darkMode,
}) => {
  const [mode, setMode] = useState<'focus25' | 'deep50' | 'break5'>('focus25');
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [sessionsDone, setSessionsDone] = useState<number>(0);

  const initialSeconds = mode === 'focus25' ? 25 * 60 : mode === 'deep50' ? 50 * 60 : 5 * 60;

  // Count down against a wall-clock deadline so the timer doesn't drift or stall
  // when the browser throttles background tabs.
  const endAtRef = useRef<number>(0);
  useEffect(() => {
    if (!isRunning) return;
    endAtRef.current = Date.now() + secondsLeft * 1000;
    const interval = setInterval(() => {
      setSecondsLeft(Math.max(0, Math.ceil((endAtRef.current - Date.now()) / 1000)));
    }, 250);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    if (secondsLeft === 0 && isRunning) {
      setIsRunning(false);
      playChime();
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#00A896', '#3B82F6', '#F59E0B'],
      });
      // Breaks must not count as study sessions or award XP
      if (mode !== 'break5') {
        setSessionsDone((prev) => prev + 1);
        onSessionComplete(mode === 'deep50' ? 50 : 25);
      }
    }
  }, [secondsLeft, isRunning]);

  const playChime = () => {
    try {
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5 note
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.3); // A5 note
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const switchMode = (newMode: 'focus25' | 'deep50' | 'break5') => {
    setMode(newMode);
    setIsRunning(false);
    setSecondsLeft(newMode === 'focus25' ? 25 * 60 : newMode === 'deep50' ? 50 * 60 : 5 * 60);
  };

  if (!isOpen) return null;

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const progressPct = ((initialSeconds - secondsLeft) / initialSeconds) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-md p-6 sm:p-8 shadow-2xl relative text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-4">
          <Clock className="w-3.5 h-3.5" />
          <span>Cambridge Deep Work Timer</span>
        </div>

        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
          Focus Session
        </h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-serif italic mb-6">
          High cognitive flow with minimal distractions.
        </p>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-1.5 p-1 bg-slate-100 dark:bg-slate-800 rounded-2xl mb-8 max-w-xs mx-auto">
          <button
            onClick={() => switchMode('focus25')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'focus25'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            25m Focus
          </button>
          <button
            onClick={() => switchMode('deep50')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'deep50'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            50m Deep
          </button>
          <button
            onClick={() => switchMode('break5')}
            className={`flex-1 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              mode === 'break5'
                ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs'
                : 'text-slate-500'
            }`}
          >
            5m Rest
          </button>
        </div>

        {/* Big Digital Timer Display */}
        <div className="relative w-56 h-56 mx-auto mb-8 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle
              cx="112"
              cy="112"
              r="96"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-slate-100 dark:text-slate-800"
            />
            <circle
              cx="112"
              cy="112"
              r="96"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={2 * Math.PI * 96}
              strokeDashoffset={2 * Math.PI * 96 * (1 - progressPct / 100)}
              strokeLinecap="round"
              className="text-teal-500 transition-all duration-300"
            />
          </svg>

          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-5xl font-black font-mono tracking-tight text-slate-900 dark:text-white">
              {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
            </span>
            <span className="text-xs font-semibold text-slate-400 mt-1 uppercase tracking-wider">
              {isRunning ? 'Flow Active' : 'Paused'}
            </span>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-4 mb-6">
          <button
            onClick={() => setSecondsLeft(initialSeconds)}
            title="Reset timer"
            className="p-3 rounded-2xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
          </button>

          <button
            onClick={() => setIsRunning(!isRunning)}
            className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 text-white font-bold text-sm shadow-md hover:opacity-95 transition-opacity flex items-center gap-2"
          >
            {isRunning ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white" />}
            <span>{isRunning ? 'Pause Flow' : 'Start Focus'}</span>
          </button>
        </div>

        <div className="text-xs text-slate-500 dark:text-slate-400">
          <span>{sessionsDone} sessions completed today • Earn +40 XP each!</span>
        </div>
      </div>
    </div>
  );
};
