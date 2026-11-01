import { TeacherStore, HttpError, makeLimiter } from './teacherStore';

/** Registers /api/teacher/* and /api/classes/* routes. `app` is an Express app. */
export function registerTeacherRoutes(app: any, store: TeacherStore = new TeacherStore()) {
  const authLimit = makeLimiter(10, 15 * 60 * 1000);
  const codeLimit = makeLimiter(60, 15 * 60 * 1000);

  const wrap = (fn: (req: any, res: any) => any) => (req: any, res: any) => {
    try {
      const out = fn(req, res);
      if (out !== undefined) res.json(out);
    } catch (e: any) {
      if (e instanceof HttpError) return res.status(e.status).json({ error: e.message });
      console.error('[teacher api]', e);
      res.status(500).json({ error: 'Something went wrong. Please try again.' });
    }
  };
  const teacherOf = (req: any) => store.verifyToken((req.headers.authorization || '').replace(/^Bearer\s+/i, ''));

  app.post('/api/teacher/register', wrap((req) => { authLimit(`${req.ip}`); return store.registerTeacher(req.body || {}); }));
  app.post('/api/teacher/login', wrap((req) => { authLimit(`${req.ip}:${(req.body?.email || '').toLowerCase()}`); return store.loginTeacher(req.body?.email, req.body?.password); }));
  app.get('/api/teacher/me', wrap((req) => {
    const t = teacherOf(req);
    return { teacher: store.publicTeacher(t), classes: store.listClasses(t.id) };
  }));
  app.post('/api/teacher/classes', wrap((req) => ({ class: store.createClass(teacherOf(req).id, req.body || {}) })));
  app.delete('/api/teacher/classes/:id', wrap((req) => { store.deleteClass(teacherOf(req).id, req.params.id); return { success: true }; }));
  app.post('/api/teacher/classes/:id/materials', wrap((req) => ({ material: store.addMaterial(teacherOf(req).id, req.params.id, req.body || {}) })));
  app.delete('/api/teacher/materials/:id', wrap((req) => { store.deleteMaterial(teacherOf(req).id, req.params.id); return { success: true }; }));

  // Student side: access by class code (no account needed)
  app.get('/api/classes/:code/materials', wrap((req) => { codeLimit(req.ip); return store.materialsByCode(req.params.code); }));
  app.get('/api/materials/:id/file', wrap((req, res) => {
    let teacherId: string | undefined;
    if (req.headers.authorization) { try { teacherId = teacherOf(req).id; } catch { /* fall back to code */ } }
    const f = store.getFile(req.params.id, String(req.query.code || ''), teacherId);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('Content-Type', f.mime);
    res.setHeader('Content-Disposition', `${f.inline ? 'inline' : 'attachment'}; filename="${f.name.replace(/"/g, '')}"`);
    res.sendFile(f.path);
    return undefined;
  }));
}
