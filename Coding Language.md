# Coding Language — specifica di progetto

Documento vivo. Ogni decisione presa sta qui; quello che è ancora aperto è marcato **DAI DECIDERE**.
La bozza originale a mano è in `boh`, questo file la sostituisce come riferimento.

---

## 0. L'obiettivo, scritto una volta per tutte

> Il linguaggio di programmazione più semplice e user-friendly al mondo: un bambino di 6 anni lo impara in pochi minuti e riesce a fare un programma vero. Gli errori si comportano come in HTML: il programma **non si ferma mai**, ma **niente passa in silenzio**.

Da questo derivano sei leggi. Se una proposta le viola, la proposta è sbagliata, non la legge.

| # | Legge | Cosa vuol dire in pratica |
|---|---|---|
| 1 | **Non si ferma mai** | una riga rotta viene saltata, il resto gira fino a `end` |
| 2 | **Niente è silenzioso** | ogni errore lascia un segno visibile, con riga e spiegazione |
| 3 | **Poche parole** | 10 parole chiave in v1, non una di più |
| 4 | **Una cosa, un modo** | due sintassi per la stessa azione sono un bug di progetto |
| 5 | **Si legge come succede** | indentazione = blocco, `print "ciao"` senza parentesi, `=` è uguaglianza |
| 6 | **Il primo errore non è l'ultimo** | si correggono tutti gli errori in una volta, non uno per esecuzione |

La legge 6 è quella che rende il linguaggio *divertente*: in C ti fermi al primo errore e ricominci. Qui vedi subito tutto ciò che non va, come nella console di un browser.

---

## 1. Forma di un programma

```
start
  ...righe...
end
```

- `start` è la prima riga, `end` l'ultima. Uno di ciascuno (tua regola, resta).
- Se mancano: si esegue comunque tutto e si mostra un **avviso** (legge 1).
- Nessun altro file, nessun `import` in v1 (vedi §9).
- Commenti: `#` fino a fine riga.
- Estensione del file: `.lang` come segnaposto, finché il nome non esiste.

---

## 2. Le parole (v1)

| Parola | Cosa fa | Esempio |
|---|---|---|
| `start` / `end` | apre e chiude il programma | `start` |
| `print` | mostra | `print "ciao " nome` |
| `define` | crea una cosa | `define anni = 12` |
| `set` | cambia una cosa che esiste | `set anni = anni + 1` |
| `if` | esegue il blocco se è vero | `if anni > 10` |
| `else` | altrimenti | `else` |
| `repeat` | ripete N volte | `repeat 3` |
| `ask` | fa una domanda, restituisce il testo | `define nome = ask("Come ti chiami?")` |
| `random` | esegue **uno** dei blocchi, con le probabilità | `random 67` |
| `pick` | sceglie **un valore** a caso | `define dado = pick 1, 2, 3, 4, 5, 6` |

Numeri, testo tra `"..."`, `true` / `false`, `niente` (il vuoto).

Operatori: `+ - * / %`, e per confrontare `= != < > <= >=`.
`=` è **solo** uguaglianza, mai assegnazione: `if x = 1` si legge come un bambino si aspetta. Assegnare lo fanno `define` e `set`, quindi `=` è libero. (In C e Python non è così: è la prima cosa che confonde chi impara.)

---

## 3. Variabili e slot `{n}`

La tua idea degli slot resta, ma **i graffi sono opzionali**:

```
define anni = 12        # uguale a:
define anni{1} = 12
```

`anni` e `anni{1}` sono la stessa cosa. I graffi servono solo quando vuoi più di un valore con lo stesso nome (`define punti{1}`, `define punti{2}`), cioè quasi mai. Il costo per un bambino passa da "devi capire i graffi" a zero, e la tua sintassi resta.

- Leggere un nome mai creato → **errore**, valore `niente`, si continua.
- `define` su un nome che esiste già → **avviso**, vince il nuovo valore.
- `set` su un nome mai creato → **avviso** ("non esisteva, l'ho creato") e lo crea.

I nomi: lettere, cifre, `_`; iniziano con una lettera. Maiuscole e minuscole contano.

