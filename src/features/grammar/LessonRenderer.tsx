import { GrammarTable } from './GrammarTable';
import type { GrammarBlock } from '@app-types/grammar';

export function LessonRenderer({ blocks }: { blocks: readonly GrammarBlock[] }) {
  return (
    <div className="flex flex-col gap-4">
      {blocks.map((b, i) => {
        switch (b.type) {
          case 'p':
            return (
              <p key={i} className="leading-relaxed text-zinc-800">
                {b.text}
              </p>
            );
          case 'h':
            return (
              <h3 key={i} className="mt-2 font-display text-lg font-bold">
                {b.text}
              </h3>
            );
          case 'example':
            return (
              <div key={i} className="rounded-2xl bg-surface-muted p-3">
                <div className="font-semibold">{b.target}</div>
                <div className="text-sm text-zinc-600">{b.base}</div>
              </div>
            );
          case 'table':
            return <GrammarTable key={i} headers={b.headers} rows={b.rows} />;
          case 'note':
            return (
              <div key={i} className="rounded-2xl bg-accent-50 p-3 text-sm text-accent-700">
                💡 {b.text}
              </div>
            );
        }
      })}
    </div>
  );
}
