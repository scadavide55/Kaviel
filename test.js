/* test.js — esegue gli esempi della specifica e i casi di errore del §8.
   node test.js                                                   */

const { run } = require('./motore.js');

let passed = 0, failed = 0;
const failures = [];

function rngOf(value) { return () => value; }

function queue(items) {
  let i = 0;
  return (q) => (i < items.length ? items[i++] : '');
}

function test(name, src, expect) {
  const opts = {};
  if (expect.rng !== undefined) opts.rng = rngOf(expect.rng);
  if (expect.input) opts.input = queue(expect.input);
  if (expect.limit) opts.limit = expect.limit;

  let res;
  try {
    res = run(src, opts);
  } catch (e) {
    failed++;
    failures.push(name + '\n  il motore ha lanciato: ' + e.message);
    return;
  }

  const problems = [];
  if (expect.output && JSON.stringify(res.output) !== JSON.stringify(expect.output)) {
    problems.push('output: atteso ' + JSON.stringify(expect.output) + ', ottenuto ' + JSON.stringify(res.output));
  }
  if (expect.errors !== undefined && res.errors !== expect.errors) {
    problems.push('errori: attesi ' + expect.errors + ', ottenuti ' + res.errors +
      (res.problems.length ? '\n    ' + res.problems.map(p => 'riga ' + p.line + ' ' + p.kind + ': ' + p.message).join('\n    ') : ''));
  }
  if (expect.warnings !== undefined && res.warnings !== expect.warnings) {
    problems.push('avvisi: attesi ' + expect.warnings + ', ottenuti ' + res.warnings +
      (res.problems.length ? '\n    ' + res.problems.map(p => 'riga ' + p.line + ' ' + p.kind + ': ' + p.message).join('\n    ') : ''));
  }
  if (expect.contains) {
    for (const piece of expect.contains) {
      const all = res.problems.map(p => p.message + ' ' + (p.hint || '')).join(' | ');
      if (!all.includes(piece)) problems.push('manca il messaggio che contiene: ' + piece + '\n    ottenuti: ' + all);
    }
  }
  if (expect.stopped !== undefined && res.stopped !== expect.stopped) {
    problems.push('stopped: atteso ' + expect.stopped + ', ottenuto ' + res.stopped);
  }

  if (problems.length) {
    failed++;
    failures.push(name + '\n  ' + problems.join('\n  '));
  } else {
    passed++;
  }
}

/* ---------------------------------------------------------- esempi §10 */

test('10.1 random 67/33, vince il primo',
  `start
random 67
  print "Wow!"
random 33
  print "Damn!"
end`,
  { output: ['Wow!'], errors: 0, warnings: 0, rng: 0.1 });

test('10.1 random 67/33, vince il secondo',
  `start
random 67
  print "Wow!"
random 33
  print "Damn!"
end`,
  { output: ['Damn!'], errors: 0, warnings: 0, rng: 0.99 });

test('10.1 random, un solo output per esecuzione',
  `start
random 50
  print "a"
random 50
  print "b"
end`,
  { output: ['a'], errors: 0, warnings: 0, rng: 0.2 });

test('10.2 sasso carta forbici, pareggio',
  `start
print "Sasso, carta o forbici?"

define tu = ask("Sasso, carta o forbici? ")
define cpu = pick "sasso", "carta", "forbici"

if tu = cpu
  print "Pari."

if tu = "sasso"
  if cpu = "carta"
    print "Ho scelto carta. Hai perso."
  if cpu = "forbici"
    print "Ho scelto forbici. Hai vinto!"
end`,
  { output: ['Sasso, carta o forbici?', 'Pari.'], errors: 0, warnings: 0, input: ['sasso'], rng: 0 });

test('10.2 sasso carta forbici, sconfitta',
  `start
define tu = ask("? ")
define cpu = pick "sasso", "carta", "forbici"
if tu = "sasso"
  if cpu = "carta"
    print "Hai perso."
end`,
  { output: ['Hai perso.'], errors: 0, warnings: 0, input: ['sasso'], rng: 0.5 });

test('10.3 Collatz 27 con else',
  `start
define n = 27
define passi = 1

repeat 111
  if n % 2 = 0
    set n = n / 2
  else
    set n = n * 3 + 1
  set passi = passi + 1
  if n = 1
    print "fatto in " passi " passi"

end`,
  { errors: 0, warnings: 0 });

