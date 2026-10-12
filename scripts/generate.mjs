#!/usr/bin/env node
// Generates README.md from data/profile.json + templates/<name>.md
//
//   node scripts/generate.mjs                     use the "template" set in the data file
//   node scripts/generate.mjs --template minimal  pick a template
//   node scripts/generate.mjs --list              list templates
//   node scripts/generate.mjs --out preview.md    write somewhere else
//
// Template syntax: {{key}}, {{a.b}}, {{#each list}}...{{/each}}, filters: | join:"sep"

import { readFileSync, writeFileSync, readdirSync } from 'node:fs';
import { dirname, join, resolve, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const templatesDir = join(root, 'templates');

const args = process.argv.slice(2);
const opt = (name) => {
  const i = args.indexOf(`--${name}`);
  return i === -1 ? undefined : args[i + 1];
};

const available = readdirSync(templatesDir)
  .filter((f) => f.endsWith('.md'))
  .map((f) => f.slice(0, -3));

if (args.includes('--list')) {
  console.log(available.join('\n'));
  process.exit(0);
}

const data = JSON.parse(readFileSync(join(root, 'data/profile.json'), 'utf8'));
const template = opt('template') ?? data.template;
if (!available.includes(template)) {
  console.error(`Unknown template "${template}". Available: ${available.join(', ')}`);
  process.exit(1);
}
const out = resolve(root, opt('out') ?? 'README.md');

// ---- derived values --------------------------------------------------------

const esc = (s) => encodeURIComponent(s).replace(/-/g, '--').replace(/_/g, '__');
const badgeUrl = ({ label, message, name, text, color, logo, logo_color = 'white' }) =>
  `https://img.shields.io/badge/${label ? esc(label) : ''}-${esc(message ?? text ?? name)}-${color}` +
  `?style=flat-square&logo=${logo}&logoColor=${logo_color}`;
const forTemplate = (list) => (list ?? []).filter((i) => !i.only || i.only.includes(template));

const ctx = {
  ...data,
  website_host: new URL(data.website).host,
  ask_capitalized: data.ask.map((s) => s[0].toUpperCase() + s.slice(1)),
  status: forTemplate(data.status).map((s) => ({
    ...s,
    alt: s.alt ?? `${s.label} ${s.message}`,
    url: s.url ?? badgeUrl(s),
  })),
  social: forTemplate(data.social).map((s) => ({ ...s, badge: badgeUrl(s) })),
  stack: data.stack.map((s) => ({ ...s, url: badgeUrl({ ...s, message: s.name }) })),
  learning_stack: data.learning_stack.map((s) => ({ ...s, url: badgeUrl({ ...s, message: s.name }) })),
};

// ---- tiny template engine --------------------------------------------------

const lookup = (path, scopes) => {
  for (const scope of scopes) {
    const v = path.split('.').reduce((o, k) => (o == null ? o : o[k]), scope);
    if (v !== undefined) return v;
  }
  throw new Error(`Template variable "${path}" is not defined`);
};

const bold = (s) => `<b>${s}</b>`;
const filters = {
  join: (v, sep) => v.join(sep),
  // "A, B and C" with every item bold
  bold_list: (v) => {
    const b = v.map(bold);
    return b.length < 2 ? b.join('') : `${b.slice(0, -1).join(', ')} and ${b.at(-1)}`;
  },
  bold_join: (v) => v.map(bold).join(', '),
};

const evalExpr = (expr, scopes) => {
  const [path, ...fs] = expr.split(/\s*\|\s*/);
  let v = lookup(path.trim(), scopes);
  for (const f of fs) {
    const m = f.match(/^(\w+)(?::"((?:[^"\\]|\\.)*)")?$/);
    if (!m || !filters[m[1]]) throw new Error(`Unknown filter "${f}"`);
    v = filters[m[1]](v, m[2]?.replace(/\\n/g, '\n'));
  }
  return String(v);
};

const render = (tpl, scopes) =>
  tpl
    .replace(/\{\{#each (\S+?)\}\}([\s\S]*?)\{\{\/each\}\}/g, (_, key, body) =>
      lookup(key, scopes)
        .map((item) => render(body, [item, ...scopes]))
        .join(''),
    )
    .replace(/\{\{\s*([^}]+?)\s*\}\}/g, (_, expr) => evalExpr(expr, scopes));

// ---- write -----------------------------------------------------------------

let md = render(readFileSync(join(templatesDir, `${template}.md`), 'utf8'), [ctx]);
// "each" bodies end with a newline + indentation; trim the trailing run before a closing tag
md = md
  .replace(/(?:&nbsp;)+\s*(<\/p>)/g, '\n$1')
  .replace(/\n[ \t]+\n(<\/p>)/g, '\n$1')
  .replace(/[ \t]+\n(<\/p>)/g, '\n$1');
writeFileSync(out, md);
console.log(`Generated ${out.startsWith(root) ? relative(root, out) : out} from template "${template}"`);
