/**
 * Approximate transliteration of Polish target words to Ukrainian phonetic
 * notation. Catches the high-value differences (ą/ę nasals, ł=у, sz/cz/rz,
 * soft ć/ś/ź, ó=у, и vs і) that a Ukrainian speaker stumbles on.
 *
 * Not phonemic-perfect (no devoicing, no nasal split, no syllable rules) —
 * good enough as a reading hint.
 */

const DIGRAPHS: readonly (readonly [string, string])[] = [
  ['dzi', 'дзі'],
  ['dź', 'дзь'],
  ['dż', 'дж'],
  ['dz', 'дз'],
  ['ch', 'х'],
  ['cz', 'ч'],
  ['sz', 'ш'],
  ['rz', 'ж'],
  ['ci', 'ці'],
  ['ć', 'ць'],
  ['si', 'сі'],
  ['ś', 'шь'],
  ['zi', 'зі'],
  ['ź', 'жь'],
  ['ni', 'ні'],
  ['ń', 'нь'],
  ['ki', 'кі'],
  ['gi', 'ґі'],
];

const LETTERS: Readonly<Record<string, string>> = {
  ą: 'он',
  ę: 'ен',
  ł: 'у',
  ó: 'у',
  ż: 'ж',
  y: 'и',
  i: 'і',
  j: 'й',
  w: 'в',
  l: 'ль',
  c: 'ц',
  h: 'х',
  e: 'е',
  o: 'о',
  a: 'а',
  u: 'у',
  b: 'б',
  d: 'д',
  f: 'ф',
  g: 'ґ',
  k: 'к',
  m: 'м',
  n: 'н',
  p: 'п',
  r: 'р',
  s: 'с',
  t: 'т',
  z: 'з',
};

export function transliteratePl(input: string): string {
  let s = input.toLocaleLowerCase('pl-PL');
  for (const [from, to] of DIGRAPHS) {
    s = s.split(from).join(to);
  }
  let out = '';
  for (const ch of s) {
    out += LETTERS[ch] ?? ch;
  }
  return out;
}
