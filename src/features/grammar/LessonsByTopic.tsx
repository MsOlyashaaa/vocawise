import { Link } from 'react-router-dom';
import { Card } from '@components/Card';
import { Pill } from '@components/Pill';
import { useGrammarByTopic } from '@hooks/useGrammar';
import { useProgress } from '@contexts/ProgressContext';
import { GRAMMAR_TOPIC_LABELS_UK, type GrammarTopic } from '@app-types/grammar';

const TOPIC_ORDER: GrammarTopic[] = ['cases', 'gender', 'plurals', 'verbs', 'adjectives', 'other'];

export function LessonsByTopic() {
  const byTopic = useGrammarByTopic();
  const { lessonsRead } = useProgress();
  return (
    <div className="flex flex-col gap-6">
      {TOPIC_ORDER.map((topic) => {
        const lessons = byTopic[topic];
        if (lessons.length === 0) return null;
        return (
          <section key={topic} className="flex flex-col gap-2">
            <h2 className="font-display text-xl font-bold">{GRAMMAR_TOPIC_LABELS_UK[topic]}</h2>
            <ul className="flex flex-col gap-2">
              {lessons.map((l) => (
                <li key={l.id}>
                  <Link to={`/grammar/${encodeURIComponent(l.id)}`}>
                    <Card padding="sm" className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="font-semibold">{l.title}</div>
                        <div className="text-xs text-zinc-500">{l.summary}</div>
                      </div>
                      {lessonsRead.includes(l.id) ? <Pill tone="success">прочитано</Pill> : null}
                    </Card>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}
