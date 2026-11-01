/** Small fetch helper that always yields a readable error message. */
export async function api<T = any>(path: string, opts: { method?: string; body?: unknown; token?: string | null } = {}): Promise<T> {
  let res: Response;
  try {
    res = await fetch(path, {
      method: opts.method || (opts.body ? 'POST' : 'GET'),
      headers: {
        ...(opts.body ? { 'Content-Type': 'application/json' } : {}),
        ...(opts.token ? { Authorization: `Bearer ${opts.token}` } : {}),
      },
      body: opts.body ? JSON.stringify(opts.body) : undefined,
    });
  } catch {
    throw new Error('Cannot reach the Study Buddy server. Check your connection and try again.');
  }
  const text = await res.text();
  let data: any = null;
  try { data = text ? JSON.parse(text) : null; } catch { /* non-JSON (e.g. static host without a backend) */ }
  if (!res.ok || data?.error) {
    throw new Error(data?.error || (res.status === 404 ? 'This feature needs the Study Buddy server (run it with "npm run dev").' : `Request failed (${res.status}).`));
  }
  if (data === null) throw new Error('The server returned an unexpected response.');
  return data as T;
}

/** Plays base64 WAV audio, stopping whatever was playing before. */
let currentAudio: HTMLAudioElement | null = null;
export function stopAudio() { currentAudio?.pause(); currentAudio = null; }
export async function playWavBase64(b64: string, onEnded?: () => void): Promise<HTMLAudioElement> {
  stopAudio();
  const audio = new Audio(`data:audio/wav;base64,${b64}`);
  audio.onended = () => { if (currentAudio === audio) currentAudio = null; onEnded?.(); };
  currentAudio = audio;
  await audio.play();
  return audio;
}
