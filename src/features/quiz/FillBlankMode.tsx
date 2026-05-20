import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useFlashcardSession, type DeckFilter } from '@features/flashcards/useFlashcardSession';
import { useLeitner } from '@hooks/useLeitner';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { pickN } from '@utils/shuffle';
import { useT } from '@hooks/useT';

export function FillBlankMode({ filter }: { filter: DeckFilter }) {
  const t = useT();
  const fullSession = useFlashcardSession(filter);
  const queue = useMemo(
    () => fullSession.queue.filter((v) => v.exampleTarget?.includes(v.target)),
    [fullSession.queue],
  );
  const current = queue[fullSession.index];
  const { vocabulary } = useLanguagePairContext();
  const { rateCard } = useLeitner();
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const sentence = useMemo(() => {
    if (!current?.exampleTarget) return '';
    return current.exampleTarget.replace(current.target, '____');
  }, [current]);

  const options = useMemo(() => {
    if (!current) return [];
    const distractors = pickN(
      vocabulary.filter((v) => v.category === current.category && v.id !== current.id),
      3,
    ).map((v) => v.target);
    return pickN([current.target, ...distractors], 4);
  }, [current, vocabulary]);

  if (!current) {
    return (
      <PracticeFrame
        title={t('practice.mode.fillBlank')}
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
    const correct = opt === current.target;
    if (correct) setScore((s) => s + 1);
    rateCard(current.id, correct);
    setTimeout(() => {
      setPicked(null);
      if (correct) fullSession.onKnow();
      else fullSession.onRepeat();
    }, 700);
  }

  return (
    <PracticeFrame
      title={t('practice.mode.fillBlank')}
      total={queue.length}
      index={fullSession.index}
      score={score}
      done={fullSession.done}
    >
      <Card>
        <p className="font-display text-xl">{sentence}</p>
        <p className="mt-1 text-sm text-zinc-500">{current.exampleBase}</p>
      </Card>
      <div className="grid grid-cols-2 gap-2">
        {options.map((opt) => {
          let tone: 'secondary' | 'primary' | 'danger' = 'secondary';
          if (picked) {
            if (opt === current.target) tone = 'primary';
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
