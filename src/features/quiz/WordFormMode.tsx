import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useFlashcardSession, type DeckFilter } from '@features/flashcards/useFlashcardSession';
import { useLeitner } from '@hooks/useLeitner';
import { pickN, shuffle } from '@utils/shuffle';
import { useT } from '@hooks/useT';

interface Challenge {
  itemId: string;
  prompt: string;
  correct: string;
  distractors: string[];
}

interface ItemLike {
  id: string;
  target: string;
  base: string;
  meta?: { plural?: string; conjugation?: Readonly<Record<string, string>> };
}

function buildChallenge(item: ItemLike): Challenge | null {
  if (item.meta?.plural) {
    const correct = item.meta.plural;
    return {
      itemId: item.id,
      prompt: `Множина від «${item.target}»`,
      correct,
      distractors: [item.target, item.target + 'i', item.target + 'y'].filter((d) => d !== correct),
    };
  }
  if (item.meta?.conjugation) {
    const persons = Object.keys(item.meta.conjugation);
    if (persons.length >= 4) {
      const target = persons[0]!;
      const correct = item.meta.conjugation[target]!;
      const distractors = persons.slice(1, 4).map((p) => item.meta!.conjugation![p]!);
      return {
        itemId: item.id,
        prompt: `Форма «${item.target}» для «${target}»`,
        correct,
        distractors,
      };
    }
  }
  return null;
}

export function WordFormMode({ filter }: { filter: DeckFilter }) {
  const t = useT();
  const fullSession = useFlashcardSession(filter);
  const challenges = useMemo(() => {
    return fullSession.queue.map(buildChallenge).filter((c): c is Challenge => c !== null);
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
