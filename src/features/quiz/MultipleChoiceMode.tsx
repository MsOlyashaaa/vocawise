import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useFlashcardSession, type DeckFilter } from '@features/flashcards/useFlashcardSession';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { useLeitner } from '@hooks/useLeitner';
import { pickN } from '@utils/shuffle';
import { useT } from '@hooks/useT';

interface Props {
  filter: DeckFilter;
}

export function MultipleChoiceMode({ filter }: Props) {
  const t = useT();
  const { queue, current, done, index, onKnow, onRepeat } = useFlashcardSession(filter);
  const { vocabulary } = useLanguagePairContext();
  const { rateCard } = useLeitner();
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const options = useMemo(() => {
    if (!current) return [];
    const distractorsPool = vocabulary.filter(
      (v) => v.category === current.category && v.id !== current.id,
    );
    const distractors = pickN(distractorsPool, 3).map((v) => v.base);
    return pickN([current.base, ...distractors], 4);
  }, [current, vocabulary]);

  if (!current) {
    return (
      <PracticeFrame
        title={t('practice.mode.multipleChoice')}
        total={queue.length}
        index={queue.length}
        score={score}
        done
      >
        {null}
      </PracticeFrame>
    );
  }

  function choose(opt: string) {
    if (picked || !current) return;
    setPicked(opt);
    const correct = opt === current.base;
    if (correct) setScore((s) => s + 1);
    rateCard(current.id, correct);
    setTimeout(() => {
      setPicked(null);
      if (correct) onKnow();
      else onRepeat();
    }, 700);
  }

  return (
    <PracticeFrame
      title={t('practice.mode.multipleChoice')}
      total={queue.length}
      index={index}
      score={score}
      done={done}
    >
      <Card className="text-center">
        <div className="mb-2 text-5xl" aria-hidden>
          {current.emoji ?? '📖'}
        </div>
        <div className="font-display text-3xl font-bold">{current.target}</div>
        <p className="mt-1 text-xs text-zinc-500">{t('practice.pickTranslation')}</p>
      </Card>
      <div className="grid grid-cols-1 gap-2">
        {options.map((opt) => {
          let tone: 'secondary' | 'primary' | 'danger' = 'secondary';
          if (picked) {
            if (opt === current.base) tone = 'primary';
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
