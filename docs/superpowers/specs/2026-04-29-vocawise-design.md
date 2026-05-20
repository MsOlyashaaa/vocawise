# Vocawise — Design Spec

**Date:** 2026-04-29
**Author:** Olha Petrenko
**Status:** Approved (ready for implementation plan)

## 1. Summary

Vocawise is a mobile-first language-learning web app for memorizing vocabulary and basic grammar through a base language the learner already knows. The first language pair is **Polish via Ukrainian** (`pl-uk`). Architecture supports adding pairs (e.g. `pl-en`, `de-uk`, `en-uk`) without core changes.

The app runs as a static SPA deployable to GitHub Pages. All learner state lives in `localStorage`. Spaced-repetition uses a 5-box Leitner system. Visual style is the "Playful Pastel" direction (pink/blue pastels, big emojis, rounded surfaces, soft shadows).

## 2. Goals & non-goals

### Goals
- Mobile-first UI, responsive on desktop. Soft pastel palette, large tap targets, card-based layout.
- Five vocabulary categories (nouns, verbs, adjectives, common, phrases) with ~80 items each (~400 total starter items).
- Flashcard mode with tap-to-flip and Leitner-driven session picker.
- Six interactive practice modes: multiple-choice, match pairs, fill-blank, word-form, repeat-difficult, association quiz.
- Grammar section with 10 beginner Ukrainian-language lessons on Polish grammar.
- Progress tracking: words learned, words to repeat, favorites, quiz accuracy, completed categories, daily streak.
- Useful learning features: word of the day, favorites, difficult words list, achievements, spaced repetition, quick review, search, filter.
- Memory aids first-class: associations, mnemonics, emoji clues, sound-alike hints, "why this is easy to remember" copy.
- Architecture ready for additional `(target × base)` language pairs without forking app code.
- Static-site deploy to GitHub Pages with a one-command build and GitHub Actions workflow.

### Non-goals (v1)
- Audio/TTS pronunciation (Web Speech API later).
- PWA install / offline service worker.
- Image upload (type field reserved).
- Cloud sync / accounts / multi-device.
- Authored test suite (Vitest scaffolded, no tests written).

## 3. Tech stack

