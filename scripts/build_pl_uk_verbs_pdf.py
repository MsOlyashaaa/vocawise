# -*- coding: utf-8 -*-
"""Build PDF: 100 most-common PL-UK verbs, 10 cards/page (2x5), pastel."""
from reportlab.pdfgen import canvas
from reportlab.lib.pagesizes import A4
from reportlab.lib.colors import HexColor
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.lib.units import mm

# (target, base, exT, exB, assoc, ja, ty, on, my, wy, oni)
V = [
    ("być", "бути", "Chcę być szczęśliwy.", "Я хочу бути щасливим.", "«być» — «бути», споріднене.", "jestem", "jesteś", "jest", "jesteśmy", "jesteście", "są"),
    ("mieć", "мати", "Mam dwa koty.", "У мене два коти.", "«mieć» — «мати».", "mam", "masz", "ma", "mamy", "macie", "mają"),
    ("robić", "робити", "Co robisz?", "Що ти робиш?", "«robić» = «робити».", "robię", "robisz", "robi", "robimy", "robicie", "robią"),
    ("iść", "йти", "Idę do sklepu.", "Я йду в магазин.", "«iść» — корінь «й-».", "idę", "idziesz", "idzie", "idziemy", "idziecie", "idą"),
    ("czytać", "читати", "Lubię czytać książki.", "Я люблю читати книги.", "«czytać» = «читати», cz=ч.", "czytam", "czytasz", "czyta", "czytamy", "czytacie", "czytają"),
    ("pisać", "писати", "Piszę list do mamy.", "Я пишу листа мамі.", "«pisać» = «писати».", "piszę", "piszesz", "pisze", "piszemy", "piszecie", "piszą"),
    ("mówić", "говорити", "Mówisz po polsku?", "Ти говориш польською?", "пор. «мова, мовити».", "mówię", "mówisz", "mówi", "mówimy", "mówicie", "mówią"),
    ("wiedzieć", "знати", "Nie wiem, gdzie on jest.", "Я не знаю, де він.", "пор. «відати».", "wiem", "wiesz", "wie", "wiemy", "wiecie", "wiedzą"),
    ("lubić", "любити", "Lubię kawę.", "Я люблю каву.", "«lubić» = «любити».", "lubię", "lubisz", "lubi", "lubimy", "lubicie", "lubią"),
    ("chcieć", "хотіти", "Chcę spać.", "Я хочу спати.", "пор. «хтіти, хочу».", "chcę", "chcesz", "chce", "chcemy", "chcecie", "chcą"),
    ("móc", "могти", "Mogę pomóc.", "Я можу допомогти.", "«móc» = «могти».", "mogę", "możesz", "może", "możemy", "możecie", "mogą"),
    ("spać", "спати", "Dziecko śpi.", "Дитина спить.", "«spać» = «спати».", "śpię", "śpisz", "śpi", "śpimy", "śpicie", "śpią"),
    ("jeść", "їсти", "Jem śniadanie.", "Я їм сніданок.", "«jeść» = «їсти».", "jem", "jesz", "je", "jemy", "jecie", "jedzą"),
    ("pić", "пити", "Pijemy herbatę.", "Ми п’ємо чай.", "«pić» = «пити».", "piję", "pijesz", "pije", "pijemy", "pijecie", "piją"),
    ("widzieć", "бачити", "Widzę cię!", "Я тебе бачу!", "корінь «вид-».", "widzę", "widzisz", "widzi", "widzimy", "widzicie", "widzą"),
    ("słyszeć", "чути", "Słyszę muzykę.", "Я чую музику.", "пор. «слух».", "słyszę", "słyszysz", "słyszy", "słyszymy", "słyszycie", "słyszą"),
    ("rozumieć", "розуміти", "Rozumiem po polsku.", "Я розумію польською.", "«rozumieć» = «розуміти».", "rozumiem", "rozumiesz", "rozumie", "rozumiemy", "rozumiecie", "rozumieją"),
    ("myśleć", "думати", "Myślę o tobie.", "Я думаю про тебе.", "пор. «мисль».", "myślę", "myślisz", "myśli", "myślimy", "myślicie", "myślą"),
    ("kochać", "кохати", "Kocham cię.", "Я тебе кохаю.", "«kochać» = «кохати».", "kocham", "kochasz", "kocha", "kochamy", "kochacie", "kochają"),
    ("pracować", "працювати", "Pracuję w biurze.", "Я працюю в офісі.", "«pracować» = «працювати».", "pracuję", "pracujesz", "pracuje", "pracujemy", "pracujecie", "pracują"),
    ("uczyć się", "вчитися", "Uczę się polskiego.", "Я вчу польську.", "«uczyć się» = «вчитися».", "uczę się", "uczysz się", "uczy się", "uczymy się", "uczycie się", "uczą się"),
    ("jechać", "їхати", "Jadę do Warszawy.", "Я їду до Варшави.", "«jechać» = «їхати».", "jadę", "jedziesz", "jedzie", "jedziemy", "jedziecie", "jadą"),
    ("lecieć", "летіти", "Samolot leci.", "Літак летить.", "«lecieć» = «летіти».", "lecę", "lecisz", "leci", "lecimy", "lecicie", "lecą"),
    ("biegać", "бігати", "Biegam co rano.", "Я бігаю щоранку.", "«biegać» = «бігати».", "biegam", "biegasz", "biega", "biegamy", "biegacie", "biegają"),
    ("stać", "стояти", "Stoję na ulicy.", "Я стою на вулиці.", "«stać» = «стояти».", "stoję", "stoisz", "stoi", "stoimy", "stoicie", "stoją"),
    ("siedzieć", "сидіти", "Siedzę na krześle.", "Я сиджу на стільці.", "«siedzieć» = «сидіти».", "siedzę", "siedzisz", "siedzi", "siedzimy", "siedzicie", "siedzą"),
    ("leżeć", "лежати", "Leżę w łóżku.", "Я лежу в ліжку.", "«leżeć» = «лежати».", "leżę", "leżysz", "leży", "leżymy", "leżycie", "leżą"),
    ("wstawać", "вставати", "Wstaję o siódmej.", "Я встаю о сьомій.", "«wstawać» = «вставати».", "wstaję", "wstajesz", "wstaje", "wstajemy", "wstajecie", "wstają"),
    ("siadać", "сідати", "Siadam przy stole.", "Я сідаю за стіл.", "«siadać» = «сідати».", "siadam", "siadasz", "siada", "siadamy", "siadacie", "siadają"),
    ("kłaść", "класти", "Kładę książkę.", "Я кладу книгу.", "«kłaść» = «класти».", "kładę", "kładziesz", "kładzie", "kładziemy", "kładziecie", "kładą"),
    ("brać", "брати", "Biorę autobus.", "Я беру автобус.", "«brać» = «брати».", "biorę", "bierzesz", "bierze", "bierzemy", "bierzecie", "biorą"),
    ("dawać", "давати", "Daję ci prezent.", "Я даю тобі подарунок.", "«dawać» = «давати».", "daję", "dajesz", "daje", "dajemy", "dajecie", "dają"),
    ("kupować", "купувати", "Kupuję chleb.", "Я купую хліб.", "«kupować» = «купувати».", "kupuję", "kupujesz", "kupuje", "kupujemy", "kupujecie", "kupują"),
    ("sprzedawać", "продавати", "Sprzedają owoce.", "Вони продають фрукти.", "пор. «продавати».", "sprzedaję", "sprzedajesz", "sprzedaje", "sprzedajemy", "sprzedajecie", "sprzedają"),
    ("płacić", "платити", "Płacę kartą.", "Я плачу карткою.", "«płacić» = «платити».", "płacę", "płacisz", "płaci", "płacimy", "płacicie", "płacą"),
    ("kosztować", "коштувати", "To kosztuje 10 zł.", "Це коштує 10 злотих.", "«kosztować» = «коштувати».", "kosztuję", "kosztujesz", "kosztuje", "kosztujemy", "kosztujecie", "kosztują"),
    ("otwierać", "відкривати", "Otwieram okno.", "Я відкриваю вікно.", "«otwierać» = «відкривати».", "otwieram", "otwierasz", "otwiera", "otwieramy", "otwieracie", "otwierają"),
    ("zamykać", "закривати", "Zamykam drzwi.", "Я закриваю двері.", "«zamykać» = «закривати».", "zamykam", "zamykasz", "zamyka", "zamykamy", "zamykacie", "zamykają"),
    ("szukać", "шукати", "Szukam kluczy.", "Я шукаю ключі.", "«szukać» = «шукати».", "szukam", "szukasz", "szuka", "szukamy", "szukacie", "szukają"),
    ("znajdować", "знаходити", "Znajduję rozwiązanie.", "Я знаходжу рішення.", "«znajdować» = «знаходити».", "znajduję", "znajdujesz", "znajduje", "znajdujemy", "znajdujecie", "znajdują"),
    ("tracić", "втрачати", "Tracę czas.", "Я втрачаю час.", "«tracić» = «втрачати».", "tracę", "tracisz", "traci", "tracimy", "tracicie", "tracą"),
    ("pamiętać", "пам'ятати", "Pamiętam ten dzień.", "Я пам'ятаю той день.", "«pamiętać» = «пам'ятати».", "pamiętam", "pamiętasz", "pamięta", "pamiętamy", "pamiętacie", "pamiętają"),
    ("zapominać", "забувати", "Zapominam imiona.", "Я забуваю імена.", "«zapominać» = «забувати».", "zapominam", "zapominasz", "zapomina", "zapominamy", "zapominacie", "zapominają"),
    ("uczyć", "вчити", "Uczę dzieci.", "Я вчу дітей.", "«uczyć» = «вчити».", "uczę", "uczysz", "uczy", "uczymy", "uczycie", "uczą"),
    ("pomagać", "допомагати", "Pomagam mamie.", "Я допомагаю мамі.", "«pomagać» = «допомагати».", "pomagam", "pomagasz", "pomaga", "pomagamy", "pomagacie", "pomagają"),
    ("prosić", "просити", "Proszę o wodę.", "Я прошу води.", "«prosić» = «просити».", "proszę", "prosisz", "prosi", "prosimy", "prosicie", "proszą"),
    ("dziękować", "дякувати", "Dziękuję bardzo.", "Дуже дякую.", "«dziękować» = «дякувати».", "dziękuję", "dziękujesz", "dziękuje", "dziękujemy", "dziękujecie", "dziękują"),
    ("przepraszać", "перепрошувати", "Przepraszam za spóźnienie.", "Перепрошую за запізнення.", "«przepraszać» = «перепрошувати».", "przepraszam", "przepraszasz", "przeprasza", "przepraszamy", "przepraszacie", "przepraszają"),
    ("witać", "вітати", "Witam państwa.", "Вітаю вас.", "«witać» = «вітати».", "witam", "witasz", "wita", "witamy", "witacie", "witają"),
    ("żegnać", "прощатися", "Żegnam się.", "Я прощаюся.", "пор. «прощатися».", "żegnam", "żegnasz", "żegna", "żegnamy", "żegnacie", "żegnają"),
    ("spotykać", "зустрічати", "Spotykam przyjaciół.", "Я зустрічаю друзів.", "«spotykać» = «зустрічати».", "spotykam", "spotykasz", "spotyka", "spotykamy", "spotykacie", "spotykają"),
    ("czekać", "чекати", "Czekam na ciebie.", "Я чекаю на тебе.", "«czekać» = «чекати».", "czekam", "czekasz", "czeka", "czekamy", "czekacie", "czekają"),
    ("pytać", "питати", "Pytam nauczyciela.", "Я питаю вчителя.", "«pytać» = «питати».", "pytam", "pytasz", "pyta", "pytamy", "pytacie", "pytają"),
    ("odpowiadać", "відповідати", "Odpowiadam na pytanie.", "Я відповідаю на запитання.", "«odpowiadać» = «відповідати».", "odpowiadam", "odpowiadasz", "odpowiada", "odpowiadamy", "odpowiadacie", "odpowiadają"),
    ("rozmawiać", "розмовляти", "Rozmawiamy o pracy.", "Ми розмовляємо про роботу.", "«rozmawiać» = «розмовляти».", "rozmawiam", "rozmawiasz", "rozmawia", "rozmawiamy", "rozmawiacie", "rozmawiają"),
    ("śmiać się", "сміятися", "Śmiejemy się głośno.", "Ми голосно сміємося.", "«śmiać się» = «сміятися».", "śmieję się", "śmiejesz się", "śmieje się", "śmiejemy się", "śmiejecie się", "śmieją się"),
    ("płakać", "плакати", "Dziecko płacze.", "Дитина плаче.", "«płakać» = «плакати».", "płaczę", "płaczesz", "płacze", "płaczemy", "płaczecie", "płaczą"),
    ("śpiewać", "співати", "Śpiewamy razem.", "Ми співаємо разом.", "«śpiewać» = «співати».", "śpiewam", "śpiewasz", "śpiewa", "śpiewamy", "śpiewacie", "śpiewają"),
    ("tańczyć", "танцювати", "Tańczę walca.", "Я танцюю вальс.", "«tańczyć» = «танцювати».", "tańczę", "tańczysz", "tańczy", "tańczymy", "tańczycie", "tańczą"),
    ("grać", "грати", "Gram w szachy.", "Я граю в шахи.", "«grać» = «грати».", "gram", "grasz", "gra", "gramy", "gracie", "grają"),
    ("patrzeć", "дивитися", "Patrzę przez okno.", "Я дивлюся у вікно.", "пор. «патрати».", "patrzę", "patrzysz", "patrzy", "patrzymy", "patrzycie", "patrzą"),
    ("oglądać", "дивитися", "Oglądam film.", "Я дивлюся фільм.", "пор. «оглядати».", "oglądam", "oglądasz", "ogląda", "oglądamy", "oglądacie", "oglądają"),
    ("słuchać", "слухати", "Słucham radia.", "Я слухаю радіо.", "«słuchać» = «слухати».", "słucham", "słuchasz", "słucha", "słuchamy", "słuchacie", "słuchają"),
    ("czuć", "відчувати", "Czuję zapach.", "Я відчуваю запах.", "пор. «чути».", "czuję", "czujesz", "czuje", "czujemy", "czujecie", "czują"),
    ("smakować", "смакувати", "Zupa smakuje.", "Суп смакує.", "«smakować» = «смакувати».", "smakuję", "smakujesz", "smakuje", "smakujemy", "smakujecie", "smakują"),
    ("gotować", "готувати", "Gotuję obiad.", "Я готую обід.", "«gotować» = «готувати».", "gotuję", "gotujesz", "gotuje", "gotujemy", "gotujecie", "gotują"),
    ("myć", "мити", "Myję ręce.", "Я мию руки.", "«myć» = «мити».", "myję", "myjesz", "myje", "myjemy", "myjecie", "myją"),
    ("prać", "прати", "Piorę ubrania.", "Я перу одяг.", "«prać» = «прати».", "piorę", "pierzesz", "pierze", "pierzemy", "pierzecie", "piorą"),
    ("sprzątać", "прибирати", "Sprzątam pokój.", "Я прибираю кімнату.", "пор. «прибирати».", "sprzątam", "sprzątasz", "sprząta", "sprzątamy", "sprzątacie", "sprzątają"),
    ("ubierać się", "одягатися", "Ubieram się ciepło.", "Я одягаюся тепло.", "«ubierać się» = «одягатися».", "ubieram się", "ubierasz się", "ubiera się", "ubieramy się", "ubieracie się", "ubierają się"),
    ("zaczynać", "починати", "Zaczynam pracę.", "Я починаю роботу.", "«zaczynać» = «починати».", "zaczynam", "zaczynasz", "zaczyna", "zaczynamy", "zaczynacie", "zaczynają"),
    ("kończyć", "закінчувати", "Kończę projekt.", "Я закінчую проєкт.", "«kończyć» = «закінчувати».", "kończę", "kończysz", "kończy", "kończymy", "kończycie", "kończą"),
    ("wracać", "повертатися", "Wracam do domu.", "Я повертаюся додому.", "пор. «повертатися».", "wracam", "wracasz", "wraca", "wracamy", "wracacie", "wracają"),
    ("wychodzić", "виходити", "Wychodzę z domu.", "Я виходжу з дому.", "«wychodzić» = «виходити».", "wychodzę", "wychodzisz", "wychodzi", "wychodzimy", "wychodzicie", "wychodzą"),
    ("wchodzić", "входити", "Wchodzę do pokoju.", "Я заходжу в кімнату.", "«wchodzić» = «входити».", "wchodzę", "wchodzisz", "wchodzi", "wchodzimy", "wchodzicie", "wchodzą"),
    ("przychodzić", "приходити", "Przychodzę o ósmej.", "Я приходжу о восьмій.", "«przychodzić» = «приходити».", "przychodzę", "przychodzisz", "przychodzi", "przychodzimy", "przychodzicie", "przychodzą"),
    ("odchodzić", "відходити", "Pociąg odchodzi.", "Потяг відходить.", "«odchodzić» = «відходити».", "odchodzę", "odchodzisz", "odchodzi", "odchodzimy", "odchodzicie", "odchodzą"),
    ("rosnąć", "рости", "Drzewo rośnie.", "Дерево росте.", "«rosnąć» = «рости».", "rosnę", "rośniesz", "rośnie", "rośniemy", "rośniecie", "rosną"),
    ("padać", "падати", "Pada deszcz.", "Падає дощ.", "«padać» = «падати».", "padam", "padasz", "pada", "padamy", "padacie", "padają"),
    ("świecić", "світити", "Słońce świeci.", "Сонце світить.", "«świecić» = «світити».", "świecę", "świecisz", "świeci", "świecimy", "świecicie", "świecą"),
    ("grzać", "гріти", "Słońce grzeje.", "Сонце гріє.", "«grzać» = «гріти».", "grzeję", "grzejesz", "grzeje", "grzejemy", "grzejecie", "grzeją"),
    ("marznąć", "мерзнути", "Marznę na dworze.", "Я мерзну надворі.", "«marznąć» = «мерзнути».", "marznę", "marzniesz", "marznie", "marzniemy", "marzniecie", "marzną"),
    ("boleć", "боліти", "Boli mnie głowa.", "У мене болить голова.", "«boleć» = «боліти».", "—", "—", "boli", "—", "—", "bolą"),
    ("leczyć", "лікувати", "Lekarz leczy chorych.", "Лікар лікує хворих.", "«leczyć» = «лікувати».", "leczę", "leczysz", "leczy", "leczymy", "leczycie", "leczą"),
    ("chorować", "хворіти", "Choruję na grypę.", "Я хворію на грип.", "«chorować» = «хворіти».", "choruję", "chorujesz", "choruje", "chorujemy", "chorujecie", "chorują"),
    ("umierać", "помирати", "Drzewa umierają.", "Дерева помирають.", "пор. «вмирати».", "umieram", "umierasz", "umiera", "umieramy", "umieracie", "umierają"),
    ("rodzić się", "народжуватися", "Dziecko się rodzi.", "Дитина народжується.", "«rodzić się» = «народжуватися».", "rodzę się", "rodzisz się", "rodzi się", "rodzimy się", "rodzicie się", "rodzą się"),
    ("żyć", "жити", "Żyjemy w Polsce.", "Ми живемо в Польщі.", "«żyć» = «жити».", "żyję", "żyjesz", "żyje", "żyjemy", "żyjecie", "żyją"),
    ("mieszkać", "жити", "Mieszkam w Krakowie.", "Я живу в Кракові.", "пор. «мешкати».", "mieszkam", "mieszkasz", "mieszka", "mieszkamy", "mieszkacie", "mieszkają"),
    ("podróżować", "подорожувати", "Podróżuję po Europie.", "Я подорожую Європою.", "«podróżować» = «подорожувати».", "podróżuję", "podróżujesz", "podróżuje", "podróżujemy", "podróżujecie", "podróżują"),
    ("odpoczywać", "відпочивати", "Odpoczywam w domu.", "Я відпочиваю вдома.", "«odpoczywać» = «відпочивати».", "odpoczywam", "odpoczywasz", "odpoczywa", "odpoczywamy", "odpoczywacie", "odpoczywają"),
    ("budzić się", "прокидатися", "Budzę się rano.", "Я прокидаюся вранці.", "пор. «будитися».", "budzę się", "budzisz się", "budzi się", "budzimy się", "budzicie się", "budzą się"),
    ("śnić", "снити", "Śnię o tobie.", "Мені сниться ти.", "«śnić» = «снити».", "śnię", "śnisz", "śni", "śnimy", "śnicie", "śnią"),
    ("wierzyć", "вірити", "Wierzę w siebie.", "Я вірю в себе.", "«wierzyć» = «вірити».", "wierzę", "wierzysz", "wierzy", "wierzymy", "wierzycie", "wierzą"),
    ("kłamać", "брехати", "Nie kłam!", "Не бреши!", "пор. «лукавити».", "kłamię", "kłamiesz", "kłamie", "kłamiemy", "kłamiecie", "kłamią"),
    ("obiecywać", "обіцяти", "Obiecuję pomóc.", "Я обіцяю допомогти.", "«obiecywać» = «обіцяти».", "obiecuję", "obiecujesz", "obiecuje", "obiecujemy", "obiecujecie", "obiecują"),
    ("zgadzać się", "погоджуватися", "Zgadzam się z tobą.", "Я з тобою погоджуюся.", "«zgadzać się» = «погоджуватися».", "zgadzam się", "zgadzasz się", "zgadza się", "zgadzamy się", "zgadzacie się", "zgadzają się"),
    ("wybierać", "вибирати", "Wybieram kolor.", "Я вибираю колір.", "«wybierać» = «вибирати».", "wybieram", "wybierasz", "wybiera", "wybieramy", "wybieracie", "wybierają"),
    ("zmieniać", "змінювати", "Zmieniam plan.", "Я змінюю план.", "«zmieniać» = «змінювати».", "zmieniam", "zmieniasz", "zmienia", "zmieniamy", "zmieniacie", "zmieniają"),
    ("pokazywać", "показувати", "Pokażę ci zdjęcie.", "Я покажу тобі фото.", "«pokazywać» = «показувати».", "pokazuję", "pokazujesz", "pokazuje", "pokazujemy", "pokazujecie", "pokazują"),
]

