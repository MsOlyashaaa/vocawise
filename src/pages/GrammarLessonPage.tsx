import { Navigate, useParams } from 'react-router-dom';
import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { LessonRenderer } from '@features/grammar/LessonRenderer';
import { useGrammarLesson } from '@hooks/useGrammar';
import { useProgress } from '@contexts/ProgressContext';
import { useToast } from '@components/Toast';
import { useT } from '@hooks/useT';
import { GRAMMAR_TOPIC_LABELS_UK } from '@app-types/grammar';

export default function GrammarLessonPage() {
  const t = useT();
  const { lessonId } = useParams<{ lessonId: string }>();
  const decoded = lessonId ? decodeURIComponent(lessonId) : '';
  const lesson = useGrammarLesson(decoded);
  const { lessonsRead, markLessonRead } = useProgress();
  const { push } = useToast();

  if (!lesson) return <Navigate to="/grammar" replace />;
  const isRead = lessonsRead.includes(lesson.id);

  return (
    <>
      <AppBar title={lesson.title} subtitle={GRAMMAR_TOPIC_LABELS_UK[lesson.topic]} back />
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-2">
        <Card variant="muted">
          <p className="text-sm">{lesson.summary}</p>
        </Card>
        <LessonRenderer blocks={lesson.body} />
        {lesson.examples.length > 0 ? (
          <Card>
            <h3 className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
              {t('grammar.example')}
            </h3>
            <div className="flex flex-col gap-2">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="rounded-2xl bg-surface-muted p-2">
                  <div className="font-semibold">{ex.target}</div>
                  <div className="text-sm text-zinc-600">{ex.base}</div>
                </div>
              ))}
            </div>
          </Card>
        ) : null}
        <Button
          variant={isRead ? 'secondary' : 'primary'}
          fullWidth
          onClick={() => {
            if (!isRead) {
              markLessonRead(lesson.id);
              push('Урок позначено як прочитаний.');
            }
          }}
          disabled={isRead}
        >
          {isRead ? t('grammar.read') : t('grammar.markRead')}
        </Button>
      </div>
    </>
  );
}
