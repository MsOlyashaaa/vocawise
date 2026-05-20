import { Link } from 'react-router-dom';
import { Card } from '@components/Card';
import { ProgressRing } from '@components/ProgressRing';
import { CATEGORY_EMOJI, CATEGORY_LABELS_UK, type VocabCategory } from '@app-types/vocabulary';

interface Props {
  category: VocabCategory;
  total: number;
  learned: number;
}

export function CategoryTile({ category, total, learned }: Props) {
  const pct = total > 0 ? learned / total : 0;
  return (
    <Link to={`/vocabulary/${category}`}>
      <Card className="flex flex-col gap-3 transition active:scale-[0.99]">
        <div className="flex items-center justify-between">
          <div className="text-4xl" aria-hidden>
            {CATEGORY_EMOJI[category]}
          </div>
          <ProgressRing value={pct} />
        </div>
        <div>
          <div className="font-display text-lg font-bold">{CATEGORY_LABELS_UK[category]}</div>
          <div className="text-xs text-zinc-500">
            {learned} / {total}
          </div>
        </div>
      </Card>
    </Link>
  );
}
