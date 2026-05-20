import { AppBar } from '@components/AppBar';
import { DeckPicker } from '@features/flashcards/DeckPicker';
import { useT } from '@hooks/useT';

export default function FlashcardsPickerPage() {
  const t = useT();
  return (
    <>
      <AppBar title={t('nav.flashcards')} />
      <div className="mx-auto max-w-md px-4 py-2">
        <DeckPicker />
      </div>
    </>
  );
}
