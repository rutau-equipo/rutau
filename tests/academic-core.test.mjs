import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { closePeriod, courseEligibility, possibleUnlocks, summarizeProgress } from '../packages/academic-core/src/index.ts';

const plan = JSON.parse(fs.readFileSync(new URL('../packages/plans/demo-sistemas/plan.json', import.meta.url)));
const periods = [
  { id: 'P1', status: 'CLOSED', courses: [{ courseId: 'MAT101', result: 'PASSED' }, { courseId: 'PRO101', result: 'PASSED' }] },
  { id: 'P2', status: 'OPEN', courses: [{ courseId: 'MAT102', result: 'PENDING' }, { courseId: 'PRO102', result: 'PENDING' }] }
];

test('progreso confirmado no cuenta materias en curso', () => {
  const p = summarizeProgress(plan, periods);
  assert.equal(p.approvedCourses, 2);
  assert.equal(p.percentage, 40);
  assert.equal(p.creditsApproved, 8);
});

test('muestra las materias que podrían desbloquearse, no las da por aprobadas', () => {
  assert.deepEqual(possibleUnlocks(plan, periods), ['ALGO201']);
  const p = summarizeProgress(plan, periods);
  const alg = plan.courses.find(c => c.id === 'ALGO201');
  assert.equal(courseEligibility(alg, p.approved, p.inProgress).status, 'BLOCKED');
});

test('no permite cerrar un período con resultados pendientes', () => {
  assert.throws(() => closePeriod(periods[1], { MAT102: 'PASSED' }), /Resultado pendiente/);
});

test('aprobar materias desbloquea correctamente', () => {
  const closed = closePeriod(periods[1], { MAT102: 'PASSED', PRO102: 'PASSED' });
  const p = summarizeProgress(plan, [periods[0], closed]);
  const alg = plan.courses.find(c => c.id === 'ALGO201');
  assert.equal(p.approvedCourses, 4);
  assert.equal(courseEligibility(alg, p.approved, p.inProgress).status, 'AVAILABLE');
});

test('reprobar mantiene bloqueadas las materias dependientes', () => {
  const closed = closePeriod(periods[1], { MAT102: 'FAILED', PRO102: 'PASSED' });
  const p = summarizeProgress(plan, [periods[0], closed]);
  const alg = plan.courses.find(c => c.id === 'ALGO201');
  assert.equal(p.approvedCourses, 3);
  assert.equal(courseEligibility(alg, p.approved, p.inProgress).status, 'BLOCKED');
});

test('correquisito pendiente se informa en una materia habilitada', () => {
  const pro = plan.courses.find(c => c.id === 'PRO102');
  const result = courseEligibility(pro, new Set(['PRO101']), new Set());
  assert.equal(result.status, 'REQUIRES_COREQUISITE');
  assert.deepEqual(result.missingCorequisites, ['MAT102']);
});