- **Package manager:** Yarn (matches user's other project; npm/pnpm acceptable but Yarn is default in scripts/CI)
- **Build:** Vite 5
- **UI:** React 18 + TypeScript 5 (strict, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`)
- **Styles:** Tailwind CSS 3 with custom pastel theme
- **Routing:** `react-router-dom` 6 with `HashRouter` (SPA fallback on GH Pages without 404 hacks)
- **State:** React Context split by domain, each backed by `useReducer`. No external state lib.
- **Persistence:** `localStorage` via versioned schema, debounced writes
- **Lint/format:** ESLint flat config + Prettier + `prettier-plugin-tailwindcss`
- **Hooks:** Husky + lint-staged on pre-commit
- **Tests:** Vitest + React Testing Library scaffolded only
- **CI/CD:** GitHub Actions → GitHub Pages (`actions/deploy-pages@v4`)

## 4. Folder structure

```
vocawise/
├─ public/
│  ├─ favicon.svg
│  └─ 404.html                       # belt-and-braces fallback (HashRouter not strictly required)
├─ src/
│  ├─ app/
│  │  ├─ App.tsx
│  │  ├─ Providers.tsx               # composes all context providers
│  │  ├─ Router.tsx                  # HashRouter + route table
│  │  └─ AppShell.tsx                # top bar + bottom nav + outlet
│  ├─ components/                    # generic UI primitives
│  │  ├─ Card.tsx
│  │  ├─ Pill.tsx
│  │  ├─ Button.tsx
│  │  ├─ IconButton.tsx
│  │  ├─ AppBar.tsx
│  │  ├─ BottomNav.tsx
│  │  ├─ EmptyState.tsx
│  │  ├─ Toast.tsx
│  │  ├─ ConfirmDialog.tsx
│  │  ├─ SearchBar.tsx
│  │  ├─ ProgressRing.tsx
│  │  ├─ DifficultyDot.tsx
│  │  └─ StreakChip.tsx
│  ├─ pages/                         # route-level screens
│  │  ├─ HomePage.tsx
│  │  ├─ VocabularyCategoriesPage.tsx
│  │  ├─ VocabularyListPage.tsx
│  │  ├─ WordDetailPage.tsx
│  │  ├─ FlashcardsPickerPage.tsx
│  │  ├─ FlashcardsSessionPage.tsx
│  │  ├─ PracticePickerPage.tsx
│  │  ├─ PracticeSessionPage.tsx
│  │  ├─ GrammarListPage.tsx
│  │  ├─ GrammarLessonPage.tsx
│  │  ├─ ProgressPage.tsx
│  │  ├─ FavoritesPage.tsx
│  │  ├─ SearchPage.tsx
│  │  └─ SettingsPage.tsx
│  ├─ features/
│  │  ├─ flashcards/
│  │  │  ├─ FlashCard.tsx            # tap-to-flip card view
│  │  │  ├─ DeckPicker.tsx
│  │  │  ├─ SessionRunner.tsx
│  │  │  └─ useFlashcardSession.ts
│  │  ├─ quiz/
│  │  │  ├─ PracticeFrame.tsx        # shared shell (progress + score)
│  │  │  ├─ MultipleChoiceMode.tsx
│  │  │  ├─ MatchPairsMode.tsx
│  │  │  ├─ FillBlankMode.tsx
│  │  │  ├─ WordFormMode.tsx
│  │  │  ├─ RepeatDifficultMode.tsx
│  │  │  └─ AssociationMode.tsx
│  │  ├─ grammar/
│  │  │  ├─ LessonRenderer.tsx
│  │  │  ├─ GrammarTable.tsx
│  │  │  └─ LessonsByTopic.tsx
│  │  ├─ vocabulary/
│  │  │  ├─ WordCard.tsx
│  │  │  ├─ AssociationCallout.tsx
│  │  │  ├─ EmojiHero.tsx
│  │  │  └─ CategoryTile.tsx
│  │  └─ progress/
│  │     ├─ AchievementBadge.tsx
│  │     ├─ StatCard.tsx
│  │     └─ StreakHeatmap.tsx
│  ├─ data/
│  │  └─ language-pairs/
│  │     ├─ index.ts                 # registry of pairs
│  │     └─ pl-uk/
│  │        ├─ pair.ts               # LanguagePair config
│  │        ├─ ui-strings.ts         # base-language UI strings
│  │        ├─ vocabulary/
│  │        │  ├─ nouns.ts
│  │        │  ├─ verbs.ts
│  │        │  ├─ adjectives.ts
│  │        │  ├─ common.ts
│  │        │  └─ phrases.ts
│  │        └─ grammar/
│  │           └─ lessons.ts
│  ├─ contexts/
│  │  ├─ LanguagePairContext.tsx
│  │  ├─ ProgressContext.tsx
│  │  ├─ FavoritesContext.tsx
│  │  └─ SettingsContext.tsx
│  ├─ hooks/
│  │  ├─ useLanguagePair.ts
│  │  ├─ useVocabulary.ts
│  │  ├─ useGrammar.ts
│  │  ├─ useLeitner.ts
│  │  ├─ useDailyStreak.ts
│  │  ├─ useWordOfDay.ts
│  │  ├─ useAchievements.ts
│  │  ├─ useT.ts                     # base-language UI string lookup
│  │  └─ useSearch.ts
│  ├─ storage/
│  │  ├─ localStore.ts               # read/write/migrate
│  │  ├─ schema.ts                   # PersistedState type
│  │  └─ debounce.ts
│  ├─ types/
│  │  ├─ language.ts
│  │  ├─ vocabulary.ts
│  │  ├─ grammar.ts
│  │  ├─ progress.ts
│  │  └─ achievements.ts
│  ├─ utils/
│  │  ├─ leitner.ts
│  │  ├─ sessionPicker.ts
│  │  ├─ shuffle.ts
│  │  ├─ dateUtils.ts                # 'YYYY-MM-DD' helpers in local TZ
│  │  └─ deterministicHash.ts        # for word-of-day
│  ├─ styles/
│  │  └─ tailwind.css
│  └─ main.tsx
├─ index.html
├─ vite.config.ts
├─ tailwind.config.ts
├─ postcss.config.js
├─ tsconfig.json
├─ eslint.config.mjs
├─ .prettierrc
├─ .gitignore
├─ .github/workflows/deploy.yml
├─ package.json
└─ README.md
```

### Path aliases

| Alias | Path |
|-------|------|
| `@app/*` | `src/app/*` |
| `@components/*` | `src/components/*` |
| `@pages/*` | `src/pages/*` |
| `@features/*` | `src/features/*` |
| `@data/*` | `src/data/*` |
| `@contexts/*` | `src/contexts/*` |
| `@hooks/*` | `src/hooks/*` |
| `@storage/*` | `src/storage/*` |
| `@types/*` | `src/types/*` |
| `@utils/*` | `src/utils/*` |
| `@styles/*` | `src/styles/*` |

## 5. Data model

### 5.1 Language pair

```ts
// src/types/language.ts
export type LangCode = 'pl' | 'uk' | 'en' | 'de' | string;

export interface LanguagePair {
  id: string;                          // 'pl-uk'
  targetLanguage: LangCode;            // pl
  baseLanguage: LangCode;              // uk
  targetName: string;                  // 'Польська'
  baseName: string;                    // 'Українська'
  flagTarget: string;                  // '🇵🇱'
  flagBase: string;                    // '🇺🇦'
  loaders: {
    vocabulary: () => Promise<VocabularyItem[]>;
    grammar: () => Promise<GrammarLesson[]>;
    uiStrings: () => Promise<UiStrings>;
  };
}
```

`loaders` use dynamic `import()` for code-splitting. Adding a new pair = create folder under `data/language-pairs/<pair-id>/`, register in `data/language-pairs/index.ts`. No core code changes.

### 5.2 Vocabulary item

```ts
export type VocabCategory = 'nouns' | 'verbs' | 'adjectives' | 'common' | 'phrases';
export type Difficulty = 'easy' | 'medium' | 'hard';

export interface VocabularyItem {
  id: string;                       // 'pl-uk:nouns:kot' — `${pairId}:${category}:${target}` (slugged)
  pairId: string;                   // 'pl-uk'
  category: VocabCategory;
  difficulty: Difficulty;
  target: string;                   // 'kot'
  base: string;                     // 'кіт'
  exampleTarget?: string;           // 'Mam kota.'
  exampleBase?: string;             // 'У мене є кіт.'
  tags?: string[];
  emoji?: string;                   // '🐱'
  imageUrl?: string;                // reserved for future
  association?: string;             // memory hint in BASE language
  similarSounding?: string;         // sound-alike base-language word
  meta?: {
    gender?: 'masc' | 'fem' | 'neut';
    plural?: string;
    aspect?: 'perf' | 'imperf';
    conjugation?: Record<string, string>;
  };
}
```

### 5.3 Grammar lesson

```ts
export type GrammarTopic = 'cases' | 'gender' | 'plurals' | 'verbs' | 'adjectives' | 'other';

export interface GrammarExample { target: string; base: string; note?: string; }

export type GrammarBlock =
  | { type: 'p'; text: string }
  | { type: 'h'; text: string }
  | { type: 'example'; target: string; base: string }
  | { type: 'table'; headers: string[]; rows: string[][] }
  | { type: 'note'; text: string };

export interface GrammarLesson {
  id: string;                       // 'pl-uk:cases-nominative'
  pairId: string;
  title: string;                    // in base language
  topic: GrammarTopic;
  difficulty: Difficulty;
  summary: string;
  body: GrammarBlock[];
  examples: GrammarExample[];
  related?: string[];               // vocab or other lesson ids
}
```

### 5.4 UI strings (i18n-lite)

```ts
export type UiStrings = Record<string, string>;
// e.g. { 'flashcard.iknow': 'Я знаю', 'flashcard.repeat': 'Повторити пізніше' }
```

`useT()` hook returns a function `t(key)` that reads from current pair's `uiStrings`, falling back to a built-in English keyset for missing keys.

## 6. Spaced repetition (Leitner)

### 6.1 Per-card state

```ts
export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export interface CardState {
  itemId: string;
  box: LeitnerBox;
  lastReviewedAt: number;       // unix ms
  nextDueAt: number;            // unix ms
  correctStreak: number;
  totalSeen: number;
  totalCorrect: number;
  flaggedRepeat: boolean;       // 'Repeat later' button
  isFavorite: boolean;
  isLearned: boolean;           // box === 5 && correctStreak >= 2
}
```

### 6.2 Box intervals

| Box | Interval until next due |
|-----|-------------------------|
| 1 | available immediately |
| 2 | 1 day |
| 3 | 3 days |
| 4 | 7 days |
| 5 | 14 days |

### 6.3 Rate function

```ts
// src/utils/leitner.ts
export function rate(state: CardState, correct: boolean, now = Date.now()): CardState {
  const nextBox = correct ? Math.min(5, state.box + 1) as LeitnerBox : 1;
  return {
    ...state,
    box: nextBox,
    lastReviewedAt: now,
    nextDueAt: now + INTERVALS_MS[nextBox],
    correctStreak: correct ? state.correctStreak + 1 : 0,
    totalSeen: state.totalSeen + 1,
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    flaggedRepeat: correct ? false : state.flaggedRepeat,
    isLearned: nextBox === 5 && state.correctStreak + (correct ? 1 : 0) >= 2,
  };
}
```

### 6.4 Session picker

```
1. eligible := cards where flaggedRepeat = true
                ∪ cards where nextDueAt <= now
                ∪ items with no CardState yet (never seen)
2. each eligible card gets a weight:
     flaggedRepeat = true → 5
     box 1                → 3
     no CardState (new)   → 2
     box 2-4              → 1
     box 5                → 0.3
3. weighted-sample without replacement until queue.length == sessionSize
   (or all eligible exhausted)
4. shuffle final queue order
```

Inclusion in `eligible` is gated by `nextDueAt <= now` (or unseen / flagged); weights only affect ordering and which subset gets picked when there are more eligible than `sessionSize`. Box-5 cards therefore appear only when their interval has elapsed, and even then rarely. Used by both flashcard sessions and practice quizzes.

## 7. Progress, streak, achievements

### 7.1 Streak

```ts
export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDay: string;        // 'YYYY-MM-DD' in user's local TZ
}
```

Updated on any card rating:
- `today === lastActive` → no-op
- `today === lastActive + 1d` → `currentStreak += 1`
- otherwise → `currentStreak = 1`
- `longestStreak = max(longestStreak, currentStreak)`

### 7.2 Aggregates

Computed selectors over `Record<itemId, CardState>`. Not stored.

| Stat | Definition |
|------|------------|
| `wordsLearned` | count where `isLearned` |
| `wordsToRepeat` | count where `nextDueAt <= now \|\| flaggedRepeat` |
| `favoritesCount` | count where `isFavorite` |
| `quizAccuracy` | `Σ totalCorrect / Σ totalSeen` (0 if no plays) |
| `categoriesCompleted` | categories where every item has `isLearned` |

### 7.3 Achievements

Static rule list, evaluated after each progress update. Newly-earned IDs trigger a toast.

```ts
export const ACHIEVEMENTS = [
  { id: 'first-word',   name: 'Перше слово',     icon: '🌱', when: p => p.wordsLearned >= 1 },
  { id: 'ten-words',    name: '10 слів',          icon: '🌿', when: p => p.wordsLearned >= 10 },
  { id: 'fifty-words',  name: '50 слів',          icon: '📚', when: p => p.wordsLearned >= 50 },
  { id: 'hundred-words',name: '100 слів',         icon: '📖', when: p => p.wordsLearned >= 100 },
  { id: 'streak-3',     name: '3 дні поспіль',    icon: '✨', when: p => p.currentStreak >= 3 },
  { id: 'streak-7',     name: 'Тиждень поспіль',  icon: '🔥', when: p => p.currentStreak >= 7 },
  { id: 'streak-30',    name: 'Місяць поспіль',   icon: '🏆', when: p => p.currentStreak >= 30 },
  { id: 'cat-nouns',    name: 'Іменники освоєні', icon: '🎯', when: p => p.categoriesCompleted.includes('nouns') },
  { id: 'cat-verbs',    name: 'Дієслова освоєні', icon: '🎯', when: p => p.categoriesCompleted.includes('verbs') },
  { id: 'sharpshooter', name: '90% точність',     icon: '🎖️', when: p => p.totalSeen >= 50 && p.quizAccuracy >= 0.9 },
];
```

## 8. Persistence (localStorage)

### 8.1 Schema

```ts
// src/storage/schema.ts
export interface PersistedState {
  schemaVersion: 1;
  pairs: Record<string, {
    cards: Record<string, CardState>;
    streak: StreakState;
    earnedAchievements: string[];
    lessonsRead: string[];
    wordOfDayHistory: { date: string; itemId: string }[];
    settings: { sessionSize: number; quizMode: 'all' | 'due' };
  }>;
  globalSettings: { activePairId: string; theme: 'light' | 'dark' };
}
```

### 8.2 Behavior

- Single key: `vocawise:v1`
- Read once on app boot. Initialize empty state if absent.
- Writes debounced 250 ms to coalesce rapid context updates.
- Wrap writes in try/catch — on `QuotaExceededError` show toast and skip persist.
- `schemaVersion` opens path for future migrations (`migrate(v1 → v2)` stub function included for shape, no migrations yet).
- Per-pair isolation: switching the active pair does not mix card states.

### 8.3 Word of the day

Deterministic, stateless:

```ts
const dayKey = format(today, 'yyyy-MM-dd');
const idx = Math.abs(hash(dayKey + pairId)) % vocab.length;
const word = vocab[idx];
```

History array (`wordOfDayHistory`) stored only for display ("past 7 days") on the Home page.

## 9. Routes (HashRouter)

```
/                          Home
/vocabulary                Category grid
/vocabulary/:category      Word list (search + filters)
/vocabulary/word/:id       Word detail
/flashcards                Deck picker
/flashcards/session        Active flashcard session
/practice                  Practice mode picker
/practice/:mode            Active practice session
/grammar                   Lesson list grouped by topic
/grammar/:lessonId         Lesson reader
/progress                  Stats, achievements, streak heatmap
/favorites                 Favorites list
/search                    Global search
/settings                  Pair switcher, session size, theme, reset
```

Bottom nav (mobile, 5 tabs): 🏠 Home · 📚 Vocab · 🎴 Flashcards · 📝 Practice · 📊 Stats. Grammar / Favorites / Settings reachable from Home or via top bar overflow menu.

## 10. Screens

### 10.1 Home
Greeting, streak chip, "Start today's review (N due)" CTA, word-of-day card (with association if present), recently-learned strip, achievements carousel.

### 10.2 Vocabulary categories
Grid of 5 large tiles. Each shows category emoji, item count, percent-learned ring.

### 10.3 Word list
Top: search input + difficulty filter + learned/unlearned toggle. Body: list of compact word rows (target, base, emoji, difficulty dot, ★ if favorite). Renders plain list (≤80 items per category, no virtualization needed).

### 10.4 Word detail
- Emoji hero
- Target word (display font, large)
- Base translation + example pair
- Association callout (highlighted, pastel pink background)
- Grammatical meta table (gender, plural, conjugation table when present)
- Tag pills
- Buttons: ★ favorite, "Practice this word"

### 10.5 Flashcard session
Single card centered. Tap-to-flip via CSS `transform: rotateY(180deg)` + `backface-visibility: hidden`. Front: target word + emoji. Back: base translation, example, association. Three buttons below: Знаю · Повторити · ★. Top: progress bar + N/total. Top-right: exit (with confirm if mid-session).

### 10.6 Practice modes (six)

All wrap in `<PracticeFrame>` (progress bar + score + exit confirm).

| Mode | UI |
|------|----|
| **MultipleChoice** | Polish word + 4 Ukrainian options (1 correct, 3 distractors from same category) |
| **MatchPairs** | 2 columns × 5 pairs. Tap one then the other to pair. Animate match. |
| **FillBlank** | Example sentence with blank. 4 word options to pick from. |
| **WordForm** | Show base sentence + lemma; pick correct case/conjugated form. Uses `meta.conjugation`/`meta.plural`; items lacking either field are filtered out at session-build time. |
| **RepeatDifficult** | Pulls only `flaggedRepeat` ∪ `box-1` cards. Multiple-choice format. |
| **Association** | Show emoji + association hint. Pick correct Polish word from 4. |

Result of each answer feeds `rate(state, correct)`.

### 10.7 Grammar
- **List**: lessons grouped by topic, with read/unread state.
- **Lesson**: render `body` blocks (`p`, `h`, `example`, `table`, `note`); footer "Я прочитав(ла)" button writes `lessonsRead`. Related vocab links at bottom.

### 10.8 Progress
- 4 stat cards (learned / to repeat / favorites / accuracy)
- Streak heatmap, last 30 days
- Achievement grid (earned = colored, locked = grayscale)
- Category completion bars

### 10.9 Search
Single input. Case-insensitive substring match against `target`, `base`, and joined `tags`. Results sorted by: exact match > prefix match > substring match. No external fuzzy lib (~30 LOC hand-rolled scorer in `utils/searchScore.ts`). Compact result rows linking to word detail.

### 10.10 Settings
- Pair switcher (dropdown of registered pairs; v1 has only `pl-uk`)
- Session size slider (5 / 10 / 20 / 30)
- Theme toggle (light / dark — dark theme deferred to nice-to-have, light only in v1)
- "Reset progress for this pair" (confirm dialog → wipes pair data)

## 11. Visual style (Playful Pastel)

Tailwind theme tokens:

```ts
colors: {
  brand:   { 50:'#fef3f2', 100:'#fce7f3', 500:'#ec4899', 700:'#be185d' },
  accent:  { 50:'#dbeafe', 500:'#3b82f6', 700:'#1e40af' },
  surface: { page:'#fafafa', card:'#ffffff', muted:'#f4f4f5' },
}
fontFamily: {
  sans:    ['Inter', 'system-ui', 'sans-serif'],
  display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
}
borderRadius: { '4xl': '2rem' }
boxShadow:    { soft: '0 8px 24px rgba(219,39,119,0.08)' }
```

Patterns:
- Cards: `bg-surface-card rounded-3xl shadow-soft p-6`
- Pills: `rounded-full bg-brand-50 text-brand-700 px-3 py-1 text-xs`
- Primary button: `bg-brand-500 text-white rounded-2xl px-5 py-3 font-semibold active:scale-[0.97]`
- Secondary: `bg-surface-muted text-zinc-700 rounded-2xl px-5 py-3 font-medium`
- Page transitions: opacity fade, 150 ms.
- Tap feedback: `active:scale-[0.97]` everywhere it's a tap target.
- Confetti emoji burst on streak milestones / achievements (lightweight CSS keyframes, no library).

## 12. Starter content scope

| Category | Items | Notes |
|----------|-------|-------|
| Nouns | ~80 | animals, family, food, body, home, transport, nature, time, clothes, school |
| Verbs | ~80 | essential motion, communication, cognition, daily routine, common irregular |
| Adjectives | ~80 | size, color, taste, emotion, character, opposites |
| Common | ~80 | numbers 1–20, days, months, greetings, courtesy, question words, pronouns |
| Phrases | ~80 | introductions, shop/cafe, transport, emergencies, small talk, time/date |

Each item: `target`, `base`, example pair, `emoji`, `difficulty`, `tags`. `association` written for ~60 % of items where a Ukrainian sound-alike or memorable hint exists; remainder left empty rather than padded with weak hints.

Grammar: 10 lessons.
1. Алфавіт і вимова
2. Рід іменників
3. Множина іменників
4. Називний відмінок
5. Знахідний відмінок
6. Родовий відмінок (basic uses)
7. Прикметники: рід і число
8. Дієвідміни I і II
9. Минулий час
10. Числівники

Each lesson: 150–300 words of Ukrainian explanation, 4–8 examples, 1–2 tables.

## 13. GitHub Pages deployment

### 13.1 Vite config

```ts
export default defineConfig({
  base: process.env.VITE_BASE ?? '/vocawise/',
  plugins: [react()],
  resolve: { alias: { /* path aliases */ } },
});
```

The `/vocawise/` base assumes a project page at `https://<user>.github.io/vocawise/`. Override with `VITE_BASE=/` for a user/organisation root page.

