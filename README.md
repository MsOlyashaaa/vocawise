# Vocawise

Mobile-first language learning app — Polish through Ukrainian. Static SPA, no backend.

## Stack

- Vite + React 18 + TypeScript (strict)
- Tailwind CSS 3 (custom Playful Pastel theme)
- React Router 6 (HashRouter)
- localStorage with versioned schema
- Leitner 5-box spaced repetition

## Run locally

```bash
nvm use            # Node 22
yarn install
yarn dev           # http://localhost:5173
```

## Build & preview

```bash
yarn build
yarn preview
```

## Lint & format

```bash
yarn lint          # check
yarn lint:fix      # auto-fix
```

## Deploy to GitHub Pages

1. Push to `main` on a public repo named `vocawise` under your GitHub account.
2. In repo Settings → Pages → Source: **GitHub Actions**.
3. The included workflow (`.github/workflows/deploy.yml`) builds with `VITE_BASE=/vocawise/` and deploys `dist/` to Pages.
4. Live URL: `https://<your-username>.github.io/vocawise/`

For a different repo name, set `VITE_BASE` accordingly in the workflow.
For a user/org root site (`<user>.github.io`), set `VITE_BASE=/`.

## Adding a new language pair

1. Create folder `src/data/language-pairs/<pair-id>/` (e.g. `pl-en`).
2. Provide:
   - `pair.ts` — exports `LanguagePair` config object
   - `ui-strings.ts` — base-language UI strings (default export)
   - `vocabulary/{nouns,verbs,adjectives,common,phrases}.ts` — each exports `VocabularyItem[]` (default export)
   - `grammar/lessons.ts` — exports `GrammarLesson[]` (default export)
3. Register the pair in `src/data/language-pairs/index.ts`.
4. Settings screen lists registered pairs automatically. Each pair has isolated localStorage progress.

## Adding new vocabulary

Open the appropriate `vocabulary/<category>.ts` and append a new `VocabularyItem`:

```ts
{
  id: 'pl-uk:nouns:<slug>',
  pairId: 'pl-uk',
  category: 'nouns',
  difficulty: 'easy',
  target: '...', base: '...',
  exampleTarget: '...', exampleBase: '...',
  emoji: '...',
  association: '...',          // optional
  meta: { gender: 'masc' },    // optional
}
```

Vite HMR picks it up instantly.

## Project structure

```
src/
├─ app/             # Shell, providers, router
├─ components/      # Generic UI primitives
├─ contexts/        # Settings / LanguagePair / Progress / Favorites
├─ data/            # Language pairs (vocab + grammar + ui strings)
├─ features/        # Domain features
├─ hooks/           # Custom hooks
├─ pages/           # Route-level screens
├─ storage/         # localStorage layer
├─ styles/          # tailwind.css
├─ types/           # TypeScript types
└─ utils/           # Pure utility functions
```

## Starter content

v1 ships with ~75 vocabulary items (15 each across 5 categories) and 10 grammar lessons. The dataset is intentionally small enough to validate every feature; growing each category to ~80 items is straightforward — append to the existing `.ts` files following the same schema. See `docs/superpowers/specs/2026-04-29-vocawise-design.md` and `docs/superpowers/plans/2026-04-29-vocawise.md` for the design rationale and content scope.

## License

MIT.
