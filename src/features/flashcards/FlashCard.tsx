import { useState } from 'react';
import { Card } from '@components/Card';
import { EmojiHero } from '@features/vocabulary/EmojiHero';
import { AssociationCallout } from '@features/vocabulary/AssociationCallout';
import { useT } from '@hooks/useT';
import type { VocabularyItem } from '@app-types/vocabulary';

interface Props {
  item: VocabularyItem;
}

export function FlashCard({ item }: Props) {
  const t = useT();
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      onClick={() => setFlipped((f) => !f)}
      className="perspective aspect-[3/4] w-full max-w-sm focus:outline-none"
      aria-label="Перевернути картку"
    >
      <div
        className={`preserve-3d relative h-full w-full transition-transform duration-300 ${flipped ? 'rotate-y-180' : ''}`}
      >
        <div className="backface-hidden absolute inset-0">
          <Card className="flex h-full flex-col items-center justify-center gap-4 text-center">
            <EmojiHero emoji={item.emoji} size="lg" />
            <div className="font-display text-4xl font-bold">{item.target}</div>
            <div className="text-xs text-zinc-400">{t('flashcard.tapToFlip')}</div>
          </Card>
        </div>
        <div className="backface-hidden rotate-y-180 absolute inset-0">
          <Card
            variant="brand"
            className="flex h-full flex-col items-center justify-center gap-3 text-center"
          >
            <div className="font-display text-3xl font-bold">{item.base}</div>
            {item.exampleTarget ? (
              <div className="text-sm">
                <em className="block">{item.exampleTarget}</em>
                <span className="block opacity-70">{item.exampleBase}</span>
              </div>
            ) : null}
            {item.association ? (
              <div className="w-full">
                <AssociationCallout
                  association={item.association}
                  similarSounding={item.similarSounding}
                />
              </div>
            ) : null}
          </Card>
        </div>
      </div>
    </button>
  );
}
