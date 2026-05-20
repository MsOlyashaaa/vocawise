import type { GrammarLesson } from '@app-types/grammar';

const plurals: GrammarLesson[] = [
  {
    id: 'pl-uk:grammar:plurals',
    pairId: 'pl-uk',
    title: 'Множина іменників',
    topic: 'plurals',
    difficulty: 'medium',
    summary:
      'Закінчення множини залежить від роду й останньої приголосної. Найчастіші закінчення: -y, -i, -e, -owie.',
    body: [
      { type: 'h', text: 'Коли використовувати' },
      {
        type: 'table',
        headers: ['Ситуація', 'Приклад'],
        rows: [
          ['більше ніж один предмет', 'koty, książki, dzieci'],
          ['числівники 2–4 + називний мн.', 'dwa koty, trzy książki, cztery okna'],
          ['числівники 5+ → родовий мн.', 'pięć kotów, dziesięć książek'],
          ['узагальнення цілого класу', 'Lubię koty. (Я люблю котів.)'],
          ['звертання до групи', 'Drodzy państwo! Panie i panowie!'],
          ['pluralia tantum (тільки множина)', 'spodnie (штани), drzwi (двері), nożyczki (ножиці)'],
        ],
      },
      {
        type: 'table',
        headers: ['Рід / тип', 'Закінчення', 'Приклад'],
        rows: [
          ['чол. тверда основа', '-y', 'kot → koty'],
          ['чол. м’яка основа', '-e', 'koń → konie'],
          ['чол. особовий', '-owie / -i', 'pan → panowie, student → studenci'],
          ['жін. -a', '-y / -i', 'kobieta → kobiety'],
          ['серед. -o/-e', '-a', 'okno → okna, pole → pola'],
        ],
      },
      {
        type: 'note',
        text: 'Особовий чоловічий рід (męskoosobowy) — окрема категорія для людей чоловічої статі. Він має власні форми у називному й знахідному множини.',
      },
    ],
    examples: [
      { target: 'koty', base: 'коти' },
      { target: 'książki', base: 'книги' },
      { target: 'okna', base: 'вікна' },
    ],
  },
];

export default plurals;
