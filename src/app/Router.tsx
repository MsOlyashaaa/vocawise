import { HashRouter, Route, Routes } from 'react-router-dom';
import { AppShell } from './AppShell';

import HomePage from '@pages/HomePage';
import VocabularyCategoriesPage from '@pages/VocabularyCategoriesPage';
import VocabularyListPage from '@pages/VocabularyListPage';
import WordDetailPage from '@pages/WordDetailPage';
import FlashcardsPickerPage from '@pages/FlashcardsPickerPage';
import FlashcardsSessionPage from '@pages/FlashcardsSessionPage';
import PracticePickerPage from '@pages/PracticePickerPage';
import PracticeSessionPage from '@pages/PracticeSessionPage';
import GrammarListPage from '@pages/GrammarListPage';
import GrammarLessonPage from '@pages/GrammarLessonPage';
import ProgressPage from '@pages/ProgressPage';
import FavoritesPage from '@pages/FavoritesPage';
import SearchPage from '@pages/SearchPage';
import SettingsPage from '@pages/SettingsPage';

export function Router() {
  return (
    <HashRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/vocabulary" element={<VocabularyCategoriesPage />} />
          <Route path="/vocabulary/word/:id" element={<WordDetailPage />} />
          <Route path="/vocabulary/:category" element={<VocabularyListPage />} />
          <Route path="/flashcards" element={<FlashcardsPickerPage />} />
          <Route path="/flashcards/session" element={<FlashcardsSessionPage />} />
          <Route path="/practice" element={<PracticePickerPage />} />
          <Route path="/practice/:mode" element={<PracticeSessionPage />} />
          <Route path="/grammar" element={<GrammarListPage />} />
          <Route path="/grammar/:lessonId" element={<GrammarLessonPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </AppShell>
    </HashRouter>
  );
}
