import { MultipleChoiceMode } from './MultipleChoiceMode';

export function RepeatDifficultMode() {
  return <MultipleChoiceMode filter={{ kind: 'repeat' }} />;
}
