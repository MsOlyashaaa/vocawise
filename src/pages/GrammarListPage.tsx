import { AppBar } from '@components/AppBar';
import { LessonsByTopic } from '@features/grammar/LessonsByTopic';
import { useT } from '@hooks/useT';

export default function GrammarListPage() {
  const t = useT();
  return (
    <>
      <AppBar title={t('grammar.lessons')} />
      <div className="mx-auto max-w-md px-4 py-2">
        <LessonsByTopic />
      </div>
    </>
  );
}
