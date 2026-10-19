/* Step-by-step tutorials for the Kaviel editor. No dependencies.
   Each step holds a short explanation and a program that can be opened in the
   editor; nothing here changes the language itself. */
(function () {
  'use strict';

  var TUTORIALS = [
    {
      title: 'First words',
      subtitle: 'Print, keep and change values',
      steps: [
        {
          title: 'Make the computer talk',
          text: 'Every program starts with start and ends with end. print shows one line. Text goes in double quotes; # starts a comment.',
          code: 'start\nprint "Hello, Kaviel!"\n# this line is a note for you\nprint "This runs top to bottom."\nend'
        },
        {
          title: 'Keep a value in a name',
          text: 'define creates a name and gives it a value. set changes it later. print can show several things: they appear separated by a space.',
          code: 'start\ndefine name = "Ada"\ndefine age = 14\nprint "Name:" name\nprint "Age:" age\nset age = age + 1\nprint "Next year:" age\nend'
        },
        {
          title: 'Let the program choose',
          text: 'Lines under if belong to it, and they are indented by two spaces. else takes the other way. Only one of the two blocks runs.',
          code: 'start\ndefine score = 12\nif score > 10\n  print "You made it."\nelse\n  print "Keep going."\nend'
        },
        {
          title: 'Decide on one line',
          text: 'When the action is short, = puts it on the same line as the condition. This reads as: if the condition holds, do the action.',
          code: 'start\ndefine age = 16\nif age = 16 = print "Exactly sixteen"\nif age > 18 = print "Older"\nif age < 18 = print "Younger"\nend'
        }
      ]
    },
    {
      title: 'Questions and numbers',
      subtitle: 'Ask the person using your program',
      steps: [
        {
          title: 'Prepare a question, then ask it',
          text: 'define ask{1} prepares question number 1. ask{1} shows it and waits. Afterward answer{1} holds what was typed, always as text.',
          code: 'start\ndefine ask{1} = ("What is your name? ")\nask{1}\nprint ("Hello ") answer{1}\nend'
        },
        {
          title: 'Two questions, numbered',
          text: 'Each question has its own number, so its answer never mixes with another one.',
          code: 'start\ndefine ask{1} = ("Your name? ")\ndefine ask{2} = ("Your city? ")\nask{1}\nask{2}\nprint answer{1} (" lives in ") answer{2}\nend'
        },
        {
          title: 'Under 18 and over 18',
          text: 'Answers arrive as text, but under and over read numbers out of them. under 18 means below 18; over 18 means 18 or older. If the answer is not a number, the program says so and keeps going.',
          code: 'start\ndefine ask{1} = ("How old are you? ")\nask{1}\nif answer{1} = under 18 = print "You are under 18."\nif answer{1} = over 18 = print "You are 18 or older."\nend'
        },
        {
          title: 'Turn text into a number yourself',
          text: 'number() converts text into a number when you need real arithmetic on an answer.',
          code: 'start\ndefine ask{1} = ("Pick a number: ")\nask{1}\ndefine n = number(answer{1})\nprint "Double is" n * 2\nend'
        }
      ]
    },
    {
      title: 'Loops and chance',
      subtitle: 'Repeat work and leave room for luck',
      steps: [
        {
          title: 'Repeat a fixed number of times',
          text: 'repeat runs its block that many times.',
          code: 'start\nrepeat 3\n  print "Again!"\nprint "Finished"\nend'
        },
        {
          title: 'Until something becomes true',
          text: 'until checks its condition before each turn and stops when the condition holds. Something inside the loop must change, or it never stops.',
          code: 'start\ndefine n = 1\nuntil n > 5\n  print "n is" n\n  set n = n + 1\nprint "Done"\nend'
        },
        {
          title: 'Leave a loop early',
          text: 'break jumps out of the nearest loop. It is useful when the answer is already known.',
          code: 'start\ndefine n = 1\nuntil n > 100\n  if n * n > 50 = break\n  set n = n + 1\nprint "The first number above 50 is" n\nend'
        },
        {
          title: 'Roll the dice',
          text: 'Random blocks next to each other form one draw. Their weights add up to 100. The result is frozen: reading it again cannot change it.',
          code: 'start\nprint "Rolling the dice..."\nrandom 17\n  print "One"\nrandom 17\n  print "Two"\nrandom 17\n  print "Three"\nrandom 17\n  print "Four"\nrandom 16\n  print "Five"\nrandom 16\n  print "Six"\nend'
        }
      ]
    },
    {
      title: 'Functions and lists',
      subtitle: 'Name a few lines, then keep many values',
      steps: [
        {
          title: 'A command of your own',
          text: 'define name() makes a function: a group of lines with one name. return sends a value back to the place where you called it.',
          code: 'start\ndefine greet(name)\n  return "Hello " + name + "!"\nprint greet("Ada")\nprint greet("Luca")\nend'
        },
        {
          title: 'Several inputs, one result',
          text: 'List the inputs in the parentheses, separated by commas. Each one is a name inside the function only.',
          code: 'start\ndefine area(width, height)\n  return width * height\nprint "A 3 by 4 room is" area(3, 4) "square metres"\nend'
        },
        {
          title: 'A function that calls itself',
          text: 'A function may call itself, as long as it gets closer to a stopping case. This is recursion.',
          code: 'start\ndefine factorial(n)\n  if n = 0 = return 1\n  return n * factorial(n - 1)\nprint "5! is" factorial(5)\nend'
        },
        {
          title: 'A list keeps many values',
          text: 'Square brackets make a list. Positions start at 1: the first item is items[1]. length counts the items.',
          code: 'start\ndefine pets = ["cat", "dog", "fox"]\nprint "First:" pets[1]\nprint "Last:" pets[length(pets)]\nprint "All:" pets\nend'
        },
        {
          title: 'Add, change and walk a list',
          text: 'append puts a value at the end. set changes one position. A loop with a counter can visit every item.',
          code: 'start\ndefine pets = ["cat", "dog"]\nappend(pets, "owl")\nset pets[1] = "lion"\nprint pets\ndefine i = 1\nuntil i > length(pets)\n  print i pets[i]\n  set i = i + 1\nend'
        }
      ]
    },
    {
      title: 'Waiting for a key',
      subtitle: 'Real keyboard input, no prompt',
      steps: [
        {
          title: 'Wait for one key',
          text: 'define keypress{1} = C names the key C. The if line waits until that key is pressed. Names like Enter, Space and ArrowUp work too.',
          code: 'start\nprint "Press C to continue."\ndefine keypress{1} = C\ndefine ask{1} = ("Ready? ")\nif keypress{1} = ask{1}\nprint "You pressed C."\nend'
        },
        {
          title: 'Press, then answer',
          text: 'A key can open a question: press it, then type the answer. That is one gesture, not two separate steps.',
          code: 'start\ndefine keypress{1} = Enter\ndefine ask{1} = ("Press Enter, then type your name: ")\nif keypress{1} = ask{1}\nprint ("Hello ") answer{1}\nend'
        }
      ]
    }
  ];

  var dialog = document.getElementById('tutorial');
  if (!dialog) return;
  var lessonsBox = document.getElementById('tutorial-lessons');
  var stepBox = document.getElementById('tutorial-step');
  var code = document.getElementById('code');
  var STORE = 'kaviel.tutorial.position', BACKUP = 'kaviel.tutorial.backup';
  var position = {lesson: 0, step: 0};

  try {
    var saved = JSON.parse(localStorage.getItem(STORE) || 'null');
    if (saved && Number.isInteger(saved.lesson) && Number.isInteger(saved.step) &&
        TUTORIALS[saved.lesson] && TUTORIALS[saved.lesson].steps[saved.step]) position = saved;
  } catch (e) {}

  function save() {
    try { localStorage.setItem(STORE, JSON.stringify(position)); } catch (e) {}
  }

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  function drawLessons() {
    lessonsBox.innerHTML = '';
    TUTORIALS.forEach(function (lesson, index) {
      var button = element('button', 'tutorial-lesson');
      button.type = 'button';
      button.setAttribute('aria-current', String(index === position.lesson));
      button.appendChild(element('span', 'lesson-number', '0' + (index + 1)));
      var text = element('span', 'lesson-text');
      text.appendChild(element('span', 'lesson-title', lesson.title));
      text.appendChild(element('small', null, lesson.subtitle));
      button.appendChild(text);
      button.addEventListener('click', function () {
        position = {lesson: index, step: 0};
        save();
        drawLessons();
        drawStep();
      });
      lessonsBox.appendChild(button);
    });
  }

  function drawStep() {
    var lesson = TUTORIALS[position.lesson], step = lesson.steps[position.step];
    stepBox.innerHTML = '';

    stepBox.appendChild(element('span', 'eyebrow', 'LESSON ' + (position.lesson + 1) + ' · STEP ' + (position.step + 1) + ' OF ' + lesson.steps.length));
    stepBox.appendChild(element('h3', null, step.title));
    stepBox.appendChild(element('p', 'tutorial-text', step.text));
    var pre = element('pre', 'tutorial-code', step.code);
    stepBox.appendChild(pre);

    var actions = element('div', 'step-actions');
    var open = element('button', 'run small', 'Open in the editor');
    open.type = 'button';
    open.addEventListener('click', function () {
      try { if (code.value.trim()) localStorage.setItem(BACKUP, code.value); } catch (e) {}
      code.value = step.code;
      code.dispatchEvent(new Event('input', {bubbles: true}));
      code.focus();
      code.setSelectionRange(0, 0);
      dialog.close();
      document.dispatchEvent(new CustomEvent('kaviel:notice', {detail: 'Step loaded. Press Run to try it.'}));
    });
    actions.appendChild(open);

    var previous = element('button', 'quiet-button', '← Back');
    previous.type = 'button';
    previous.disabled = position.lesson === 0 && position.step === 0;
    previous.addEventListener('click', function () {
      if (position.step > 0) position.step--;
      else if (position.lesson > 0) { position.lesson--; position.step = TUTORIALS[position.lesson].steps.length - 1; }
      save(); drawLessons(); drawStep();
    });
    actions.appendChild(previous);

    var next = element('button', 'quiet-button', 'Next step →');
    next.type = 'button';
    next.disabled = position.lesson === TUTORIALS.length - 1 && position.step === lesson.steps.length - 1;
    next.addEventListener('click', function () {
      if (position.step < lesson.steps.length - 1) position.step++;
      else if (position.lesson < TUTORIALS.length - 1) { position.lesson++; position.step = 0; }
      save(); drawLessons(); drawStep();
    });
    actions.appendChild(next);
    stepBox.appendChild(actions);

    if (localStorage.getItem(BACKUP) !== null) {
      var restore = element('button', 'restore-code', 'Restore my previous code');
      restore.type = 'button';
      restore.addEventListener('click', function () {
        code.value = localStorage.getItem(BACKUP) || '';
        try { localStorage.removeItem(BACKUP); } catch (e) {}
        code.dispatchEvent(new Event('input', {bubbles: true}));
        restore.remove();
        document.dispatchEvent(new CustomEvent('kaviel:notice', {detail: 'Your previous code is back in the editor.'}));
      });
      stepBox.appendChild(restore);
    }
  }

  function open() {
    if (!dialog.open) dialog.showModal();
    document.getElementById('tutorials-toggle').setAttribute('aria-expanded', 'true');
    drawLessons();
    drawStep();
    closeFindBar();
  }
  function closeFindBar() {
    var find = document.getElementById('find-bar');
    if (!find.hidden) document.getElementById('find-close').click();
  }

  document.getElementById('tutorials-toggle').addEventListener('click', open);
  function closeDialog() {
    dialog.close();
    document.getElementById('tutorials-toggle').setAttribute('aria-expanded', 'false');
  }

  document.getElementById('tutorial-close').addEventListener('click', closeDialog);
  dialog.addEventListener('close', function () {
    document.getElementById('tutorials-toggle').setAttribute('aria-expanded', 'false');
    code.focus();
  });
  dialog.addEventListener('click', function (ev) {
    var box = dialog.getBoundingClientRect();
    if (ev.target === dialog && (ev.clientX < box.left || ev.clientX > box.right || ev.clientY < box.top || ev.clientY > box.bottom)) dialog.close();
  });
  document.addEventListener('keydown', function (ev) {
    if (dialog.open && ev.key === 'Escape') { ev.preventDefault(); dialog.close(); }
  });

  drawLessons();
  drawStep();
})();
