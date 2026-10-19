/* Local-only workspace tools. No dependencies and no changes to the engine. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var code = $('code'), highlight = $('highlight'), out = $('out');
  var filename = 'untitled.kaviel', toastTimer, lastRun = false;
  var keywords = new Set('start end print define set if else repeat until ask random pick return break and or not keypress'.split(' '));
  var values = new Set(['true', 'false', 'nothing']);
  var names = {hello: 'hello.kaviel', dice: 'dice.kaviel', rps: 'rock_paper_scissors.kaviel', collatz: 'collatz.kaviel', errors: 'errors.kaviel', questions: 'questions.kaviel', age: 'age.kaviel', functions: 'functions.kaviel', lists: 'lists.kaviel', keypress: 'keypress.kaviel'};

  function escapeHTML(text) {
    return text.replace(/[&<>"']/g, function (c) { return {'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]; });
  }

  function paint() {
    // Strings and comments are consumed first, so keywords inside them stay text.
    var token = /#[^\n]*|"(?:\\[^\n]|[^"\\\n])*"?|\b\d+(?:\.\d+)?\b|\b[a-zA-Z_][a-zA-Z_0-9]*\b|[=<>!+*\/%{}(),\[\]-]/g;
    var source = code.value, html = '', last = 0, match;
    while ((match = token.exec(source))) {
      html += escapeHTML(source.slice(last, match.index));
      var word = match[0], kind = '';
      if (word[0] === '#') kind = 'comment';
      else if (word[0] === '"') kind = 'string';
      else if (/^\d/.test(word)) kind = 'number';
      else if (keywords.has(word)) kind = 'keyword';
      else if (values.has(word) || (word === 'answer' && /^[ \t]*\{/.test(source.slice(token.lastIndex)))) kind = 'value';
      else if (/^[=<>!+*\/%{}(),\[\]-]$/.test(word)) kind = 'operator';
      html += kind ? '<span class="tok-' + kind + '">' + escapeHTML(word) + '</span>' : escapeHTML(word);
      last = token.lastIndex;
    }
    highlight.innerHTML = html + escapeHTML(source.slice(last)) + '\n';
    syncScroll();
    position();
  }

  function syncScroll() {
    highlight.scrollTop = code.scrollTop;
    highlight.scrollLeft = code.scrollLeft;
    $('gutter').scrollTop = code.scrollTop;
    position();
  }

  function position() {
    var before = code.value.slice(0, code.selectionStart);
    var line = before.split('\n').length;
    var column = before.length - before.lastIndexOf('\n');
    $('cursor-position').textContent = 'Ln ' + line + ', Col ' + column;
    var style = getComputedStyle(code);
    $('active-line').style.top = (parseFloat(style.paddingTop) + (line - 1) * parseFloat(style.lineHeight) - code.scrollTop) + 'px';
  }

  function setFilename(name, persist) {
    // File names are rendered as text, never as markup or file paths.
    filename = name.replace(/[\\/]/g, '_').replace(/[\u0000-\u001f\u007f]/g, '').slice(0, 120) || 'untitled.kaviel';
    if (!/\.kaviel$/i.test(filename)) filename += '.kaviel';
    $('file-name').textContent = $('explorer-file').textContent = filename;
    document.title = filename + ' — Kaviel';
    if (persist !== false) {
      try { localStorage.setItem('kaviel.filename', filename); } catch (e) {}
    }
  }

  function toast(text) {
    clearTimeout(toastTimer);
    $('toast').textContent = text;
    $('toast').hidden = false;
    toastTimer = setTimeout(function () { $('toast').hidden = true; }, 3200);
  }

  document.addEventListener('kaviel:notice', function (ev) { toast(String(ev.detail || '')); });

  function saveFile() {
    var url = URL.createObjectURL(new Blob([code.value], {type: 'text/plain;charset=utf-8'}));
    var link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(function () { URL.revokeObjectURL(url); }, 1000);
    toast('Source file prepared for download.');
  }

  $('save-file').addEventListener('click', saveFile);
  $('open-file').addEventListener('click', function () { $('file-input').click(); });
  $('file-input').addEventListener('change', async function () {
    var file = this.files[0];
    this.value = '';
    if (!file) return;
    if (!/\.kaviel$/i.test(file.name)) { toast('Choose a .kaviel source file.'); return; }
    if (file.size > 1024 * 1024) { toast('This editor opens files up to 1 MB.'); return; }
    try {
      var beforeRead = code.value;
      var source = await file.text();
      // Reading is asynchronous: keep newer edits rather than replacing them.
      if (code.value !== beforeRead) {
        toast('The source changed while opening. Select the file again to replace it.');
        return;
      }
      applyFile(source, file.name);
    } catch (e) { toast('The file could not be read. Your current code is unchanged.'); }
  });
  function applyFile(source, name) {
    code.value = source.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
    setFilename(name);
    code.dispatchEvent(new Event('input', {bubbles: true}));
    out.textContent = '';
    lastRun = false;
    $('execution-time').textContent = '';
    $('summary').textContent = 'File opened. Press Run to start.';
    code.scrollTop = code.scrollLeft = 0;
    code.setSelectionRange(0, 0);
    code.focus();
    updateOutput();
    syncScroll();
    toast('Opened ' + filename);
  }

  var query = $('find-query'), matches = [], matchIndex = -1;
  function collectMatches() {
    matches = [];
    var needle = query.value.toLowerCase(), source = code.value.toLowerCase(), at = 0;
    if (needle) {
      while ((at = source.indexOf(needle, at)) !== -1) {
        matches.push(at);
        at += needle.length;
      }
    }
    matchIndex = -1;
    $('find-count').textContent = needle ? matches.length + ' matches' : '';
  }
  function find(direction, reset) {
    if (!query.value) { $('find-count').textContent = ''; return; }
    if (!matches.length) { $('find-count').textContent = 'No matches'; return; }
    if (reset || matchIndex < 0) matchIndex = direction < 0 ? matches.length - 1 : 0;
    else matchIndex = (matchIndex + direction + matches.length) % matches.length;
    var at = matches[matchIndex];
    code.setSelectionRange(at, at + query.value.length);
    var line = code.value.slice(0, at).split('\n').length - 1;
    code.scrollTop = Math.max(0, line * parseFloat(getComputedStyle(code).lineHeight) - code.clientHeight / 3);
    // Long lines need horizontal reveal as well as vertical reveal.
    var column = at - code.value.lastIndexOf('\n', at - 1) - 1;
    code.scrollLeft = Math.max(0, column * parseFloat(getComputedStyle(code).fontSize) * .602 - code.clientWidth / 3);
    $('find-count').textContent = (matchIndex + 1) + ' / ' + matches.length;
    syncScroll();
  }
  function openFind() {
    var selection = code.value.slice(code.selectionStart, code.selectionEnd);
    $('find-bar').hidden = false;
    if (selection && !selection.includes('\n')) query.value = selection;
    collectMatches();
    query.focus();
    query.select();
  }
  function closeFind() { $('find-bar').hidden = true; code.focus(); }
  $('find-toggle').addEventListener('click', function () { if ($('find-bar').hidden) openFind(); else closeFind(); });
  $('find-close').addEventListener('click', closeFind);
  query.addEventListener('input', function () { collectMatches(); find(1, true); });
  $('find-bar').addEventListener('submit', function (ev) { ev.preventDefault(); find(1); });
  $('find-prev').addEventListener('click', function () { find(-1); });
  query.addEventListener('keydown', function (ev) {
    if (ev.key === 'Escape') { ev.preventDefault(); closeFind(); }
    else if (ev.key === 'Enter' && ev.shiftKey) { ev.preventDefault(); find(-1); }
  });

  var guide = $('guide');
  function openGuide() { if (!guide.open) guide.showModal(); $('guide-toggle').setAttribute('aria-expanded', 'true'); }
  $('guide-toggle').addEventListener('click', openGuide);
  $('shortcuts-toggle').addEventListener('click', openGuide);
  $('guide-close').addEventListener('click', function () { guide.close(); });
  guide.addEventListener('close', function () { $('guide-toggle').setAttribute('aria-expanded', 'false'); });
  guide.addEventListener('click', function (ev) {
    var box = guide.getBoundingClientRect();
    if (ev.target === guide && (ev.clientX < box.left || ev.clientX > box.right || ev.clientY < box.top || ev.clientY > box.bottom)) guide.close();
  });

  function markExample() {
    var selected = $('examples').value;
    document.querySelectorAll('[data-example]').forEach(function (button) {
      button.setAttribute('aria-current', String(button.dataset.example === selected));
    });
  }
  document.querySelectorAll('[data-example]').forEach(function (button) {
    button.addEventListener('click', function () {
      $('examples').value = button.dataset.example;
      $('examples').dispatchEvent(new Event('change', {bubbles: true}));
    });
  });
  $('examples').addEventListener('change', function () {
    var key = $('examples').value;
    if (Object.prototype.hasOwnProperty.call(names, key)) setFilename(names[key]);
    markExample();
    lastRun = false;
    $('execution-time').textContent = '';
    updateOutput();
    syncScroll();
  });

  function updateOutput() {
    $('output-placeholder').hidden = out.textContent !== '';
    $('output-placeholder').querySelector('strong').textContent = lastRun ? 'Nothing printed this time.' : 'Your ideas, in motion.';
    $('output-placeholder').querySelector('p').textContent = lastRun ? 'Use print to show a value here.' : 'Run your code to see what happens.';
  }
  new MutationObserver(updateOutput).observe(out, {childList: true, characterData: true, subtree: true});
  new MutationObserver(function () {
    var summary = $('summary').textContent;
    $('diagnostic-dot').className = 'diagnostic-dot' + (summary.startsWith('Done') ? (document.querySelector('.problem') ? ' warn' : ' good') : '');
  }).observe($('summary'), {childList: true, characterData: true, subtree: true});
  $('clear-output').addEventListener('click', function () {
    out.textContent = '';
    lastRun = false;
    $('execution-time').textContent = '';
    updateOutput();
    toast('Output cleared. Your code is unchanged.');
  });

  // The editor reports the real duration when a run finishes; this file only
  // mirrors the result into the placeholder text.
  code.addEventListener('kaviel:ran', function () {
    lastRun = true;
    updateOutput();
    syncScroll();
  });
  code.addEventListener('kaviel:source', function () { paint(); collectMatches(); markExample(); });
  code.addEventListener('input', markExample);
  code.addEventListener('scroll', syncScroll);
  code.addEventListener('click', position);
  code.addEventListener('keyup', position);
  document.addEventListener('selectionchange', function () { if (document.activeElement === code) position(); });
  code.addEventListener('kaviel:saved', function (ev) {
    $('save-state').innerHTML = '<span class="dot"></span>';
    $('save-state').appendChild(document.createTextNode(ev.detail ? 'Draft saved on this device' : 'Not saved · download a copy'));
    $('save-state').style.color = ev.detail ? '' : 'var(--warn)';
    if (ev.detail) {
      try { localStorage.setItem('kaviel.filename', filename); } catch (e) {}
    }
  });
  window.addEventListener('resize', syncScroll);
  document.addEventListener('keydown', function (ev) {
    if (guide.open) return;
    var tutorial = document.getElementById('tutorial');
    if (tutorial && tutorial.open) return;
    if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 's') { ev.preventDefault(); saveFile(); }
    else if ((ev.metaKey || ev.ctrlKey) && ev.key.toLowerCase() === 'f') { ev.preventDefault(); openFind(); }
    else if (ev.key === '?' && !ev.metaKey && !ev.ctrlKey && !ev.altKey && !/^(TEXTAREA|INPUT|SELECT)$/.test(document.activeElement.tagName)) { ev.preventDefault(); openGuide(); }
  });

  try { filename = localStorage.getItem('kaviel.filename') || filename; } catch (e) {}
  if (Object.prototype.hasOwnProperty.call(names, $('examples').value)) filename = names[$('examples').value];
  setFilename(filename, false);
  if (!/Mac|iPhone|iPad/.test(navigator.platform)) $('run-shortcut').textContent = 'Ctrl ↵';
  paint();
  markExample();
  updateOutput();
})();
