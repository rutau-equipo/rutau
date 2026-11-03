import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Ajv2020 from 'ajv/dist/2020.js';

const root = fileURLToPath(new URL('..', import.meta.url));
const schema = JSON.parse(fs.readFileSync(path.join(root, 'packages/contracts/curriculum.schema.json'), 'utf8'));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate = ajv.compile(schema);
const base = path.join(root, 'packages/plans');
const errors = [];
let count = 0;

for (const entry of fs.readdirSync(base, { withFileTypes: true })) {
  const planFile = path.join(base, entry.name, 'plan.json');
  if (!entry.isDirectory() || !fs.existsSync(planFile)) continue;
  count++;
  const data = JSON.parse(fs.readFileSync(planFile, 'utf8'));
  if (!validate(data)) {
    errors.push(`${entry.name}: errores de formato: ${ajv.errorsText(validate.errors)}`);
    continue;
  }
  const ids = new Set();
  const codes = new Set();
  for (const c of data.courses) {
    if (ids.has(c.id)) errors.push(`${entry.name}: ID duplicado ${c.id}`);
    if (codes.has(c.code)) errors.push(`${entry.name}: código duplicado ${c.code}`);
    ids.add(c.id); codes.add(c.code);
  }
  for (const c of data.courses) {
    const reqs = [...c.prerequisites.allOf, ...c.prerequisites.anyOf, ...c.corequisites];
    for (const dep of reqs) {
      if (!ids.has(dep)) errors.push(`${entry.name}: ${c.id} referencia a materia inexistente ${dep}`);
      if (dep === c.id) errors.push(`${entry.name}: ${c.id} depende de sí misma`);
    }
    for (const dep of c.prerequisites.allOf) {
      if (c.prerequisites.anyOf.includes(dep)) errors.push(`${entry.name}: ${c.id} repite ${dep} en allOf y anyOf`);
    }
  }
  // Solo prerrequisitos obligatorios: alternativas 'anyOf' requieren análisis de satisfacibilidad aparte.
  const courseById = new Map(data.courses.map(c => [c.id, c]));
  const visiting = new Set();
  const visited = new Set();
  function walk(id) {
    if (visiting.has(id)) { errors.push(`${entry.name}: ciclo obligatorio alrededor de ${id}`); return; }
    if (visited.has(id)) return;
    visiting.add(id);
    for (const dep of (courseById.get(id)?.prerequisites.allOf ?? [])) if (courseById.has(dep)) walk(dep);
    visiting.delete(id); visited.add(id);
  }
  for (const id of ids) walk(id);
  console.log(`Plan verificado: ${entry.name} (${data.courses.length} materias)`);
}
if (!count) errors.push('No se encontraron módulos de planes');
if (errors.length) {
  for (const issue of errors) console.error('ERROR:', issue);
  process.exitCode = 1;
} else console.log(`✅ ${count} plan(es) válidos`);
