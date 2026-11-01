import React, { useState } from 'react';
import {
  MapPin,
  Search,
  ExternalLink,
  Navigation,
  Loader2,
  Building2,
  BookOpen,
} from 'lucide-react';

interface MapsGroundingViewProps {
  darkMode?: boolean;
}

export const MapsGroundingView: React.FC<MapsGroundingViewProps> = ({ darkMode }) => {
  const [locationQuery, setLocationQuery] = useState('quiet public libraries and study spaces near London');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<{
    answer: string;
    mapPlaces: { title: string; uri: string }[];
  } | null>(null);

  const handleSearchMaps = async (customQ?: string) => {
    const q = customQ || locationQuery;
    if (!q.trim() || isLoading) return;
    setIsLoading(true);

    try {
      // Use the student's location when they allow it (the server supports lat/lng)
      const coords = await new Promise<{ latitude: number; longitude: number } | null>((resolve) => {
        if (!navigator.geolocation) return resolve(null);
        navigator.geolocation.getCurrentPosition(
          (p) => resolve({ latitude: p.coords.latitude, longitude: p.coords.longitude }),
          () => resolve(null),
          { timeout: 4000, maximumAge: 600000 }
        );
      });
      const res = await fetch('/api/gemini/maps-grounding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q, ...(coords || {}) }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.success) throw new Error(data.error || 'Search failed');
      setResult({
        answer: data.answer || 'No results found.',
        mapPlaces: data.mapPlaces || [],
      });
    } catch (err: any) {
      console.error(err);
      setResult({ answer: `Couldn't complete the search: ${err.message}. AI search needs a configured Gemini API key.`, mapPlaces: [] });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl mx-auto">
      {/* Header */}
      <div className="pb-6 border-b goodness-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200/60 dark:border-emerald-800/40 text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-2">
          <MapPin className="w-3.5 h-3.5" />
          <span>Real-time Google Maps Grounding (gemini-3.8-flash)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Study Spaces & Exam Centres
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">
          Locate verified British Council examination test centres, quiet academic libraries, and collaborative revision hubs.
        </p>
      </div>

      {/* Query Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-4">
        <div>
          <label className="text-xs font-semibold text-slate-400 block mb-1">
            Search Exam Centres, Libraries, or City:
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchMaps();
              }}
              placeholder="e.g. British Council Cambridge exam centres, quiet libraries..."
              className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs sm:text-sm text-slate-900 dark:text-white"
            />
            <button
              onClick={() => handleSearchMaps()}
              disabled={isLoading || !locationQuery.trim()}
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm flex items-center gap-2 shadow-sm disabled:opacity-50"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Navigation className="w-4 h-4" />}
              <span>Find Places</span>
            </button>
          </div>
        </div>

        {/* Quick Suggestions */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 text-xs">
          <span className="text-slate-400 mr-1 font-semibold">Popular Searches:</span>
          {[
            'British Council examination centres',
            'Quiet public study libraries with WiFi',
            'University open revision spaces',
            'Quiet study cafes near me',
          ].map((prompt, i) => (
            <button
              key={i}
              onClick={() => {
                setLocationQuery(prompt);
                handleSearchMaps(prompt);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 hover:text-emerald-600 transition-colors"
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>

      {/* Results */}
      {result && (
        <div className="p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs space-y-5 animate-fade-in">
          <div className="flex items-center justify-between pb-3 border-b goodness-border">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-500" />
              <span>Recommended Study Locations</span>
            </h4>
            <span className="text-[11px] font-mono text-slate-400">
              Grounded with Google Maps
            </span>
          </div>

          <div className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-wrap font-sans">
            {result.answer}
          </div>

          {/* Place Links */}
          {result.mapPlaces.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                Open in Google Maps:
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {result.mapPlaces.map((place, i) => (
                  <a
                    key={i}
                    href={place.uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-800 dark:text-slate-200 hover:border-emerald-500 transition-colors group"
                  >
                    <span className="font-semibold truncate mr-2">{place.title}</span>
                    <ExternalLink className="w-3.5 h-3.5 text-emerald-600 group-hover:scale-110 shrink-0 transition-transform" />
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