assert len(V) == 100, f"Expected 100, got {len(V)}"

# Emoji icons matching V order
EMOJIS = [
    "🌀","🤲","🛠","🚶","📖","✍","🗣","💡","❤","🙏",
    "💪","😴","🍽","🥤","👀","👂","🧠","💭","💖","💼",
    "🎓","🚗","✈","🏃","🧍","🪑","🛏","⏰","💺","📦",
    "✋","🎁","🛒","💰","💳","💲","🔓","🔒","🔍","🎯",
    "📉","🧩","🌫","📚","🤝","🙏","🙇","😔","👋","🚪",
    "👫","⌛","❓","💬","🗨","😄","😢","🎤","💃","🎮",
    "👁","📺","🎧","🌬","👅","🍳","🧼","🧺","🧹","👕",
    "▶","⏹","↩","🚪","🚪","➡","⬅","🌱","🌧","☀",
    "🔥","🥶","🤕","💊","🤒","🪦","👶","🌍","🏠","🧳",
    "🛋","🌅","💤","✝","🤥","🤞","👍","✅","🔄","👉",
]
assert len(EMOJIS) == 100

# Soft pastel page backgrounds — rotate per page
PAGE_BGS = [
    HexColor("#FBF4F7"),  # rose
    HexColor("#F3F7FB"),  # paper blue
    HexColor("#F2F8F4"),  # paper mint
    HexColor("#FAF6F1"),  # vanilla
    HexColor("#F6F3FA"),  # lavender
]