---

## 4. Blocchi e indentazione

```
if anni > 10
  print "sei grande"
else
  print "sei piccolo"
```

- Un blocco è tutto ciò che sta più a destra della riga sopra. Spazi (tab = 4 spazi).
- Indentazione che non corrisponde a nessun livello aperto → **errore** e si aggancia al livello più vicino (perdona, ma lo dice).
- `else` **c'è**. Nel tuo draft non c'era: senza, per fare "altrimenti" bisogna scrivere la condizione opposta a mano, e se sbagli la negazione il programma fa la cosa sbagliata *senza dare errore* — che è il caso peggiore. Con `else` la condizione si scrive una volta sola.
- `repeat 3` ripete il blocco. Il contatore non è accessibile (in v1): se serve, si usa una variabile con `set`.

---

## 5. Random, senza slot

Il cuore della tua idea — **probabilità e comportamento nello stesso posto** — resta, ma in una forma sola:

```
random 67
  print "Wow!"
random 33
  print "Damn!"
```

- Righe `random` consecutive (con i loro blocchi) formano **un'unica estrazione**: una sola vince, le altre non girano.
- Due gruppi separati da qualsiasi altra riga = **due estrazioni indipendenti**. Questo chiude il buco che avevi: con `Random{1}` usato sia come "quale random" sia come "quale faccia", il linguaggio poteva esprimere un solo random per programma.
- Pesi che non sommano 100 → **avviso**, e si normalizza (non si blocca: legge 1).
- L'estrazione avviene una volta, al momento in cui si arriva alle righe `random`. Il risultato è congelato: due letture non possono dare due esiti diversi.

**La tua regola "one use" sparisce come errore perché diventa impossibile da violare**: una faccia non ha un nome, quindi non c'è modo di attaccarle un secondo blocco. Era la regola giusta, risolta dalla forma invece che da un messaggio.

`pick` fa l'altro mestiere — scegliere un valore, tutti con la stessa probabilità:

```
define dado = pick 1, 2, 3
```

Nel sasso-carta-forbici questo vale molto: `define cpu = pick "rock", "paper", "scissors"` restituisce la parola, e sparisce la mappa `1 = rock, 2 = paper, 3 = scissors` che nel tuo esempio costringeva a confrontare numeri.

---

## 6. `ask`

```
define nome = ask("Come ti chiami? ")
print "Ciao " nome
```

- `ask` scrive la domanda, aspetta l'invio, restituisce quello che è stato scritto (testo, mai vuoto: se premi solo invio, torna `""`).
- Una domanda si usa **una volta sola**? No in v1: la stessa riga `ask` può girare più volte (dentro un `repeat`). Il limite "one use" del tuo draft si applicava a `Ask{1}` come slot; con la forma attuale non serve.
- Senza interfaccia (esecuzione da terminale) `ask` legge da stdin.

---

## 7. Valori, conversioni, tipi

Quattro tipi: numero, testo, `true`/`false`, `niente`.

Niente dichiarazioni: il tipo lo decide il valore. Le conversioni sono automatiche e **generose**, perché un bambino non deve sapere cosa è un tipo:

