/**
 * Teacher / class / material storage. Node built-ins only.
 * Data lives in DATA_DIR (default ./data): store.json + uploads/.
 * NOTE: on ephemeral hosts (e.g. Cloud Run) mount a persistent volume at DATA_DIR.
 */
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface Teacher { id: string; name: string; email: string; organization: string; passwordHash: string; createdAt: string }
export interface ClassRoom { id: string; teacherId: string; code: string; name: string; subject: string; createdAt: string }
export type MaterialKind = 'notes' | 'link' | 'file';
export interface Material {
  id: string; classId: string; title: string; description: string; kind: MaterialKind;
  content?: string; url?: string; fileName?: string; mimeType?: string; sizeBytes?: number; createdAt: string;
}
interface StoreShape { secret: string; teachers: Teacher[]; classes: ClassRoom[]; materials: Material[] }

export class HttpError extends Error {
  constructor(public status: number, message: string) { super(message); }
}

const MAX_FILE_BYTES = 8 * 1024 * 1024;
const MAX_NOTES_CHARS = 100_000;
const FILE_TYPES: Record<string, string> = {
  pdf: 'application/pdf', png: 'image/png', jpg: 'image/jpeg', jpeg: 'image/jpeg', gif: 'image/gif',
  txt: 'text/plain', md: 'text/markdown', csv: 'text/csv',
  doc: 'application/msword', docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ppt: 'application/vnd.ms-powerpoint', pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  xls: 'application/vnd.ms-excel', xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
};
const INLINE_OK = new Set(['application/pdf', 'image/png', 'image/jpeg', 'image/gif', 'text/plain']);
const CODE_CHARS = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';

export class TeacherStore {
  private dir: string;
  private file: string;
  private uploads: string;
  private data: StoreShape;

  constructor(dir = process.env.DATA_DIR || path.join(process.cwd(), 'data')) {
    this.dir = dir;
    this.file = path.join(dir, 'store.json');
    this.uploads = path.join(dir, 'uploads');
    fs.mkdirSync(this.uploads, { recursive: true });
    this.data = fs.existsSync(this.file)
      ? JSON.parse(fs.readFileSync(this.file, 'utf8'))
      : { secret: crypto.randomBytes(32).toString('hex'), teachers: [], classes: [], materials: [] };
    if (!this.data.secret) this.data.secret = crypto.randomBytes(32).toString('hex');
    this.save();
  }

  private save() {
    const tmp = this.file + '.tmp';
    fs.writeFileSync(tmp, JSON.stringify(this.data, null, 2));
    fs.renameSync(tmp, this.file);
  }

