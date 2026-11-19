#!/usr/bin/env node
// Vérifie les skills : en-tête valide, outils MCP cités existants, fonctions de formule connues.
// Usage : node scripts/check-skills.mjs   (aucune dépendance)
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const tools = new Set(JSON.parse(readFileSync('scripts/tools.json', 'utf8')));
const fonctions = new Set(
  [...readFileSync('skills/tblflow-formules/references/fonctions.md', 'utf8').matchAll(/`([A-Z][A-Z_0-9]+)`/g)].map((m) => m[1])
);
const errors = [];
const cited = new Set();

for (const dir of readdirSync('skills')) {
  const file = join('skills', dir, 'SKILL.md');
  if (!existsSync(file)) { errors.push(`${dir}: SKILL.md manquant`); continue; }
  const text = readFileSync(file, 'utf8');
  const head = /^---\n([\s\S]*?)\n---\n/.exec(text)?.[1];
  if (!head) { errors.push(`${dir}: en-tête absent`); continue; }
  if (!new RegExp(`^name: ${dir}$`, 'm').test(head)) errors.push(`${dir}: name ≠ nom du dossier`);
  if (!/^description:/m.test(head)) errors.push(`${dir}: description absente`);
  if (/teable|cuppy/i.test(text)) errors.push(`${dir}: marque interdite`);
  for (const [, tok] of text.matchAll(/`([a-z]+(?:_[a-z]+)+)`/g)) {
    if (tools.has(tok)) cited.add(tok);
    else errors.push(`${dir}: outil inconnu « ${tok} »`);
  }
  for (const [, fn] of text.matchAll(/\b([A-Z][A-Z_0-9]{2,})\(/g)) {
    if (!fonctions.has(fn)) errors.push(`${dir}: fonction de formule inconnue « ${fn} »`);
  }
}
for (const t of tools) if (!cited.has(t)) errors.push(`outil jamais cité par un skill : ${t}`);

if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`OK : ${readdirSync('skills').length} skills, ${cited.size}/${tools.size} outils cités`);
