import React, { useCallback, useEffect, useState } from 'react';
import { GraduationCap, Users, Plus, Trash2, Copy, Check, FileText, Link2, Paperclip, LogOut, Loader2, Sparkles, Download, School, KeyRound } from 'lucide-react';
import { api } from '../utils/api';
import { MarkdownText } from './MarkdownText';

interface Material {
  id: string; title: string; description: string; kind: 'notes' | 'link' | 'file';
  content?: string; url?: string; fileName?: string; sizeBytes?: number; createdAt: string;
}
interface TeacherClass { id: string; code: string; name: string; subject: string; materials: Material[] }
interface Teacher { id: string; name: string; email: string; organization: string }
interface JoinedClass { class: { name: string; subject: string; code: string; teacherName: string; organization: string }; materials: Material[] }

interface Props {
  onMakeStudyPack: (text: string, title: string, subject: string) => void;
  onAddPoints?: (n: number, reason: string) => void;
  darkMode?: boolean;
}

const TOKEN_KEY = 'studybuddy_teacher_token';
const CODES_KEY = 'studybuddy_class_codes';
const MAX_FILE = 8 * 1024 * 1024;

const input = 'w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-teal-500/30';
const card = 'p-6 rounded-3xl bg-white dark:bg-slate-900/80 border border-slate-200/90 dark:border-slate-800 shadow-xs';
const btn = 'px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50 flex items-center justify-center gap-2';

const read = (k: string) => { try { return localStorage.getItem(k); } catch { return null; } };
const write = (k: string, v: string | null) => { try { v === null ? localStorage.removeItem(k) : localStorage.setItem(k, v); } catch { /* storage blocked */ } };

function CopyCode({ code }: { code: string }) {
  const [done, setDone] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard?.writeText(code).then(() => { setDone(true); setTimeout(() => setDone(false), 1500); }).catch(() => {}); }}
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-mono font-bold text-sm border border-teal-200/60 dark:border-teal-800/40" title="Copy class code">
      {code} {done ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
    </button>
  );
}

