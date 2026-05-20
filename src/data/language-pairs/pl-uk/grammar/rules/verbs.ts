import type { GrammarLesson } from '@app-types/grammar';

const verbs: GrammarLesson[] = [
  {
    id: 'pl-uk:grammar:conjugations',
    pairId: 'pl-uk',
    title: 'Всі чотири дієвідміни',
    topic: 'verbs',
    difficulty: 'medium',
    summary:
      'Польські дієслова діляться на 4 дієвідміни за закінченнями у 1-й і 2-й особі однини теперішнього часу. Знаючи ці дві форми, можна відмінити будь-яке дієслово.',
    body: [
      {
        type: 'p',
        text: 'Дієвідміна визначається за двома першими формами (ja, ty). Решта виводиться за шаблоном. Деякі дієслова мають чергування у корені — їх треба запам’ятати.',
      },
      { type: 'h', text: 'Коли використовувати теперішній час' },
      {
        type: 'table',
        headers: ['Ситуація', 'Приклад'],
        rows: [
          ['дія відбувається зараз', 'Czytam książkę. (Зараз читаю книгу.)'],
          ['постійні стани, факти', 'Mieszkam w Krakowie. (Я живу у Кракові.)'],
          ['звички, повторювані дії', 'Codziennie pracuję od 9 do 17.'],
          [
            'розклад, заплановане найближче майбутнє',
            'Pociąg odjeżdża o 8. (Поїзд відходить о 8.)',
          ],
          ['загальні істини', 'Woda gotuje się w 100 stopniach.'],
        ],
      },
      { type: 'h', text: 'I дієвідміна (-ę, -esz)' },
      { type: 'p', text: 'Найбільша група. Часто з чергуванням приголосних у корені.' },
      {
        type: 'table',
        headers: ['Особа', 'Закінчення', 'pisać (писати)', 'pić (пити)'],
        rows: [
          ['ja', '-ę', 'piszę', 'piję'],
          ['ty', '-esz', 'piszesz', 'pijesz'],
          ['on / ona / ono', '-e', 'pisze', 'pije'],
          ['my', '-emy', 'piszemy', 'pijemy'],
          ['wy', '-ecie', 'piszecie', 'pijecie'],
          ['oni / one', '-ą', 'piszą', 'piją'],
        ],
      },
      { type: 'p', text: 'Приклади дієслів: pisać, pić, jechać, brać, prać, móc, iść, chcieć.' },
      { type: 'h', text: 'II дієвідміна (-ę, -isz / -ysz)' },
      { type: 'p', text: 'Дієслова на -ić, -yć у інфінітиві. Часто описують стани і відчуття.' },
      {
        type: 'table',
        headers: ['Особа', 'Закінчення', 'mówić (говорити)', 'lubić (любити)'],
        rows: [
          ['ja', '-ę', 'mówię', 'lubię'],
          ['ty', '-isz', 'mówisz', 'lubisz'],
          ['on / ona / ono', '-i', 'mówi', 'lubi'],
          ['my', '-imy', 'mówimy', 'lubimy'],
          ['wy', '-icie', 'mówicie', 'lubicie'],
          ['oni / one', '-ą', 'mówią', 'lubią'],
        ],
      },
      {
        type: 'p',
        text: 'Після твердих ż, sz, cz, dz, c використовується -ysz: uczyć → uczę, uczysz; tańczyć → tańczę, tańczysz.',
      },
      {
        type: 'p',
        text: 'Приклади: mówić, lubić, robić, widzieć, słyszeć, uczyć, tańczyć, prosić.',
      },
      { type: 'h', text: 'III дієвідміна (-am, -asz)' },
      { type: 'p', text: 'Найрегулярніша й найпростіша. Дієслова на -ać.' },
      {
        type: 'table',
        headers: ['Особа', 'Закінчення', 'czytać (читати)', 'mieszkać (жити)'],
        rows: [
          ['ja', '-am', 'czytam', 'mieszkam'],
          ['ty', '-asz', 'czytasz', 'mieszkasz'],
          ['on / ona / ono', '-a', 'czyta', 'mieszka'],
          ['my', '-amy', 'czytamy', 'mieszkamy'],
          ['wy', '-acie', 'czytacie', 'mieszkacie'],
          ['oni / one', '-ają', 'czytają', 'mieszkają'],
        ],
      },
      {
        type: 'p',
        text: 'Приклади: czytać, mieszkać, kochać, pamiętać, śpiewać, pytać, słuchać, znać, grać, czekać.',
      },
      {
        type: 'note',
        text: 'Виняток: mieć (мати) → mam, masz, ma, mamy, macie, mają. Закінчення III дієвідміни, але інфінітив на -eć.',
      },
      { type: 'h', text: 'IV дієвідміна (-em, -esz)' },
      { type: 'p', text: 'Найменша група. Кілька неправильних, але важливих дієслів.' },
      {
        type: 'table',
        headers: ['Особа', 'Закінчення', 'rozumieć (розуміти)', 'jeść (їсти)', 'wiedzieć (знати)'],
        rows: [
          ['ja', '-em', 'rozumiem', 'jem', 'wiem'],
          ['ty', '-esz', 'rozumiesz', 'jesz', 'wiesz'],
          ['on / ona / ono', '-e', 'rozumie', 'je', 'wie'],
          ['my', '-emy', 'rozumiemy', 'jemy', 'wiemy'],
          ['wy', '-ecie', 'rozumiecie', 'jecie', 'wiecie'],
          ['oni / one', '-edzą', 'rozumieją', 'jedzą', 'wiedzą'],
        ],
      },
      {
        type: 'note',
        text: 'У 3-й особі множини IV дієвідміни особлива форма -edzą / -eją: jeść → jedzą, wiedzieć → wiedzą, rozumieć → rozumieją.',
      },
      { type: 'h', text: 'Неправильні дієслова (не входять у схему)' },
      {
        type: 'table',
        headers: ['Особа', 'być (бути)', 'mieć (мати)', 'iść (іти)'],
        rows: [
          ['ja', 'jestem', 'mam', 'idę'],
          ['ty', 'jesteś', 'masz', 'idziesz'],
          ['on / ona / ono', 'jest', 'ma', 'idzie'],
          ['my', 'jesteśmy', 'mamy', 'idziemy'],
          ['wy', 'jesteście', 'macie', 'idziecie'],
          ['oni / one', 'są', 'mają', 'idą'],
        ],
      },
      { type: 'h', text: 'Як визначити дієвідміну' },
      {
        type: 'table',
        headers: ['1-ша особа', '2-га особа', 'Дієвідміна'],
        rows: [
          ['-ę', '-esz', 'I'],
          ['-ę', '-isz / -ysz', 'II'],
          ['-am', '-asz', 'III'],
          ['-em', '-esz', 'IV'],
        ],
      },
      {
        type: 'note',
        text: 'Словники зазвичай дають інфінітив + першу та другу особу: pisać (piszę, piszesz). Цього достатньо, щоб відмінити дієслово повністю.',
      },
      { type: 'example', target: 'Piszę list.', base: 'Я пишу лист.' },
      { type: 'example', target: 'Czytamy książki.', base: 'Ми читаємо книги.' },
      { type: 'example', target: 'Oni rozumieją po polsku.', base: 'Вони розуміють польською.' },
    ],
    examples: [
      { target: 'Mówię po polsku.', base: 'Я говорю польською.' },
      { target: 'Lubisz kawę?', base: 'Любиш каву?' },
      { target: 'Mieszkamy w Warszawie.', base: 'Живемо у Варшаві.' },
      { target: 'Wiem, że ona ma rację.', base: 'Я знаю, що вона має рацію.' },
    ],
  },
  {
    id: 'pl-uk:grammar:past',
    pairId: 'pl-uk',
    title: 'Минулий час',
    topic: 'verbs',
    difficulty: 'hard',
    summary:
      'Минулий час твориться додаванням -ł / -ła / -ło до основи. Закінчення залежать від роду й числа — польський минулий час «пам’ятає» рід підмета.',
    body: [
      {
        type: 'p',
        text: 'Утворення: інфінітив → відкинути -ć → додати суфікс -ł- + особові закінчення. Pisać → pisa- → pisał, pisała, pisało.',
      },
      { type: 'h', text: 'Коли використовувати' },
      {
        type: 'table',
        headers: ['Ситуація', 'Приклад'],
        rows: [
          ['будь-яка дія в минулому', 'Wczoraj byłam w kinie. (Учора я була в кіно.)'],
          ['послідовність подій (доконані)', 'Wstałem, ubrałem się, wyszedłem.'],
          ['тривалі процеси (недоконані)', 'Cały dzień pisałem raport.'],
          ['повторювані дії в минулому', 'Co tydzień chodziliśmy na basen.'],
          ['стан / звичка в минулому', 'Lubiłem czekoladę jako dziecko.'],
          ['розповідь, історія', 'Dawno temu żył król...'],
        ],
      },
      { type: 'h', text: 'Однина' },
      {
        type: 'table',
        headers: ['Особа', 'чол.', 'жін.', 'серед.'],
        rows: [
          ['ja', 'pisałem', 'pisałam', '—'],
          ['ty', 'pisałeś', 'pisałaś', '—'],
          ['on / ona / ono', 'pisał', 'pisała', 'pisało'],
        ],
      },
      { type: 'h', text: 'Множина' },
      {
        type: 'table',
        headers: ['Особа', 'особовий чол.', 'інше'],
        rows: [
          ['my', 'pisaliśmy', 'pisałyśmy'],
          ['wy', 'pisaliście', 'pisałyście'],
          ['oni / one', 'pisali', 'pisały'],
        ],
      },
      { type: 'h', text: 'Особливості творення' },
      {
        type: 'table',
        headers: ['Інфінітив', 'Основа', 'on / ona'],
        rows: [
          ['pisać', 'pisa-', 'pisał / pisała'],
          ['mówić', 'mówi-', 'mówił / mówiła'],
          ['mieć', 'mia-', 'miał / miała'],
          ['iść', 'sze-', 'szedł / szła (особлива)'],
          ['móc', 'mog-', 'mógł / mogła'],
          ['jeść', 'jad-', 'jadł / jadła'],
        ],
      },
      {
        type: 'note',
        text: 'Підмет жінки → -ła, чоловіка → -ł, середнього → -ło. Для самого мовця: чоловік каже «pisałem», жінка — «pisałam». Це не помилка узгодження, це обов’язково.',
      },
      {
        type: 'note',
        text: 'Закінчення -śmy, -ście можуть переходити на інше слово: «Coś ty zrobił?» = «Co ty zrobiłeś?». Це «рухомі» закінчення.',
      },
      {
        type: 'note',
        text: 'iść має нерегулярні форми: szedł (чол.), szła (жін.), szli / szły (мн.). Запам’ятати!',
      },
      { type: 'example', target: 'Wczoraj pisałam list.', base: 'Учора я (жінка) писала лист.' },
      { type: 'example', target: 'On czytał książkę.', base: 'Він читав книгу.' },
      { type: 'example', target: 'Szliśmy do kina.', base: 'Ми (чол.) йшли у кіно.' },
    ],
    examples: [
      { target: 'Byłem w Polsce.', base: 'Я (чол.) був у Польщі.' },
      { target: 'Byłyśmy w domu.', base: 'Ми (жінки) були вдома.' },
      { target: 'Co robiłeś wczoraj?', base: 'Що ти (чол.) робив учора?' },
    ],
  },
  {
    id: 'pl-uk:grammar:future',
    pairId: 'pl-uk',
    title: 'Майбутній час',
    topic: 'verbs',
    difficulty: 'hard',
    summary:
      'Два типи: ПРОСТИЙ (для доконаних дієслів) — відмінюється як теперішній; СКЛАДЕНИЙ (для недоконаних) — być у майбутньому + інфінітив або форма на -ł.',
    body: [
      {
        type: 'p',
        text: 'Ключ — вид дієслова (aspekt). Niedokonany (недоконаний) описує процес, dokonany (доконаний) — завершену дію. Forma майбутнього залежить від виду.',
      },
      { type: 'h', text: 'Коли використовувати' },
      {
        type: 'table',
        headers: ['Ситуація', 'Тип', 'Приклад'],
        rows: [
          ['разова дія з результатом у майб.', 'простий доконаний', 'Jutro napiszę email.'],
          [
            'процес / тривала дія в майб.',
            'складений недоконаний',
            'Cały weekend będę odpoczywać.',
          ],
          ['повторювана дія в майб.', 'складений недоконаний', 'Co rano będę biegać.'],
          ['обіцянка, план', 'обидва (за смислом)', 'Zadzwonię. / Будзe pamiętała.'],
          ['прогноз погоди / стану', 'складений', 'Jutro będzie deszcz.'],
          ['послідовність завершених кроків', 'простий доконаний', 'Wstanę, zjem, wyjdę.'],
        ],
      },
      { type: 'h', text: 'Майбутній być (основа для складеного)' },
      {
        type: 'table',
        headers: ['Особа', 'Форма'],
        rows: [
          ['ja', 'będę'],
          ['ty', 'będziesz'],
          ['on / ona / ono', 'będzie'],
          ['my', 'będziemy'],
          ['wy', 'będziecie'],
          ['oni / one', 'będą'],
        ],
      },
      { type: 'h', text: '1. Майбутній доконаний (futur prosty)' },
      {
        type: 'p',
        text: 'Доконане дієслово відмінюється за теперішнім часом, АЛЕ означає майбутнє. Дія відбудеться і завершиться.',
      },
      {
        type: 'table',
        headers: ['Інфінітив', 'Особа', 'Форма', 'Переклад'],
        rows: [
          ['napisać (написати)', 'ja', 'napiszę', 'я напишу'],
          ['napisać', 'ty', 'napiszesz', 'ти напишеш'],
          ['napisać', 'on / ona', 'napisze', 'він/вона напише'],
          ['przeczytać (прочитати)', 'ja', 'przeczytam', 'я прочитаю'],
          ['kupić (купити)', 'ja', 'kupię', 'я куплю'],
          ['zrobić (зробити)', 'oni', 'zrobią', 'вони зроблять'],
          ['pójść (піти)', 'ja', 'pójdę', 'я піду'],
        ],
      },
      {
        type: 'note',
        text: 'Доконане дієслово зазвичай має префікс (na-, prze-, z-, po-, u-) або інший корінь: pisać → napisać, czytać → przeczytać, robić → zrobić, iść → pójść.',
      },
      { type: 'h', text: '2. Майбутній недоконаний (futur złożony)' },
      {
        type: 'p',
        text: 'Описує процес або повторювану дію в майбутньому. Утворюється: będę + інфінітив АБО będę + форма на -ł / -ła / -ło / -li / -ły.',
      },
      {
        type: 'p',
        text: 'Обидва варіанти рівнозначні. Форма з -ł узгоджується за родом і числом (як минулий час).',
      },
      {
        type: 'table',
        headers: ['Особа', 'будe + інфінітив', 'будe + -ł/-ła'],
        rows: [
          ['ja (чол.)', 'będę pisać', 'będę pisał'],
          ['ja (жін.)', 'będę pisać', 'będę pisała'],
          ['ty (чол.)', 'będziesz pisać', 'będziesz pisał'],
          ['ty (жін.)', 'będziesz pisać', 'będziesz pisała'],
          ['on', 'będzie pisać', 'będzie pisał'],
          ['ona', 'będzie pisać', 'będzie pisała'],
          ['my (особ. чол.)', 'będziemy pisać', 'będziemy pisali'],
          ['my (інше)', 'będziemy pisać', 'będziemy pisały'],
          ['oni (особ.)', 'będą pisać', 'będą pisali'],
          ['one (інше)', 'będą pisać', 'będą pisały'],
        ],
      },
      {
        type: 'note',
        text: 'Інфінітивний варіант (będę pisać) простіший — рід не вибираєте. Носії частіше вживають другий (będę pisał/pisała), бо звучить природніше.',
      },
      { type: 'h', text: 'Порівняння: видова пара' },
      {
        type: 'table',
        headers: ['Недоконане (процес)', 'Доконане (результат)', 'Переклад'],
        rows: [
          ['będę pisać list', 'napiszę list', 'писатиму / напишу лист'],
          ['będę czytać książkę', 'przeczytam książkę', 'читатиму / прочитаю книгу'],
          ['będziemy robić', 'zrobimy', 'робитимемо / зробимо'],
          ['będzie kupować', 'kupi', 'купуватиме / купить'],
          ['będę iść', 'pójdę', 'йтиму / піду'],
        ],
      },
      { type: 'h', text: 'Як вибрати вид у майбутньому' },
      {
        type: 'table',
        headers: ['Контекст', 'Вид', 'Приклад'],
        rows: [
          ['конкретна разова дія з результатом', 'доконаний', 'Jutro napiszę email.'],
          ['тривалий процес / стан', 'недоконаний', 'Jutro będę pracować cały dzień.'],
          ['повторювана дія', 'недоконаний', 'Co tydzień będę chodzić na siłownię.'],
          ['послідовність завершених дій', 'доконаний', 'Wstanę, ubiorę się, wyjdę.'],
        ],
      },
      {
        type: 'note',
        text: 'być сам по собі має ТІЛЬКИ складений майбутній (через свою недоконаність): będę, będziesz, będzie...',
      },
      {
        type: 'note',
        text: 'У реченнях зі словами «завтра», «потім», «за тиждень» — вид треба визначати за смислом, не за часовим словом.',
      },
      { type: 'example', target: 'Jutro napiszę do ciebie.', base: 'Завтра я напишу тобі.' },
      {
        type: 'example',
        target: 'Wieczorem będę oglądać film.',
        base: 'Увечері я дивитимусь фільм.',
      },
      {
        type: 'example',
        target: 'W przyszłym roku będę mieszkała w Krakowie.',
        base: 'Наступного року я (жін.) житиму у Кракові.',
      },
    ],
    examples: [
      { target: 'Kupię chleb.', base: 'Я куплю хліб.' },
      { target: 'Będę się uczyć polskiego.', base: 'Я вчитиму польську.' },
      { target: 'Oni przyjadą jutro.', base: 'Вони приїдуть завтра.' },
      { target: 'Będziemy czekać.', base: 'Будемо чекати.' },
    ],
  },
];

export default verbs;
