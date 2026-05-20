import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
import { Pill } from '@components/Pill';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { CATEGORIES, CATEGORY_LABELS_UK, type VocabCategory } from '@app-types/vocabulary';
import { useT } from '@hooks/useT';

const MODES = [
  { id: 'multipleChoice', emoji: '✔️', key: 'practice.mode.multipleChoice' },
  { id: 'matchPairs', emoji: '🧩', key: 'practice.mode.matchPairs' },
  { id: 'fillBlank', emoji: '✏️', key: 'practice.mode.fillBlank' },
  { id: 'wordForm', emoji: '🔄', key: 'practice.mode.wordForm' },
  { id: 'grammar', emoji: '📐', key: 'practice.mode.grammar' },
  { id: 'repeatDifficult', emoji: '🔁', key: 'practice.mode.repeatDifficult' },
  { id: 'association', emoji: '💭', key: 'practice.mode.association' },
] as const;

const COUNTS = [5, 10, 20, 30, 50] as const;

const SETTINGS_KEY = 'vocawise:practice-setup';

interface Setup {
  category: VocabCategory | 'all';
  tag: string;
  count: number;
}

function loadSetup(): Setup {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return JSON.parse(raw) as Setup;
  } catch {
    /* noop */
  }
  return { category: 'all', tag: 'all', count: 10 };
}

function saveSetup(s: Setup): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* noop */
  }
}

export default function PracticePickerPage() {
  const t = useT();
  const nav = useNavigate();
  const { vocabulary } = useLanguagePairContext();
  const [setup, setSetup] = useState<Setup>(() => loadSetup());

  const pool = useMemo(() => {
    if (setup.category === 'all') return vocabulary;
    return vocabulary.filter((v) => v.category === setup.category);
  }, [vocabulary, setup.category]);

  const tags = useMemo(() => {
    const counts = new Map<string, number>();
    for (const v of pool) for (const tg of v.tags ?? []) counts.set(tg, (counts.get(tg) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [pool]);

  const eligible = useMemo(
    () => pool.filter((v) => setup.tag === 'all' || (v.tags ?? []).includes(setup.tag)).length,
    [pool, setup.tag],
  );

  function update<K extends keyof Setup>(k: K, v: Setup[K]): void {
    const next = { ...setup, [k]: v };
    if (k === 'category') next.tag = 'all';
    setSetup(next);
    saveSetup(next);
  }

  function start(mode: string): void {
    const params = new URLSearchParams();
    if (setup.category !== 'all') params.set('cat', setup.category);
    if (setup.tag !== 'all') params.set('tag', setup.tag);
    params.set('count', String(setup.count));
    nav(`/practice/${mode}?${params.toString()}`);
  }

  return (
    <>
      <AppBar title={t('practice.modes')} />
      <div className="mx-auto flex max-w-md flex-col gap-3 px-4 py-2">
        <Card>
          <h3 className="mb-2 text-xs uppercase tracking-wide text-zinc-500">Налаштування тесту</h3>

          <div className="mb-2 text-xs font-semibold text-zinc-600">Категорія</div>
          <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1">
            <button onClick={() => update('category', 'all')} className="shrink-0">
              <Pill tone={setup.category === 'all' ? 'brand' : 'neutral'}>усі</Pill>
            </button>
            {CATEGORIES.map((c) => (
              <button key={c} onClick={() => update('category', c)} className="shrink-0">
                <Pill tone={setup.category === c ? 'brand' : 'neutral'}>
                  {CATEGORY_LABELS_UK[c]}
                </Pill>
              </button>
            ))}
          </div>

          {tags.length > 0 ? (
            <>
              <div className="mb-2 text-xs font-semibold text-zinc-600">Тема</div>
              <div className="-mx-1 mb-3 flex gap-2 overflow-x-auto px-1 pb-1">
                <button onClick={() => update('tag', 'all')} className="shrink-0">
                  <Pill tone={setup.tag === 'all' ? 'accent' : 'neutral'}>усі</Pill>
                </button>
                {tags.map(([tg, n]) => (
                  <button key={tg} onClick={() => update('tag', tg)} className="shrink-0">
                    <Pill tone={setup.tag === tg ? 'accent' : 'neutral'}>
                      {tg} · {n}
                    </Pill>
                  </button>
                ))}
              </div>
            </>
          ) : null}

          <div className="mb-2 text-xs font-semibold text-zinc-600">Кількість слів</div>
          <div className="grid grid-cols-5 gap-2">
            {COUNTS.map((n) => (
              <button
                key={n}
                onClick={() => update('count', n)}
                className={`rounded-2xl py-2 font-semibold ${
                  setup.count === n ? 'bg-brand-500 text-white' : 'bg-surface-muted text-zinc-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>

          <div className="mt-2 text-xs text-zinc-500">
            Доступно слів у вибірці: <strong>{eligible}</strong>
          </div>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => start(m.id)}>
              <Card className="flex flex-col items-center gap-2 text-center active:scale-[0.98]">
                <div className="text-4xl" aria-hidden>
                  {m.emoji}
                </div>
                <div className="font-semibold">{t(m.key)}</div>
              </Card>
            </button>
          ))}
        </div>
      </div>
    </>
  );
}
