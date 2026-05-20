import type { GrammarLesson } from '@app-types/grammar';
import verbs from './rules/verbs';
import cases from './rules/cases';
import gender from './rules/gender';
import plurals from './rules/plurals';
import adjectives from './rules/adjectives';
import other from './rules/other';

const lessons: GrammarLesson[] = [
  ...other,
  ...gender,
  ...plurals,
  ...cases,
  ...adjectives,
  ...verbs,
];

export default lessons;
