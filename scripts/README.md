# README generator

`/README.md` is generated. Edit the data or a template, then regenerate.

| Path | Purpose |
|---|---|
| `data/profile.json` | All profile content, plus `"template"` (the active design) |
| `templates/*.md` | Designs: `badges` (flat-square badges), `minimal` (table + icons) |
| `assets/` | `logo/`, `icons/` and `images/` referenced by the README |
| `scripts/generate.mjs` | Renders a template with the data |

```bash
npm run readme            # use the template named in data/profile.json
npm run readme:badges     # force a template
npm run readme:minimal
npm run readme:list       # list templates
node scripts/generate.mjs --template minimal --out preview.md
```

Template syntax: `{{key}}`, `{{a.b}}`, `{{#each list}}…{{/each}}`, filter `| join:"sep"`.
Data items with `"only": ["badges"]` render only in that template.
Add a design by dropping a new `.md` into `templates/`.