| Situazione | Cosa succede |
|---|---|
| `print 5` | stampa `5` |
| `"ciao " + 5` | `ciao 5` (il `+` incolla quando c'è del testo) |
| `5 + "5"` | `55` (incolla, non somma: prevedibile e spiegabile) |
| `"a" - 1` | **errore**, risultato `niente`, si continua |
| `1 / 0` | **errore**, risultato `niente`, si continua |
| `"rock" = 1` | `false` + **avviso** (confronto tra tipi diversi: quasi sempre un bug) |

---

## 8. Gli errori — il pezzo che conta

### Tre livelli

| Livello | Quando | Cosa fa il programma | Come si vede |
|---|---|---|---|
| **Errore** | la riga non si capisce o non si può eseguire | salta la riga e va avanti | riga sottolineata in rosso + messaggio |
| **Avviso** | gira, ma probabilmente non è quello che volevi | esegue | riga sottolineata in giallo |
| **Suggerimento** | c'è un modo migliore | esegue | nel pannello, non nell'editor |

### Cosa non deve mai succedere

- **Il programma si ferma a metà.** Mai (tranne il caso "ciclo infinito", sotto).
- **L'errore sparisce.** Mai, nemmeno uno.
- **L'errore si mostra come traceback.** Mai: niente `TypeError at line 12`. Solo frasi.

### Le frasi

Il messaggio è una frase, non un codice. Struttura fissa:

> **riga 7** — Non conosco `anni`. L'hai creato con `define`?
> *forse volevi scrivere `anni`*

Le "forse volevi" si calcolano confrontando la parola scritta con le parole chiave e con i nomi già creati (distanza di Levenshtein ≤ 2). Per un bambino è la differenza tra "sbagliato" e "ho solo sbagliato a scrivere".

### Cosa succede, caso per caso

| Caso | Reazione | Livello |
|---|---|---|
| parola sconosciuta (`prnt`) | riga saltata | errore |
| nome mai creato, in lettura | valore `niente`, riga saltata | errore |
| `define` di un nome già esistente | vince il nuovo | avviso |
| `set` di un nome mai creato | lo crea | avviso |
| indentazione fuori livello | si aggancia al livello più vicino | errore |
| blocco `if` senza corpo | il blocco non fa niente | avviso |
| condizione di `if` che va in errore | vale `false`, il blocco non gira, e lo dice | errore |
| `random` che non somma 100 | normalizza | avviso |
| divisione per zero | risultato `niente` | errore |
| operazione su tipi incompatibili | risultato `niente` | errore |
| `ask` vuoto | `""` | avviso |
| `start` / `end` mancanti | esegue tutto | avviso |
| **più di 1 000 000 di istruzioni** | il programma si ferma | errore |
| errore interno del motore | il programma si ferma | errore, con la riga |

L'ultima riga è l'unica cosa che ferma il programma, ed è obbligatoria: un bambino scrive `repeat` con `set` sbagliato e crea un ciclo infinito al primo tentativo. Il limite lo salva e gli dice cosa guardare.

### Il recupero: come si continua

Il parser non prova a indovinare dentro una riga rotta: la riga diventa un "buco", si registra l'errore, e si riparte dalla riga logica successiva allo stesso livello o più a sinistra.

- Se a essere rotta è l'**intestazione di un blocco** (`if`, `repeat`, `random`), si salta l'intero blocco, e lo si dice: *"ho saltato anche le righe 8–10"*. Saltare il corpo è più onesto che eseguirlo a caso.
- Se è rotta un'**espressione** dentro una riga, la riga salta la sua azione ma le altre righe non la toccano.
- Un errore non interrompe mai il ciclo di analisi: si raccolgono tutti gli errori del programma, si mostrano insieme, e solo dopo si parte con l'esecuzione.

### Dove si vedono

```
┌──────────────────────────┬──────────────────────────┐
│  editor                  │  Risultato  Problemi (3) │
│  start                   │                          │
│  define anni = 12        │  Ciao Davide             │
│  prnt "ciao"   ← rosso   │  ─────────────────────   │
│  end                     │  riga 3 · errore         │
│                          │  Non conosco `prnt`.     │
│                          │  Forse volevi `print`?   │
└──────────────────────────┴──────────────────────────┘
```

A fine esecuzione una riga di riepilogo, sempre:
`Finito · 3 problemi (1 errore, 2 avvisi)`
Se non ci sono problemi: `Finito · nessun problema`.

---

## 9. Cosa non c'è, di proposito

| Non c'è | Perché | Quando torna |
|---|---|---|
| `import` | con tre funzioni built-in è una parola da imparare per niente | quando ci sono moduli veri (v0.4) |
| funzioni definite dall'utente | è la più grande assenza, ma raddoppia le cose da spiegare | v0.3 |
| liste | idem; il sasso-carta-forbici dimostra quanto mancano | v0.3 |
| `while` / `until` | `repeat` copre i primi programmi; senza uscita anticipata però `repeat` è cieco | v0.2 |
| `keypress` | richiede gestione eventi, non è un concetto da primi minuti | v0.2 |
| `else if` | `else` + `if` indentato fa la stessa cosa | forse mai |
| oggetti / classi | fuori portata, e non servono all'obiettivo | — |
| tipi dichiarati | il tipo lo decide il valore | — |

`import` merita una nota: nel tuo draft `import Random` era la cosa che rende un random possibile. È un'idea buona, ma in v1 i tre comandi built-in ci sono sempre; reintrodurre `import` quando esistono moduli veri è coerente, prima è teatro.

---

## 10. Esempi di riferimento (sintassi finale)

Servono come test: ognuno ha l'output atteso.

### 10.1 Un dado e una scelta

```
start
random 67
  print "Wow!"
random 33
  print "Damn!"
end
```

Output: `Wow!` circa 67 volte su 100, `Damn!` il resto. **Un** solo output per esecuzione.

### 10.2 Sasso, carta, forbici

```
start
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

if tu = "carta"
  if cpu = "sasso"
    print "Ho scelto sasso. Hai vinto!"
  if cpu = "forbici"
    print "Ho scelto forbici. Hai perso."

if tu = "forbici"
  if cpu = "sasso"
    print "Ho scelto sasso. Hai perso."
  if cpu = "carta"
    print "Ho scelto carta. Hai vinto!"

end
```

Se scrivi `Sasso` con la maiuscola non combacia niente e non stampa niente: **nessun errore**, perché per il linguaggio è solo un confronto tra testi diversi. È il caso in cui essere permissivi fa male: da qui nasce la regola che un confronto tra tipi diversi dà un avviso.

### 10.3 Collatz, con `else`

```
start
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

end
```

Continua a stampare dopo aver raggiunto 1, perché non c'è modo di uscire da un `repeat` (v0.2: `until`). Con `else` la condizione si scrive una volta invece di due.

---

## 11. Come si costruisce

```
testo sorgente
   │
   ▼
[ lessico ]      righe logiche → token (NEWLINE, INDENT, DEDENT inclusi)
   │             tab = 4 spazi, parentesi e "\" a fine riga continuano la riga
   ▼
[ parser ]       token → albero, con recupero: una riga rotta diventa un nodo "errore"
   │             errori raccolti in una lista, mai lanciati
   ▼
[ interprete ]   cammina l'albero, non si ferma: ogni errore runtime vale "niente"
   │             budget di 1 000 000 di istruzioni
   ▼
output + problemi
```

Quattro file, nessuna dipendenza:

| File | Ruolo |
|---|---|
| `motore.js` | lessico + parser + interprete. **Niente DOM.** Gira in browser e in Node |
| `linguaggio.html` | editor, pannello Risultato, pannello Problemi, evidenziazione righe |
| `test.js` | esegue gli esempi del §10 in Node e confronta output e numero di problemi |
| `lang.js` | esegue un file `.lang` dal terminale (`node lang.js prova.lang`) |

Il motore separato dal DOM è quello che rende possibile testare davvero il linguaggio invece di guardarlo a occhio.

---

## 12. Roadmap

| Versione | Cosa | Stato |
|---|---|---|
| v0.1 | `start/end`, `print`, `define`, `set`, `if/else`, `repeat`, numeri e testo, tutti gli errori del §8 | **fatto** |
| v0.2 | `ask`, `random`, `pick`, `until`, `keypress` | fatto tranne `keypress` |
| v0.3 | funzioni dell'utente, liste, `break` | da fare |
| v0.4 | `import` con moduli veri | da fare |
| beta | `.lang` con nome definitivo, esempi pronti, errori in italiano e inglese | da fare |

Mappa sul notepad:
- n1 *finalizzare la struttura* → **questo documento**
- n2 *primo prototipo funzionante* → v0.1 di §12
- n3 *applicazione funzionante* → `linguaggio.html`
- n4 *prima beta* → ultima riga della tabella
- n5 *l'obiettivo* → §0

---

## 13. DAI DECIDERE

1. **Il nome del linguaggio.** Serve prima della beta, e lo scegli tu: è la sola cosa che non posso decidere al posto tuo.
2. **`random` con o senza le righe consecutive?** (deciso e implementato: righe consecutive. L'alternativa costava una parola e un `end` in più.)
3. **`pick` è un corpo estraneo?** (implementato: `pick "sasso", "carta", "forbici"` restituisce il valore. Se non ti convince, si toglie.)
4. **Tutto in italiano o tutto in inglese?** Le parole chiave sono inglesi perché le hai scritte così. I messaggi in v1 sono in italiano: se il linguaggio deve essere internazionale, servono due file di messaggi.

---

## 14. Le differenze dal tuo draft, in una tabella

| Tuo draft | Qui | Perché |
|---|---|---|
| `define Random value{1} = 67` + `Random{1} = print(...)` | `random 67` + blocco | due passi per dire una cosa sola; e il `{n}` faceva due mestieri |
| `Random{1}` può essere usato una volta sola → errore | impossibile da violare | la forma lo impedisce, sparisce una classe di errori |
| `define N value{1} = 27` / `N{1} = 27` / `set steps{1} = ...` | `define n = 27` / `set n = 28` | due modi per assegnare; i graffi ora sono opzionali |
| `if` senza `else` | `if` / `else` | la negazione scritta a mano è la fonte di bug silenziosi |
| `print ("x")` e `print "x"` | `print "x"` | una sola forma |
| `= 67%` | `67` | il `%` è sintassi travestita da commento |
| `if keypress{1} = Ask{1}` | confronto tra tipi diversi → avviso | nel tuo draft quell'errore passava silenzioso |
| `import Random` | niente import in v1 | una parola in meno finché non carica niente di vero |
| `end` | `end` | resta: è il confine del programma |

---

## 15. Stato dell'implementazione (19 ottobre 2026)

Il motore esiste e gira. Non è una simulazione: `motore.js` è lessico + parser + interprete veri.

### Come si usa

```
node test.js                          # 45 test, tutti i casi del §8
node lang.js prova.lang               # esegue un file, chiede le risposte su stdin
open linguaggio.html                  # editor con Risultato e Problemi
```

`node` su questo Mac sta in `/usr/local/bin/node`, che non è nel PATH della shell: o si scrive il percorso intero, o si aggiunge `/usr/local/bin` al PATH.

### Cosa è stato verificato

| Prova | Risultato |
|---|---|
| 45 test in `test.js` | tutti passati |
| esempi §10 (dado, sasso-carta-forbici, Collatz) | output atteso |
| Collatz di 27 | arriva a 1 in 112 passi contati da 1 (`until`), 111 passi di calcolo |
| `random 67/33` su 1000 giri | 600–750 successi (atteso ~670) |
| pagina `linguaggio.html` in Brave headless | gira, colora le righe 3 · 4 · 10, il programma arriva a `end` |
| `lang.js` con `ask` da stdin | legge la riga e continua |

### Decisioni prese costruendo (non erano nella specifica)

| Cosa | Scelta | Motivo |
|---|---|---|
| `print "steps = " passi` | spazio aggiunto solo se non c'è già | altrimenti stampava `steps =  112` con due spazi: è la riga che si scrive più spesso |
| `==` | accettato come `=` | chi arriva da Python lo scrive; rifiutarlo era un errore per niente |
| messaggio "ho saltato le righe 8–10" | **avviso**, non errore | l'errore vero è già segnato sulla riga dell'intestazione: due errori per una svista confondono |
| `if` la cui condizione va in errore | un solo messaggio (quello dell'espressione) | due messaggi sulla stessa riga sono rumore |
| limite 1 000 000 istruzioni | errore + programma fermo | è l'unico caso in cui il programma si ferma, §8 |
| `until` | implementato in anticipo | senza, il Collatz stampa la stessa riga 111 volte |
| `end` | `end` | resta: è il confine del programma |

### Cosa manca per arrivare alla v1

1. `keypress` — richiede un ponte tra eventi del browser e interprete, non è una parola chiave.
2. Funzioni scritte dall'utente e liste (v0.3): senza liste il sasso-carta-forbici resta lungo.
3. `break`, oppure un modo per uscire da un `repeat` prima della fine.
4. Il nome. Finché non c'è, l'estensione resta `.lang`.
