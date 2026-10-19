/* engine.js — lexer + parser + interpreter for Kaviel.
   No DOM: it runs in the browser (window.Kaviel) and in Node (require).

   Project law: the program never stops, but nothing passes in silence.
   lexer      → tokens (NEWLINE, INDENT, DEDENT included)
   parser     → tree, with recovery: a broken line becomes a hole + a problem
   interpreter→ walks the tree, every error is "nothing" and we carry on
*/

(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Kaviel = factory();
})(typeof self !== 'undefined' ? self : globalThis, function () {
  'use strict';

  // ---------------------------------------------------------------- constants

  var KEYWORDS = ['start', 'end', 'print', 'define', 'set', 'if', 'else', 'repeat',
    'until', 'ask', 'random', 'pick', 'return', 'break', 'for',
    'true', 'false', 'nothing', 'and', 'or', 'not', 'under', 'over', 'is'];
  var KEYWORD_SET = new Set(KEYWORDS);
  var OPERATORS = ['and', 'or', 'not'];
  var TWO_CHAR_OPS = ['==', '!=', '<=', '>=', '//'];
  var ONE_CHAR_OPS = '=<>+-*/%(),{}[]';
  var CMP = ['=', '==', '!=', '<', '>', '<=', '>='];
  var MAX_STEPS = 1000000;

  var ERROR = { __error: true };

  function isErr(v) { return v === ERROR; }
  function isDigit(c) { return c >= '0' && c <= '9'; }
  var LETTER = /[\p{L}_]/u, LETTER_OR_DIGIT = /[\p{L}\p{N}_]/u;
  function isIdentStart(c) { return c !== undefined && LETTER.test(c); }
  function isIdentPart(c) { return c !== undefined && LETTER_OR_DIGIT.test(c); }

  // ---------------------------------------------------------------- lexer

  function tokenize(src) {
    var tokens = [];
    var problems = [];
    var len = src.length;
    var indents = [0];
    var neutral = new Set();          // indents already forgiven once
    var i = 0, line = 1, col = 1;
    var depth = 0;                    // inside ( ) [ ] { } newlines do not count
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
          // blank line or comment only: it does not touch indentation
          i = j;
          col = width + 1;
          atLineStart = false;
          continue;
        }
        if (!lineHasToken) {
          var top = indents[indents.length - 1];
          if (neutral.has(width) && width !== top) {
            // already reported: reuse the same level, no new tokens
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
                'This line is further left than any open block: I snapped it to the nearest one.',
                'Use the same number of spaces as the lines above it.', line, 1);
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
          atLineStart = false;      // the next line continues this one
          continue;
        }
        problem('error', 'A `\\` on its own only works at the end of a line, to continue on the next one.', '', line, col);
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
          problem('error', 'This text never closes: the `"` at the end is missing.', 'Put `"` after the last letter.', startLine, startCol);
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
        tokens[tokens.length - 1].friendly = OPERATORS.indexOf(word) >= 0;
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

      problem('error', 'I do not know this symbol: `' + c + '`.', 'Remove it or write it another way.', line, col);
      i++; col++;
    }

    if (depth > 0) {
      problem('error', 'A bracket is opened and never closed.', 'Every `(` needs its `)`.', line, col);
    }
    if (lineHasToken) push('newline', '\n', line, col);
    while (indents.length > 1) { indents.pop(); push('dedent', 0, line, col); }
    push('eof', null, line, col);
    return { tokens: tokens, problems: problems };
  }

  // ---------------------------------------------------------------- suggestions

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
    var declaredFunctions = new Set();
    var functionDepth = 0, loopDepth = 0;
    var mainEndLine = 1;

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
      advance();                       // the indented line that opens the block
      var nesting = 1;
      while (nesting > 0 && peek().type !== 'eof') {
        var tk = advance();
        if (tk.type === 'indent') nesting++;
        else if (tk.type === 'dedent') nesting--;
        else if (tk.type !== 'newline') lastContent = tk.line;
      }
      if (!quiet) {
        problem('warning', startTok,
          'I skipped lines ' + bodyStart + '–' + lastContent + ' of the `' + what + '` block too.',
          'Fix the header and the block heals itself.');
      }
    }

    var statements = parseStatements();
    mainEndLine = lastProgramLine(statements);

    if (!sawStart) {
      problems.push({
        line: 1, col: 1, kind: 'warning',
        message: 'A program should start with `start`.',
        hint: 'I ran everything anyway.'
      });
    }
    if (!sawEnd) {
      var last = tokens[tokens.length - 1];
      problems.push({
        line: Math.max(1, last.line), col: 1, kind: 'warning',
        message: '`end` is missing at the end of the program.',
        hint: 'I ran everything anyway.'
      });
    }

    return {
      statements: statements,
      sawStart: sawStart,
      sawEnd: sawEnd,
      declaredFunctions: Array.from(declaredFunctions),
      mainEndLine: mainEndLine
    };

    function lastProgramLine(list) {
      var last = 1;
      for (var i = 0; i < list.length; i++) {
        if (list[i].type !== 'Function') last = list[i].line;
      }
      return last;
    }

    function parseFunction(t, name) {
      pos += 1; // past the function name: now on `(`
      if (functionDepth) {
        error(name, 'A function must be defined outside other functions.', 'Move it to its own line at the start of the program.');
        skipBrokenBlock(t, 'define');
        return null;
      }
      if (!isOp('(')) { error(peek(), 'Function parameters go inside `( )`.', 'For example: define double(n)'); skipBrokenBlock(t, 'define'); return null; }
      pos++;
      var params = [], valid = true;
      while (!atEnd() && !isOp(')')) {
        var p = advance();
        if (p.type !== 'ident' || params.indexOf(p.value) >= 0) {
          error(p, 'Each function parameter needs a different name.', ''); valid = false; break;
        }
        params.push(p.value);
        if (!isOp(',')) break;
        pos++;
      }
      if (!isOp(')')) { error(peek(), 'The `)` after the function parameters is missing.', ''); valid = false; }
      else pos++;
      if (!valid || !atEnd()) { if (valid) error(peek(), 'Nothing goes after a function header.', ''); skipBrokenBlock(t, 'define'); return null; }
      var savedLoops = loopDepth;
      loopDepth = 0; functionDepth++;
      var body = parseBlock('define', t.line);
      functionDepth--; loopDepth = savedLoops;
      declaredFunctions.add(name.value);
      return { type: 'Function', name: name.value, params: params, body: body, line: t.line };
    }

    function inlineAction() {
      var next = peek(1);
      return isOp('=') && next.type === 'keyword' && ['print', 'ask', 'set', 'define', 'return', 'break'].indexOf(next.value) >= 0 && (next.value !== 'ask' || peek(2).value === '{');
    }

    function parseKeyDefinition(t) {
      pos++;
      var slot = parseQuestionSlot('keypress');
      if (slot === null) { recover(); return null; }
      if (!isOp('=')) { error(peek(), 'A key definition needs `=` and a key.', 'For example: define keypress{1} = C'); recover(); return null; }
      pos++;
      var key = advance();
      if (!atEnd() || (key.type !== 'ident' && key.type !== 'string')) {
        error(key, 'A key must be a letter or a name such as Enter, Space or ArrowUp.', 'For example: define keypress{1} = C'); recover(); return null;
      }
      var supported = ['Enter', 'Space', 'Escape', 'Tab', 'Backspace', 'Delete', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'];
      if (key.value.length !== 1 && supported.indexOf(key.value) < 0) {
        error(key, 'This key name is not supported.', 'Use one character, Enter, Space, Escape or an arrow key.'); return null;
      }
      return { type: 'DefineKey', slot: slot, key: key.value, line: t.line };
    }

    function parseKeyLink(t) {
      pos++;
      var keySlot = parseQuestionSlot('keypress');
      if (keySlot === null) { recover(); return null; }
      if (!isOp('=')) {
        error(peek(), 'After a key comes `= ` and what to do.', 'For example: if keypress{1} = ask{1}');
        recover(); return null;
      }
      if (peek(1).value === 'ask' && peek(2).type === 'op' && peek(2).value === '{') {
        pos += 2;
        var questionSlot = parseQuestionSlot('ask');
        if (questionSlot === null) { recover(); return null; }
        if (!atEnd()) { error(peek(), 'Nothing goes after a key-to-question link.', ''); recover(); return null; }
        return { type: 'AwaitQuestion', keySlot: keySlot, slot: questionSlot, line: t.line };
      }
      // Any other action: the key waits, then that line runs.
      pos++;
      var keyAction = parseStatement();
      if (!atEnd()) { error(peek(), 'Nothing goes after the action of a key.', ''); recover(); return null; }
      return { type: 'AwaitKey', keySlot: keySlot, body: { type: 'Block', body: keyAction ? [keyAction] : [], line: t.line }, line: t.line };
    }

    function parseStatements() {
      var list = [];
      var warnedAfterEnd = false;
      for (;;) {
        var t = peek();
        if (t.type === 'eof' || t.type === 'dedent') break;
        if (t.type === 'newline') { pos++; continue; }
        var before = pos;
        var st = parseStatement();
        if (st) {
          if (st.type === 'Start') sawStart = true;
          if (st.type === 'End') sawEnd = true;
          if (sawEnd && st.type !== 'End' && !warnedAfterEnd) {
            warning({ line: st.line, col: 1 }, 'This line comes after `end`, so it belongs to no program.', 'Move it above `end`, or remove `end` if the program goes on.');
            warnedAfterEnd = true;
          }
          list.push(st);
        }
        if (pos === before) pos++;
        if (peek().type === 'newline') pos++;
      }
      return list;
    }

    function parseBlock(kw, headerLine) {
      if (peek().type === 'newline') pos++;
      else error(peek(), 'After `' + kw + '` you go to the next line.', 'The block goes underneath, indented.');
      if (peek().type !== 'indent') {
        warning({ line: headerLine, col: 1 },
          '`' + kw + '` has no block under it, so it does nothing.',
          'Indent the lines that belong to it.');
        return { type: 'Block', body: [], line: headerLine };
      }
      pos++;
      var body = parseStatements();
      if (peek().type === 'dedent') pos++;
      if (body.length === 0) {
        warning({ line: headerLine, col: 1 }, 'The `' + kw + '` block is empty.', '');
      }
      return { type: 'Block', body: body, line: headerLine };
    }

    // Numbered questions use their own slots, separate from ordinary variables.
    function parseQuestionSlot(word) {
      if (!isOp('{')) {
        error(peek(), '`' + word + '` needs a question number in `{ }`.', 'For example: ' + word + '{1}');
        return null;
      }
      pos++;
      var number = peek();
      if (number.type !== 'number' || !Number.isSafeInteger(number.value) || number.value < 1) {
        error(number, 'A question number must be a positive whole number.', 'For example: ' + word + '{1} or ' + word + '{2}');
        while (!atEnd()) pos++;
        return null;
      }
      pos++;
      if (!isOp('}')) {
        error(peek(), 'The `}` that closes `' + word + '{' + number.value + '` is missing.', '');
        while (!atEnd()) pos++;
        return null;
      }
      pos++;
      return number.value;
    }

    function parseQuestionDefinition(t) {
      pos++; // ask
      var slot = parseQuestionSlot('ask');
      if (slot === null) { recover(); return null; }
      if (!isOp('=')) {
        error(peek(), 'After `ask{' + slot + '}` comes `=` and the question text.', 'For example: define ask{' + slot + '} = ("Your name?")');
        recover();
        return null;
      }
      pos++;
      var before = problems.length;
      var question = parseExpression();
      if (problems.length > before) { recover(); return null; }
      if (!atEnd() || question.type !== 'Literal' || typeof question.value !== 'string') {
        error(t, 'A numbered question needs text in double quotes.', 'For example: define ask{' + slot + '} = ("Your name?")');
        recover();
        return null;
      }
      return { type: 'DefineQuestion', slot: slot, question: question.value, line: t.line };
    }

    function parseQuestionCall() {
      var t = advance(); // ask
      var slot = parseQuestionSlot('ask');
      if (slot === null) { recover(); return null; }
      if (!atEnd()) {
        error(peek(), '`ask{' + slot + '}` sits alone on its line.', 'Read its response afterward with answer{' + slot + '}.');
        recover();
        return null;
      }
      return { type: 'RunQuestion', slot: slot, line: t.line };
    }

    function parseStatement() {
      var t = peek();

      if (t.type === 'indent') {
        error(t, 'This line is indented, but the line above does not open a block.',
          'Remove the extra spaces, or put an `if` or a `repeat` above it.');
        pos++;
        var escaped = parseStatements();
        if (peek().type === 'dedent') pos++;
        return { type: 'Block', body: escaped, line: t.line };
      }

      if (t.type === 'keyword') {
        switch (t.value) {
          case 'start':
            pos++;
            if (!atEnd()) { error(peek(), 'Nothing goes after `start`: it sits alone on its line.'); recover(); }
            return { type: 'Start', line: t.line };

          case 'end':
            pos++;
            if (!atEnd()) { error(peek(), 'Nothing goes after `end`: it sits alone on its line.'); recover(); }
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
              error(t, '`print` needs something to show.', 'For example: print "hello"');
            }
            return { type: 'Print', values: values, line: t.line };
          }

          case 'define':
          case 'set': {
            pos++;
            var nameTok = peek();
            if (t.value === 'define' && isKw('ask')) return parseQuestionDefinition(t);
            if (t.value === 'define' && nameTok.value === 'keypress' && peek(1).value === '{') return parseKeyDefinition(t);
            if (t.value === 'define' && nameTok.type === 'ident' && peek(1).value === '(') return parseFunction(t, nameTok);
            if (nameTok.type !== 'ident') {
              error(nameTok, 'After `' + t.value + '` comes a name.', 'For example: ' + t.value + ' age = 12');
              recover();
              return null;
            }
            pos++;
            if (nameTok.value === 'answer' && isOp('{')) {
              error(nameTok, '`answer{n}` is filled by its matching `ask{n}`, not by `define` or `set`.', 'Use another name for an ordinary variable.');
              recover();
              return null;
            }
            var slot = 1;
            if (isOp('{')) {
              pos++;
              var numTok = peek();
              if (numTok.type === 'number' && isFinite(numTok.value)) { slot = Math.floor(numTok.value); pos++; }
              else { error(numTok, 'Inside `{ }` goes a number, like in `' + nameTok.value + '{1}`.', ''); recover(); return null; }
              if (isOp('}')) pos++;
              else { error(peek(), 'The `}` that closes `{ ' + slot + '` is missing.', ''); recover(); return null; }
            }
            var indices = [];
            while (isOp('[')) {
              pos++;
              indices.push(parseExpression());
              if (!isOp(']')) { error(peek(), 'The `]` after the list position is missing.', ''); recover(); return null; }
              pos++;
            }
            if (indices.length && t.value !== 'set') {
              error(t, 'Change a list item with `set`.', 'For example: set items[1] = 5'); recover(); return null;
            }
            if (!isOp('=')) {
              error(peek(), 'After the name the `=` is missing.', 'For example: ' + t.value + ' ' + nameTok.value + ' = 12');
              recover();
              return null;
            }
            pos++;
            var expr = parseExpression();
            known.add(nameTok.value);
            if (!atEnd()) {
              error(peek(), 'I do not understand this part of the line.', 'One line does one thing.');
              recover();
              return null;
            }
            return { type: t.value === 'define' ? 'Define' : 'Set', name: nameTok.value, slot: slot, indices: indices, expr: expr, line: t.line };
          }

          case 'return': {
            pos++;
            if (!functionDepth) { error(t, '`return` belongs inside a function.', 'A function starts with define name(...).'); recover(); return null; }
            var value = atEnd() ? { type: 'Literal', value: null, line: t.line } : parseExpression();
            if (!atEnd()) { error(peek(), 'Nothing goes after the returned value.', ''); recover(); return null; }
            return { type: 'Return', expr: value, line: t.line };
          }

          case 'break':
            pos++;
            if (!loopDepth || !atEnd()) { error(t, '`break` sits alone inside a repeat or until loop.', ''); recover(); return null; }
            return { type: 'Break', line: t.line };

          case 'if': {
            pos++;
            if (peek().value === 'keypress' && peek(1).value === '{') return parseKeyLink(t);
            var beforeCond = problems.length;
            var cond = parseExpression();
            if (problems.length > beforeCond || (!atEnd() && !inlineAction())) {
              if (!atEnd() && problems.length === beforeCond) {
                error(peek(), 'Nothing goes after the `if` condition.', 'For example: if age > 10');
              }
              skipBrokenBlock(t, 'if');
              return null;
            }
            var body;
            if (inlineAction()) {
              pos++;
              var action = parseStatement();
              body = { type: 'Block', body: action ? [action] : [], line: t.line };
              // An `else` on the following line, at the same level, belongs to this one-line `if`.
              var afterAction = pos;
              while (peek().type === 'newline') pos++;
              if (!isKw('else')) pos = afterAction;
            } else body = parseBlock('if', t.line);
            var otherwise = null;
            if (isKw('else')) {
              var elseTok = advance();
              if (isKw('if')) {
                error(peek(), '`else if` does not exist: write `else`, then `if` on the next line, indented.', '');
                skipBrokenBlock(elseTok, 'else');
                return { type: 'If', cond: cond, body: body, otherwise: null, line: t.line };
              }
              otherwise = parseBlock('else', elseTok.line);
            }
            return { type: 'If', cond: cond, body: body, otherwise: otherwise, line: t.line };
          }

          case 'else':
            error(t, '`else` alone means nothing: it must come right after an `if` block, at the same level.', '');
            skipBrokenBlock(t, 'else', true);
            return null;

          case 'repeat':
          case 'until': {
            pos++;
            var beforeHead = problems.length;
            var head = parseExpression();
            if (problems.length > beforeHead || !atEnd()) {
              if (!atEnd() && problems.length === beforeHead) {
                error(peek(), 'Nothing goes after `' + t.value + '`.', 'For example: repeat 3');
              }
              skipBrokenBlock(t, t.value);
              return null;
            }
            loopDepth++;
            var loopBody = parseBlock(t.value, t.line);
            loopDepth--;
            return { type: t.value === 'repeat' ? 'Repeat' : 'Until', expr: head, body: loopBody, line: t.line };
          }

          case 'for': {
            pos++;
            var eachTok = peek();
            if (!(eachTok.type === 'ident' && eachTok.value === 'each')) {
              error(eachTok, '`for` is followed by `each`.', 'For example: for each pet in pets');
              skipBrokenBlock(t, 'for');
              return null;
            }
            pos++;
            var itemTok = peek();
            if (itemTok.type !== 'ident') {
              error(itemTok, 'After `for each` comes a name for one item.', 'For example: for each pet in pets');
              skipBrokenBlock(t, 'for');
              return null;
            }
            pos++;
            var inTok = peek();
            if (!(inTok.type === 'ident' && inTok.value === 'in')) {
              error(inTok, 'After the item name comes `in`.', 'For example: for each pet in pets');
              skipBrokenBlock(t, 'for');
              return null;
            }
            pos++;
            var beforeList = problems.length;
            var listExpr = parseExpression();
            if (problems.length > beforeList || !atEnd()) {
              if (!atEnd() && problems.length === beforeList) {
                error(peek(), 'Nothing goes after the list of `for each`.', 'For example: for each pet in pets');
              }
              skipBrokenBlock(t, 'for');
              return null;
            }
            loopDepth++;
            var eachBody = parseBlock('for', t.line);
            loopDepth--;
            return { type: 'ForEach', name: itemTok.value, list: listExpr, body: eachBody, line: t.line };
          }

          case 'random': {
            pos++;
            var beforeWeight = problems.length;
            var weight = parseExpression();
            if (problems.length > beforeWeight || !atEnd()) {
              if (!atEnd() && problems.length === beforeWeight) {
                error(peek(), 'After `random` comes only the chance.', 'For example: random 67');
              }
              skipBrokenBlock(t, 'random');
              return null;
            }
            var face = parseBlock('random', t.line);
            return { type: 'Random', weight: weight, body: face, line: t.line };
          }

          case 'ask':
            if (peek(1).type === 'op' && peek(1).value === '{') return parseQuestionCall();
            // The existing ask("question") expression remains supported.
          case 'pick':
          case 'true':
          case 'false':
          case 'nothing': {
            var exprStmt = parseExpression();
            if (!atEnd()) {
              error(peek(), 'I do not understand this part of the line.', 'One line does one thing.');
              recover();
              return null;
            }
            return { type: 'ExprStmt', expr: exprStmt, line: t.line };
          }

          default:
            error(t, 'I do not know what `' + t.value + '` means here.', '');
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
          error(t, '`=` on its own does not assign: it compares two things.',
            'To create `' + t.value + '` use `define ' + t.value + ' = ...`, to change it use `set ' + t.value + ' = ...`.' + (sug ? ' (Did you mean `' + sug + '`?)' : ''));
          recover();
          return null;
        }
        if (nextT.type === 'op' && nextT.value === '(') {
          var call = parseExpression();
          if (!atEnd()) { error(peek(), 'Nothing goes after this function call.', ''); recover(); return null; }
          return { type: 'ExprStmt', expr: call, line: t.line };
        }
        var suggestion = suggestFor(t.value, KEYWORDS.concat(Array.from(known)));
        error(t, 'I do not know `' + t.value + '`.', suggestion ? 'Did you mean `' + suggestion + '`?' : '');
        recover();
        return null;
      }

      if (t.type === 'string' || t.type === 'number') {
        error(t, 'This line starts with a value, but a value alone does nothing.',
          'To show it: print ' + t.text);
        recover();
        return null;
      }

      error(t, 'I do not understand this line.', '');
      recover();
      return null;
    }

    // ---- expressions

    function parseExpression() { return parseLogic('or', parseAnd); }
    function parseAnd() { return parseLogic('and', parseNot); }
    // not covers the whole comparison after it: not age = 9 means not (age = 9).
    function parseNot() {
      var t = peek();
      if (t.type === 'keyword' && t.value === 'not') {
        pos++;
        return { type: 'Unary', op: 'not', expr: parseNot(), line: t.line };
      }
      return parseComparison();
    }
    function parseLogic(word, next) {
      var left = next();
      while (peek().type === 'keyword' && peek().value === word) {
        var t = advance();
        left = { type: 'Binary', op: word, left: left, right: next(), line: t.line };
      }
      return left;
    }

    function parseComparison() {
      var left = parseAdditive();
      for (;;) {
        var t = peek();
        if (inlineAction()) break;
        if (t.type === 'op' && CMP.indexOf(t.value) >= 0) {
          pos++;
          var op = t.value === '==' ? '=' : t.value;
          if (op === '=' && peek().type === 'keyword' && (peek().value === 'under' || peek().value === 'over' || peek().value === 'is')) op = advance().value;
          var right = parseAdditive();
          left = { type: 'Binary', op: op, left: left, right: right, line: t.line };
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
        if (t.type === 'op' && (t.value === '*' || t.value === '/' || t.value === '%' || t.value === '//')) {
          pos++;
          var right = parseUnary();
          left = { type: 'Binary', op: t.value, left: left, right: right, line: t.line };
        } else break;
      }
      return left;
    }

    function parseUnary() {
      var t = peek();
      if ((t.type === 'op' && t.value === '-') || (t.type === 'keyword' && t.value === 'not')) {
        pos++;
        return { type: 'Unary', op: t.value, expr: parseUnary(), line: t.line };
      }
      var node = parsePrimary();
      while (isOp('[')) {
        pos++;
        var index = parseExpression();
        if (!isOp(']')) { error(peek(), 'The `]` after the list position is missing.', ''); return { type: 'Bad', line: t.line }; }
        pos++;
        node = { type: 'Index', list: node, index: index, line: t.line };
      }
      return node;
    }

    function parsePrimary() {
      var t = peek();
      if (isOp('[')) {
        pos++;
        var listItems = [];
        while (!atEnd() && !isOp(']')) {
          var beforeItem = pos;
          listItems.push(parseExpression());
          if (pos === beforeItem || !isOp(',')) break;
          pos++;
        }
        if (!isOp(']')) { error(peek(), 'The `]` that closes this list is missing.', 'For example: [1, 2, 3]'); return { type: 'Bad', line: t.line }; }
        pos++;
        return { type: 'List', items: listItems, line: t.line };
      }

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
        if (t.value === 'nothing') {
          pos++;
          return { type: 'Literal', value: null, line: t.line };
        }
        if (t.value === 'ask') {
          pos++;
          if (!isOp('(')) {
            error(t, '`ask` wants the question between brackets.', 'For example: ask("What is your name? ")');
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
          else error(peek(), 'The `)` that closes `ask` is missing.', '');
          return { type: 'Ask', args: args, line: t.line };
        }
        if (t.value === 'pick') {
          pos++;
          var items = [];
          for (;;) {
            var before2 = pos;
            items.push(parseAdditive());
            if (pos === before2) break;
            if (isOp(',')) { pos++; continue; }
            break;
          }
          if (items.length === 0) {
            error(t, '`pick` needs at least one value to choose from.', 'For example: pick "rock", "paper"');
          }
          return { type: 'Pick', items: items, line: t.line };
        }
        error(t, '`' + t.value + '` does not belong here.', '');
        pos++;
        return { type: 'Bad', line: t.line };
      }

      if (t.type === 'ident' && t.value === 'answer' && peek(1).type === 'op' && peek(1).value === '{') {
        pos++;
        var answerSlot = parseQuestionSlot('answer');
        return answerSlot === null ? { type: 'Bad', line: t.line } : { type: 'Answer', slot: answerSlot, line: t.line };
      }

      if (t.type === 'ident') {
        pos++;
        var slot = 1;
        if (isOp('{')) {
          pos++;
          var num = peek();
          if (num.type === 'number') { slot = Math.floor(num.value); pos++; }
          else { error(num, 'Inside `{ }` goes a number.', 'For example: points{2}'); }
          if (isOp('}')) pos++;
          else error(peek(), 'The `}` is missing.', '');
        }
        if (isOp('(')) {
          pos++;
          var callArgs = [];
          while (!atEnd() && !isOp(')')) {
            var beforeArg = pos;
            callArgs.push(parseExpression());
            if (pos === beforeArg || !isOp(',')) break;
            pos++;
          }
          if (!isOp(')')) { error(peek(), 'The `)` after the function arguments is missing.', ''); return { type: 'Bad', line: t.line }; }
          pos++;
          return { type: 'Call', name: t.value, args: callArgs, line: t.line };
        }
        return { type: 'Name', name: t.value, slot: slot, line: t.line };
      }

      if (t.type === 'op' && t.value === '(') {
        pos++;
        var inner = parseExpression();
        if (isOp(')')) pos++;
        else error(peek(), 'The `)` that closes the bracket is missing.', '');
        return inner;
      }

      error(t, 'Something to compute is missing here.', 'For example: print 1 + 2, or define x = "hello".');
      if (!atEnd()) pos++;
      return { type: 'Bad', line: t.line };
    }
  }

  // ---------------------------------------------------------------- run

  var runtime;
  function getRuntime() {
    if (!runtime) {
      var create = typeof module === 'object' && module.exports ? require('./runtime.js') : globalThis.KavielRuntime;
      if (!create) throw new Error('Load runtime.js before engine.js.');
      runtime = create({ tokenize: tokenize, parse: parse, suggestFor: suggestFor, MAX_STEPS: MAX_STEPS });
    }
    return runtime;
  }
  function run(src, options) { return getRuntime().run(src, options); }
  function runAsync(src, options) { return getRuntime().runAsync(src, options); }

  return {
    VERSION: '1.5.0-beta',
    run: run,
    runAsync: runAsync,
    tokenize: tokenize,
    parse: parse,
    KEYWORDS: KEYWORDS,
    MAX_STEPS: MAX_STEPS
  };
});
