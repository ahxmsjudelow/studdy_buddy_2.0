import React, { useState } from 'react';
import { Subject } from '../data/subjects';
import {
  Compass,
  Search,
  ExternalLink,
  Globe,
  Loader2,
  FileCheck2,
  BookOpen,
} from 'lucide-react';

interface SearchGroundingViewProps {
  currentSubject?: Subject;
  allSubjects: Subject[];
  darkMode?: boolean;
}

export const SearchGroundingView: React.FC<SearchGroundingViewProps> = ({
  currentSubject,
  allSubjects,
  darkMode,
}) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject>(
    currentSubject || allSubjects.find((s) => s.code === '0580') || allSubjects[0]
  );
  const [query, setQuery] = useState('2026 syllabus updates and grade thresholds');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    sources: { title: string; uri: string }[];
  } | null>(null);

  const handleSearch = async (customQuery?: string) => {
    const q = customQuery || query;
    if (!q.trim() || isLoading) return;
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/search-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: q,
          subject: selectedSubject.name + (selectedSubject.code ? ` (${selectedSubject.code})` : ''),
        }),
      });

      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Search failed');
      setResult({
        answer: data.answer || 'No results found.',
        sources: data.sources || [],
      });
    } catch (err: any) {
      console.error(err);
      setResult({ answer: `Couldn't complete the search: ${err.message}. Syllabus search needs a configured Gemini API key.`, sources: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b goodness-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200/60 dark:border-sky-800/40 text-sky-700 dark:text-sky-300 text-xs font-semibold mb-2">
          <Globe className="w-3.5 h-3.5" />
          <span>Real-time Google Search Grounding (gemini-3.8-flash)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Cambridge Syllabus & Spec Grounding
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
          Verify recent examiner reports, grade thresholds, official textbook requirements, and real-world case studies.
        </p>
      </div>

      {/* Query Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-1">
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Select Subject:
            </label>
            <select
              value={selectedSubject.id}
              onChange={(e) => {
                const s = allSubjects.find((x) => x.id === e.target.value);
                if (s) setSelectedSubject(s);
              }}
              className="w-full px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-medium text-slate-900 dark:text-white"
            >
              {allSubjects.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} {s.code ? `(${s.code})` : ''}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2">
            <label className="text-xs font-semibold text-slate-400 block mb-1">
              Search Query or Syllabus Clarification:
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleSearch();
                }}
                placeholder="e.g. 2026 specimen paper changes, grade boundaries..."
                className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
              />
              <button
                onClick={() => handleSearch()}
                disabled={isLoading || !query.trim()}
                className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span>Ground</span>
              </button>
            </div>
          </div>
        </div>

        {/* Quick Grounding Prompts */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 mr-1 font-semibold">Suggested:</span>
          {[
            'Paper 2 vs Paper 4 weighting and timing',
            'Latest 2024-2025 grade thresholds for A* grade',
            'Formula sheet rules allowed in exam hall',
            'Command words definitions (State vs Explain vs Discuss)',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setQuery(prompt);
                handleSearch(prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-sky-50 dark:hover:bg-sky-950/40 hover:text-sky-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Grounded Response */}
      {result && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b goodness-border">
            <div className="flex items-center gap-2">
              <FileCheck2 className="w-4 h-4 text-sky-500" />
              <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                Grounded Cambridge Findings
              </h4>
            </div>
            <span className="text-[11px] font-mono text-slate-400">
              Verified with Google Search
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {result.answer}
          </div>

          {/* Web Sources & Citations */}
          {result.sources.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Referenced Official Web Sources:
              </span>
              <div className="flex flex-wrap gap-2">
                {result.sources.map((s, i) => (
                  <a
                    key={i}
                    href={s.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-sky-600 dark:text-sky-400 hover:underline max-w-sm truncate"
                  >
                    <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                    <span className="truncate">{s.title}</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
