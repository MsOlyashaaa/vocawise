export type LeitnerBox = 1 | 2 | 3 | 4 | 5;

export interface CardState {
  itemId: string;
  box: LeitnerBox;
  lastReviewedAt: number;
  nextDueAt: number;
  correctStreak: number;
  totalSeen: number;
  totalCorrect: number;
  flaggedRepeat: boolean;
  isFavorite: boolean;
  isLearned: boolean;
}

export interface StreakState {
  currentStreak: number;
  longestStreak: number;
  lastActiveDay: string;
}

export interface ProgressAggregate {
  wordsLearned: number;
  wordsToRepeat: number;
  favoritesCount: number;
  totalSeen: number;
  totalCorrect: number;
  quizAccuracy: number;
  categoriesCompleted: string[];
  currentStreak: number;
  longestStreak: number;
}

export function newCardState(itemId: string): CardState {
  return {
    itemId,
    box: 1,
    lastReviewedAt: 0,
    nextDueAt: 0,
    correctStreak: 0,
    totalSeen: 0,
    totalCorrect: 0,
    flaggedRepeat: false,
    isFavorite: false,
    isLearned: false,
  };
}

export function newStreak(): StreakState {
  return { currentStreak: 0, longestStreak: 0, lastActiveDay: '' };
}