### 13.2 Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc -b && vite build",
    "preview": "vite preview",
    "lint": "eslint . && prettier --check .",
    "lint:fix": "eslint . --fix && prettier --write ."
  }
}
```

### 13.3 GitHub Actions

`.github/workflows/deploy.yml`:
- Trigger: push to `main`, plus manual dispatch.
- Steps: checkout → setup-node 22 → cache yarn → `yarn install` → `yarn build` → `actions/upload-pages-artifact` → `actions/deploy-pages@v4`.
- Permissions: `contents: read`, `pages: write`, `id-token: write`.
- Concurrency: cancel in-progress deploys.

### 13.4 Routing rationale

`HashRouter` chosen over `BrowserRouter` because GH Pages serves only static files. Deep paths like `/flashcards/session` would 404 on refresh; the `index.html` 404 fallback hack is fragile across nested routes. Hash-based routes (`#/flashcards/session`) keep refresh-safety with zero deploy plumbing. URL aesthetics traded for reliability.

## 14. Tooling & code quality

- TypeScript strict mode + `noUncheckedIndexedAccess` + `exactOptionalPropertyTypes`.
- ESLint flat config with: `@typescript-eslint`, `eslint-plugin-react-hooks`, `eslint-plugin-jsx-a11y`, `eslint-plugin-tailwindcss`, `eslint-config-prettier`.
- Prettier with `prettier-plugin-tailwindcss` (auto-sorts class names).
- Husky pre-commit hook runs `lint-staged` → prettier + eslint on staged `*.{ts,tsx,css}`.
- Vitest + RTL configured but no tests authored in v1.
- README covers: install, dev, build, deploy, "How to add a new language pair", "How to add new vocabulary".

## 15. Out of scope (v1)

- Audio / TTS (Web Speech API)
- PWA install / offline service worker
- Image upload (type field reserved)
- Dark theme implementation (toggle present, only light styled in v1)
- Cloud sync, accounts, multi-device
- Authored unit / integration tests

Each is a self-contained future increment that does not require schema changes.

## 16. Risks & open questions

| Risk | Mitigation |
|------|------------|
| Authoring 400 quality associations is slow | Spec accepts ~60 % association coverage; remaining items still useful with example sentence. |
| `localStorage` quota (5 MB) | Single small JSON blob per pair. ~400 cards × ~200 bytes ≈ 80 KB. Plenty of headroom. |
| Hash routing produces ugly URLs | Acceptable for personal learning app; switch to BrowserRouter+`404.html` shim possible later. |
| Adding new pair requires recompile | Acceptable trade-off for type-safety; switching to runtime JSON loading is a future option. |
| Polish keyboard input on mobile (FillBlank typing) | Default to picker UI; allow free text only when device locale supports Polish input. |

## 17. Ready for plan

Spec is approved end-to-end with the user across five sections. Next step: invoke `superpowers:writing-plans` to break this into an executable, testable implementation plan.
