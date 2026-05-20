import { useState } from 'react';
import { AppBar } from '@components/AppBar';
import { Card } from '@components/Card';
import { Button } from '@components/Button';
import { ConfirmDialog } from '@components/ConfirmDialog';
import { listPairs } from '@data/language-pairs';
import { useSettings } from '@contexts/SettingsContext';
import { useProgress } from '@contexts/ProgressContext';
import { useToast } from '@components/Toast';
import { useT } from '@hooks/useT';

const SESSION_SIZES = [5, 10, 20, 30] as const;

export default function SettingsPage() {
  const t = useT();
  const { global, perPair, setActivePair, setTheme, setSessionSize } = useSettings();
  const { resetProgress } = useProgress();
  const { push } = useToast();
  const [confirmReset, setConfirmReset] = useState(false);

  const pairs = listPairs();
  const currentSize = perPair[global.activePairId]?.sessionSize ?? 10;

  return (
    <>
      <AppBar title={t('nav.settings')} back />
      <div className="mx-auto flex max-w-md flex-col gap-4 px-4 py-2">
        <Card>
          <h3 className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
            {t('settings.pair')}
          </h3>
          <div className="flex flex-col gap-2">
            {pairs.map((p) => (
              <button
                key={p.id}
                onClick={() => setActivePair(p.id)}
                className={`flex items-center gap-3 rounded-2xl p-3 text-left ${
                  global.activePairId === p.id ? 'bg-brand-50 text-brand-700' : 'bg-surface-muted'
                }`}
              >
                <span aria-hidden>
                  {p.flagTarget}→{p.flagBase}
                </span>
                <span className="flex-1">
                  <strong>{p.targetName}</strong> через {p.baseName.toLowerCase()}
                </span>
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
            {t('settings.sessionSize')}
          </h3>
          <div className="grid grid-cols-4 gap-2">
            {SESSION_SIZES.map((n) => (
              <button
                key={n}
                onClick={() => setSessionSize(global.activePairId, n)}
                className={`rounded-2xl py-3 font-semibold ${
                  currentSize === n ? 'bg-brand-500 text-white' : 'bg-surface-muted text-zinc-700'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="mb-2 text-xs uppercase tracking-wide text-zinc-500">
            {t('settings.theme')}
          </h3>
          <div className="flex gap-2">
            <Button
              variant={global.theme === 'light' ? 'primary' : 'secondary'}
              onClick={() => setTheme('light')}
            >
              {t('settings.theme.light')}
            </Button>
            <Button
              variant={global.theme === 'dark' ? 'primary' : 'secondary'}
              onClick={() => setTheme('dark')}
              disabled
            >
              {t('settings.theme.dark')}
            </Button>
          </div>
          <p className="mt-2 text-xs text-zinc-500">Темна тема — у наступній версії.</p>
        </Card>

        <Button variant="danger" onClick={() => setConfirmReset(true)}>
          {t('settings.reset')}
        </Button>

        <ConfirmDialog
          open={confirmReset}
          title={t('settings.reset')}
          body={t('settings.resetConfirm', { pair: global.activePairId })}
          onCancel={() => setConfirmReset(false)}
          onConfirm={() => {
            resetProgress();
            setConfirmReset(false);
            push('Прогрес скинуто.', 'warning');
          }}
          destructive
        />
      </div>
    </>
  );
}