  // ---- auth ----
  private hash(password: string): string {
    const salt = crypto.randomBytes(16);
    return `${salt.toString('hex')}:${crypto.scryptSync(password, salt, 64).toString('hex')}`;
  }
  private verifyPassword(password: string, stored: string): boolean {
    const [saltHex, hashHex] = stored.split(':');
    const expected = Buffer.from(hashHex, 'hex');
    const actual = crypto.scryptSync(password, Buffer.from(saltHex, 'hex'), expected.length);
    return crypto.timingSafeEqual(expected, actual);
  }
  issueToken(teacherId: string, ttlMs = 7 * 24 * 3600 * 1000): string {
    const payload = Buffer.from(JSON.stringify({ t: teacherId, e: Date.now() + ttlMs })).toString('base64url');
    const sig = crypto.createHmac('sha256', this.data.secret).update(payload).digest('base64url');
    return `${payload}.${sig}`;
  }
  verifyToken(token: string | undefined): Teacher {
    if (!token) throw new HttpError(401, 'Please sign in as a teacher.');
    const [payload, sig] = token.split('.');
    const expect = crypto.createHmac('sha256', this.data.secret).update(payload || '').digest('base64url');
    const a = Buffer.from(sig || ''); const b = Buffer.from(expect);
    if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) throw new HttpError(401, 'Session invalid. Please sign in again.');
    const { t, e } = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (Date.now() > e) throw new HttpError(401, 'Session expired. Please sign in again.');
    const teacher = this.data.teachers.find((x) => x.id === t);
    if (!teacher) throw new HttpError(401, 'Account not found.');
    return teacher;
  }

  publicTeacher(t: Teacher) { return { id: t.id, name: t.name, email: t.email, organization: t.organization }; }

  registerTeacher(i: { name?: string; email?: string; password?: string; organization?: string }) {
    const name = (i.name || '').trim(); const email = (i.email || '').trim().toLowerCase();
    const organization = (i.organization || '').trim(); const password = i.password || '';
    if (name.length < 2) throw new HttpError(400, 'Please enter your name.');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) throw new HttpError(400, 'Please enter a valid email address.');
    if (organization.length < 2) throw new HttpError(400, 'Please enter your school or organization.');
    if (password.length < 8) throw new HttpError(400, 'Password must be at least 8 characters.');
    if (this.data.teachers.some((t) => t.email === email)) throw new HttpError(409, 'An account with this email already exists.');
    const teacher: Teacher = { id: crypto.randomUUID(), name, email, organization, passwordHash: this.hash(password), createdAt: new Date().toISOString() };
    this.data.teachers.push(teacher); this.save();
    return { token: this.issueToken(teacher.id), teacher: this.publicTeacher(teacher) };
  }

  loginTeacher(emailIn?: string, password?: string) {
    const email = (emailIn || '').trim().toLowerCase();
    const teacher = this.data.teachers.find((t) => t.email === email);
    // run a hash either way to keep timing similar
    const ok = teacher ? this.verifyPassword(password || '', teacher.passwordHash) : (this.verifyPassword(password || '', this.hash('x')), false);
    if (!teacher || !ok) throw new HttpError(401, 'Incorrect email or password.');
    return { token: this.issueToken(teacher.id), teacher: this.publicTeacher(teacher) };
  }

  // ---- classes ----
  private newCode(): string {
    for (;;) {
      const code = Array.from(crypto.randomBytes(6), (b) => CODE_CHARS[b % CODE_CHARS.length]).join('');
      if (!this.data.classes.some((c) => c.code === code)) return code;
    }
  }
  createClass(teacherId: string, i: { name?: string; subject?: string }): ClassRoom {
    const name = (i.name || '').trim();
    if (name.length < 2) throw new HttpError(400, 'Please enter a class name.');
    const c: ClassRoom = { id: crypto.randomUUID(), teacherId, code: this.newCode(), name: name.slice(0, 80), subject: (i.subject || '').trim().slice(0, 80), createdAt: new Date().toISOString() };
    this.data.classes.push(c); this.save(); return c;
  }
  listClasses(teacherId: string) {
    return this.data.classes.filter((c) => c.teacherId === teacherId).map((c) => ({
      ...c, materials: this.data.materials.filter((m) => m.classId === c.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    }));
  }
  deleteClass(teacherId: string, classId: string) {
    const c = this.ownedClass(teacherId, classId);
    this.data.materials.filter((m) => m.classId === c.id).forEach((m) => this.removeFile(m));
    this.data.materials = this.data.materials.filter((m) => m.classId !== c.id);
    this.data.classes = this.data.classes.filter((x) => x.id !== c.id); this.save();
  }
  private ownedClass(teacherId: string, classId: string): ClassRoom {
    const c = this.data.classes.find((x) => x.id === classId && x.teacherId === teacherId);
    if (!c) throw new HttpError(404, 'Class not found.');
    return c;
  }

  // ---- materials ----
  addMaterial(teacherId: string, classId: string, i: {
    title?: string; description?: string; kind?: string; content?: string; url?: string; fileName?: string; fileBase64?: string;
  }): Material {
    const c = this.ownedClass(teacherId, classId);
    const title = (i.title || '').trim();
    if (title.length < 2) throw new HttpError(400, 'Please enter a title.');
    const m: Material = { id: crypto.randomUUID(), classId: c.id, title: title.slice(0, 120), description: (i.description || '').trim().slice(0, 500), kind: 'notes', createdAt: new Date().toISOString() };
    if (i.kind === 'notes') {
      const content = (i.content || '').trim();
      if (content.length < 10) throw new HttpError(400, 'Notes are too short.');
      if (content.length > MAX_NOTES_CHARS) throw new HttpError(400, 'Notes are too long (max 100,000 characters).');
      m.kind = 'notes'; m.content = content;
    } else if (i.kind === 'link') {
      let u: URL;
      try { u = new URL((i.url || '').trim()); } catch { throw new HttpError(400, 'Please enter a valid link.'); }
      if (!['http:', 'https:'].includes(u.protocol)) throw new HttpError(400, 'Links must start with http:// or https://');
      m.kind = 'link'; m.url = u.toString();
    } else if (i.kind === 'file') {
      const ext = path.extname(i.fileName || '').slice(1).toLowerCase();
      if (!FILE_TYPES[ext]) throw new HttpError(400, `Unsupported file type. Allowed: ${Object.keys(FILE_TYPES).join(', ')}.`);
      if (!i.fileBase64) throw new HttpError(400, 'No file received.');
      const buf = Buffer.from(i.fileBase64.replace(/^data:[^,]*,/, ''), 'base64');
      if (buf.length === 0) throw new HttpError(400, 'The file is empty.');
      if (buf.length > MAX_FILE_BYTES) throw new HttpError(413, 'File is too large (max 8 MB).');
      fs.writeFileSync(path.join(this.uploads, `${m.id}.${ext}`), buf);
      m.kind = 'file'; m.fileName = path.basename(i.fileName!).replace(/[^\w.\- ]/g, '_').slice(0, 120); m.mimeType = FILE_TYPES[ext]; m.sizeBytes = buf.length;
    } else throw new HttpError(400, 'Unknown material type.');
    this.data.materials.push(m); this.save(); return m;
  }
  private removeFile(m: Material) {
    if (m.kind !== 'file' || !m.fileName) return;
    const ext = path.extname(m.fileName).slice(1).toLowerCase();
    try { fs.unlinkSync(path.join(this.uploads, `${m.id}.${ext}`)); } catch { /* already gone */ }
  }
  deleteMaterial(teacherId: string, materialId: string) {
    const m = this.data.materials.find((x) => x.id === materialId);
    if (!m) throw new HttpError(404, 'Material not found.');
    this.ownedClass(teacherId, m.classId);
    this.removeFile(m);
    this.data.materials = this.data.materials.filter((x) => x.id !== m.id); this.save();
  }

  // ---- student access (by class code) ----
  materialsByCode(codeIn: string) {
    const code = (codeIn || '').trim().toUpperCase();
    const c = this.data.classes.find((x) => x.code === code);
    if (!c) throw new HttpError(404, 'No class found with that code. Check it with your teacher.');
    const t = this.data.teachers.find((x) => x.id === c.teacherId);
    return {
      class: { name: c.name, subject: c.subject, code: c.code, teacherName: t?.name || '', organization: t?.organization || '' },
      materials: this.data.materials.filter((m) => m.classId === c.id).sort((a, b) => b.createdAt.localeCompare(a.createdAt)),
    };
  }
  /** Teachers pass their own id to skip the code check. */
  getFile(materialId: string, code?: string, teacherId?: string) {
    const m = this.data.materials.find((x) => x.id === materialId && x.kind === 'file');
    if (!m || !m.fileName) throw new HttpError(404, 'File not found.');
    const c = this.data.classes.find((x) => x.id === m.classId)!;
    const allowed = (teacherId && c.teacherId === teacherId) || (code && code.trim().toUpperCase() === c.code);
    if (!allowed) throw new HttpError(403, 'You do not have access to this file.');
    const ext = path.extname(m.fileName).slice(1).toLowerCase();
    return { path: path.join(this.uploads, `${m.id}.${ext}`), name: m.fileName, mime: m.mimeType || 'application/octet-stream', inline: INLINE_OK.has(m.mimeType || '') };
  }
}

/** Tiny in-memory limiter for auth endpoints. */
export function makeLimiter(max: number, windowMs: number) {
  const hits = new Map<string, number[]>();
  return (key: string) => {
    const now = Date.now();
    const arr = (hits.get(key) || []).filter((t) => now - t < windowMs);
    if (arr.length >= max) throw new HttpError(429, 'Too many attempts. Please wait a few minutes and try again.');
    arr.push(now); hits.set(key, arr);
  };
}