test('10.3 Collatz arriva a 1 in 111 passi',
  `start
define n = 27
define passi = 1
until n = 1
  if n % 2 = 0
    set n = n / 2
  else
    set n = n * 3 + 1
  set passi = passi + 1
print "passi: " passi
print "n: " n
end`,
  { output: ['passi: 112', 'n: 1'], errors: 0, warnings: 0 });

/* ---------------------------------------------------------- le basi */

test('hello world',
  `start
print "ciao"
end`,
  { output: ['ciao'], errors: 0, warnings: 0 });

test('print più valori li separa con uno spazio',
  `start
define nome = "Davide"
print "Ciao " nome " !"
print "anni:" 12
end`,
  { output: ['Ciao Davide !', 'anni: 12'], errors: 0, warnings: 0 });

test('define e set',
  `start
define x = 1
set x = x + 1
set x = x * 10
print x
end`,
  { output: ['20'], errors: 0, warnings: 0 });

test('slot {n}: nomi diversi, stesso nome',
  `start
define punti{1} = 10
define punti{2} = 20
set punti{1} = punti{1} + 5
print punti{1}
print punti{2}
print punti
end`,
  { output: ['15', '20', '15'], errors: 0, warnings: 0 });

test('if / else',
  `start
define eta = 8
if eta > 10
  print "grande"
else
  print "piccolo"
end`,
  { output: ['piccolo'], errors: 0, warnings: 0 });

test('if annidati e repeat',
  `start
define i = 0
repeat 3
  set i = i + 1
  if i = 2
    print "due"
  else
    print i
end`,
  { output: ['1', 'due', '3'], errors: 0, warnings: 0 });

test('testo + numero incolla',
  `start
print "5" + 5
print 5 + 5
end`,
  { output: ['55', '10'], errors: 0, warnings: 0 });

test('commenti e righe vuote',
  `start
# commento
print "a"   # in linea

# altro
print "b"
end`,
  { output: ['a', 'b'], errors: 0, warnings: 0 });

test('true / false / niente',
  `start
print true
print false
print niente
if true
  print "ok"
end`,
  { output: ['true', 'false', 'niente', 'ok'], errors: 0, warnings: 0 });

test('numeri con la virgola e divisione',
  `start
print 3.5 + 1
print 27 / 2
print 10 % 3
end`,
  { output: ['4.5', '13.5', '1'], errors: 0, warnings: 0 });

test('precedenza degli operatori',
  `start
print 2 + 3 * 4
print (2 + 3) * 4
print 10 - 2 - 3
end`,
  { output: ['14', '20', '5'], errors: 0, warnings: 0 });

test('random dentro repeat torna a scegliere',
  `start
repeat 3
  random 100
    print "sempre"
end`,
  { output: ['sempre', 'sempre', 'sempre'], errors: 0, warnings: 0, rng: 0.5 });

test('due gruppi random separati sono due estrazioni',
  `start
random 100
  print "a"
print "in mezzo"
random 100
  print "b"
end`,
  { output: ['a', 'in mezzo', 'b'], errors: 0, warnings: 0, rng: 0.5 });

/* ---------------------------------------------------------- gli errori §8 */

test('parola sconosciuta: riga saltata, si continua',
  `start
print "prima"
prnt "ciao"
print "dopo"
end`,
  { output: ['prima', 'dopo'], errors: 1, warnings: 0, contains: ['Non conosco `prnt`', 'print'] });

test('nome mai creato',
  `start
print anni
print "fine"
end`,
  { output: ['fine'], errors: 1, warnings: 0, contains: ['Non conosco `anni`', 'define'] });

test('define di un nome esistente: avviso, vince il nuovo',
  `start
define x = 1
define x = 2
print x
end`,
  { output: ['2'], errors: 0, warnings: 1, contains: ['esisteva già'] });

test('set di un nome mai creato: avviso e lo crea',
  `start
set x = 5
print x
end`,
  { output: ['5'], errors: 0, warnings: 1, contains: ['non esisteva'] });

test('divisione per zero: niente, si continua',
  `start
print 1 / 0
print "vivo"
end`,
  { output: ['vivo'], errors: 1, warnings: 0, contains: ['dividere per zero'] });

test('operazione su tipi incompatibili',
  `start
print "a" - 1
print "vivo"
end`,
  { output: ['vivo'], errors: 1, warnings: 0, contains: ['due numeri'] });

