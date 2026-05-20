import { NavLink } from 'react-router-dom';
import { useT } from '@hooks/useT';

interface Tab {
  to: string;
  label: string;
  emoji: string;
  exact?: boolean;
}
const TABS: readonly Tab[] = [
  { to: '/', label: 'home', emoji: '🏠', exact: true },
  { to: '/vocabulary', label: 'vocab', emoji: '📚' },
  { to: '/flashcards', label: 'flashcards', emoji: '🎴' },
  { to: '/practice', label: 'practice', emoji: '📝' },
  { to: '/progress', label: 'progress', emoji: '📊' },
];

export function BottomNav() {
  const t = useT();
  return (
    <nav className="safe-bottom fixed inset-x-0 bottom-0 z-30 border-t border-surface-border bg-surface-card">
      <ul className="mx-auto grid max-w-md grid-cols-5">
        {TABS.map((tab) => (
          <li key={tab.to}>
            <NavLink
              to={tab.to}
              end={tab.exact === true}
              className={({ isActive }) =>
                `flex flex-col items-center gap-0.5 py-2 text-[11px] ${
                  isActive ? 'text-brand-600' : 'text-zinc-500'
                }`
              }
            >
              <span className="text-xl leading-none" aria-hidden>
                {tab.emoji}
              </span>
              <span>{t(`nav.${tab.label}`)}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
}
