import { Link } from 'react-router-dom';
import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
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

export default function PracticePickerPage() {
  const t = useT();
  return (
    <>
      <AppBar title={t('practice.modes')} />
      <div className="mx-auto grid max-w-md grid-cols-2 gap-3 px-4 py-2">
        {MODES.map((m) => (
          <Link key={m.id} to={`/practice/${m.id}`}>
            <Card className="flex flex-col items-center gap-2 text-center active:scale-[0.98]">
              <div className="text-4xl" aria-hidden>
                {m.emoji}
              </div>
              <div className="font-semibold">{t(m.key)}</div>
            </Card>
          </Link>
        ))}
      </div>
    </>
  );
}
