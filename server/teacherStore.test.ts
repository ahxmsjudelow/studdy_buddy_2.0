import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { TeacherStore, HttpError } from './teacherStore';

const mk = () => new TeacherStore(fs.mkdtempSync(path.join(os.tmpdir(), 'sb-')));

test('teacher can register, create a class and upload; student reads by code', () => {
  const s = mk();
  const { token, teacher } = s.registerTeacher({ name: 'Ms Khan', email: 'K@School.org', password: 'longenough1', organization: 'Oakwood School' });
  assert.equal(teacher.email, 'k@school.org');
  const t = s.verifyToken(token);
  const c = s.createClass(t.id, { name: '10A Physics', subject: 'Physics 0625' });
  s.addMaterial(t.id, c.id, { title: 'Forces notes', kind: 'notes', content: 'Force equals mass times acceleration.' });
  s.addMaterial(t.id, c.id, { title: 'Past paper', kind: 'file', fileName: 'p1.pdf', fileBase64: Buffer.from('%PDF-1.4 test').toString('base64') });
  const view = s.materialsByCode(c.code.toLowerCase());
  assert.equal(view.materials.length, 2);
  assert.equal(view.class.organization, 'Oakwood School');
  const file = view.materials.find((m) => m.kind === 'file')!;
  assert.ok(fs.existsSync(s.getFile(file.id, c.code).path));
  assert.throws(() => s.getFile(file.id, 'WRONG1'), (e: any) => e instanceof HttpError && e.status === 403);
});

test('login, bad password, bad token and validation', () => {
  const s = mk();
  s.registerTeacher({ name: 'Mr Lee', email: 'lee@x.org', password: 'password123', organization: 'Org' });
  assert.ok(s.loginTeacher('lee@x.org', 'password123').token);
  assert.throws(() => s.loginTeacher('lee@x.org', 'nope'), /Incorrect/);
  assert.throws(() => s.verifyToken('abc.def'), /invalid/i);
  assert.throws(() => s.registerTeacher({ name: 'A', email: 'bad', password: 'x', organization: '' }));
  assert.throws(() => s.registerTeacher({ name: 'Mr Lee', email: 'lee@x.org', password: 'password123', organization: 'Org' }), /already exists/);
});

test('teachers cannot touch other teachers\' classes; unsafe files/links rejected', () => {
  const s = mk();
  const a = s.verifyToken(s.registerTeacher({ name: 'Aa', email: 'a@x.org', password: 'password123', organization: 'Org' }).token);
  const b = s.verifyToken(s.registerTeacher({ name: 'Bb', email: 'b@x.org', password: 'password123', organization: 'Org' }).token);
  const c = s.createClass(a.id, { name: 'Class A' });
  assert.throws(() => s.addMaterial(b.id, c.id, { title: 'x1', kind: 'notes', content: 'long enough notes' }), /not found/i);
  assert.throws(() => s.addMaterial(a.id, c.id, { title: 'bad', kind: 'file', fileName: 'evil.exe', fileBase64: 'AAAA' }), /Unsupported/);
  assert.throws(() => s.addMaterial(a.id, c.id, { title: 'bad', kind: 'link', url: 'javascript:alert(1)' }), /http/);
  assert.throws(() => s.materialsByCode('NOPE00'), /No class/);
});