# Neutral card palette
CARD_FILL = HexColor("#FFFFFF")
CARD_BORDER = HexColor("#E5E7EB")
DIVIDER = HexColor("#EDEEF0")
STRIP_FILL = HexColor("#FAFAF9")
INK = HexColor("#1F2937")
INK_SOFT = HexColor("#4B5563")
INK_FAINT = HexColor("#9CA3AF")

# Per-card accent palettes for icon badge (pastel bg + soft mid-tone fg)
ACCENTS = [
    (HexColor("#FCE4EC"), HexColor("#C2185B")),  # rose
    (HexColor("#E3F2FD"), HexColor("#1565C0")),  # blue
    (HexColor("#E8F5E9"), HexColor("#2E7D32")),  # mint
    (HexColor("#FFF3E0"), HexColor("#E65100")),  # peach
    (HexColor("#F3E5F5"), HexColor("#6A1B9A")),  # lavender
    (HexColor("#E0F7FA"), HexColor("#00838F")),  # teal
    (HexColor("#FFFDE7"), HexColor("#9E6B00")),  # butter
    (HexColor("#FBE9E7"), HexColor("#BF360C")),  # coral
]

# Register fonts (Windows Arial supports PL diacritics + Cyrillic)
pdfmetrics.registerFont(TTFont("Arial", r"C:\Windows\Fonts\arial.ttf"))
pdfmetrics.registerFont(TTFont("ArialBd", r"C:\Windows\Fonts\arialbd.ttf"))
pdfmetrics.registerFont(TTFont("ArialIt", r"C:\Windows\Fonts\ariali.ttf"))

