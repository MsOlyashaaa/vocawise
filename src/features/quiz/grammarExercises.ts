import type { VocabularyItem, CaseKey, NounCases } from '@app-types/vocabulary';
import { shuffle } from '@utils/shuffle';

export type GrammarExercise =
  | DeclineExercise
  | ConjugateExercise
  | ChooseExercise
  | NumeralExercise;

export interface DeclineExercise {
  kind: 'decline';
  itemId: string;
  baseForm: string;
  baseTranslation: string;
  caseKey: CaseKey;
  caseLabel: string;
  number: 'sg' | 'pl';
  answer: string;
}

export type PersonKey = 'ja' | 'ty' | 'on' | 'my' | 'wy' | 'oni';

export interface ConjugateExercise {
  kind: 'conjugate';
  itemId: string;
  infinitive: string;
  infinitiveTranslation: string;
  person: PersonKey;
  personLabel: string;
  answer: string;
}

export interface ChooseExercise {
  kind: 'choose';
  itemId: string;
  prompt: string;
  baseTranslation: string;
  caseLabel: string;
  answer: string;
  choices: string[];
}

export interface NumeralExercise {
  kind: 'numeral';
  itemId: string;
  num: number;
  base: string;
  baseTranslation: string;
  answer: string;
}

const CASE_LABELS: Readonly<Record<CaseKey, string>> = {
  nom: 'Називний',
  gen: 'Родовий',
  dat: 'Давальний',
  acc: 'Знахідний',
  ins: 'Орудний',
  loc: 'Місцевий',
  voc: 'Кличний',
};

const PERSON_LABELS: Readonly<Record<PersonKey, string>> = {
  ja: 'я',
  ty: 'ти',
  on: 'він / вона',
  my: 'ми',
  wy: 'ви',
  oni: 'вони',
};

type SingularKey = Exclude<keyof NounCases, 'genPl' | 'datPl' | 'accPl' | 'insPl' | 'locPl'>;
const SG_KEYS: SingularKey[] = ['gen', 'dat', 'acc', 'ins', 'loc'];
const PL_MAP: readonly (readonly [keyof NounCases, CaseKey])[] = [
  ['genPl', 'gen'],
  ['datPl', 'dat'],
  ['accPl', 'acc'],
  ['insPl', 'ins'],
  ['locPl', 'loc'],
] as const;

function makeDecline(item: VocabularyItem): DeclineExercise[] {
  const cases = item.meta?.cases;
  if (!cases) return [];
  const out: DeclineExercise[] = [];
  for (const k of SG_KEYS) {
    const v = cases[k];
    if (v) {
      out.push({
        kind: 'decline',
        itemId: item.id,
        baseForm: item.target,
        baseTranslation: item.base,
        caseKey: k,
        caseLabel: `${CASE_LABELS[k]} (однина)`,
        number: 'sg',
        answer: v,
      });
    }
  }
  for (const [field, key] of PL_MAP) {
    const v = cases[field];
    if (v) {
      out.push({
        kind: 'decline',
        itemId: item.id,
        baseForm: item.target,
        baseTranslation: item.base,
        caseKey: key,
        caseLabel: `${CASE_LABELS[key]} (множина)`,
        number: 'pl',
        answer: v,
      });
    }
  }
  return out;
}

function makeConjugate(item: VocabularyItem): ConjugateExercise[] {
  const conj = item.meta?.conjugation;
  if (!conj) return [];
  const persons: PersonKey[] = ['ja', 'ty', 'on', 'my', 'wy', 'oni'];
  return persons
    .filter((p) => Boolean(conj[p]))
    .map((p) => ({
      kind: 'conjugate' as const,
      itemId: item.id,
      infinitive: item.target,
      infinitiveTranslation: item.base,
      person: p,
      personLabel: PERSON_LABELS[p],
      answer: conj[p]!,
    }));
}

const CHOOSE_TEMPLATES: readonly {
  key: SingularKey;
  prompt: string;
  label: string;
}[] = [
  { key: 'acc', prompt: 'Mam ___.', label: 'Знахідний' },
  { key: 'gen', prompt: 'Nie mam ___.', label: 'Родовий' },
  { key: 'ins', prompt: 'Idę z ___.', label: 'Орудний' },
  { key: 'loc', prompt: 'Myślę o ___.', label: 'Місцевий' },
  { key: 'dat', prompt: 'Daję to ___.', label: 'Давальний' },
];

function makeChoose(item: VocabularyItem): ChooseExercise[] {
  const cases = item.meta?.cases;
  if (!cases) return [];
  const out: ChooseExercise[] = [];
  for (const tpl of CHOOSE_TEMPLATES) {
    const answer = cases[tpl.key];
    if (!answer) continue;
    const pool = [item.target, cases.gen, cases.dat, cases.acc, cases.ins, cases.loc].filter(
      (v): v is string => Boolean(v),
    );
    const distractors = Array.from(new Set(pool)).filter((v) => v !== answer);
    const choices = shuffle([answer, ...distractors.slice(0, 3)]);
    if (choices.length < 2) continue;
    out.push({
      kind: 'choose',
      itemId: item.id,
      prompt: tpl.prompt,
      baseTranslation: item.base,
      caseLabel: tpl.label,
      answer,
      choices,
    });
  }
  return out;
}

function makeNumeral(item: VocabularyItem): NumeralExercise[] {
  const plural = item.meta?.plural;
  const genPl = item.meta?.cases?.genPl;
  if (!plural || !genPl) return [];
  return [
    {
      kind: 'numeral',
      itemId: item.id,
      num: 3,
      base: item.target,
      baseTranslation: item.base,
      answer: `trzy ${plural}`,
    },
    {
      kind: 'numeral',
      itemId: item.id,
      num: 5,
      base: item.target,
      baseTranslation: item.base,
      answer: `pięć ${genPl}`,
    },
  ];
}

export function buildGrammarExercises(vocab: readonly VocabularyItem[]): GrammarExercise[] {
  const nouns = vocab.filter((v) => v.category === 'nouns' && v.meta?.cases);
  const verbs = vocab.filter((v) => v.category === 'verbs' && v.meta?.conjugation);
  const out: GrammarExercise[] = [];
  for (const n of nouns) out.push(...makeDecline(n));
  for (const v of verbs) out.push(...makeConjugate(v));
  for (const n of nouns) out.push(...makeChoose(n));
  for (const n of nouns) out.push(...makeNumeral(n));
  return shuffle(out);
}

export function normalizeAnswer(s: string): string {
  return s.trim().toLocaleLowerCase('pl-PL').replace(/\s+/g, ' ');
}

export function isCorrect(input: string, expected: string): boolean {
  return normalizeAnswer(input) === normalizeAnswer(expected);
}