function MaterialRow({ m, code, onStudyPack, onDelete }: { m: Material; code: string; onStudyPack?: (m: Material) => void; onDelete?: () => void }) {
  const [open, setOpen] = useState(false);
  const Icon = m.kind === 'notes' ? FileText : m.kind === 'link' ? Link2 : Paperclip;
  return (
    <div className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40">
      <div className="flex items-start gap-3">
        <Icon className="w-4 h-4 mt-1 text-teal-600 dark:text-teal-400 shrink-0" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-sm text-slate-900 dark:text-white break-words">{m.title}</div>
          {m.description && <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{m.description}</div>}
          <div className="text-[11px] text-slate-400 mt-1">{new Date(m.createdAt).toLocaleDateString()}{m.fileName ? ` · ${m.fileName} (${Math.round((m.sizeBytes || 0) / 1024)} KB)` : ''}</div>
          <div className="flex flex-wrap items-center gap-2 mt-2">
            {m.kind === 'notes' && <>
              <button onClick={() => setOpen(!open)} className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">{open ? 'Hide notes' : 'Read notes'}</button>
              {onStudyPack && <button onClick={() => onStudyPack(m)} className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline inline-flex items-center gap-1"><Sparkles className="w-3 h-3" />Make flashcards & quiz</button>}
            </>}
            {m.kind === 'link' && <a href={m.url} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline">Open link</a>}
            {m.kind === 'file' && <a href={`/api/materials/${m.id}/file?code=${encodeURIComponent(code)}`} target="_blank" rel="noopener noreferrer" className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline inline-flex items-center gap-1"><Download className="w-3 h-3" />Open / download</a>}
          </div>
        </div>
        {onDelete && <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-rose-500" title="Delete"><Trash2 className="w-4 h-4" /></button>}
      </div>
      {open && m.content && <MarkdownText text={m.content} className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 text-sm text-slate-800 dark:text-slate-200" />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Student: join with class code
// ---------------------------------------------------------------------------
function StudentView({ onMakeStudyPack }: Pick<Props, 'onMakeStudyPack'>) {
  const [code, setCode] = useState('');
  const [joined, setJoined] = useState<JoinedClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async (c: string) => api<JoinedClass>(`/api/classes/${encodeURIComponent(c)}/materials`), []);

  useEffect(() => {
    const saved: string[] = (() => { try { return JSON.parse(read(CODES_KEY) || '[]'); } catch { return []; } })();
    Promise.all(saved.map((c) => load(c).catch(() => null))).then((r) => setJoined(r.filter(Boolean) as JoinedClass[]));
  }, [load]);

  const join = async () => {
    const c = code.trim().toUpperCase();
    if (!c) return;
    setLoading(true); setError(null);
    try {
      const data = await load(c);
      setJoined((p) => [data, ...p.filter((x) => x.class.code !== data.class.code)]);
      const saved: string[] = JSON.parse(read(CODES_KEY) || '[]');
      write(CODES_KEY, JSON.stringify([data.class.code, ...saved.filter((x) => x !== data.class.code)]));
      setCode('');
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  const leave = (c: string) => {
    setJoined((p) => p.filter((x) => x.class.code !== c));
    const saved: string[] = JSON.parse(read(CODES_KEY) || '[]');
    write(CODES_KEY, JSON.stringify(saved.filter((x) => x !== c)));
  };

  return (
    <div className="space-y-5">
      <div className={card}>
        <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><KeyRound className="w-4 h-4 text-teal-500" />Join your teacher's class</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-3">Enter the 6-character class code your teacher gave you to see their notes, links and files. No account needed.</p>
        <div className="flex gap-2">
          <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} onKeyDown={(e) => e.key === 'Enter' && join()} maxLength={8} placeholder="e.g. K7M2QX" className={`${input} font-mono tracking-widest uppercase`} />
          <button onClick={join} disabled={loading || !code.trim()} className={`${btn} bg-teal-600 text-white hover:bg-teal-500 shrink-0`}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Join'}</button>
        </div>
        {error && <p className="mt-2 text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      </div>

      {joined.length === 0 && <p className="text-sm text-slate-500 dark:text-slate-400 text-center py-6">You haven't joined a class yet.</p>}
      {joined.map((j) => (
        <div key={j.class.code} className={card}>
          <div className="flex items-start justify-between gap-3 mb-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{j.class.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{[j.class.subject, j.class.teacherName && `${j.class.teacherName}`, j.class.organization].filter(Boolean).join(' · ')}</p>
            </div>
            <button onClick={() => leave(j.class.code)} className="text-xs text-slate-400 hover:text-rose-500">Leave</button>
          </div>
          <div className="space-y-2.5">
            {j.materials.length === 0 && <p className="text-xs text-slate-500">Your teacher hasn't uploaded anything yet.</p>}
            {j.materials.map((m) => <MaterialRow key={m.id} m={m} code={j.class.code} onStudyPack={(mm) => onMakeStudyPack(mm.content || '', mm.title, j.class.subject)} />)}
          </div>
        </div>
      ))}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Teacher portal
// ---------------------------------------------------------------------------
function TeacherAuth({ onAuthed }: { onAuthed: (token: string, t: Teacher) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [f, setF] = useState({ name: '', email: '', password: '', organization: '' });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const submit = async () => {
    setLoading(true); setError(null);
    try {
      const r = await api<{ token: string; teacher: Teacher }>(`/api/teacher/${mode}`, { body: f });
      onAuthed(r.token, r.teacher);
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });
  return (
    <div className={`${card} max-w-md mx-auto space-y-3`}>
      <div className="flex items-center gap-2 text-slate-900 dark:text-white font-bold"><School className="w-5 h-5 text-teal-500" />Teacher account for schools & organizations</div>
      <p className="text-xs text-slate-500 dark:text-slate-400">Create classes, upload notes, links and files, and share one code with your students.</p>
      {mode === 'register' && <>
        <input className={input} placeholder="Your name" value={f.name} onChange={set('name')} autoComplete="name" />
        <input className={input} placeholder="School or organization" value={f.organization} onChange={set('organization')} autoComplete="organization" />
      </>}
      <input className={input} type="email" placeholder="Work email" value={f.email} onChange={set('email')} autoComplete="email" />
      <input className={input} type="password" placeholder={mode === 'register' ? 'Password (8+ characters)' : 'Password'} value={f.password} onChange={set('password')} onKeyDown={(e) => e.key === 'Enter' && submit()} autoComplete={mode === 'register' ? 'new-password' : 'current-password'} />
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      <button onClick={submit} disabled={loading} className={`${btn} w-full bg-slate-900 text-white dark:bg-white dark:text-slate-950`}>{loading && <Loader2 className="w-4 h-4 animate-spin" />}{mode === 'login' ? 'Sign in' : 'Create teacher account'}</button>
      <button onClick={() => { setMode(mode === 'login' ? 'register' : 'login'); setError(null); }} className="text-xs text-teal-600 dark:text-teal-400 hover:underline w-full text-center">
        {mode === 'login' ? 'New teacher? Create an account' : 'Already have an account? Sign in'}
      </button>
    </div>
  );
}

function UploadForm({ classId, token, onDone }: { classId: string; token: string; onDone: () => void }) {
  const [kind, setKind] = useState<'notes' | 'link' | 'file'>('notes');
  const [title, setTitle] = useState(''); const [description, setDescription] = useState('');
  const [content, setContent] = useState(''); const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null); const [loading, setLoading] = useState(false);

  const submit = async () => {
    setError(null);
    setLoading(true);
    try {
      const body: any = { title, description, kind };
      if (kind === 'notes') body.content = content;
      if (kind === 'link') body.url = url;
      if (kind === 'file') {
        if (!file) throw new Error('Choose a file to upload.');
        if (file.size > MAX_FILE) throw new Error('File is too large (max 8 MB).');
        body.fileName = file.name;
        body.fileBase64 = await new Promise<string>((res, rej) => {
          const r = new FileReader();
          r.onload = () => res(String(r.result).split(',')[1] || '');
          r.onerror = () => rej(new Error('Could not read that file.'));
          r.readAsDataURL(file);
        });
      }
      await api(`/api/teacher/classes/${classId}/materials`, { body, token });
      setTitle(''); setDescription(''); setContent(''); setUrl(''); setFile(null);
      onDone();
    } catch (e: any) { setError(e.message); } finally { setLoading(false); }
  };

  return (
    <div className="mt-4 p-4 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700 space-y-2.5">
      <div className="flex gap-1.5 text-xs">
        {([['notes', 'Notes', FileText], ['link', 'Link', Link2], ['file', 'File', Paperclip]] as const).map(([k, label, I]) => (
          <button key={k} onClick={() => setKind(k)} className={`px-3 py-1.5 rounded-lg font-semibold flex items-center gap-1.5 ${kind === k ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-950' : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'}`}><I className="w-3.5 h-3.5" />{label}</button>
        ))}
      </div>
      <input className={input} placeholder="Title (e.g. Chapter 4: Forces)" value={title} onChange={(e) => setTitle(e.target.value)} />
      <input className={input} placeholder="Short description (optional)" value={description} onChange={(e) => setDescription(e.target.value)} />
      {kind === 'notes' && <textarea className={`${input} min-h-[140px]`} placeholder="Paste or type your notes (Markdown supported: # headings, - bullets, **bold**)" value={content} onChange={(e) => setContent(e.target.value)} />}
      {kind === 'link' && <input className={input} placeholder="https://…" value={url} onChange={(e) => setUrl(e.target.value)} />}
      {kind === 'file' && <input type="file" accept=".pdf,.png,.jpg,.jpeg,.gif,.txt,.md,.csv,.doc,.docx,.ppt,.pptx,.xls,.xlsx" onChange={(e) => setFile(e.target.files?.[0] || null)} className="text-xs text-slate-600 dark:text-slate-300" />}
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}
      <button onClick={submit} disabled={loading} className={`${btn} bg-teal-600 text-white hover:bg-teal-500`}>{loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}Upload for students</button>
    </div>
  );
}

function TeacherDashboard({ token, onSignOut }: { token: string; onSignOut: () => void }) {
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [classes, setClasses] = useState<TeacherClass[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [newName, setNewName] = useState(''); const [newSubject, setNewSubject] = useState('');
  const [openClass, setOpenClass] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await api<{ teacher: Teacher; classes: TeacherClass[] }>('/api/teacher/me', { token });
      setTeacher(r.teacher); setClasses(r.classes); setError(null);
    } catch (e: any) {
      if (/sign in|expired|invalid|not found/i.test(e.message)) onSignOut(); else setError(e.message);
    }
  }, [token, onSignOut]);
  useEffect(() => { refresh(); }, [refresh]);

  const createClass = async () => {
    try {
      const r = await api<{ class: TeacherClass }>('/api/teacher/classes', { body: { name: newName, subject: newSubject }, token });
      setNewName(''); setNewSubject(''); setOpenClass(r.class.id); await refresh();
    } catch (e: any) { setError(e.message); }
  };
  const del = async (path: string, confirmMsg: string) => {
    if (!window.confirm(confirmMsg)) return;
    try { await api(path, { method: 'DELETE', token }); await refresh(); } catch (e: any) { setError(e.message); }
  };

  if (!teacher) return <div className="py-10 flex justify-center">{error ? <p className="text-sm text-rose-600">{error}</p> : <Loader2 className="w-5 h-5 animate-spin text-teal-500" />}</div>;
  return (
    <div className="space-y-5">
      <div className={`${card} flex items-center justify-between gap-3`}>
        <div>
          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2"><GraduationCap className="w-5 h-5 text-teal-500" />{teacher.name}</div>
          <div className="text-xs text-slate-500 dark:text-slate-400">{teacher.organization} · {teacher.email}</div>
        </div>
        <button onClick={onSignOut} className="text-xs font-semibold text-slate-500 hover:text-rose-500 flex items-center gap-1"><LogOut className="w-3.5 h-3.5" />Sign out</button>
      </div>
      {error && <p className="text-xs text-rose-600 dark:text-rose-400">{error}</p>}

      <div className={`${card} space-y-2.5`}>
        <h3 className="font-bold text-slate-900 dark:text-white text-sm">Create a class</h3>
        <div className="grid sm:grid-cols-[1fr_1fr_auto] gap-2">
          <input className={input} placeholder="Class name (e.g. Year 10 Physics)" value={newName} onChange={(e) => setNewName(e.target.value)} />
          <input className={input} placeholder="Subject (optional)" value={newSubject} onChange={(e) => setNewSubject(e.target.value)} />
          <button onClick={createClass} disabled={newName.trim().length < 2} className={`${btn} bg-slate-900 text-white dark:bg-white dark:text-slate-950`}><Plus className="w-4 h-4" />Create</button>
        </div>
      </div>

      {classes.length === 0 && <p className="text-sm text-slate-500 text-center py-4">No classes yet. Create one to get a code for your students.</p>}
      {classes.map((c) => (
        <div key={c.id} className={card}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h4 className="font-bold text-slate-900 dark:text-white">{c.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">{c.subject || 'No subject'} · {c.materials.length} item{c.materials.length === 1 ? '' : 's'}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">Student code:</span><CopyCode code={c.code} />
              <button onClick={() => del(`/api/teacher/classes/${c.id}`, `Delete "${c.name}" and all its materials?`)} className="p-1.5 text-slate-400 hover:text-rose-500" title="Delete class"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
          <div className="space-y-2.5 mt-4">
            {c.materials.map((m) => <MaterialRow key={m.id} m={m} code={c.code} onDelete={() => del(`/api/teacher/materials/${m.id}`, `Delete "${m.title}"?`)} />)}
          </div>
          {openClass === c.id
            ? <UploadForm classId={c.id} token={token} onDone={refresh} />
            : <button onClick={() => setOpenClass(c.id)} className={`${btn} mt-4 bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200/60 dark:border-teal-800/40`}><Plus className="w-4 h-4" />Add material</button>}
        </div>
      ))}
    </div>
  );
}

export const ClassesHub: React.FC<Props> = ({ onMakeStudyPack }) => {
  const [view, setView] = useState<'student' | 'teacher'>('student');
  const [token, setToken] = useState<string | null>(() => read(TOKEN_KEY));
  const signOut = useCallback(() => { write(TOKEN_KEY, null); setToken(null); }, []);

  return (
    <div className="space-y-6 animate-fade-in max-w-3xl mx-auto">
      <div className="pb-4 border-b goodness-border">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-50 dark:bg-teal-950/60 border border-teal-200/60 dark:border-teal-800/40 text-teal-700 dark:text-teal-300 text-xs font-semibold mb-2"><Users className="w-3.5 h-3.5" />Classes & Teachers</div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">Class materials from your teacher</h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 font-serif italic mt-1">Teachers upload; students join with a code.</p>
      </div>
      <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl w-fit">
        {(['student', 'teacher'] as const).map((v) => (
          <button key={v} onClick={() => setView(v)} className={`px-4 py-1.5 text-xs rounded-lg font-semibold ${view === v ? 'bg-white dark:bg-slate-900 text-teal-600 dark:text-teal-400 shadow-xs' : 'text-slate-500'}`}>{v === 'student' ? "I'm a student" : "I'm a teacher"}</button>
        ))}
      </div>
      {view === 'student' ? <StudentView onMakeStudyPack={onMakeStudyPack} />
        : token ? <TeacherDashboard token={token} onSignOut={signOut} />
        : <TeacherAuth onAuthed={(t) => { write(TOKEN_KEY, t); setToken(t); }} />}
    </div>
  );
};