# Emoji font (Segoe UI Emoji has wide Unicode coverage; renders monochrome in PDF)
EMOJI_OK = True
try:
    pdfmetrics.registerFont(TTFont("Emoji", r"C:\Windows\Fonts\seguisym.ttf"))
except Exception:
    try:
        pdfmetrics.registerFont(TTFont("Emoji", r"C:\Windows\Fonts\seguiemj.ttf"))
    except Exception:
        EMOJI_OK = False

OUT = r"E:\vocawise\docs\pl-uk-100-verbs.pdf"

PAGE_W, PAGE_H = A4
MARGIN = 8 * mm
COLS, ROWS = 2, 5
GUT_X = 4 * mm
GUT_Y = 3 * mm
CARD_W = (PAGE_W - 2 * MARGIN - (COLS - 1) * GUT_X) / COLS
CARD_H = (PAGE_H - 2 * MARGIN - (ROWS - 1) * GUT_Y) / ROWS
PER_PAGE = COLS * ROWS


def shrink_to_fit(c, text, font, max_size, min_size, max_w):
    sz = max_size
    while sz > min_size and c.stringWidth(text, font, sz) > max_w:
        sz -= 0.5
    return sz


def draw_page_bg(c, page_idx):
    bg = PAGE_BGS[page_idx % len(PAGE_BGS)]
    c.setFillColor(bg)
    c.setStrokeColor(bg)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)


