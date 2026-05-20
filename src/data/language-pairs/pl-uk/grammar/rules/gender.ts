import type { GrammarLesson } from '@app-types/grammar';

const gender: GrammarLesson[] = [
  {
    id: 'pl-uk:grammar:gender',
    pairId: 'pl-uk',
    title: 'Рід іменників',
    topic: 'gender',
    difficulty: 'easy',
    summary:
      'У польській іменники мають три роди: чоловічий (m), жіночий (f) і середній (n). Рід зазвичай можна впізнати за закінченням називного відмінка.',
    body: [
      {
        type: 'p',
        text: 'Знати рід іменника важливо, бо від нього залежать форми прикметників і дієслів минулого часу.',
      },
      { type: 'h', text: 'Коли важливо знати рід' },
      {
        type: 'table',
        headers: ['Ситуація', 'Приклад'],
        rows: [
          ['узгодження прикметника', 'duży kot, duża książka, duże okno'],
          ['узгодження минулого часу', 'on pisał, ona pisała, ono pisało'],
          ['узгодження займенників', 'mój / moja / moje'],
          ['узгодження числівників 1', 'jeden kot, jedna książka, jedno okno'],
          ['форми відмінків (всі)', 'kota (m) vs kobiety (f) у родовому'],
          ['особовий чол. множини (męskoosobowy)', 'studenci uczą się ↔ koty śpią'],
        ],
      },
      {
        type: 'table',
        headers: ['Рід', 'Типове закінчення', 'Приклад'],
        rows: [
          ['чоловічий (m)', 'приголосний', 'kot, dom, samochód'],
          ['жіночий (f)', '-a, -i', 'kobieta, książka, pani'],
          ['середній (n)', '-o, -e, -ę', 'okno, pole, imię'],
        ],
      },
      {
        type: 'note',
        text: 'Виняток: kolega, mężczyzna закінчуються на -a, але є чоловічого роду (бо позначають чоловіків).',
      },
    ],
    examples: [
      { target: 'kot (m)', base: 'кіт' },
      { target: 'książka (f)', base: 'книга' },
      { target: 'okno (n)', base: 'вікно' },
    ],
    related: ['pl-uk:nouns:kot', 'pl-uk:nouns:ksiazka'],
  },
];

export default gender;
