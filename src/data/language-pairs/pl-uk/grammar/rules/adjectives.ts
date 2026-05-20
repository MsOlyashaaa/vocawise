import type { GrammarLesson } from '@app-types/grammar';

const adjectives: GrammarLesson[] = [
  {
    id: 'pl-uk:grammar:adjectives',
    pairId: 'pl-uk',
    title: 'Прикметники: рід і число',
    topic: 'adjectives',
    difficulty: 'medium',
    summary:
      'Прикметник у польській узгоджується з іменником у роді й числі. Запам’ятайте три форми однини й одну множини.',
    body: [
      { type: 'h', text: 'Коли використовувати' },
      {
        type: 'table',
        headers: ['Ситуація', 'Приклад'],
        rows: [
          ['опис іменника (атрибут)', 'duży kot, nowa książka'],
          ['предикатив (після jest / być)', 'Kot jest duży. Książka jest nowa.'],
          ['порівняння', 'większy, najlepszy (більший, найкращий)'],
          [
            'узгодження за родом, числом, відмінком — ЗАВЖДИ',
            'dużego kota (Gen), dużą książkę (Acc)',
          ],
          ['у звертаннях', 'Drogi Panie! Kochana mamo!'],
          ['як іменник (субстантивація)', 'młody (молодий чоловік), chory (хворий)'],
        ],
      },
      {
        type: 'table',
        headers: ['Рід / число', 'Закінчення', 'Приклад'],
        rows: [
          ['чол. однина', '-y / -i', 'duży, tani'],
          ['жін. однина', '-a', 'duża, tania'],
          ['серед. однина', '-e', 'duże, tanie'],
          ['не-особова множина', '-e', 'duże, tanie'],
          ['особова чол. множина', '-i / -y', 'duzi, tani'],
        ],
      },
      {
        type: 'example',
        target: 'duży kot, duża książka, duże okno',
        base: 'великий кіт, велика книга, велике вікно',
      },
    ],
    examples: [
      { target: 'nowy samochód', base: 'новий автомобіль' },
      { target: 'nowa kuchnia', base: 'нова кухня' },
      { target: 'nowe ubranie', base: 'новий одяг' },
    ],
  },
];

export default adjectives;