def wrap_text(c, text, font, size, max_w):
    words = text.split(" ")
    cur, lines = "", []
    for word in words:
        test = (cur + " " + word).strip()
        if c.stringWidth(test, font, size) <= max_w:
            cur = test
        else:
            if cur:
                lines.append(cur)
            cur = word
    if cur:
        lines.append(cur)
    return lines


def draw_card(c, x, y, w, h, idx, v):
    target, base, exT, exB, assoc, ja, ty, on, my, wy, oni = v
    emoji = EMOJIS[idx]
    badge_bg, badge_fg = ACCENTS[idx % len(ACCENTS)]
    INK_ASSOC = HexColor("#6B7280")  # darker than INK_FAINT — better readability

    # Card body — neutral white, thin border
    c.setFillColor(CARD_FILL)
    c.setStrokeColor(CARD_BORDER)
    c.setLineWidth(0.7)
    c.roundRect(x, y, w, h, 8, stroke=1, fill=1)

    strip_h = 12 * mm
    top_y = y + strip_h
    left_w = w * 0.40

    # Bottom strip
    c.setFillColor(STRIP_FILL)
    c.setStrokeColor(STRIP_FILL)
    c.rect(x + 0.7, y + 0.7, w - 1.4, strip_h - 0.7, stroke=0, fill=1)

    # Horizontal divider above strip
    c.setStrokeColor(DIVIDER)
    c.setLineWidth(0.5)
    c.line(x + 0.7, top_y, x + w - 0.7, top_y)

    # Vertical divider 40/60
    c.line(x + left_w, top_y + 1, x + left_w, y + h - 1)

    # ==================== LEFT 40% ====================
    pad = 3.5 * mm
    lx = x + pad
    lw = left_w - 2 * pad

    # Number tiny, top-right of card
    c.setFont("Arial", 6.5)
    c.setFillColor(INK_FAINT)
    num_text = f"#{idx + 1:03d}"
    nw = c.stringWidth(num_text, "Arial", 6.5)
    c.drawString(x + w - pad - nw, y + h - 9, num_text)

    # Font sizes — bumped for hierarchy
    target_sz = 18
    while c.stringWidth(target, "ArialBd", target_sz) > lw and target_sz > 12:
        target_sz -= 0.5
    base_sz = 12
    while c.stringWidth(base, "ArialIt", base_sz) > lw and base_sz > 9:
        base_sz -= 0.5

    assoc_sz = 7.5
    assoc_lines = wrap_text(c, assoc, "ArialIt", assoc_sz, lw)[:2]

    # Vertical centering — group: badge + accent + PL + UA + assoc
    badge_size = 10 * mm
    gap_badge = 5
    accent_h = 1.8
    gap_accent = 3
    gap_pl_uk = 3
    gap_uk_assoc = 6
    line_gap = 9

    content_h = (
        badge_size + gap_badge
        + target_sz + gap_accent + accent_h + gap_pl_uk
        + base_sz + gap_uk_assoc
        + len(assoc_lines) * line_gap
    )
    avail_h = h - strip_h
    top_offset = max(2, (avail_h - content_h) / 2)
    cy = y + h - top_offset

    # Emoji badge — pastel circle
    bx = lx
    by = cy - badge_size
    c.setFillColor(badge_bg)
    c.setStrokeColor(badge_bg)
    c.circle(bx + badge_size / 2, by + badge_size / 2, badge_size / 2, stroke=0, fill=1)

    if EMOJI_OK:
        emoji_sz = 14
        c.setFont("Emoji", emoji_sz)
        c.setFillColor(badge_fg)
        try:
            ew = c.stringWidth(emoji, "Emoji", emoji_sz)
        except Exception:
            ew = emoji_sz
        c.drawString(
            bx + (badge_size - ew) / 2,
            by + (badge_size - emoji_sz) / 2 + 2.5,
            emoji,
        )

    cy -= badge_size + gap_badge

    # PL target
    c.setFont("ArialBd", target_sz)
    c.setFillColor(INK)
    c.drawString(lx, cy - target_sz, target)
    cy -= target_sz + gap_accent

    # Pastel accent line under PL — short, in badge_bg color
    accent_w = 14 * mm
    c.setFillColor(badge_bg)
    c.setStrokeColor(badge_bg)
    c.rect(lx, cy - accent_h, accent_w, accent_h, stroke=0, fill=1)
    cy -= accent_h + gap_pl_uk

    # UA base
    c.setFont("ArialIt", base_sz)
    c.setFillColor(INK_SOFT)
    c.drawString(lx, cy - base_sz, base)
    cy -= base_sz + gap_uk_assoc

    # Association — darker, more readable
    c.setFont("ArialIt", assoc_sz)
    c.setFillColor(INK_ASSOC)
    for ln in assoc_lines:
        c.drawString(lx, cy - assoc_sz, ln)
        cy -= line_gap

    # ==================== RIGHT 60% — table ====================
    rx = x + left_w + pad
    rw = w - left_w - 2 * pad
    rows_data = [("JA", ja, "MY", my), ("TY", ty, "WY", wy), ("ON", on, "ONI", oni)]

    col_w = rw / 2
    label_w = 17
    form_w = col_w - label_w - 4

    table_top = y + h - 5
    table_bottom = top_y + 4
    table_h = table_top - table_bottom
    row_h = table_h / 3

    for i, (l1, f1, l2, f2) in enumerate(rows_data):
        row_top = table_top - i * row_h
        row_bot = row_top - row_h
        if i > 0:
            c.setStrokeColor(DIVIDER)
            c.setLineWidth(0.3)
            c.line(rx, row_top, rx + rw, row_top)
        ry = row_bot + (row_h - 9.5) / 2 + 1

        # Labels — small caps bold faint
        c.setFont("ArialBd", 7)
        c.setFillColor(INK_FAINT)
        c.drawString(rx, ry, l1)
        c.drawString(rx + col_w, ry, l2)

        # Forms
        c.setFillColor(INK)
        sz1 = shrink_to_fit(c, f1, "Arial", 9.5, 6.5, form_w)
        c.setFont("Arial", sz1)
        c.drawString(rx + label_w, ry, f1)

        sz2 = shrink_to_fit(c, f2, "Arial", 9.5, 6.5, form_w)
        c.setFont("Arial", sz2)
        c.drawString(rx + col_w + label_w, ry, f2)

    # ==================== BOTTOM STRIP — example with accent bar ====================
    sp = 3.5 * mm
    # Accent bar tied to badge color
    bar_w = 2
    c.setFillColor(badge_bg)
    c.setStrokeColor(badge_bg)
    c.rect(x + sp, y + 2, bar_w, strip_h - 4, stroke=0, fill=1)

    text_x = x + sp + bar_w + 5
    text_w = w - sp - (bar_w + 5) - sp

    sz = shrink_to_fit(c, exT, "Arial", 9, 7, text_w)
    c.setFont("Arial", sz)
    c.setFillColor(INK)
    c.drawString(text_x, y + strip_h - 13, exT)

    sz = shrink_to_fit(c, exB, "ArialIt", 8.5, 7, text_w)
    c.setFont("ArialIt", sz)
    c.setFillColor(INK_SOFT)
    c.drawString(text_x, y + strip_h - 25, exB)


def main():
    c = canvas.Canvas(OUT, pagesize=A4)
    c.setTitle("100 PL-UK Verbs Flashcards")

    page_idx = 0
    draw_page_bg(c, page_idx)

    for i, v in enumerate(V):
        slot = i % PER_PAGE
        if slot == 0 and i > 0:
            c.showPage()
            page_idx += 1
            draw_page_bg(c, page_idx)
        col = slot % COLS
        row = slot // COLS
        x = MARGIN + col * (CARD_W + GUT_X)
        y = PAGE_H - MARGIN - (row + 1) * CARD_H - row * GUT_Y
        draw_card(c, x, y, CARD_W, CARD_H, i, v)

    c.showPage()
    c.save()
    print(f"Wrote {OUT} ({len(V)} verbs, {(len(V) + PER_PAGE - 1) // PER_PAGE} pages)")


if __name__ == "__main__":
    main()
