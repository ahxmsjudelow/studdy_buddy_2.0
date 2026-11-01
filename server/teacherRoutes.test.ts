import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TeacherStore } from './teacherStore';
import { registerTeacherRoutes } from './teacherRoutes';

type H = (req: any, res: any) => void;
function fakeApp() {
  const routes: Record<string, H> = {};
  const reg = (m: string) => (p: string, h: H) => { routes[`${m} ${p}`] = h; };
  return { routes, post: reg('POST'), get: reg('GET'), delete: reg('DELETE') };
}
function call(app: any, key: string, req: any = {}) {
  return new Promise<{ status: number; body: any }>((resolve) => {
    const res: any = { statusCode: 200, headers: {}, status(c: number) { this.statusCode = c; return this; }, json(b: any) { resolve({ status: this.statusCode, body: b }); }, setHeader() {}, sendFile() { resolve({ status: 200, body: 'file' }); } };
    app.routes[key]({ ip: '1.1.1.1', headers: {}, body: {}, params: {}, query: {}, ...req }, res);
  });
}

test('teacher HTTP flow end to end', async () => {
  const app = fakeApp();
  registerTeacherRoutes(app, new TeacherStore(fs.mkdtempSync(path.join(os.tmpdir(), 'sb-r-'))));
  const reg = await call(app, 'POST /api/teacher/register', { body: { name: 'Ms Ali', email: 'ali@school.edu', password: 'supersecret', organization: 'Greenfield' } });
  assert.equal(reg.status, 200);
  const auth = { authorization: `Bearer ${reg.body.token}` };
  assert.equal((await call(app, 'GET /api/teacher/me')).status, 401);
  const cls = await call(app, 'POST /api/teacher/classes', { headers: auth, body: { name: '9B Biology', subject: 'Biology' } });
  const code = cls.body.class.code;
  const up = await call(app, 'POST /api/teacher/classes/:id/materials', { headers: auth, params: { id: cls.body.class.id }, body: { title: 'Cells', kind: 'notes', content: 'Cells are the basic unit of life.' } });
  assert.equal(up.status, 200);
  const student = await call(app, 'GET /api/classes/:code/materials', { params: { code } });
  assert.equal(student.body.materials[0].title, 'Cells');
  assert.equal((await call(app, 'GET /api/classes/:code/materials', { params: { code: 'ZZZZZZ' } })).status, 404);
  const me = await call(app, 'GET /api/teacher/me', { headers: auth });
  assert.equal(me.body.classes.length, 1);
  assert.equal((await call(app, 'POST /api/teacher/login', { body: { email: 'ali@school.edu', password: 'bad' } })).status, 401);
});
