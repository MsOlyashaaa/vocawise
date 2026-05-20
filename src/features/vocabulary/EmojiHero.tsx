export function EmojiHero({
  emoji,
  size = 'md',
}: {
  emoji?: string | undefined;
  size?: 'sm' | 'md' | 'lg';
}) {
  if (!emoji) return null;
  const cls = size === 'lg' ? 'text-7xl' : size === 'sm' ? 'text-3xl' : 'text-5xl';
  return (
    <div className={`leading-none ${cls}`} aria-hidden>
      {emoji}
    </div>
  );
}
