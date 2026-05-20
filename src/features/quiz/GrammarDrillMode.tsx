import { useMemo, useState } from 'react';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { PracticeFrame } from './PracticeFrame';
import { useLanguagePairContext } from '@contexts/LanguagePairContext';
import { useSettings } from '@contexts/SettingsContext';
import { useLeitner } from '@hooks/useLeitner';
import { useT } from '@hooks/useT';
import { buildGrammarExercises, isCorrect, type GrammarExercise } from './grammarExercises';

type Status = 'idle' | 'correct' | 'wrong';

export function GrammarDrillMode() {
  const t = useT();
  const { vocabulary } = useLanguagePairContext();
  const { global, perPair } = useSettings();
  const sessionSize = perPair[global.activePairId]?.sessionSize ?? 10;
  const { rateCard } = useLeitner();

  const exercises = useMemo<GrammarExercise[]>(() => {
    return buildGrammarExercises(vocabulary).slice(0, sessionSize);
  }, [vocabulary, sessionSize]);

  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  const ex = exercises[idx];
  const total = exercises.length;
  const done = idx >= total;
  const title = t('practice.mode.grammar');

  if (total === 0) {
    return (
      <PracticeFrame title={title} total={0} index={0} score={score} done>
        {null}
      </PracticeFrame>
    );
  }

  function advance() {
    setInput('');
    setStatus('idle');
    setIdx((i) => i + 1);
  }

  function submitText(answer: string) {
    if (!ex || status !== 'idle') return;
    const correct = isCorrect(answer, ex.answer);
    if (correct) setScore((s) => s + 1);
    rateCard(ex.itemId, correct);
    setStatus(correct ? 'correct' : 'wrong');
    setTimeout(advance, correct ? 700 : 1500);
  }

  function pickChoice(opt: string) {
    if (ex?.kind !== 'choose' || status !== 'idle') return;
    const correct = opt === ex.answer;
    if (correct) setScore((s) => s + 1);
    rateCard(ex.itemId, correct);
    setStatus(correct ? 'correct' : 'wrong');
    setInput(opt);
    setTimeout(advance, correct ? 700 : 1500);
  }

  return (
    <PracticeFrame title={title} total={total} index={idx} score={score} done={done}>
      {ex ? (
        <ExerciseView
          ex={ex}
          status={status}
          input={input}
          setInput={setInput}
          onSubmit={submitText}
          onPick={pickChoice}
        />
      ) : null}
    </PracticeFrame>
  );
}

interface ViewProps {
  ex: GrammarExercise;
  status: Status;
  input: string;
  setInput: (v: string) => void;
  onSubmit: (s: string) => void;
  onPick: (s: string) => void;
}

function ExerciseView({ ex, status, input, setInput, onSubmit, onPick }: ViewProps) {
  if (ex.kind === 'choose') {
    return (
      <>
        <Card>
          <p className="text-xs uppercase tracking-wide text-zinc-500">{ex.caseLabel}</p>
          <p className="font-display text-xl">{ex.prompt.replace('___', '____')}</p>
          <p className="mt-1 text-sm text-zinc-500">«{ex.baseTranslation}»</p>
        </Card>
        <div className="grid grid-cols-2 gap-2">
          {ex.choices.map((opt) => {
            let tone: 'secondary' | 'primary' | 'danger' = 'secondary';
            if (status !== 'idle') {
              if (opt === ex.answer) tone = 'primary';
              else if (opt === input) tone = 'danger';
            }
            return (
              <Button
                key={opt}
                variant={tone}
                onClick={() => onPick(opt)}
                disabled={status !== 'idle'}
              >
                {opt}
              </Button>
            );
          })}
        </div>
      </>
    );
  }

  let label = '';
  let hint = '';
  if (ex.kind === 'decline') {
    label = `Поставте «${ex.baseForm}» у ${ex.caseLabel}`;
    hint = ex.baseTranslation;
  } else if (ex.kind === 'conjugate') {
    label = `Відмініть «${ex.infinitive}» для «${ex.personLabel}»`;
    hint = ex.infinitiveTranslation;
  } else {
    label = `Скажіть: ${ex.num} + «${ex.base}»`;
    hint = ex.baseTranslation;
  }

  return (
    <>
      <Card>
        <p className="font-display text-lg">{label}</p>
        <p className="mt-1 text-sm text-zinc-500">«{hint}»</p>
      </Card>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit(input);
        }}
        className="flex flex-col gap-2"
      >
        <input
          ref={(el) => el?.focus()}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          disabled={status !== 'idle'}
          className={`w-full rounded-2xl border-2 px-4 py-3 text-lg outline-none ${
            status === 'correct'
              ? 'border-green-500 bg-green-50'
              : status === 'wrong'
                ? 'border-red-500 bg-red-50'
                : 'border-zinc-200 focus:border-brand-500'
          }`}
          placeholder="..."
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
        />
        {status === 'wrong' ? (
          <p className="text-sm text-red-600">
            Правильно: <span className="font-semibold">{ex.answer}</span>
          </p>
        ) : null}
        <Button type="submit" disabled={!input.trim() || status !== 'idle'}>
          Перевірити
        </Button>
      </form>
    </>
  );
}
