import { useEffect, useMemo, useRef, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useFlashcardSession, type DeckFilter } from '@features/flashcards/useFlashcardSession';
import { useLeitner } from '@hooks/useLeitner';
import { shuffle } from '@utils/shuffle';
import { useT } from '@hooks/useT';
import type { VocabularyItem } from '@app-types/vocabulary';

const PAIRS_PER_ROUND = 5;

interface Slot {
  id: string;
  text: string;
  itemId: string;
  lang: 'target' | 'base';
  matched: boolean;
}

export function MatchPairsMode({ filter }: { filter: DeckFilter }) {
  const t = useT();
  const { queue } = useFlashcardSession(filter);
  const { rateCard } = useLeitner();
  const [round, setRound] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [selectedRight, setSelectedRight] = useState<string | null>(null);
  const [slots, setSlots] = useState<{ left: Slot[]; right: Slot[] }>({ left: [], right: [] });
  const slotsRef = useRef(slots);
  slotsRef.current = slots;

  const rounds = useMemo<VocabularyItem[][]>(() => {
    const groups: VocabularyItem[][] = [];
    for (let i = 0; i < queue.length; i += PAIRS_PER_ROUND) {
      groups.push(queue.slice(i, i + PAIRS_PER_ROUND));
    }
    return groups;
  }, [queue]);

  useEffect(() => {
    const items = rounds[round] ?? [];
    setSlots({
      left: shuffle(
        items.map((it) => ({
          id: `L-${it.id}`,
          text: it.target,
          itemId: it.id,
          lang: 'target' as const,
          matched: false,
        })),
      ),
      right: shuffle(
        items.map((it) => ({
          id: `R-${it.id}`,
          text: it.base,
          itemId: it.id,
          lang: 'base' as const,
          matched: false,
        })),
      ),
    });
    setSelectedLeft(null);
    setSelectedRight(null);
  }, [round, rounds]);

  useEffect(() => {
    if (!selectedLeft || !selectedRight) return;
    const { left, right } = slotsRef.current;
    const l = left.find((s) => s.id === selectedLeft);
    const r = right.find((s) => s.id === selectedRight);
    if (!l || !r || l.matched || r.matched) return;
    const correct = l.itemId === r.itemId;
    rateCard(l.itemId, correct);
    if (correct) {
      setScore((s) => s + 1);
      setSlots((s) => ({
        left: s.left.map((x) => (x.id === l.id ? { ...x, matched: true } : x)),
        right: s.right.map((x) => (x.id === r.id ? { ...x, matched: true } : x)),
      }));
    }
    const handle = setTimeout(() => {
      setSelectedLeft(null);
      setSelectedRight(null);
    }, 350);
    return () => clearTimeout(handle);
  }, [selectedLeft, selectedRight, rateCard]);

  const allMatched = slots.left.length > 0 && slots.left.every((x) => x.matched);
  useEffect(() => {
    if (allMatched && round < rounds.length) {
      const handle = setTimeout(() => setRound((r) => r + 1), 600);
      return () => clearTimeout(handle);
    }
    return;
  }, [allMatched, round, rounds.length]);

  const total = queue.length;
  const indexApprox = Math.min(
    total,
    round * PAIRS_PER_ROUND + slots.left.filter((s) => s.matched).length,
  );
  const done = round >= rounds.length;

  if (rounds.length === 0) {
    return (
      <PracticeFrame title={t('practice.mode.matchPairs')} total={0} index={0} score={score} done>
        {null}
      </PracticeFrame>
    );
  }

  return (
    <PracticeFrame
      title={t('practice.mode.matchPairs')}
      total={total}
      index={indexApprox}
      score={score}
      done={done}
    >
      <p className="text-center text-sm text-zinc-500">{t('practice.matchAllPairs')}</p>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-2">
          {slots.left.map((s) => (
            <Button
              key={s.id}
              variant={s.matched ? 'primary' : selectedLeft === s.id ? 'primary' : 'secondary'}
              disabled={s.matched}
              onClick={() => setSelectedLeft(s.id)}
            >
              {s.text}
            </Button>
          ))}
        </div>
        <div className="flex flex-col gap-2">
          {slots.right.map((s) => (
            <Button
              key={s.id}
              variant={s.matched ? 'primary' : selectedRight === s.id ? 'primary' : 'secondary'}
              disabled={s.matched}
              onClick={() => setSelectedRight(s.id)}
            >
              {s.text}
            </Button>
          ))}
        </div>
      </div>
      {!done && (
        <Card padding="sm" className="text-center text-xs text-zinc-500">
          Раунд {round + 1} / {rounds.length}
        </Card>
      )}
    </PracticeFrame>
  );
}
