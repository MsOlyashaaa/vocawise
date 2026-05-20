import type { ReactNode } from 'react';
import { SettingsProvider } from '@contexts/SettingsContext';
import { LanguagePairProvider } from '@contexts/LanguagePairContext';
import { ProgressProvider } from '@contexts/ProgressContext';
import { FavoritesProvider } from '@contexts/FavoritesContext';
import { ToastProvider, ToastQuotaBridge } from '@components/Toast';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <SettingsProvider>
      <LanguagePairProvider>
        <ProgressProvider>
          <FavoritesProvider>
            <ToastProvider>
              <ToastQuotaBridge>{children}</ToastQuotaBridge>
            </ToastProvider>
          </FavoritesProvider>
        </ProgressProvider>
      </LanguagePairProvider>
    </SettingsProvider>
  );
}
