import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useFlashcardSession, type DeckFilter } from '@features/flashcards/useFlashcardSession';
import { useLeitner } from '@hooks/useLeitner';
import { pickN, shuffle } from '@utils/shuffle';
import { useT } from '@hooks/useT';
import type { VocabularyItem, NounCases } from '@app-types/vocabulary';

interface Challenge {
  itemId: string;
  prompt: string;
  correct: string;
  distractors: string[];
}

const PERSON_LABELS: Readonly<Record<string, string>> = {
  ja: 'я',
  ty: 'ти',
  on: 'він / вона',
  my: 'ми',
  wy: 'ви',
  oni: 'вони',
};

const CASE_LABELS: Readonly<Record<keyof NounCases, string>> = {
  gen: 'родовий однини',
  dat: 'давальний однини',
  acc: 'знахідний однини',
  ins: 'орудний однини',
  loc: 'місцевий однини',
  voc: 'кличний однини',
  genPl: 'родовий множини',
  datPl: 'давальний множини',
  accPl: 'знахідний множини',
  insPl: 'орудний множини',
  locPl: 'місцевий множини',
};

function buildChallenges(item: VocabularyItem): Challenge[] {
  const out: Challenge[] = [];

  // Plural (nouns)
  if (item.meta?.plural && item.meta.plural !== item.target) {
    out.push({
      itemId: item.id,
      prompt: `Множина від «${item.target}»`,
      correct: item.meta.plural,
      distractors: [item.target, item.target + 'i', item.target + 'y', item.target + 'e'].filter(
        (d) => d !== item.meta!.plural,
      ),
    });
  }

  // Conjugation — one challenge per person form
  const conj = item.meta?.conjugation;
  if (conj) {
    const persons = Object.keys(conj);
    const otherForms = persons.map((p) => conj[p]!).filter(Boolean);
    for (const p of persons) {
      const correct = conj[p];
      if (!correct) continue;
      const label = PERSON_LABELS[p] ?? p;
      out.push({
        itemId: item.id,
        prompt: `«${item.target}» для «${label}»`,
        correct,
        distractors: otherForms.filter((f) => f !== correct),
      });
    }
  }

  // Past tense forms (verbs)
  const past = item.meta?.past;
  if (past) {
    const pastForms = [past.onM, past.onaF, past.onN, past.mPersPl, past.otherPl].filter(
      (f): f is string => Boolean(f),
    );
    const pastLabels: [keyof typeof past, string][] = [
      ['onM', 'він (минулий)'],
      ['onaF', 'вона (минулий)'],
      ['mPersPl', 'вони — особ. чол. (минулий)'],
      ['otherPl', 'вони — інше (минулий)'],
    ];
    for (const [k, label] of pastLabels) {
      const correct = past[k];
      if (!correct) continue;
      out.push({
        itemId: item.id,
        prompt: `«${item.target}» — ${label}`,
        correct,
        distractors: pastForms.filter((f) => f !== correct),
      });
    }
  }

  // Noun cases — one challenge per case
  const cases = item.meta?.cases;
  if (cases) {
    const caseForms = Object.values(cases).filter((v): v is string => Boolean(v));
    for (const key of Object.keys(cases) as (keyof NounCases)[]) {
      const correct = cases[key];
      if (!correct) continue;
      const label = CASE_LABELS[key];
      out.push({
        itemId: item.id,
        prompt: `«${item.target}» — ${label}`,
        correct,
        distractors: caseForms.filter((f) => f !== correct),
      });
    }
  }

  return out;
}

export function WordFormMode({
  filter,
  count,
}: {
  filter: DeckFilter;
  count?: number | undefined;
}) {
  const t = useT();
  const fullSession = useFlashcardSession(filter, count);
  const challenges = useMemo(() => {
    return shuffle(fullSession.queue.flatMap(buildChallenges));
  }, [fullSession.queue]);
  const { rateCard } = useLeitner();
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const ch = challenges[idx];
  const options = useMemo(() => {
    if (!ch) return [];
    return shuffle([ch.correct, ...pickN(ch.distractors, 3)]);
  }, [ch]);

  if (challenges.length === 0) {
    return (
      <PracticeFrame title={t('practice.mode.wordForm')} total={0} index={0} score={score} done>
        {null}
      </PracticeFrame>
    );
  }
  if (!ch) {
    return (
      <PracticeFrame
        title={t('practice.mode.wordForm')}
        total={challenges.length}
        index={challenges.length}
        score={score}
        done
      >
        {null}
      </PracticeFrame>
    );
  }

  function choose(opt: string) {
    if (picked || !ch) return;
    setPicked(opt);
    const correct = opt === ch.correct;
    if (correct) setScore((s) => s + 1);
    rateCard(ch.itemId, correct);
    setTimeout(() => {
      setPicked(null);
      setIdx((i) => i + 1);
    }, 700);
  }

  return (
    <PracticeFrame
      title={t('practice.mode.wordForm')}
      total={challenges.length}
      index={idx}
      score={score}
      done={idx >= challenges.length}
    >
      <Card>
        <p className="font-display text-lg">{ch.prompt}</p>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          let tone: 'secondary' | 'primary' | 'danger' = 'secondary';
          if (picked) {
            if (opt === ch.correct) tone = 'primary';
            else if (opt === picked) tone = 'danger';
          }
          return (
            <Button key={opt} variant={tone} onClick={() => choose(opt)} disabled={picked !== null}>
              {opt}
            </Button>
          );
        })}
      </div>
    </PracticeFrame>
  );
}