test('confronto tra tipi diversi: avviso e false',
  `start
define x = 5
if x = "5"
  print "uguali"
else
  print "diversi"
end`,
  { output: ['diversi'], errors: 0, warnings: 1, contains: ['non potranno mai essere uguali'] });

test('random che non somma 100: avviso e continua',
  `start
random 60
  print "a"
random 30
  print "b"
end`,
  { errors: 0, warnings: 1, contains: ['invece di 100'], rng: 0.1 });

test('indentazione fuori livello: errore, si aggancia',
  `start
if true
    print "dentro"
  print "fuori"
end`,
  { output: ['dentro', 'fuori'], errors: 1, warnings: 0, contains: ['spostata a sinistra'] });

test('if senza corpo: avviso',
  `start
if true
print "dopo"
end`,
  { output: ['dopo'], errors: 0, warnings: 1, contains: ['non ha un blocco sotto'] });

test('condizione dell if in errore: vale false e lo dice',
  `start
define a = 1
if a / 0 = 1
  print "non deve uscire"
print "vivo"
end`,
  { output: ['vivo'], errors: 1, warnings: 0, contains: ['dividere per zero'] });

test('riga spostata a destra senza blocco: errore, esegue lo stesso',
  `start
print "a"
  print "b"
end`,
  { output: ['a', 'b'], errors: 1, warnings: 0, contains: ['non apre un blocco'] });

test('ciclo infinito: si ferma al limite',
  `start
define x = 1
until x = 2
  set x = 1
end`,
  { errors: 1, stopped: true, contains: ['non finisce mai'] });

test('start e end mancanti: avvisi, esegue tutto',
  `print "ciao"`,
  { output: ['ciao'], errors: 0, warnings: 2, contains: ['`start`', '`end`'] });

test('tanti errori in una volta sola (legge 6)',
  `start
prnt "a"
print "b"
foo bar
print 1 / 0
end`,
  { output: ['b'], errors: 3, warnings: 0 });

test('= da solo non assegna',
  `start
define x = 1
x = 2
print x
end`,
  { output: ['1'], errors: 1, warnings: 0, contains: ['non assegna', 'define'] });

test('intestazione rotta: salta il blocco e lo dice',
  `start
if 1 >
  print "dentro"
  print "ancora dentro"
print "fuori"
end`,
  { output: ['fuori'], errors: 1, warnings: 1, contains: ['Ho saltato anche le righe'] });

test('ask vuoto: avviso e testo vuoto',
  `start
define risposta = ask("? ")
print "[" risposta "]"
end`,
  { output: ['[ ]'], errors: 0, warnings: 1, input: [''], contains: ['vuota'] });

test('ask senza interfaccia: errore, non si ferma',
  `start
define r = ask("? ")
print "vivo"
end`,
  { output: ['vivo'], errors: 1, warnings: 0 });

test('testo non chiuso: errore, si continua',
  `start
print "ciao
print "dopo"
end`,
  { output: ['dopo'], errors: 1, warnings: 0, contains: ['non si chiude'] });

test('pick sceglie davvero uno dei valori',
  `start
define dado = pick 1, 2, 3, 4, 5, 6
print dado
end`,
  { output: ['4'], errors: 0, warnings: 0, rng: 0.5 });

test('slot: la stessa domanda non è one-use in v1',
  `start
define q = ask("nome? ")
print q
define q2 = ask("eta? ")
print q2
end`,
  { output: ['Davide', '14'], errors: 0, warnings: 0, input: ['Davide', '14'] });

test('programma vuoto: solo gli avvisi di start/end',
  ``,
  { output: [], errors: 0, warnings: 2, contains: ['`start`', '`end`'] });

test('else da solo',
  `start
else
  print "x"
end`,
  { errors: 1, warnings: 0, contains: ['`else` da solo'] });

/* ---------------------------------------------------------- random statistico */

{
  const res = run(`start
define w = 0
define l = 0
repeat 1000
  random 67
    set w = w + 1
  random 33
    set l = l + 1
end
print w`, {});
  const n = Number(res.output[0]);
  if (!(n >= 600 && n <= 750)) {
    failed++;
    failures.push('random 67/33 su 1000 giri fuori intervallo: ' + n);
  } else {
    passed++;
  }
}

/* ---------------------------------------------------------- risultato */

console.log('');
for (const f of failures) console.log('FALLITO · ' + f + '\n');
console.log(passed + ' passati, ' + failed + ' falliti');
process.exit(failed ? 1 : 0);
