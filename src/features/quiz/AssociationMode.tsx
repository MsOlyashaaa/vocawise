import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useFlashcardSession, type DeckFilter } from '@features/flashcards/useFlashcardSession';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { useLeitner } from '@hooks/useLeitner';
import { pickN } from '@utils/shuffle';
import { useT } from '@hooks/useT';

export function AssociationMode({ filter }: { filter: DeckFilter }) {
  const t = useT();
  const fullSession = useFlashcardSession(filter);
  const { vocabulary } = useLanguagePairContext();
  const { rateCard } = useLeitner();
  const [score, setScore] = useState(0);
  const [picked, setPicked] = useState<string | null>(null);

  const queue = useMemo(
    () => fullSession.queue.filter((v) => v.emoji ?? v.association),
    [fullSession.queue],
  );
  const current = queue[fullSession.index];

  const options = useMemo(() => {
    if (!current) return [];
    const others = pickN(
      vocabulary.filter((v) => v.id !== current.id),
      3,
    ).map((v) => v.target);
    return pickN([current.target, ...others], 4);
  }, [current, vocabulary]);

  if (!current) {
    return (
      <PracticeFrame
        title={t('practice.mode.association')}
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
      title={t('practice.mode.association')}
      total={queue.length}
      index={fullSession.index}
      score={score}
      done={fullSession.done}
    >
      <Card variant="brand" className="text-center">
        <div className="mb-2 text-6xl" aria-hidden>
          {current.emoji ?? '💭'}
        </div>
        {current.association ? <p className="text-sm">{current.association}</p> : null}
        <p className="mt-2 text-xs opacity-70">{t('practice.pickWord')}</p>
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
