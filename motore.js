/* motore.js — lessico + parser + interprete del linguaggio.
   Nessun DOM: gira nel browser (window.Motore) e in Node (require).

   Legge del progetto: il programma non si ferma mai, ma niente passa in silenzio.
   lessico  → token (NEWLINE, INDENT, DEDENT inclusi)
   parser   → albero, con recupero: una riga rotta diventa un buco + un problema
   interprete → cammina l'albero, ogni errore vale "niente" e si continua
*/

(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Motore = factory();
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  // ---------------------------------------------------------------- costanti

  var KEYWORDS = ['start', 'end', 'print', 'define', 'set', 'if', 'else', 'repeat',
    'until', 'ask', 'random', 'pick', 'true', 'false', 'niente'];
  var KEYWORD_SET = new Set(KEYWORDS);
  var TWO_CHAR_OPS = ['==', '!=', '<=', '>='];
  var ONE_CHAR_OPS = '=<>+-*/%(),{}';
  var CMP = ['=', '==', '!=', '<', '>', '<=', '>='];
  var MAX_STEPS = 1000000;

  var ERROR = { __errore: true };

  function isErr(v) { return v === ERROR; }
  function isDigit(c) { return c >= '0' && c <= '9'; }
  function isIdentStart(c) { return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_'; }
  function isIdentPart(c) { return isIdentStart(c) || isDigit(c); }

  // ---------------------------------------------------------------- lessico

  function tokenize(src) {
    var tokens = [];
    var problems = [];
    var len = src.length;
    var indents = [0];
    var neutral = new Set();          // rientri già perdonati una volta
    var i = 0, line = 1, col = 1;
    var depth = 0;                    // dentro ( ) [ ] { } i ritorni a capo non contano
    var lineHasToken = false;
    var atLineStart = true;

    function push(type, value, l, c, text) {
      tokens.push({ type: type, value: value, line: l, col: c, text: text === undefined ? String(value) : text });
    }
    function problem(kind, message, hint, l, c) {
      problems.push({ line: l, col: c || 1, kind: kind, message: message, hint: hint || '' });
    }

    while (i < len) {
      if (atLineStart) {
        var j = i, width = 0;
        while (j < len && (src[j] === ' ' || src[j] === '\t')) {
          width += src[j] === '\t' ? 4 : 1;
          j++;
        }
        var nxt = j < len ? src[j] : '';
        if (j >= len || nxt === '\n' || nxt === '\r' || nxt === '#') {
          // riga vuota o solo commento: non tocca l'indentazione
          i = j;
          col = width + 1;
          atLineStart = false;
          continue;
        }
        if (!lineHasToken) {
          var top = indents[indents.length - 1];
          if (neutral.has(width) && width !== top) {
            // già segnalato: si riusa lo stesso livello, senza nuovi token
          } else if (width > top) {
            indents.push(width);
            push('indent', width, line, 1);
          } else if (width < top) {
            while (indents.length > 1 && indents[indents.length - 1] > width) {
              indents.pop();
              push('dedent', width, line, 1);
            }
            if (indents[indents.length - 1] !== width) {
              problem('error',
                'Questa riga è spostata a sinistra in un punto che non conosco: l\'ho agganciata al livello più vicino.',
                'Usa lo stesso numero di spazi delle righe che stanno sopra di lei.', line, 1);
              neutral.add(width);
            }
          }
        }
        i = j;
        col = width + 1;
        atLineStart = false;
        continue;
      }

      var c = src[i];

      if (c === '\r') { i++; continue; }

      if (c === '\n') {
        i++;
        if (depth === 0) {
          if (lineHasToken) {
            push('newline', '\n', line, col);
            lineHasToken = false;
          }
          atLineStart = true;
          line++;
          col = 1;
        } else {
          line++;
          col = 1;
        }
        continue;
      }

      if (c === ' ' || c === '\t') { i++; col++; continue; }

      if (c === '#') {
        while (i < len && src[i] !== '\n') { i++; col++; }
        continue;
      }

      if (c === '\\') {
        var k = i + 1;
        while (k < len && (src[k] === ' ' || src[k] === '\t')) k++;
        if (k < len && (src[k] === '\n' || src[k] === '\r')) {
          while (k < len && src[k] !== '\n') k++;
          i = k + 1;
          line++;
          col = 1;
          atLineStart = false;      // la riga dopo continua questa
          continue;
        }
        problem('error', 'La barra `\\` da sola vale solo a fine riga, per continuare la riga dopo.', '', line, col);
        i++; col++;
        continue;
      }

      if (c === '"') {
        var startLine = line, startCol = col;
        var j2 = i + 1, out = '', closed = false;
        while (j2 < len) {
          var d = src[j2];
          if (d === '"') { closed = true; j2++; break; }
          if (d === '\n') break;
          if (d === '\\') {
            var e = src[j2 + 1];
            if (e === 'n') out += '\n';
            else if (e === 't') out += '\t';
            else if (e === '"') out += '"';
            else if (e === '\\') out += '\\';
            else if (e !== undefined) out += e;
            j2 += 2;
            continue;
          }
          out += d;
          j2++;
        }
        col += (j2 - i);
        i = j2;
        if (!closed) {
          problem('error', 'Questo testo non si chiude: manca `"` alla fine.', 'Scrivi `"` dopo l\'ultima lettera.', startLine, startCol);
        }
        push('string', out, startLine, startCol);
        tokens[tokens.length - 1].broken = !closed;
        lineHasToken = true;
        continue;
      }

      if (isDigit(c)) {
        var j3 = i, text = '';
        while (j3 < len && isDigit(src[j3])) { text += src[j3]; j3++; }
        if (src[j3] === '.' && isDigit(src[j3 + 1] || '')) {
          text += '.';
          j3++;
          while (j3 < len && isDigit(src[j3])) { text += src[j3]; j3++; }
        }
        var numCol = col;
        col += (j3 - i);
        i = j3;
        push('number', parseFloat(text), line, numCol, text);
        lineHasToken = true;
        continue;
      }

      if (isIdentStart(c)) {
        var j4 = i, word = '';
        while (j4 < len && isIdentPart(src[j4])) { word += src[j4]; j4++; }
        var wordCol = col;
        col += (j4 - i);
        i = j4;
        push(KEYWORD_SET.has(word) ? 'keyword' : 'ident', word, line, wordCol, word);
        lineHasToken = true;
        continue;
      }

      if (c === '(' || c === '[' || c === '{') depth++;
      if (c === ')' || c === ']' || c === '}') depth = Math.max(0, depth - 1);

      var two = src.slice(i, i + 2);
      if (TWO_CHAR_OPS.indexOf(two) >= 0) {
        push('op', two, line, col);
        i += 2; col += 2; lineHasToken = true;
        continue;
      }
      if (ONE_CHAR_OPS.indexOf(c) >= 0) {
        push('op', c, line, col);
        i++; col++; lineHasToken = true;
        continue;
      }

      problem('error', 'Non so cosa sia questo simbolo: `' + c + '`.', 'Toglilo oppure scrivilo in un altro modo.', line, col);
      i++; col++;
    }

    if (depth > 0) {
      problem('error', 'C\'è una parentesi aperta che non si chiude mai.', 'Ogni `(` vuole la sua `)`.', line, col);
    }
    if (lineHasToken) push('newline', '\n', line, col);
    while (indents.length > 1) { indents.pop(); push('dedent', 0, line, col); }
    push('eof', null, line, col);
    return { tokens: tokens, problems: problems };
  }

  // ---------------------------------------------------------------- suggerimenti

  function levenshtein(a, b) {
    a = a.toLowerCase(); b = b.toLowerCase();
    var m = a.length, n = b.length;
    if (!m) return n;
    if (!n) return m;
    var prev = new Array(n + 1), cur = new Array(n + 1);
    for (var j = 0; j <= n; j++) prev[j] = j;
    for (var i = 1; i <= m; i++) {
      cur[0] = i;
      for (var k = 1; k <= n; k++) {
        var cost = a[i - 1] === b[k - 1] ? 0 : 1;
        cur[k] = Math.min(prev[k] + 1, cur[k - 1] + 1, prev[k - 1] + cost);
      }
      var tmp = prev; prev = cur; cur = tmp;
    }
    return prev[n];
  }

  function suggestFor(word, candidates) {
    var best = null, bestD = 3;
    candidates.forEach(function (c) {
      if (c === word) return;
      var d = levenshtein(word, c);
      if (d < bestD) { bestD = d; best = c; }
    });
    return best;
  }

  // ---------------------------------------------------------------- parser

  function parse(tokens, problems) {
    var pos = 0;
    var known = new Set();
    var sawStart = false, sawEnd = false;

    function peek(k) { return tokens[Math.min(pos + (k || 0), tokens.length - 1)]; }
    function advance() { return tokens[pos++]; }
    function isOp(v) { var t = peek(); return t.type === 'op' && t.value === v; }
    function isKw(v) { var t = peek(); return t.type === 'keyword' && t.value === v; }
    function atEnd() {
      var t = peek();
      return t.type === 'newline' || t.type === 'eof' || t.type === 'dedent';
    }
    function problem(kind, t, message, hint) {
      problems.push({ line: t.line, col: t.col, kind: kind, message: message, hint: hint || '' });
    }
    function error(t, message, hint) { problem('error', t, message, hint); }
    function warning(t, message, hint) { problem('warning', t, message, hint); }

    function recover() {
      while (!atEnd()) pos++;
      if (peek().type === 'newline') pos++;
    }

    function skipBrokenBlock(startTok, what, quiet) {
      recover();
      if (peek().type !== 'indent') return;
      var bodyStart = peek().line;
      var lastContent = bodyStart;
      advance();                       // il rientro che apre il blocco
      var nesting = 1;
      while (nesting > 0 && peek().type !== 'eof') {
        var tk = advance();
        if (tk.type === 'indent') nesting++;
        else if (tk.type === 'dedent') nesting--;
        else if (tk.type !== 'newline') lastContent = tk.line;
      }
      if (!quiet) {
        problem('warning', startTok,
          'Ho saltato anche le righe ' + bodyStart + '–' + lastContent + ' del blocco `' + what + '`.',
          'Sistemi l\'intestazione e il blocco torna a posto da solo.');
      }
    }

    var statements = parseStatements();

    if (!sawStart) {
      problems.push({
        line: 1, col: 1, kind: 'warning',
        message: 'Il programma dovrebbe cominciare con `start`.',
        hint: 'Ho eseguito tutto lo stesso.'
      });
    }
    if (!sawEnd) {
      var last = tokens[tokens.length - 1];
      problems.push({
        line: Math.max(1, last.line), col: 1, kind: 'warning',
        message: 'Manca `end` alla fine del programma.',
        hint: 'Ho eseguito tutto lo stesso.'
      });
    }

    return { statements: statements, sawStart: sawStart, sawEnd: sawEnd };

    function parseStatements() {
      var list = [];
      for (;;) {
        var t = peek();
        if (t.type === 'eof' || t.type === 'dedent') break;
        if (t.type === 'newline') { pos++; continue; }
        var before = pos;
        var st = parseStatement();
        if (st) {
          if (st.type === 'Start') sawStart = true;
          if (st.type === 'End') sawEnd = true;
          list.push(st);
        }
        if (pos === before) pos++;
        if (peek().type === 'newline') pos++;
      }
      return list;
    }

    function parseBlock(kw, headerLine) {
      if (peek().type === 'newline') pos++;
      else error(peek(), 'Dopo `' + kw + '` bisogna andare a capo.', 'Le righe del blocco vanno sotto, spostate a destra.');
      if (peek().type !== 'indent') {
        warning({ line: headerLine, col: 1 },
          '`' + kw + '` non ha un blocco sotto, quindi non fa niente.',
          'Sposta a destra le righe che devono stare dentro.');
        return { type: 'Block', body: [], line: headerLine };
      }
      pos++;
      var body = parseStatements();
      if (peek().type === 'dedent') pos++;
      if (body.length === 0) {
        warning({ line: headerLine, col: 1 }, 'Il blocco di `' + kw + '` è vuoto.', '');
      }
      return { type: 'Block', body: body, line: headerLine };
    }

    function parseStatement() {
      var t = peek();

      if (t.type === 'indent') {
        error(t, 'Questa riga è spostata a destra, ma la riga sopra non apre un blocco.',
          'Togli gli spazi in più, oppure metti un `if` o un `repeat` sopra di lei.');
        pos++;
        var escaped = parseStatements();
        if (peek().type === 'dedent') pos++;
        return { type: 'Block', body: escaped, line: t.line };
      }

      if (t.type === 'keyword') {
        switch (t.value) {
          case 'start':
            pos++;
            if (!atEnd()) { error(peek(), 'Dopo `start` non serve altro: `start` sta da solo sulla sua riga.'); recover(); }
            return { type: 'Start', line: t.line };

          case 'end':
            pos++;
            if (!atEnd()) { error(peek(), 'Dopo `end` non serve altro: `end` sta da solo sulla sua riga.'); recover(); }
            return { type: 'End', line: t.line };

          case 'print': {
            pos++;
            var values = [];
            while (!atEnd()) {
              var before = pos;
              values.push(parseExpression());
              if (pos === before) { if (!atEnd()) pos++; break; }
              if (isOp(',')) pos++;
            }
            if (values.length === 0) {
              error(t, '`print` ha bisogno di qualcosa da mostrare.', 'Per esempio: print "ciao"');
            }
            return { type: 'Print', values: values, line: t.line };
          }

          case 'define':
          case 'set': {
            pos++;
            var nameTok = peek();
            if (nameTok.type !== 'ident') {
              error(nameTok, 'Dopo `' + t.value + '` serve un nome.', 'Per esempio: ' + t.value + ' anni = 12');
              recover();
              return null;
            }
            pos++;
            var slot = 1;
            if (isOp('{')) {
              pos++;
              var numTok = peek();
              if (numTok.type === 'number' && isFinite(numTok.value)) { slot = Math.floor(numTok.value); pos++; }
              else { error(numTok, 'Dentro `{ }` va un numero, come in `' + nameTok.value + '{1}`.', ''); recover(); return null; }
              if (isOp('}')) pos++;
              else { error(peek(), 'Manca la `}` che chiude `{ ' + slot + '`.', ''); recover(); return null; }
            }
            if (!isOp('=')) {
              error(peek(), 'Dopo il nome manca `=`.', 'Per esempio: ' + t.value + ' ' + nameTok.value + ' = 12');
              recover();
              return null;
            }
            pos++;
            var expr = parseExpression();
            known.add(nameTok.value);
            if (!atEnd()) {
              error(peek(), 'Non capisco questa parte della riga.', 'Una riga fa una cosa sola.');
              recover();
              return null;
            }
            return { type: t.value === 'define' ? 'Define' : 'Set', name: nameTok.value, slot: slot, expr: expr, line: t.line };
          }

          case 'if': {
            pos++;
            var beforeCond = problems.length;
            var cond = parseExpression();
            if (problems.length > beforeCond || !atEnd()) {
              if (!atEnd() && problems.length === beforeCond) {
                error(peek(), 'Dopo la condizione dell\'`if` non serve altro.', 'Per esempio: if anni > 10');
              }
              skipBrokenBlock(t, 'if');
              return null;
            }
            var body = parseBlock('if', t.line);
            var otherwise = null;
            if (isKw('else')) {
              var elseTok = advance();
              if (isKw('if')) {
                error(peek(), '`else if` non esiste: metti `else` e poi l\'`if` sulla riga dopo, spostato a destra.', '');
                skipBrokenBlock(elseTok, 'else');
                return { type: 'If', cond: cond, body: body, otherwise: null, line: t.line };
              }
              otherwise = parseBlock('else', elseTok.line);
            }
            return { type: 'If', cond: cond, body: body, otherwise: otherwise, line: t.line };
          }

          case 'else':
            error(t, '`else` da solo non vuol dire niente: deve venire subito dopo un blocco `if`, allo stesso livello.', '');
            skipBrokenBlock(t, 'else', true);
            return null;

          case 'repeat':
          case 'until': {
            pos++;
            var beforeHead = problems.length;
            var head = parseExpression();
            if (problems.length > beforeHead || !atEnd()) {
              if (!atEnd() && problems.length === beforeHead) {
                error(peek(), 'Dopo `' + t.value + '` non serve altro.', 'Per esempio: repeat 3');
              }
              skipBrokenBlock(t, t.value);
              return null;
            }
            var loopBody = parseBlock(t.value, t.line);
            return { type: t.value === 'repeat' ? 'Repeat' : 'Until', expr: head, body: loopBody, line: t.line };
          }

          case 'random': {
            pos++;
            var beforeWeight = problems.length;
            var weight = parseExpression();
            if (problems.length > beforeWeight || !atEnd()) {
              if (!atEnd() && problems.length === beforeWeight) {
                error(peek(), 'Dopo `random` ci va solo il numero delle probabilità.', 'Per esempio: random 67');
              }
              skipBrokenBlock(t, 'random');
              return null;
            }
            var face = parseBlock('random', t.line);
            return { type: 'Random', weight: weight, body: face, line: t.line };
          }

          case 'ask':
          case 'pick':
          case 'true':
          case 'false':
          case 'niente': {
            var exprStmt = parseExpression();
            if (!atEnd()) {
              error(peek(), 'Non capisco questa parte della riga.', 'Una riga fa una cosa sola.');
              recover();
              return null;
            }
            return { type: 'ExprStmt', expr: exprStmt, line: t.line };
          }

          default:
            error(t, 'Non so cosa voglia dire `' + t.value + '` qui.', '');
            recover();
            return null;
        }
      }

      if (t.type === 'ident') {
        var nextT = peek(1);
        var slotFollows = nextT.type === 'op' && nextT.value === '{';
        var afterName = slotFollows ? peek(3) : nextT;

        if (afterName.type === 'op' && afterName.value === '=') {
          var sug = suggestFor(t.value, KEYWORDS.concat(Array.from(known)));
          error(t, '`=` da solo non assegna: confronta due cose.',
            'Per creare `' + t.value + '` si usa `define ' + t.value + ' = ...`, per cambiarlo `set ' + t.value + ' = ...`.' + (sug ? ' (Forse volevi `' + sug + '`?)' : ''));
          recover();
          return null;
        }
        if (nextT.type === 'op' && nextT.value === '(') {
          error(t, 'Non ci sono ancora le funzioni scritte da te: `' + t.value + '` non è un comando.',
            'I comandi di adesso sono: print, define, set, if, else, repeat, until, random, pick, ask.');
          recover();
          return null;
        }
        var suggestion = suggestFor(t.value, KEYWORDS.concat(Array.from(known)));
        error(t, 'Non conosco `' + t.value + '`.', suggestion ? 'Forse volevi scrivere `' + suggestion + '`?' : '');
        recover();
        return null;
      }

      if (t.type === 'string' || t.type === 'number') {
        error(t, 'Questa riga comincia con un valore, ma un valore da solo non fa niente.',
          'Per mostrarlo: print ' + t.text);
        recover();
        return null;
      }

      error(t, 'Non capisco questa riga.', '');
      recover();
      return null;
    }

    // ---- espressioni

    function parseExpression() { return parseComparison(); }

    function parseComparison() {
      var left = parseAdditive();
      for (;;) {
        var t = peek();
        if (t.type === 'op' && CMP.indexOf(t.value) >= 0) {
          pos++;
          var right = parseAdditive();
          left = { type: 'Binary', op: t.value === '==' ? '=' : t.value, left: left, right: right, line: t.line };
        } else break;
      }
      return left;
    }

    function parseAdditive() {
      var left = parseMultiplicative();
      for (;;) {
        var t = peek();
        if (t.type === 'op' && (t.value === '+' || t.value === '-')) {
          pos++;
          var right = parseMultiplicative();
          left = { type: 'Binary', op: t.value, left: left, right: right, line: t.line };
        } else break;
      }
      return left;
    }

    function parseMultiplicative() {
      var left = parseUnary();
      for (;;) {
        var t = peek();
        if (t.type === 'op' && (t.value === '*' || t.value === '/' || t.value === '%')) {
          pos++;
          var right = parseUnary();
          left = { type: 'Binary', op: t.value, left: left, right: right, line: t.line };
        } else break;
      }
      return left;
    }

    function parseUnary() {
      var t = peek();
      if (t.type === 'op' && t.value === '-') {
        pos++;
        return { type: 'Unary', op: '-', expr: parseUnary(), line: t.line };
      }
      return parsePrimary();
    }

    function skipCallArgs() {
      var nesting = 0;
      while (peek().type !== 'eof') {
        var t = peek();
        if (t.type === 'op' && t.value === '(') nesting++;
        if (t.type === 'op' && t.value === ')') { nesting--; pos++; if (nesting <= 0) return; continue; }
        if (nesting === 0 && (t.type === 'newline' || t.type === 'dedent')) return;
        pos++;
      }
    }

    function parsePrimary() {
      var t = peek();

      if (t.type === 'number' || t.type === 'string') {
        pos++;
        if (t.broken) return { type: 'Bad', line: t.line };
        return { type: 'Literal', value: t.value, line: t.line };
      }

      if (t.type === 'keyword') {
        if (t.value === 'true' || t.value === 'false') {
          pos++;
          return { type: 'Literal', value: t.value === 'true', line: t.line };
        }
        if (t.value === 'niente') {
          pos++;
          return { type: 'Literal', value: null, line: t.line };
        }
        if (t.value === 'ask') {
          pos++;
          if (!isOp('(')) {
            error(t, '`ask` vuole la domanda tra parentesi.', 'Per esempio: ask("Come ti chiami? ")');
            return { type: 'Bad', line: t.line };
          }
          pos++;
          var args = [];
          if (!isOp(')')) {
            for (;;) {
              var before = pos;
              args.push(parseExpression());
              if (pos === before) break;
              if (isOp(',')) { pos++; continue; }
              break;
            }
          }
          if (isOp(')')) pos++;
          else error(peek(), 'Manca la `)` che chiude `ask`.', '');
          return { type: 'Ask', args: args, line: t.line };
        }
        if (t.value === 'pick') {
          pos++;
          var items = [];
          for (;;) {
            var before2 = pos;
            items.push(parseExpression());
            if (pos === before2) break;
            if (isOp(',')) { pos++; continue; }
            break;
          }
          if (items.length === 0) {
            error(t, '`pick` ha bisogno di almeno un valore da scegliere.', 'Per esempio: pick "sasso", "carta"');
          }
          return { type: 'Pick', items: items, line: t.line };
        }
        error(t, 'Qui non ci può stare `' + t.value + '`.', '');
        pos++;
        return { type: 'Bad', line: t.line };
      }

      if (t.type === 'ident') {
        pos++;
        var slot = 1;
        if (isOp('{')) {
          pos++;
          var num = peek();
          if (num.type === 'number') { slot = Math.floor(num.value); pos++; }
          else { error(num, 'Dentro `{ }` ci va un numero.', 'Per esempio: punti{2}'); }
          if (isOp('}')) pos++;
          else error(peek(), 'Manca `}`.', '');
        }
        if (isOp('(')) {
          error(t, 'Non ci sono ancora le funzioni scritte da te: `' + t.value + '` non è un comando.', '');
          skipCallArgs();
          return { type: 'Bad', line: t.line };
        }
        return { type: 'Name', name: t.value, slot: slot, line: t.line };
      }

      if (t.type === 'op' && t.value === '(') {
        pos++;
        var inner = parseExpression();
        if (isOp(')')) pos++;
        else error(peek(), 'Manca la `)` che chiude la parentesi.', '');
        return inner;
      }

      error(t, 'Qui manca qualcosa da calcolare.', 'Per esempio: print 1 + 2, oppure define x = "ciao".');
      if (!atEnd()) pos++;
      return { type: 'Bad', line: t.line };
    }
  }

  // ---------------------------------------------------------------- valori

  function show(v) {
    if (v === null) return 'niente';
    if (typeof v === 'number') {
      if (!isFinite(v)) return String(v);
      if (Number.isInteger(v)) return String(v);
      return String(Math.round(v * 1e10) / 1e10);
    }
    return String(v);
  }

  /* I valori di un print stanno uno accanto all'altro separati da uno spazio,
     ma solo se quello spazio non c'è già: print "ciao " nome stampa "ciao Davide". */
  function joinPrinted(parts) {
    var out = '';
    for (var i = 0; i < parts.length; i++) {
      var piece = parts[i];
      if (i > 0 && piece !== '') {
        var lastChar = out.charAt(out.length - 1);
        var firstChar = piece.charAt(0);
        var gap = lastChar !== ' ' && lastChar !== '\t' && firstChar !== ' ' && firstChar !== '\t';
        if (gap) out += ' ';
      }
      out += piece;
    }
    return out;
  }

  function typeName(v) {
    if (typeof v === 'number') return 'un numero';
    if (typeof v === 'string') return 'un testo';
    if (typeof v === 'boolean') return 'true o false';
    return 'niente';
  }

  function truthy(v) {
    if (v === null) return false;
    if (typeof v === 'number') return v !== 0;
    if (typeof v === 'string') return v !== '';
    return !!v;
  }

  // ---------------------------------------------------------------- interprete

  function Interpreter(opts) {
    this.output = opts.output || [];
    this.problems = [];
    this.input = opts.input || null;
    this.rng = opts.rng || Math.random;
    this.limit = opts.limit || MAX_STEPS;
    this.vars = new Map();
    this.steps = 0;
    this.stopped = false;
  }

  Interpreter.prototype.key = function (name, slot) {
    return name + '\u0000' + (slot || 1);
  };

  Interpreter.prototype.error = function (line, message, hint) {
    this.problems.push({ line: line, col: 1, kind: 'error', message: message, hint: hint || '' });
  };

  Interpreter.prototype.warning = function (line, message, hint) {
    this.problems.push({ line: line, col: 1, kind: 'warning', message: message, hint: hint || '' });
  };

  Interpreter.prototype.tick = function (line) {
    this.steps++;
    if (this.steps > this.limit) {
      this.error(line,
        'Ho eseguito più di ' + this.limit.toLocaleString('it-IT') + ' istruzioni e mi sono fermato: c\'è un ciclo che non finisce mai.',
        'Guarda la condizione di `repeat` / `until`: dentro il ciclo qualcosa deve cambiare davvero.');
      this.stopped = true;
    }
  };

  Interpreter.prototype.execList = function (list) {
    for (var i = 0; i < list.length; i++) {
      if (this.stopped) return;
      var st = list[i];
      if (st.type === 'Random') {
        var j = i;
        while (j < list.length && list[j].type === 'Random') j++;
        this.execRandomGroup(list.slice(i, j));
        i = j - 1;
        continue;
      }
      this.execStatement(st);
    }
  };

  Interpreter.prototype.execRandomGroup = function (group) {
    var weights = [];
    var total = 0;
    for (var i = 0; i < group.length; i++) {
      var w = this.eval(group[i].weight);
      if (isErr(w)) { weights.push(0); continue; }
      if (typeof w !== 'number') {
        this.error(group[i].line, 'Le probabilità di `random` vogliono numeri, non ' + typeName(w) + '.', 'Per esempio: random 67');
        weights.push(0);
        continue;
      }
      if (w < 0) {
        this.error(group[i].line, 'Una probabilità negativa non ha senso.', 'Usa numeri da 0 a 100.');
        weights.push(0);
        continue;
      }
      weights.push(w);
      total += w;
    }
    if (total <= 0) {
      this.error(group[0].line, 'Nessuna faccia del `random` ha una probabilità maggiore di zero: non ho scelto niente.', '');
      return;
    }
    if (Math.abs(total - 100) > 1e-9) {
      this.warning(group[0].line,
        'Le probabilità di questo `random` fanno ' + show(Math.round(total * 1e6) / 1e6) + ' invece di 100: le ho adattate.',
        'Se i numeri sono le percentuali, devono sommare 100.');
    }
    var draw = this.rng() * total;
    var picked = group.length - 1;
    var walked = 0;
    for (var k = 0; k < group.length; k++) {
      walked += weights[k];
      if (draw < walked) { picked = k; break; }
    }
    this.execList(group[picked].body.body);
  };

  Interpreter.prototype.execStatement = function (st) {
    var self = this;
    this.tick(st.line);

    switch (st.type) {
      case 'Start':
      case 'End':
        return;
      case 'Block':
        this.execList(st.body);
        return;
      case 'ExprStmt':
        this.eval(st.expr);
        return;

      case 'Print': {
        var parts = [];
        for (var i = 0; i < st.values.length; i++) {
          var v = this.eval(st.values[i]);
          if (isErr(v)) return;               // riga saltata: l'errore è già stato detto
          parts.push(show(v));
        }
        this.output.push(joinPrinted(parts));
        return;
      }

      case 'Define': {
        var dv = this.eval(st.expr);
        if (isErr(dv)) return;
        var dk = this.key(st.name, st.slot);
        if (this.vars.has(dk)) {
          this.warning(st.line, '`' + st.name + '` esisteva già: ho messo il nuovo valore.',
            'Se volevi cambiarlo, il comando è `set`.');
        }
        this.vars.set(dk, dv);
        return;
      }

      case 'Set': {
        var sv = this.eval(st.expr);
        if (isErr(sv)) return;
        var sk = this.key(st.name, st.slot);
        if (!this.vars.has(sk)) {
          this.warning(st.line, '`' + st.name + '` non esisteva: l\'ho creato adesso.',
            'Per crearlo apposta si usa `define`.');
        }
        this.vars.set(sk, sv);
        return;
      }

      case 'If': {
        var beforeCond = this.problems.length;
        var cv = this.eval(st.cond);
        if (isErr(cv)) {
          if (this.problems.length === beforeCond) {
            this.error(st.line, 'La condizione di questo `if` non ha funzionato: ho saltato il blocco.', '');
          }
          return;
        }
        if (truthy(cv)) this.execList(st.body.body);
        else if (st.otherwise) this.execList(st.otherwise.body);
        return;
      }

      case 'Repeat': {
        var beforeN = this.problems.length;
        var nv = this.eval(st.expr);
        if (isErr(nv)) {
          if (this.problems.length === beforeN) {
            this.error(st.line, 'Non so quante volte ripetere: ho saltato il blocco.', '');
          }
          return;
        }
        if (typeof nv !== 'number') {
          this.error(st.line, '`repeat` vuole un numero di giri, non ' + typeName(nv) + '.', 'Per esempio: repeat 3');
          return;
        }
        var times = Math.floor(nv);
        if (times < 0) { this.error(st.line, '`repeat` non può girare un numero negativo di volte.', ''); return; }
        if (times !== nv) this.warning(st.line, '`repeat ' + show(nv) + '`: ho arrotondato a ' + times + ' giri.', '');
        for (var r = 0; r < times; r++) {
          if (this.stopped) return;
          this.tick(st.line);
          this.execList(st.body.body);
        }
        return;
      }

      case 'Until': {
        for (;;) {
          if (this.stopped) return;
          this.tick(st.line);
          var beforeU = this.problems.length;
          var uv = this.eval(st.expr);
          if (isErr(uv)) {
            if (this.problems.length === beforeU) {
              this.error(st.line, 'La condizione di questo `until` non ha funzionato: mi sono fermato.', '');
            }
            return;
          }
          if (truthy(uv)) return;
          this.execList(st.body.body);
        }
      }

      default:
        this.error(st.line, 'Il motore non conosce questa istruzione.', '');
    }
  };

  Interpreter.prototype.eval = function (node) {
    var self = this;
    switch (node.type) {
      case 'Literal':
        return node.value;
      case 'Bad':
        return ERROR;

      case 'Name': {
        var k = this.key(node.name, node.slot);
        if (!this.vars.has(k)) {
          var names = [];
          this.vars.forEach(function (_v, key) { names.push(String(key).split('\u0000')[0]); });
          var sug = suggestFor(node.name, names);
          this.error(node.line, 'Non conosco `' + node.name + '`. L\'hai creato con `define`?',
            sug ? 'Forse volevi `' + sug + '`?' : '');
          return ERROR;
        }
        return this.vars.get(k);
      }

      case 'Unary': {
        var uv = this.eval(node.expr);
        if (isErr(uv)) return ERROR;
        if (typeof uv !== 'number') {
          this.error(node.line, 'Il `-` vuole un numero, non ' + typeName(uv) + '.', '');
          return ERROR;
        }
        return -uv;
      }

      case 'Binary':
        return this.evalBinary(node);

      case 'Ask': {
        var args = [];
        for (var i = 0; i < node.args.length; i++) {
          var a = this.eval(node.args[i]);
          if (isErr(a)) return ERROR;
          args.push(a);
        }
        if (!this.input) {
          this.error(node.line, '`ask` ha bisogno di qualcuno che risponda, e qui non c\'è nessuno.',
            'Da terminale la domanda legge l\'input; nella pagina si apre una finestrella.');
          return ERROR;
        }
        if (args.length > 1) this.warning(node.line, '`ask` accetta una domanda sola: ho usato la prima.', '');
        var question = args.length ? show(args[0]) : '';
        var answer = this.input(question);
        if (answer === undefined || answer === null) {
          this.error(node.line, 'Non ho ricevuto nessuna risposta alla domanda.', '');
          return ERROR;
        }
        answer = String(answer);
        if (answer === '') this.warning(node.line, 'La risposta era vuota.', '');
        return answer;
      }

      case 'Pick': {
        if (node.items.length === 0) return ERROR;
        var pool = [];
        for (var p = 0; p < node.items.length; p++) {
          var item = this.eval(node.items[p]);
          if (isErr(item)) return ERROR;
          pool.push(item);
        }
        var idx = Math.floor(this.rng() * pool.length);
        if (idx >= pool.length) idx = pool.length - 1;
        if (idx < 0) idx = 0;
        return pool[idx];
      }

      default:
        this.error(node.line, 'Il motore non conosce questa espressione.', '');
        return ERROR;
    }
  };

  Interpreter.prototype.evalBinary = function (node) {
    var l = this.eval(node.left);
    if (isErr(l)) return ERROR;
    var r = this.eval(node.right);
    if (isErr(r)) return ERROR;

    var op = node.op;

    if (op === '=' || op === '!=') {
      var same = true;
      if (typeof l !== typeof r) {
        this.warning(node.line,
          'Stai confrontando ' + typeName(l) + ' con ' + typeName(r) + ': non potranno mai essere uguali.',
          'Forse una delle due parti è un testo e l\'altra un numero?');
        same = false;
      } else {
        same = l === r;
      }
      return op === '=' ? same : !same;
    }

    if (op === '+' && (typeof l === 'string' || typeof r === 'string')) {
      return show(l) + show(r);
    }

    if (typeof l !== 'number' || typeof r !== 'number') {
      this.error(node.line, 'Il `' + op + '` vuole due numeri, ma qui c\'è ' + typeName(l) + ' e ' + typeName(r) + '.',
        op === '+' ? 'Per attaccare due testi si usa `+` con almeno un testo.' : '');
      return ERROR;
    }

    switch (op) {
      case '+': return l + r;
      case '-': return l - r;
      case '*': return l * r;
      case '/':
        if (r === 0) {
          this.error(node.line, 'Non si può dividere per zero.', 'Il divisore deve essere diverso da 0.');
          return ERROR;
        }
        return l / r;
      case '%':
        if (r === 0) {
          this.error(node.line, 'Non si può dividere per zero (il `%` divide per trovare il resto).', '');
          return ERROR;
        }
        return l % r;
      case '<': return l < r;
      case '>': return l > r;
      case '<=': return l <= r;
      case '>=': return l >= r;
    }
    this.error(node.line, 'Non conosco l\'operatore `' + op + '`.', '');
    return ERROR;
  };

  // ---------------------------------------------------------------- avvio

  function run(src, options) {
    options = options || {};
    var problems = [];

    var lex = tokenize(src);
    problems = problems.concat(lex.problems);

    var program = parse(lex.tokens, problems);

    var interp = new Interpreter({
      output: [],
      input: options.input || null,
      rng: options.rng || Math.random,
      limit: options.limit || MAX_STEPS
    });

    try {
      interp.execList(program.statements);
    } catch (e) {
      interp.error(1, 'Errore interno del motore: ' + (e && e.message ? e.message : 'sconosciuto') + '.',
        'Non è colpa del tuo programma: segnalalo.');
    }

    problems = problems.concat(interp.problems);
    problems.sort(function (a, b) { return (a.line - b.line) || (a.col - b.col); });

    var errors = 0, warnings = 0;
    for (var i = 0; i < problems.length; i++) {
      if (problems[i].kind === 'error') errors++;
      else if (problems[i].kind === 'warning') warnings++;
    }

    return {
      output: interp.output,
      problems: problems,
      errors: errors,
      warnings: warnings,
      steps: interp.steps,
      stopped: interp.stopped,
      summary: problems.length === 0
        ? 'Finito · nessun problema'
        : 'Finito · ' + problems.length + ' problemi (' +
          errors + (errors === 1 ? ' errore' : ' errori') + ', ' +
          warnings + (warnings === 1 ? ' avviso' : ' avvisi') + ')'
    };
  }

  return {
    run: run,
    tokenize: tokenize,
    parse: parse,
    KEYWORDS: KEYWORDS,
    MAX_STEPS: MAX_STEPS
  };
});
