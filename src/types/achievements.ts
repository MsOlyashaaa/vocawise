import type { ProgressAggregate } from './progress';

export interface Achievement {
  id: string;
  name: string;
  icon: string;
  description: string;
  when: (p: ProgressAggregate) => boolean;
}

export const ACHIEVEMENTS: readonly Achievement[] = [
  {
    id: 'first-word',
    name: 'Перше слово',
    icon: '🌱',
    description: 'Вивчи перше слово',
    when: (p) => p.wordsLearned >= 1,
  },
  {
    id: 'ten-words',
    name: '10 слів',
    icon: '🌿',
    description: '10 слів вивчено',
    when: (p) => p.wordsLearned >= 10,
  },
  {
    id: 'fifty-words',
    name: '50 слів',
    icon: '📚',
    description: '50 слів вивчено',
    when: (p) => p.wordsLearned >= 50,
  },
  {
    id: 'hundred-words',
    name: '100 слів',
    icon: '📖',
    description: '100 слів вивчено',
    when: (p) => p.wordsLearned >= 100,
  },
  {
    id: 'streak-3',
    name: '3 дні поспіль',
    icon: '✨',
    description: '3 дні занять поспіль',
    when: (p) => p.currentStreak >= 3,
  },
  {
    id: 'streak-7',
    name: 'Тиждень поспіль',
    icon: '🔥',
    description: '7 днів занять поспіль',
    when: (p) => p.currentStreak >= 7,
  },
  {
    id: 'streak-30',
    name: 'Місяць поспіль',
    icon: '🏆',
    description: '30 днів занять поспіль',
    when: (p) => p.currentStreak >= 30,
  },
  {
    id: 'cat-nouns',
    name: 'Іменники освоєні',
    icon: '🎯',
    description: 'Усі іменники з підбірки вивчено',
    when: (p) => p.categoriesCompleted.includes('nouns'),
  },
  {
    id: 'cat-verbs',
    name: 'Дієслова освоєні',
    icon: '🎯',
    description: 'Усі дієслова з підбірки вивчено',
    when: (p) => p.categoriesCompleted.includes('verbs'),
  },
  {
    id: 'sharpshooter',
    name: '90% точність',
    icon: '🎖️',
    description: '50+ відповідей з точністю не нижче 90%',
    when: (p) => p.totalSeen >= 50 && p.quizAccuracy >= 0.9,
  },
];
