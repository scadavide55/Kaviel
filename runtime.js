/* Kaviel v1 runtime. One generator interpreter drives both sync and async hosts. */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.KavielRuntime = factory;
})(typeof self !== 'undefined' ? self : globalThis, function (language) {
  'use strict';
  const ERROR = Symbol('expression error');
  const MAX_DEPTH = 128, MAX_LIST = 100000, MAX_OUTPUT = 10000;
  const builtins = new Set(['length', 'append', 'number']);
  const truthy = v => v !== null && v !== false && v !== 0 && v !== '';
  const typeName = v => Array.isArray(v) ? 'a list' : typeof v === 'number' ? 'a number' : typeof v === 'string' ? 'a text' : typeof v === 'boolean' ? 'true or false' : 'nothing';
  function show(v) {
    if (Array.isArray(v)) return '[' + v.map(x => typeof x === 'string' ? JSON.stringify(x) : show(x)).join(', ') + ']';
    if (v === null) return 'nothing';
    return typeof v === 'number' && Math.abs(v) < 1e20 ? String(Math.round(v * 1e10) / 1e10) : String(v);
  }
  function joined(parts) {
    let out = '';
    for (let i = 0; i < parts.length; i++) {
      const p = parts[i];
      if (i && p !== '' && !/[ \t]$/.test(out) && !/^[ \t]/.test(p)) out += ' ';
      out += p;
    }
    return out;
  }
  function numeric(v) {
    if (typeof v === 'number') return Number.isFinite(v) ? v : ERROR;
    if (typeof v !== 'string' || !/^[+-]?(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?$/.test(v.trim())) return ERROR;
    const n = Number(v.trim());
    return Number.isFinite(n) ? n : ERROR;
  }
  function contains(value, target, seen = new Set()) {
    if (value === target) return true;
    if (!Array.isArray(value) || seen.has(value)) return false;
    seen.add(value);
    return value.some(v => contains(v, target, seen));
  }
  function same(a, b) {
    if (Array.isArray(a) && Array.isArray(b)) return a.length === b.length && a.every((v, i) => same(v, b[i]));
    return a === b;
  }
  function matchesKey(received, expected) {
    if (typeof received !== 'string') return false;
    if (expected === 'Space') expected = ' ';
    return expected.length === 1 ? received.toLowerCase() === expected.toLowerCase() : received === expected;
  }
  class Interpreter {
    constructor(options) {
      this.options = options;
      this.output = []; this.problems = []; this.steps = 0; this.stopped = false; this.cancelled = false;
      this.limit = Number.isSafeInteger(options.limit) && options.limit > 0 ? options.limit : language.MAX_STEPS;
      this.rng = options.rng || Math.random;
      this.vars = new Map(); this.locals = null; this.functions = new Map();
      this.questions = new Map(); this.answers = new Map(); this.keys = new Map();
      this.depth = 0;
    }
    key(name, slot) { return name + '\u0000' + (slot || 1); }
    problem(kind, line, message, hint = '') { this.problems.push({kind, line, col: 1, message, hint}); }
    error(line, message, hint) { this.problem('error', line, message, hint); return ERROR; }
    warning(line, message, hint) { this.problem('warning', line, message, hint); }
    *step(line) {
      if (this.stopped) return false;
      if (++this.steps > this.limit) {
        this.error(line, 'I ran more than ' + this.limit.toLocaleString('en-US') + ' steps and stopped: a loop is not ending.', 'Look at the repeat / until condition: something inside the loop must really change.');
        this.stopped = true; return false;
      }
      if (this.steps % 256 === 0) yield {type: 'checkpoint', line};
      return !this.stopped;
    }
    scope(key) { return this.locals && this.locals.has(key) ? this.locals : this.vars; }
    *list(statements) {
      for (let i = 0; i < statements.length && !this.stopped; i++) {
        const st = statements[i];
        let control;
        if (st.type === 'Random') {
          let end = i + 1;
          while (end < statements.length && statements[end].type === 'Random') end++;
          control = yield* this.random(statements.slice(i, end)); i = end - 1;
        } else control = yield* this.statement(st);
        if (control) return control;
      }
    }
    *random(group) {
      const weights = []; let total = 0;
      for (const st of group) {
        if (!(yield* this.step(st.line))) return;
        let weight = yield* this.eval(st.weight);
        if (weight === ERROR) weight = 0;
        else if (typeof weight !== 'number') { this.error(st.line, 'The chances of `random` want numbers, not ' + typeName(weight) + '.', 'For example: random 67'); weight = 0; }
        else if (weight < 0) { this.error(st.line, 'A negative chance makes no sense.'); weight = 0; }
        weights.push(weight); total += weight;
      }
      if (total <= 0) { this.error(group[0].line, 'No face of this `random` has a chance above zero: nothing was picked.'); return; }
      if (Math.abs(total - 100) > 1e-9) this.warning(group[0].line, 'The chances of this `random` add up to ' + show(total) + ' instead of 100: I adjusted them.');
      const draw = this.rng() * total; let walked = 0, picked = group.length - 1;
      for (let i = 0; i < weights.length; i++) { walked += weights[i]; if (draw < walked) { picked = i; break; } }
      return yield* this.list(group[picked].body.body);
    }
    *ask(slot, line) {
      if (!this.questions.has(slot)) return this.error(line, '`ask{' + slot + '}` has not been defined.', 'Prepare it first with define ask{' + slot + '} = ("Your question?").');
      this.answers.delete(slot);
      const value = yield* this.read(this.questions.get(slot), line);
      if (value !== ERROR) this.answers.set(slot, value);
      return value;
    }
    *read(question, line) {
      let answer;
      try { answer = yield {type: 'input', question, line}; }
      catch (e) { return this.error(line, 'The input could not be read. The program continued.'); }
      if (this.stopped) return ERROR;
      if (answer === undefined || answer === null) return this.error(line, 'No answer came back to the question.', 'A question needs an input handler and someone to answer; there is nobody here.');
      answer = String(answer);
      if (answer === '') this.warning(line, 'The answer was empty.');
      return answer;
    }
    validIndex(list, index, line) {
      if (!Array.isArray(list)) { this.error(line, 'This value is not a list.'); return false; }
      if (!Number.isSafeInteger(index) || index < 1 || index > list.length) {
        this.error(line, 'List positions start at 1; this list has ' + list.length + ' items.', 'Use a whole-number position inside the list.'); return false;
      }
      return true;
    }
    *statement(st) {
      if (!(yield* this.step(st.line))) return;
      switch (st.type) {
        case 'Start': case 'End': return;
        case 'Block': return yield* this.list(st.body);
        case 'ExprStmt': yield* this.eval(st.expr); return;
        case 'Print': {
          const parts = [];
          for (const item of st.values) { const v = yield* this.eval(item); if (v === ERROR) return; parts.push(show(v)); }
          if (this.output.length >= MAX_OUTPUT) { this.error(st.line, 'The output limit of ' + MAX_OUTPUT + ' lines was reached.'); this.stopped = true; return; }
          const text = joined(parts); this.output.push(text);
          if (this.options.onOutput) this.options.onOutput(text);
          return;
        }
        case 'DefineQuestion':
          if (this.questions.has(st.slot)) this.warning(st.line, '`ask{' + st.slot + '}` already existed: the new question took over.', 'Its previous answer was cleared.');
          this.questions.set(st.slot, st.question); this.answers.delete(st.slot); return;
        case 'RunQuestion': yield* this.ask(st.slot, st.line); return;
        case 'DefineKey':
          if (this.keys.has(st.slot)) this.warning(st.line, '`keypress{' + st.slot + '}` already existed: the new key took over.');
          this.keys.set(st.slot, st.key); return;
        case 'AwaitQuestion': {
          if (!this.keys.has(st.keySlot)) { this.error(st.line, '`keypress{' + st.keySlot + '}` has not been defined.'); return; }
          if (!this.questions.has(st.slot)) { this.error(st.line, '`ask{' + st.slot + '}` has not been defined.'); return; }
          const key = this.keys.get(st.keySlot);
          for (;;) {
            if (!(yield* this.step(st.line))) return;
            let received;
            try { received = yield {type: 'keypress', key, line: st.line}; }
            catch (e) { this.error(st.line, 'The key could not be read. The program continued.'); return; }
            if (this.stopped) return;
            if (received === undefined || received === null) { this.error(st.line, 'No key came back while waiting for ' + key + '.'); return; }
            if (matchesKey(received, key)) break;
          }
          yield* this.ask(st.slot, st.line); return;
        }
        case 'Define': case 'Set': {
          const value = yield* this.eval(st.expr); if (value === ERROR) return;
          const key = this.key(st.name, st.slot);
          const scope = st.type === 'Define' ? (this.locals || this.vars) : this.scope(key);
          if (st.indices && st.indices.length) {
            if (!scope.has(key)) { this.error(st.line, 'I do not know `' + st.name + '`. Did you create it with `define`?'); return; }
            let list = scope.get(key);
            for (let i = 0; i < st.indices.length; i++) {
              const position = yield* this.eval(st.indices[i]);
              if (position === ERROR || !this.validIndex(list, position, st.line)) return;
              if (i === st.indices.length - 1) {
                if (contains(value, list)) { this.error(st.line, 'A list cannot contain itself.'); return; }
                list[position - 1] = value;
              } else list = list[position - 1];
            }
            return;
          }
          if (st.type === 'Define' && scope.has(key)) this.warning(st.line, '`' + st.name + '` already existed: the new value took over.', 'To change it on purpose, the command is `set`.');
          if (st.type === 'Set' && !scope.has(key)) {
            this.warning(st.line, '`' + st.name + '` did not exist: I created it just now.', 'To create it on purpose, use `define`.');
            (this.locals || this.vars).set(key, value);
          } else scope.set(key, value);
          return;
        }
        case 'If': {
          const value = yield* this.eval(st.cond); if (value === ERROR) return;
          if (truthy(value)) return yield* this.list(st.body.body);
          if (st.otherwise) return yield* this.list(st.otherwise.body);
          return;
        }
        case 'Repeat': case 'Until': {
          let turns;
          if (st.type === 'Repeat') {
            turns = yield* this.eval(st.expr); if (turns === ERROR) return;
            if (typeof turns !== 'number') { this.error(st.line, '`repeat` wants a number of turns, not ' + typeName(turns) + '.'); return; }
            if (turns < 0) { this.error(st.line, '`repeat` cannot run a negative number of times.'); return; }
            if (!Number.isInteger(turns)) this.warning(st.line, '`repeat ' + show(turns) + '`: I rounded it to ' + Math.floor(turns) + ' turns.');
            turns = Math.floor(turns);
          }
          for (let turn = 0; st.type === 'Until' || turn < turns; turn++) {
            if (!(yield* this.step(st.line))) return;
            if (st.type === 'Until') { const done = yield* this.eval(st.expr); if (done === ERROR || truthy(done)) return; }
            const control = yield* this.list(st.body.body);
            if (control && control.kind === 'break') return;
            if (control) return control;
          }
          return;
        }
        case 'Break': return {kind: 'break'};
        case 'Return': {
          const value = yield* this.eval(st.expr);
          return {kind: 'return', value};
        }
        case 'Function':
          if (builtins.has(st.name)) { this.error(st.line, '`' + st.name + '` is a built-in function. Choose a different name.'); return; }
          if (this.functions.has(st.name)) this.warning(st.line, 'Function `' + st.name + '` already existed: its new definition took over.');
          this.functions.set(st.name, st); return;
        default: this.error(st.line, 'The engine does not know this statement.');
      }
    }
    *eval(node) {
      if (!(yield* this.step(node.line))) return ERROR;
      switch (node.type) {
        case 'Bad': return ERROR;
        case 'Literal': return typeof node.value === 'number' && !Number.isFinite(node.value) ? this.error(node.line, 'This number is too large to represent as a finite number.') : node.value;
        case 'Answer':
          return this.answers.has(node.slot) ? this.answers.get(node.slot) : this.error(node.line, '`answer{' + node.slot + '}` has no answer yet.', 'Run ask{' + node.slot + '} before reading its answer.');
        case 'Name': {
          const key = this.key(node.name, node.slot), scope = this.scope(key);
          if (!scope.has(key)) {
            const names = [...this.vars.keys(), ...(this.locals ? this.locals.keys() : [])].map(k => k.split('\u0000')[0]);
            const suggestion = language.suggestFor(node.name, names);
            return this.error(node.line, 'I do not know `' + node.name + '`. Did you create it with `define`?',
              (suggestion ? 'Did you mean `' + suggestion + '`? ' : '') + 'To show the word as text, put it in quotes: "' + node.name + '".');
          }
          return scope.get(key);
        }
        case 'List': {
          const items = [];
          for (const expr of node.items) { const value = yield* this.eval(expr); if (value === ERROR) return ERROR; items.push(value); }
          return items;
        }
        case 'Index': {
          const list = yield* this.eval(node.list); if (list === ERROR) return ERROR;
          const index = yield* this.eval(node.index); if (index === ERROR || !this.validIndex(list, index, node.line)) return ERROR;
          return list[index - 1];
        }
        case 'Unary': {
          const value = yield* this.eval(node.expr); if (value === ERROR) return ERROR;
          if (node.op === 'not') return !truthy(value);
          if (typeof value !== 'number') return this.error(node.line, 'A `-` wants a number, not ' + typeName(value) + '.');
          return -value;
        }
        case 'Binary': return yield* this.binary(node);
        case 'Ask': {
          const args = [];
          for (const expr of node.args) { const value = yield* this.eval(expr); if (value === ERROR) return ERROR; args.push(value); }
          if (args.length > 1) this.warning(node.line, '`ask` takes one question: I used the first one.');
          return yield* this.read(args.length ? show(args[0]) : '', node.line);
        }
        case 'Pick': {
          let pool = [];
          for (const expr of node.items) { const value = yield* this.eval(expr); if (value === ERROR) return ERROR; pool.push(value); }
          if (pool.length === 1 && Array.isArray(pool[0])) pool = pool[0];
          if (!pool.length) return this.error(node.line, '`pick` cannot choose from an empty list.');
          return pool[Math.min(pool.length - 1, Math.max(0, Math.floor(this.rng() * pool.length)))];
        }
        case 'Call': return yield* this.call(node);
        default: return this.error(node.line, 'The engine does not know this expression.');
      }
    }
    *call(node) {
      const builtin = builtins.has(node.name), fn = this.functions.get(node.name);
      if (!builtin && !fn) return this.error(node.line, 'I do not know function `' + node.name + '`.', 'Define it first with define ' + node.name + '(...).');
      const expected = builtin ? (node.name === 'append' ? 2 : 1) : fn.params.length;
      if (node.args.length !== expected) return this.error(node.line, '`' + node.name + '` needs ' + expected + ' arguments, not ' + node.args.length + '.');
      const args = [];
      for (const expr of node.args) { const value = yield* this.eval(expr); if (value === ERROR) return ERROR; args.push(value); }
      if (builtin) {
        if (node.name === 'number') { const n = numeric(args[0]); return n === ERROR ? this.error(node.line, 'This value is not a valid finite number.') : n; }
        if (node.name === 'length') {
          if (!Array.isArray(args[0]) && typeof args[0] !== 'string') return this.error(node.line, '`length` needs a list or text.');
          return typeof args[0] === 'string' ? Array.from(args[0]).length : args[0].length;
        }
        const list = args[0];
        if (!Array.isArray(list)) return this.error(node.line, '`append` needs a list as its first argument.');
        if (list.length >= MAX_LIST) return this.error(node.line, 'The list limit of ' + MAX_LIST + ' items was reached.');
        if (contains(args[1], list)) return this.error(node.line, 'A list cannot contain itself.');
        list.push(args[1]); return null;
      }
      if (this.depth >= MAX_DEPTH) return this.error(node.line, 'The function call limit of ' + MAX_DEPTH + ' was reached.', 'Check the stopping condition of recursive functions.');
      const previous = this.locals;
      this.locals = new Map(fn.params.map((param, i) => [this.key(param, 1), args[i]])); this.depth++;
      try {
        const control = yield* this.list(fn.body.body);
        return control && control.kind === 'return' ? control.value : null;
      } finally { this.depth--; this.locals = previous; }
    }
    *binary(node) {
      const left = yield* this.eval(node.left); if (left === ERROR) return ERROR;
      if (node.op === 'and' && !truthy(left)) return false;
      if (node.op === 'or' && truthy(left)) return true;
      const right = yield* this.eval(node.right); if (right === ERROR) return ERROR;
      const op = node.op;
      if (op === 'and' || op === 'or') return truthy(right);
      if (op === 'under' || op === 'over') {
        const a = numeric(left), b = numeric(right);
        if (a === ERROR || b === ERROR) return this.error(node.line, '`' + op + '` needs numeric values; this response is not a valid number.');
        return op === 'under' ? a < b : a >= b;
      }
      if (op === '=' || op === '!=') {
        const comparable = typeName(left) === typeName(right);
        if (!comparable) this.warning(node.line, 'You are comparing ' + typeName(left) + ' with ' + typeName(right) + ': they can never be equal.', 'Maybe one side is a text and the other a number?');
        const result = comparable && same(left, right);
        return op === '=' ? result : !result;
      }
      if (op === '+' && (typeof left === 'string' || typeof right === 'string')) return show(left) + show(right);
      if (typeof left !== 'number' || typeof right !== 'number') return this.error(node.line, 'A `' + op + '` wants two numbers, but here there is ' + typeName(left) + ' and ' + typeName(right) + '.', op === '+' ? 'To glue two texts, `+` needs at least one text.' : '');
      let result;
      switch (op) {
        case '+': result = left + right; break;
        case '-': result = left - right; break;
        case '*': result = left * right; break;
        case '/': if (right === 0) return this.error(node.line, 'You cannot divide by zero.', 'The divisor must not be 0.'); result = left / right; break;
        case '%': if (right === 0) return this.error(node.line, 'You cannot divide by zero (the `%` divides to find the rest).'); result = left % right; break;
        case '<': return left < right;
        case '>': return left > right;
        case '<=': return left <= right;
        case '>=': return left >= right;
        default: return this.error(node.line, 'I do not know the operator `' + op + '`.');
      }
      return Number.isFinite(result) ? result : this.error(node.line, 'This calculation is too large to represent as a finite number.');
    }
  }
  function prepare(source, options) {
    const lex = language.tokenize(source), problems = lex.problems.slice();
    const interpreter = new Interpreter(options);
    let program;
    try { program = language.parse(lex.tokens, problems); }
    catch (e) { problems.push({kind: 'error', line: 1, col: 1, message: 'This program is nested too deeply to read safely.', hint: 'Use smaller expressions or functions.'}); program = {statements: []}; }
    return {interpreter, problems, iterator: interpreter.list(program.statements)};
  }
  function finish(state) {
    const it = state.interpreter;
    const problems = state.problems.concat(it.problems).sort((a, b) => a.line - b.line || a.col - b.col);
    const errors = problems.filter(p => p.kind === 'error').length, warnings = problems.filter(p => p.kind === 'warning').length;
    return {output: it.output, problems, errors, warnings, steps: it.steps, stopped: it.stopped, cancelled: it.cancelled,
      summary: it.cancelled ? 'Stopped by you.' : problems.length ? 'Done · ' + problems.length + ' problems (' + errors + (errors === 1 ? ' error' : ' errors') + ', ' + warnings + (warnings === 1 ? ' warning' : ' warnings') + ')' : 'Done · no problems'};
  }
  function internal(state) { state.interpreter.error(1, 'Internal engine error. The program stopped safely.', 'This is an engine problem, not a mistake in your program.'); state.interpreter.stopped = true; }
  function run(source, options = {}) {
    const state = prepare(source, options); let response, thrown = false;
    try {
      for (;;) {
        const step = thrown ? state.iterator.throw(response) : state.iterator.next(response);
        response = undefined; thrown = false;
        if (step.done) break;
        const request = step.value;
        if (request.type === 'checkpoint') continue;
        const handler = options[request.type];
        try {
          response = handler ? handler(request.type === 'input' ? request.question : request.key) : undefined;
          if (response && typeof response.then === 'function') { response.catch(() => {}); response = undefined; state.interpreter.error(request.line, 'An async input handler needs runAsync, not run.'); }
        } catch (e) { response = e; thrown = true; }
      }
    } catch (e) { internal(state); }
    return finish(state);
  }
  function cancellable(promise, signal) {
    if (!signal) return Promise.resolve(promise);
    return new Promise((resolve, reject) => {
      const abort = () => { signal.removeEventListener('abort', abort); reject(new Error('cancelled')); };
      if (signal.aborted) { abort(); return; }
      signal.addEventListener('abort', abort, {once: true});
      Promise.resolve(promise).then(v => { signal.removeEventListener('abort', abort); resolve(v); }, e => { signal.removeEventListener('abort', abort); reject(e); });
    });
  }
  async function runAsync(source, options = {}) {
    const state = prepare(source, options); let response, thrown = false;
    try {
      for (;;) {
        if (options.signal && options.signal.aborted) { state.interpreter.stopped = state.interpreter.cancelled = true; break; }
        const step = thrown ? state.iterator.throw(response) : state.iterator.next(response);
        response = undefined; thrown = false;
        if (step.done) break;
        const request = step.value;
        try {
          if (request.type === 'checkpoint') await cancellable(new Promise(resolve => setTimeout(resolve, 0)), options.signal);
          else {
            const handler = options[request.type];
            response = await cancellable(handler ? handler(request.type === 'input' ? request.question : request.key, options.signal) : undefined, options.signal);
          }
        } catch (e) { response = e; thrown = true; }
      }
    } catch (e) { internal(state); }
    finally { state.iterator.return(); }
    return finish(state);
  }
  return {run, runAsync};
});
