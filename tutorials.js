/* Lessons for the Kaviel editor. No dependencies.
   Every step has a short text, a program, and often a small job for the reader.
   A step with expectErrors: true is meant to show mistakes on purpose. */
(function () {
  'use strict';

  var TUTORIALS = [
    {
      title: 'Meet the editor',
      subtitle: '',
      steps: [
        {title: 'Your workspace', text: '', code: 'start\nprint "Hello!"\nend', turn: ''},
        {title: 'Run, Stop and Save', text: '', code: 'start\nprint "Hello again!"\nend', turn: ''},
        {title: 'How these lessons work', text: '', code: 'start\nprint "I can type code!"\nend', turn: ''}
      ]
    },
    {
      title: 'Say hello',
      subtitle: 'Your very first program',
      steps: [
        {
          title: 'Make the computer talk',
          text: 'A program is a list of instructions. The computer reads them from the top to the bottom. Every program begins with start and finishes with end. The word print makes the computer say something.',
          code: 'start\nprint "Hello!"\nend',
          turn: 'Click the green Run button. Look at the Output box.'
        },
        {
          title: 'Say more than one thing',
          text: 'Each print line says one line. The computer does them in order, just like you read a book.',
          code: 'start\nprint "Hello!"\nprint "My name is Kaviel."\nprint "Nice to meet you."\nend',
          turn: 'Add one more line that says your own name.'
        },
        {
          title: 'Words go inside quotes',
          text: 'Words are called text, and they live between quote marks. Numbers do not need quotes. The computer can even do the sum for you.',
          code: 'start\nprint "I am learning to code."\nprint 7\nprint 2 + 3\nend',
          turn: 'Change the 7 to your age. Then run it again.'
        },
        {
          title: 'Notes for people',
          text: 'A line that starts with # is a note. The computer skips it. Notes help people understand the code later.',
          code: 'start\n# This line is only a note\nprint "The note above is invisible."\nend',
          turn: 'Write your own note with a # at the start.'
        },
        {
          title: 'An empty line',
          text: '',
          code: 'start\nprint "Hello!"\nprint nothing\nprint "Bye!"\nend',
          turn: ''
        }
      ]
    },
    {
      title: 'Names and boxes',
      subtitle: 'Remember things for later',
      steps: [
        {
          title: 'A box with a name',
          text: 'define makes a box and gives it a name. You put something inside. Later you can use the name instead of the thing.',
          code: 'start\ndefine name = "Ada"\nprint name\nprint "Hello" name\nend',
          turn: 'Put your own name in the box.'
        },
        {
          title: 'Change what is inside',
          text: 'set puts something new in a box that already exists. The old thing is gone.',
          code: 'start\ndefine age = 7\nprint "Now:" age\nset age = 8\nprint "Next year:" age\nend',
          turn: 'Add another set line to jump ahead ten years.'
        },
        {
          title: 'Do maths',
          text: 'The computer can add +, subtract -, multiply * and divide /. The sign % gives what is left over after dividing.',
          code: 'start\nprint 10 + 5\nprint 10 - 5\nprint 10 * 5\nprint 10 / 5\nprint 10 % 3\nend',
          turn: 'Try a bigger sum, like 123 * 456.'
        },
        {
          title: 'Mix words and boxes',
          text: 'print can show many things in one line. Use + to stick pieces of text together with no extra space.',
          code: 'start\ndefine pet = "dog"\ndefine legs = 4\nprint "My pet is a" pet\nprint "It has" legs "legs."\nprint "Total legs for 3 pets:" legs * 3\nprint "Woof" + "!" + "!"\nend',
          turn: 'Change the pet to a bird. How many legs does a bird have?'
        }
      ]
    },
    {
      title: 'Ask questions',
      subtitle: 'Talk with the person using your program',
      steps: [
        {
          title: 'Prepare a question, then ask it',
          text: 'define ask{1} writes question number 1. ask{1} really asks it and waits. A box appears in the Output. Type an answer and press Enter. answer{1} holds what was typed.',
          code: 'start\ndefine ask{1} = ("What is your name? ")\nask{1}\nprint ("Hello ") answer{1}\nend',
          turn: 'Run it and type your name.'
        },
        {
          title: 'Two questions',
          text: 'Every question has its own number, so the answers never get mixed up.',
          code: 'start\ndefine ask{1} = ("Your name? ")\ndefine ask{2} = ("Your city? ")\nask{1}\nask{2}\nprint answer{1} (" lives in ") answer{2}\nend',
          turn: 'Add a third question about your favourite food.'
        },
        {
          title: 'Under 18 or over 18',
          text: 'The computer can check a number. under 18 means less than 18. over 18 means more than 18, so 18 itself is neither under nor over. The third word is is: answer{1} = is 18 is true when the answer is exactly 18.',
          code: 'start\ndefine ask{1} = ("How old are you? ")\nask{1}\nif answer{1} = under 18 = print "You are under 18."\nif answer{1} = is 18 = print "You are exactly 18."\nif answer{1} = over 18 = print "You are over 18."\nend',
          turn: 'Run it twice. Once with 10, once with 18.'
        },
        {
          title: 'Turn an answer into a number',
          text: 'Answers are always text, even when you type digits. number() turns text into a real number, so you can do maths with it.',
          code: 'start\ndefine ask{1} = ("Pick a number: ")\nask{1}\ndefine n = number(answer{1})\nprint "Double is" n * 2\nprint "Plus ten is" n + 10\nend',
          turn: 'Make it print the number times 100.'
        },
        {
          title: 'A question in one line',
          text: '',
          code: 'start\ndefine name = ask("What is your name? ")\nprint "Hello" name\nend',
          turn: ''
        }
      ]
    },
    {
      title: 'Make choices',
      subtitle: 'Let the program decide',
      steps: [
        {
          title: 'If this, then that',
          text: 'The lines pushed in under if belong to it. They only run when the check is true. Push lines in with two spaces, or press Tab.',
          code: 'start\ndefine score = 12\nif score > 10\n  print "You win!"\n  print "Well done."\nprint "The game is over."\nend',
          turn: 'Change the score to 3. What changes?'
        },
        {
          title: 'Otherwise',
          text: 'else is the other road. When the check is false, the else lines run instead. Only one road is taken.',
          code: 'start\ndefine score = 3\nif score > 10\n  print "You win!"\nelse\n  print "Try again."\nend',
          turn: 'Find a score that makes it say You win!'
        },
        {
          title: 'Choose on one line',
          text: 'When the job is small, a second = puts it on the same line as the check. Read it as: if this is true, do that.',
          code: 'start\ndefine age = 16\nif age = 16 = print "Exactly sixteen"\nif age > 18 = print "Older"\nif age < 18 = print "Younger"\nend',
          turn: 'Change the age to 25.'
        },
        {
          title: 'Compare words',
          text: 'Words can be compared too. A single = asks: are these the same? Remember that big and small letters are different.',
          code: 'start\ndefine colour = "red"\nif colour = "red"\n  print "Stop!"\nelse\n  print "Go!"\nend',
          turn: 'Change red to green.'
        },
        {
          title: 'And, or, not',
          text: 'and needs both checks to be true. or needs just one. not turns true into false. Put brackets around the check that not should flip.',
          code: 'start\ndefine age = 9\nif age > 5 and age < 13\n  print "You are a kid."\nif age < 3 or age > 90\n  print "That is very special."\nif not (age = 10)\n  print "You are not ten."\nend',
          turn: 'Try age 2, then age 95.'
        }
      ]
    },
    {
      title: 'True, false and nothing',
      subtitle: 'Yes, no, and empty',
      steps: [
        {
          title: 'Yes and no',
          text: 'A check is not only something you read on the page: the computer answers it with true or false. 5 > 3 is true, and 5 < 3 is false.\n\nThese two words are values, like numbers and texts. You can put one in a box, print it, or compare it with something else.',
          code: 'start\nprint true\nprint false\nprint 5 > 3\nend',
          turn: 'Print the answer to 10 > 2, then the answer to 2 > 10.'
        },
        {
          title: 'The value that is not there',
          text: 'Sometimes a box exists but nothing has been put in it yet. That value is called nothing, and it means "no value".\n\nPrinting it gives an empty line, and you can ask whether a box still holds it. It is how a program says "I have nothing here".',
          code: 'start\ndefine box = nothing\nprint box\nprint box = nothing\nset box = "Ada"\nprint box\nend',
          turn: 'Make a second box with nothing in it, and print it.'
        }
      ]
    },
    {
      title: 'Again and again',
      subtitle: 'Loops repeat work for you',
      steps: [
        {
          title: 'Repeat a few times',
          text: 'repeat 3 does the pushed-in lines three times. The computer never gets tired.',
          code: 'start\nrepeat 3\n  print "La la la!"\nprint "That was a song."\nend',
          turn: 'Make it sing 10 times.'
        },
        {
          title: 'Keep going until',
          text: 'until checks first. If the check is already true, the lines are skipped. If not, they run, and it checks again. Something inside must change, or it never ends.',
          code: 'start\ndefine n = 1\nuntil n > 5\n  print "n is" n\n  set n = n + 1\nprint "Done"\nend',
          turn: 'Change 5 to 10.'
        },
        {
          title: 'Count with a loop',
          text: 'A loop and a box make a counter. This is the seven times table. You change one thing, and ten lines appear.',
          code: 'start\ndefine n = 1\nuntil n > 10\n  print n "x 7 =" n * 7\n  set n = n + 1\nend',
          turn: 'Change the 7 to your favourite number.'
        },
        {
          title: 'Leave early',
          text: 'break jumps out of the loop right away. Use it when you already know the answer.',
          code: 'start\ndefine n = 1\nuntil n > 100\n  if n * n > 50 = break\n  set n = n + 1\nprint "The first number whose square is above 50 is" n\nend',
          turn: 'Change 50 to 200.'
        }
      ]
    },
    {
      title: 'Luck',
      subtitle: 'Dice, coins and surprises',
      steps: [
        {
          title: 'Pick one thing',
          text: 'pick chooses one thing from a list at random. Each thing has the same chance. Run it again and again to see different answers.',
          code: 'start\ndefine animal = pick "cat", "dog", "owl", "fox"\nprint "Today you are a" animal\nend',
          turn: 'Add your favourite animal to the list.'
        },
        {
          title: 'Flip a coin',
          text: 'Pick between just two things and you have a coin.',
          code: 'start\ndefine side = pick "heads", "tails"\nprint "The coin says" side\nend',
          turn: 'Run it ten times. Is it fair?'
        },
        {
          title: 'Roll a die',
          text: 'You can pick numbers too. A die has six sides.',
          code: 'start\ndefine die = pick 1, 2, 3, 4, 5, 6\nprint "You rolled a" die\nif die = 6 = print "Lucky!"\nend',
          turn: 'Change it to a die with 20 sides.'
        },
        {
          title: 'Unfair chances',
          text: 'random blocks let you set the chance. Blocks next to each other are one draw, and only one of them runs. The numbers add up to 100.',
          code: 'start\nprint "Rolling the magic box..."\nrandom 80\n  print "Just a pebble."\nrandom 19\n  print "A shiny coin!"\nrandom 1\n  print "A DIAMOND!"\nend',
          turn: 'Make the diamond more common.'
        }
      ]
    },
    {
      title: 'Your own commands',
      subtitle: 'Give a few lines a name',
      steps: [
        {
          title: 'Make a command',
          text: 'define with brackets makes a function: a few lines with a name. return gives back the answer. You can use it as many times as you like.',
          code: 'start\ndefine greet(name)\n  return "Hello " + name + "!"\nprint greet("Ada")\nprint greet("Luca")\nend',
          turn: 'Say hello to your best friend.'
        },
        {
          title: 'More than one input',
          text: 'Put several names inside the brackets, with commas. Each one only exists inside the function.',
          code: 'start\ndefine area(width, height)\n  return width * height\nprint "A 3 by 4 room is" area(3, 4) "square metres"\nprint "A 10 by 10 field is" area(10, 10)\nend',
          turn: 'Find the area of a 25 by 8 garden.'
        },
        {
          title: 'Commands that use commands',
          text: 'A function can use other functions. Small pieces make big programs.',
          code: 'start\ndefine double(n)\n  return n * 2\ndefine quadruple(n)\n  return double(double(n))\nprint quadruple(5)\nend',
          turn: 'Make a function that triples a number.'
        },
        {
          title: 'A command that calls itself',
          text: 'A function may call itself, as long as it gets closer to an end. This is called recursion. 5! means 5 x 4 x 3 x 2 x 1.',
          code: 'start\ndefine factorial(n)\n  if n = 0 = return 1\n  return n * factorial(n - 1)\nprint "5! is" factorial(5)\nend',
          turn: 'Try factorial(10).'
        },
        {
          title: 'A command that does something',
          text: '',
          code: 'start\ndefine cheer(name)\n  print "Hooray for" name\ndefine birthday = true\ndefine sleeping = false\nif birthday = cheer("Ada")\nif sleeping = cheer("Luca")\nprint "The end"\nend',
          turn: ''
        }
      ]
    },
    {
      title: 'Lists',
      subtitle: 'Many things in one place',
      steps: [
        {
          title: 'A list of things',
          text: 'Square brackets make a list. The first thing is number 1, the second is number 2, and so on. length tells you how many there are.',
          code: 'start\ndefine pets = ["cat", "dog", "fox"]\nprint "First:" pets[1]\nprint "Last:" pets[length(pets)]\nprint "All:" pets\nprint "How many:" length(pets)\nend',
          turn: 'Print the second pet.'
        },
        {
          title: 'Add and change',
          text: 'append puts a new thing at the end. set can change one place in the list.',
          code: 'start\ndefine pets = ["cat", "dog"]\nappend(pets, "owl")\nset pets[1] = "lion"\nprint pets\nend',
          turn: 'Add two more animals.'
        },
        {
          title: 'Visit every item',
          text: 'A loop with a counter can visit every place in a list, one after the other.',
          code: 'start\ndefine pets = ["cat", "dog", "owl"]\ndefine i = 1\nuntil i > length(pets)\n  print i pets[i]\n  set i = i + 1\nend',
          turn: 'Add an animal to the list. Does the loop still work?'
        },
        {
          title: 'One at a time',
          text: 'for each gives you one item at a time, with a name of your choice. No counter, no position, no length. It reads like the sentence you would say out loud, and break leaves it early.',
          code: 'start\ndefine pets = ["cat", "dog", "owl"]\nfor each pet in pets\n  print pet\nend',
          turn: 'Add a fourth animal. Notice that nothing else has to change.'
        },
        {
          title: 'Add up a list',
          text: 'A box can collect a total while the loop visits every number.',
          code: 'start\ndefine prices = [3, 5, 2, 10]\ndefine total = 0\ndefine i = 1\nuntil i > length(prices)\n  set total = total + prices[i]\n  set i = i + 1\nprint "Total:" total\nend',
          turn: 'Add another price.'
        },
        {
          title: 'Pick from a list',
          text: '',
          code: 'start\ndefine pets = ["cat", "dog", "fox"]\ndefine friend = pick pets\nprint "Today you are a" friend\nend',
          turn: ''
        }
      ]
    },
    {
      title: 'Lists inside lists',
      subtitle: 'A table in a list',
      steps: [
        {
          title: 'A list of lists',
          text: 'A list can hold anything, even other lists. Two brackets make a row, and a list of rows makes a table.\n\nYou read it with two positions: the row first, then the item inside that row. grid[2][1] means the second row, first item in it.',
          code: 'start\ndefine grid = [[1, 2], [3, 4]]\nprint grid\nprint grid[2][1]\nend',
          turn: 'Change the 4 to 9 with set, then print the whole grid.'
        },
        {
          title: 'A table of players',
          text: 'This is how a score table is made: one list, and a small list for every player. append adds a row to the outer list, and for each walks the rows.\n\nInside every row you read the name and the points. One idea, used twice, and you have a table.',
          code: 'start\ndefine rows = []\nappend(rows, ["Ada", 10])\nappend(rows, ["Luca", 7])\nfor each row in rows\n  print row[1] row[2]\nend',
          turn: 'Add a third player with 12 points.'
        }
      ]
    },
    {
      title: 'Words and letters',
      subtitle: 'Play with text',
      steps: [
        {
          title: 'Big letters, small letters',
          text: 'The computer can change the size of letters. upper makes every letter big, lower makes every letter small.\n\nBoth do not change the old text: they give you back a new one, so the word you started from is still there.',
          code: 'start\nprint upper("Kaviel")\nprint lower("KAVIEL")\nend',
          turn: 'Print your own name in small letters.'
        },
        {
          title: 'Cut the spaces',
          text: 'When a person types an answer, spaces often sneak in at the beginning or at the end. You cannot see them, but the computer can, and two texts that look the same stop being equal.\n\ntrim takes those spaces away. It is the first thing to do with an answer you want to compare.',
          code: 'start\ndefine name = "  Ada  "\nprint "[" trim(name) "]"\nend',
          turn: 'Remove trim, run again, and look at the brackets.'
        },
        {
          title: 'Take one piece',
          text: 'part cuts a piece out of a text. You give it the text, the position where the piece starts and where it ends, and both positions count.\n\nPositions start at 1, exactly as in a list, so the first letter is at 1 and not at 0.',
          code: 'start\ndefine word = "Kaviel"\nprint part(word, 1, 6)\nprint part(word, 4, 6)\nend',
          turn: 'Print the first four letters of the word.'
        },
        {
          title: 'Split it, join it',
          text: 'split breaks a text wherever it finds a separator, and gives you a list. join does the opposite: it takes a list and a piece of text, and glues the pieces with that text in between.\n\nTwo words, one idea: pieces and whole. It is how a chat turns a sentence into words.',
          code: 'start\ndefine letters = "a,b,c"\ndefine pieces = split(letters, ",")\nprint pieces\nprint join(pieces, "-")\nprint length(pieces)\nend',
          turn: 'Split your own sentence on the space and join it with a plus sign.'
        },
        {
          title: 'New lines and quotes',
          text: '',
          code: 'start\nprint "Ada\\nLuca"\nprint "\\"Kaviel\\""\nend',
          turn: ''
        }
      ]
    },
    {
      title: 'Numbers that stay whole',
      subtitle: 'Without a comma',
      steps: [
        {
          title: 'Two slashes',
          text: 'A division with one slash gives the exact answer, and it can have a part after the point: 7 / 2 is 3.5.\n\nWith two slashes you keep only the whole part: 7 // 2 is 3. It is called whole division, and it is what you need to count things: you cannot have half a chair.',
          code: 'start\nprint 7 / 2\nprint 7 // 2\nend',
          turn: 'Try 9 // 3 and 10 // 3.'
        },
        {
          title: 'What is left over',
          text: 'The per cent sign gives what is left after a whole division. 7 % 2 is 1, because 2 fits three times in 7 and 1 is left.\n\nIt is the quickest way to ask "is this number even?": if it is even, the rest of the division by 2 is 0.',
          code: 'start\nprint 7 % 2\nprint 8 % 2\nend',
          turn: 'Print the rest of 10 divided by 3.'
        },
        {
          title: 'A whole average',
          text: 'Now you can do what a shop does: add up the prices, divide by how many there are, and keep whole numbers.\n\ntotal // count gives the average without anything after the point, which is what you want when the answer must be a whole coin.',
          code: 'start\ndefine total = 17\ndefine count = 5\nprint total // count\nend',
          turn: 'Change total to 20 and run it again. Then try 17 / 5 to see the difference.'
        }
      ]
    },
    {
      title: 'Numbers with a point',
      subtitle: 'Not only whole',
      steps: [
        {
          title: 'A part after the point',
          text: 'Not every answer is whole. With one slash a division can give a part after the point: 10 / 4 is 2.5.\n\nKaviel writes that part with a point and not with a comma, so that the same program runs the same way on every computer. You may type a comma, and it will be understood.',
          code: 'start\nprint 3.5 + 1\nprint 10 / 4\nprint 0.1 + 0.2\nend',
          turn: 'Print 7 / 2 and 7 // 2 together, and look at the difference.'
        },
        {
          title: 'Below zero',
          text: 'A number can be smaller than zero. Write a minus in front of it: -5 is five below zero, like a temperature in winter.\n\nTwo minuses make a plus: -3 * -2 is 6. It is the same rule as a debt that is cancelled twice ending up as money.',
          code: 'start\nprint -5 + 2\nprint 0 - 7\nprint -3 * -2\nend',
          turn: 'Print a temperature that starts at 3 and falls by 8.'
        }
      ]
    },
    {
      title: 'Draw with letters',
      subtitle: 'Patterns',
      steps: [
        {
          title: 'A row of stars',
          text: 'A text can grow. Start from an empty text, "", and add one star at every turn: after five turns you have a row of five stars.\n\nThis is how a computer draws when there is no drawing program: with letters, one after the other.',
          code: 'start\ndefine line = ""\nrepeat 5\n  set line = line + "*"\nprint line\nend',
          turn: 'Make a row of twenty stars.'
        },
        {
          title: 'A triangle',
          text: 'Put the growing text inside a loop that runs one more time each turn, and print it every turn: you get a triangle.\n\nIt is the same two ideas as before, a text that grows and a loop that goes on, and the picture comes out by itself.',
          code: 'start\ndefine stars = ""\ndefine n = 1\nuntil n > 5\n  set stars = stars + "*"\n  print stars\n  set n = n + 1\nend',
          turn: 'Make the triangle grow by two stars at a time.'
        },
        {
          title: 'A frame around a name',
          text: 'join repeats something: three pieces of three dashes, glued with nothing between them, give a bar of nine dashes.\n\nWith a bar above and a bar below you have a sign. A computer draws every picture this way: small pieces, repeated in the right order.',
          code: 'start\ndefine bar = join(["---", "---", "---"], "")\nprint bar\nprint "Ada"\nprint bar\nend',
          turn: 'Make the frame wider, and put your own name inside.'
        }
      ]
    },
    {
      title: 'Press a key',
      subtitle: 'Wait for the keyboard',
      steps: [
        {
          title: 'Wait for one key',
          text: 'define keypress{1} = C names the key C. The if line waits until that key is pressed, and then asks its question. Other keys are ignored.',
          code: 'start\nprint "Press C to continue."\ndefine keypress{1} = C\ndefine ask{1} = ("What is your name? ")\nif keypress{1} = ask{1}\nprint ("Hello ") answer{1}\nend',
          turn: 'Run it. Try pressing a wrong key first.'
        },
        {
          title: 'Other keys',
          text: 'Besides letters, you can use Enter, Space, Escape, Tab and the arrows: ArrowUp, ArrowDown, ArrowLeft and ArrowRight.',
          code: 'start\nprint "Press Space to begin."\ndefine keypress{1} = Space\ndefine ask{1} = ("Your favourite colour? ")\nif keypress{1} = ask{1}\nprint ("Wow, ") answer{1} ("is a great colour.")\nend',
          turn: 'Change Space to Enter.'
        }
      ]
    },
    {
      title: 'Make a game',
      subtitle: 'Put it all together',
      steps: [
        {
          title: 'Guess the number',
          text: 'The computer picks a secret number. You guess until you find it. The loop keeps going until your guess is the secret, and the two small if lines give hints.',
          code: 'start\ndefine secret = pick 1, 2, 3, 4, 5, 6, 7, 8, 9, 10\ndefine ask{1} = ("Guess a number from 1 to 10: ")\ndefine guess = 0\ndefine tries = 0\nuntil guess = secret\n  ask{1}\n  set guess = number(answer{1})\n  set tries = tries + 1\n  if guess > secret = print "Too big."\n  if guess < secret = print "Too small."\nprint "You got it in" tries "tries!"\nend',
          turn: 'Make the secret number go up to 20.'
        },
        {
          title: 'A quiz with points',
          text: 'A box called points counts the right answers. Every right answer adds one.',
          code: 'start\ndefine points = 0\ndefine ask{1} = ("What is 2 + 2? ")\ndefine ask{2} = ("What colour is grass? ")\n\nask{1}\nif answer{1} = "4"\n  print "Correct!"\n  set points = points + 1\nelse\n  print "Not quite. The answer is 4."\n\nask{2}\nif answer{2} = "green"\n  print "Correct!"\n  set points = points + 1\nelse\n  print "Not quite. Grass is green."\n\nprint "You got" points "out of 2."\nend',
          turn: 'Write a third question of your own.'
        },
        {
          title: 'Rock, paper, scissors',
          text: 'The computer chooses with pick. Then if lines work out who won. This is a bigger program, so read it slowly, one line at a time.',
          code: 'start\ndefine cpu = pick "rock", "paper", "scissors"\ndefine ask{1} = ("rock, paper or scissors? ")\nask{1}\ndefine you = answer{1}\nprint "I chose" cpu\nif you = cpu\n  print "A draw!"\nif you = "rock"\n  if cpu = "scissors" = print "You win!"\n  if cpu = "paper" = print "I win!"\nif you = "paper"\n  if cpu = "rock" = print "You win!"\n  if cpu = "scissors" = print "I win!"\nif you = "scissors"\n  if cpu = "paper" = print "You win!"\n  if cpu = "rock" = print "I win!"\nend',
          turn: 'Add a line that says what happens if you type something else.'
        }
      ]
    },
    {
      title: 'Mistakes',
      subtitle: 'They happen. It is fine.',
      steps: [
        {
          title: 'A typo',
          text: 'Everyone makes mistakes. When a line is wrong, Kaviel skips it, tells you about it, and keeps going. Look at the Problems box after you run this.',
          code: 'start\nprint "Hello!"\nprnt "This line has a typo."\nprint "But this one still works."\nend',
          turn: 'Run it. Then click the problem to jump to the line.',
          expectErrors: true
        },
        {
          title: 'A name that does not exist',
          text: 'A box must be created with define before you use it. Kaviel even guesses what you meant.',
          code: 'start\ndefine age = 8\nprint "Age:" agee\nprint "Fixed:" age\nend',
          turn: 'Fix the line by removing the extra e.',
          expectErrors: true
        },
        {
          title: 'Impossible maths',
          text: 'Some things cannot be done, like dividing by zero. The program says so, and goes on.',
          code: 'start\nprint 10 / 2\nprint 10 / 0\nprint "Still running!"\nend',
          turn: 'Change the 0 to a 5.',
          expectErrors: true
        }
      ]
    },
    {
      title: 'Your big project',
      subtitle: '',
      steps: [
        {title: 'Start your story', text: '', code: 'start\ndefine ask{1} = ("What is your name? ")\nask{1}\nprint "Welcome to the island," answer{1}\nprint "Find as many coins as you can."\nend', turn: ''},
        {title: 'Choose a way', text: '', code: 'start\ndefine ask{1} = ("What is your name? ")\ndefine ask{2} = ("Which way: left or right? ")\nask{1}\nprint "Welcome to the island," answer{1}\nask{2}\nif answer{2} = "left"\n  print "You walk into a cave."\nelse\n  print "You walk to a river."\nend', turn: ''},
        {title: 'Add luck and coins', text: '', code: 'start\ndefine coins = 0\ndefine ask{1} = ("What is your name? ")\ndefine ask{2} = ("Which way: left or right? ")\nask{1}\nprint "Welcome to the island," answer{1}\nask{2}\nif answer{2} = "left"\n  print "You walk into a cave."\nelse\n  print "You walk to a river."\nrandom 70\n  print "You find 5 coins!"\n  set coins = coins + 5\nrandom 30\n  print "A crab pinches you. No coins today."\nprint "You have" coins "coins."\nend', turn: ''},
        {title: 'Play three days', text: '', code: 'start\ndefine coins = 0\ndefine ask{1} = ("What is your name? ")\ndefine ask{2} = ("Which way: left or right? ")\nask{1}\nprint "Welcome to the island," answer{1}\nprint "Find as many coins as you can in 3 days."\n\ndefine day = 1\nuntil day > 3\n  print "Day" day\n  ask{2}\n  if answer{2} = "left"\n    print "You walk into a cave."\n  else\n    print "You walk to a river."\n  random 70\n    print "You find 5 coins!"\n    set coins = coins + 5\n  random 30\n    print "A crab pinches you. No coins today."\n  set day = day + 1\n\nprint "The game is over. You have" coins "coins."\nend', turn: ''},
        {title: 'The end of the game', text: '', code: 'start\ndefine coins = 0\ndefine ask{1} = ("What is your name? ")\ndefine ask{2} = ("Which way: left or right? ")\nask{1}\nprint "Welcome to the island," answer{1}\nprint "Find as many coins as you can in 3 days."\n\ndefine day = 1\nuntil day > 3\n  print "Day" day\n  ask{2}\n  if answer{2} = "left"\n    print "You walk into a cave."\n  else\n    print "You walk to a river."\n  random 70\n    print "You find 5 coins!"\n    set coins = coins + 5\n  random 30\n    print "A crab pinches you. No coins today."\n  set day = day + 1\n\nprint answer{1} "found" coins "coins."\nif coins > 10 = print "You are rich!"\nif coins < 11 = print "Nice try. Play again!"\nend', turn: ''},
        {title: 'Make it your own', text: '', code: 'start\ndefine coins = 0\ndefine ask{1} = ("What is your name? ")\ndefine ask{2} = ("Which way: left or right? ")\nask{1}\nprint "Welcome to the island," answer{1}\nprint "Find as many coins as you can in 3 days."\n\ndefine day = 1\nuntil day > 3\n  print "Day" day\n  ask{2}\n  if answer{2} = "left"\n    print "You walk into a cave."\n  else\n    print "You walk to a river."\n  random 70\n    print "You find 5 coins!"\n    set coins = coins + 5\n  random 30\n    print "A crab pinches you. No coins today."\n  set day = day + 1\n\nprint answer{1} "found" coins "coins."\nif coins > 10 = print "You are rich!"\nif coins < 11 = print "Nice try. Play again!"\nend', turn: ''}
      ]
    }
  ];

  // Texts come from lessons.js in the chosen language (English when a lesson is missing).
  var LANG = document.documentElement.lang || 'en';
  var PACKS = window.KavielLessons || {};
  var UI = (PACKS[LANG] || PACKS.en || {ui: {}}).ui;
  var EXPLAIN = (PACKS[LANG] || PACKS.en || {explain: {}}).explain;
  TUTORIALS.forEach(function (lesson, i) {
    var row = null;
    [PACKS[LANG], PACKS.en].forEach(function (pack) {
      if (!row && pack && pack.lessons[i] && pack.lessons[i][2].length === lesson.steps.length) row = pack.lessons[i];
    });
    if (!row) return;
    lesson.title = row[0];
    lesson.subtitle = row[1];
    lesson.steps.forEach(function (step, j) {
      var data = row[2][j];
      step.title = data[0]; step.text = data[1]; step.see = data[2]; step.turn = data[3]; step.slip = data[4];
    });
  });

  if (window.KavielI18n) TUTORIALS.forEach(function (lesson) {
    lesson.steps.forEach(function (step) { step.code = window.KavielI18n.code(step.code); });
  });

  // ---------------------------------------------------------- only in the app
  // The desktop app writes the `kaviel` command on this computer, so it also
  // carries a lesson that the website cannot have: the terminal, on this system.
  if (window.kavielDesktop) {
    var IS_WIN = /Windows/i.test(navigator.userAgent);
    var IS_MAC = /Mac/i.test(navigator.userAgent);
    var cli = window.kavielDesktop.cli || {};
    var where = cli.dir || (IS_WIN ? '%LOCALAPPDATA%\\Kaviel\\bin' : '~/.local/bin');
    var openTerminal = IS_WIN ? 'Start menù, scrivi "Prompt dei comandi" e aprilo.'
      : IS_MAC ? 'Premi Cmd+Spazio, scrivi "Terminale" e aprilo.'
      : 'Apri il terminale dal menù delle applicazioni.';
    var TEXT = {
      it: ['Il terminale, su questo computer', 'L\'app ti ha installato un comando', [
        ['Il comando kaviel', 'Insieme all\'app è stato messo sul computer un comando chiamato kaviel. Non ha una finestra: si scrive nel terminale, e fa girare un programma con lo stesso motore dell\'app.\n\n' + openTerminal + '\n\nIl comando si trova in ' + where + '.', 'kaviel 1.5.0-beta'],
        ['Fai girare un programma', 'Salva un programma con il pulsante Save: finisce nella cartella Download, con un nome che termina in .kv.\n\nNel terminale scrivi kaviel run e poi il percorso del file. Se non vuoi scrivere tutto il percorso, trascina il file dal Finder dentro la finestra del terminale: il percorso si scrive da solo.', 'Hello from my file'],
        ['Aiuto e versione', 'Due comandi che servono sempre: kaviel help mostra come si usa, kaviel version dice quale versione sta girando.\n\nSe il terminale risponde "command not found", la cartella ' + where + ' non è nel PATH: chiudi e riapri il terminale, oppure aggiungi quella cartella al PATH nel tuo file di configurazione.', 'kaviel run <file.kv>   Run a program']
      ]],
      en: ['The terminal, on this computer', 'The app installed a command', [
        ['The kaviel command', 'Together with the app, a command called kaviel was put on this computer. It has no window: you type it in a terminal, and it runs a program with the same engine as the app.\n\n' + (IS_WIN ? 'Open the Start menu, type "Command Prompt" and open it.' : IS_MAC ? 'Press Cmd+Space, type "Terminal" and open it.' : 'Open a terminal from your applications menu.') + '\n\nThe command lives in ' + where + '.', 'kaviel 1.5.0-beta'],
        ['Run a program', 'Save a program with the Save button: it lands in your Downloads folder, with a name ending in .kv.\n\nIn the terminal, type kaviel run and then the path of the file. If you do not want to type the whole path, drag the file into the terminal window and the path writes itself.', 'Hello from my file'],
        ['Help and version', 'Two commands you always need: kaviel help shows how to use it, kaviel version says which version is running.\n\nIf the terminal answers "command not found", the folder ' + where + ' is not on your PATH: close and reopen the terminal, or add that folder to PATH in your shell configuration file.', 'kaviel run <file.kv>   Run a program']
      ]],
      fr: ['Le terminal, sur cet ordinateur', 'L\'app a installé une commande', [
        ['La commande kaviel', 'Avec l\'app, une commande appelée kaviel a été mise sur cet ordinateur. Elle n\'a pas de fenêtre : tu l\'écris dans un terminal, et elle lance un programme avec le même moteur que l\'app.\n\n' + (IS_WIN ? 'Ouvre le menu Démarrer, tape « Invite de commandes » et ouvre-la.' : IS_MAC ? 'Appuie sur Cmd+Espace, tape « Terminal » et ouvre-le.' : 'Ouvre un terminal depuis le menu des applications.') + '\n\nLa commande se trouve dans ' + where + '.', 'kaviel 1.5.0-beta'],
        ['Lance un programme', 'Enregistre un programme avec le bouton Save : il arrive dans ton dossier Téléchargements, avec un nom qui finit par .kv.\n\nDans le terminal, tape kaviel run puis le chemin du fichier. Si tu ne veux pas taper tout le chemin, glisse le fichier dans la fenêtre du terminal : le chemin s\'écrit tout seul.', 'Hello from my file'],
        ['Aide et version', 'Deux commandes toujours utiles : kaviel help montre comment s\'en servir, kaviel version dit quelle version tourne.\n\nSi le terminal répond « command not found », le dossier ' + where + ' n\'est pas dans le PATH : ferme et rouvre le terminal, ou ajoute ce dossier au PATH dans le fichier de configuration de ton shell.', 'kaviel run <file.kv>   Run a program']
      ]]
    };
    var pack = TEXT[LANG] || TEXT.en;
    var lesson = {title: pack[0], subtitle: pack[1], steps: []};
    pack[2].forEach(function (row, i) {
      lesson.steps.push({
        title: row[0],
        text: row[1],
        code: i === 0 ? 'kaviel version' : i === 1 ? 'kaviel run Downloads/hello.kv' : 'kaviel help',
        see: row[2],
        turn: i === 0 ? (LANG === 'it' ? 'Scrivi kaviel version nel terminale e premi Invio.' : LANG === 'fr' ? 'Tape kaviel version dans le terminal et appuie sur Entrée.' : 'Type kaviel version in the terminal and press Enter.') : '',
        slip: '',
        desktopOnly: true
      });
    });
    TUTORIALS.push(lesson);
  }

  // One short sentence for each line of code, so the child knows what every line does.
  function explain(line, next) {
    var t = line.trim(), m, e = EXPLAIN;
    if (!t || !e.start) return '';
    if (t === 'start') return e.start;
    if (t === 'end') return e.end;
    if (t[0] === '#') return e.note;
    if (t === 'else') return e.else;
    if (t === 'break') return e.breakIt;
    // A text command inside a line explains the line better than print does.
    if ((m = t.match(/\b(upper|lower|trim|part|split|join)\(/)) && e[m[1]]) return e[m[1]];
    if (/\/\//.test(t) && e.whole) return e.whole;
    if (/\s%\s/.test(t) && e.rest) return e.rest;
    if (/^for\s+each\b/.test(t)) return e.forEach;
    if (/^print\s+(true|false|nothing)\s*$/.test(t) && e.value) return e.value;
    if (/^print\b.*[<>]=?/.test(t) && e.compare) return e.compare;
    if (/^define\s+\w+\s*=\s*nothing\s*$/.test(t) && e.nothingValue) return e.nothingValue;
    if (/^define\s+\w+\s*=\s*\[\[/.test(t) && e.nestedList) return e.nestedList;
    if (/^append\([^,]+,\s*\[/.test(t) && e.appendRow) return e.appendRow;
    if (/\w+\[\d+\]\[\d+\]/.test(t) && e.twice) return e.twice;
    if (/^define\s+\w+\s*=\s*ask\(/.test(t) && e.askNow) return e.askNow;
    if (/^if\s+.+\s=\s+\w+\(.*\)\s*$/.test(t) && e.ifCall && !(next && /^\s/.test(next))) return e.ifCall;
    if (/^print\b.*\\n/.test(t) && e.newLine) return e.newLine;
    if (/^print\s*$/.test(t)) return e.printEmpty;
    if (/^print\b/.test(t)) return e.print;
    if ((m = t.match(/^define\s+ask\{(\d+)\}/))) return e.askDef.replace('{n}', m[1]);
    if (/^define\s+keypress\{/.test(t)) return e.keyDef;
    if ((m = t.match(/^define\s+([A-Za-z_]\w*)\s*\(/))) return e.fnDef.replace('{name}', m[1]);
    if ((m = t.match(/^define\s+([A-Za-z_]\w*)\s*=\s*pick\b/))) return e.pick.replace('{name}', m[1]);
    if ((m = t.match(/^define\s+([A-Za-z_]\w*)/))) return e.define.replace('{name}', m[1]);
    if (/^set\b/.test(t)) return e.set;
    if ((m = t.match(/^ask\{(\d+)\}$/))) return e.ask.replace('{n}', m[1]);
    if (/^if\s+keypress\{/.test(t)) return e.keyIf;
    if (/^if\b/.test(t)) {
      var parts = t.split(' = ');
      var inline = parts.length >= 3 || (parts.length === 2 && /[<>]/.test(parts[0]));
      return inline ? e.ifInline : e.ifBlock;
    }
    if (/^repeat\b/.test(t)) return e.repeat;
    if (/^until\b/.test(t)) return e.until;
    if (/^random\b/.test(t)) return e.random;
    if (/^return\b/.test(t)) return e.returnIt;
    if (/^append\(/.test(t)) return e.append;
    return '';
  }
  window.KavielTutorials = TUTORIALS;

  var panel = document.getElementById('tutorial');
  if (!panel) return;
  var $ = function (id) { return document.getElementById(id); };
  var lessonsBox = $('tutorial-lessons');
  var stepBox = $('tutorial-step');
  var toggle = $('tutorials-toggle');
  var code = $('code');
  var STORE = 'kaviel.tutorial.position', BACKUP = 'kaviel.tutorial.backup', DONE = 'kaviel.tutorial.done', VISITED = 'kaviel.visited';
  var position = {lesson: 0, step: 0}, showingStep = false, done = [];

  function read(key, fallback) {
    try { var value = JSON.parse(localStorage.getItem(key) || 'null'); return value === null ? fallback : value; } catch (e) { return fallback; }
  }
  function write(key, value) { try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) {} }

  var saved = read(STORE, null);
  if (saved && Number.isInteger(saved.lesson) && Number.isInteger(saved.step) &&
      TUTORIALS[saved.lesson] && TUTORIALS[saved.lesson].steps[saved.step]) {
    position = {lesson: saved.lesson, step: saved.step};
    showingStep = true;
  }
  done = read(DONE, []);
  if (!Array.isArray(done)) done = [];

  function element(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Reading a step aloud: the browser's own voice, in the language of the site.
  var reader = null, SPEECH = {en: 'en-US', it: 'it-IT', fr: 'fr-FR'};
  function silence() {
    reader = null;
    if (!window.speechSynthesis) return;
    try { window.speechSynthesis.cancel(); } catch (e) {}
  }
  function voiceFor(lang) {
    var voices = [];
    try { voices = window.speechSynthesis.getVoices() || []; } catch (e) { return null; }
    for (var i = 0; i < voices.length; i++) {
      if (String(voices[i].lang || '').replace('_', '-').toLowerCase().indexOf(lang.slice(0, 2)) === 0) return voices[i];
    }
    return null;
  }
  function listenButton(step) {
    if (!window.speechSynthesis || typeof SpeechSynthesisUtterance !== 'function') return null;
    var said = step.title + '. ' + String(step.text).replace(/\n\n/g, ' ');
    var button = element('button', 'btn listen');
    button.type = 'button';
    button.setAttribute('aria-pressed', 'false');
    button.innerHTML = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 7.5h3L11 4v12L7 12.5H4z"/><path d="M14 7.5a4 4 0 0 1 0 5M16.5 5a7.5 7.5 0 0 1 0 10"/></svg>';
    var label = element('span', null, UI.listen || 'Listen');
    button.appendChild(label);
    reader = button;
    button.addEventListener('click', function () {
      var speaking = button.getAttribute('aria-pressed') === 'true';
      try { window.speechSynthesis.cancel(); } catch (e) {}
      if (speaking) {
        button.setAttribute('aria-pressed', 'false');
        label.textContent = UI.listen || 'Listen';
        return;
      }
      var speech = new SpeechSynthesisUtterance(said);
      speech.lang = SPEECH[LANG] || 'en-US';
      speech.rate = 0.95;
      var voice = voiceFor(speech.lang);
      if (voice) speech.voice = voice;
      speech.onend = speech.onerror = function () {
        button.setAttribute('aria-pressed', 'false');
        label.textContent = UI.listen || 'Listen';
      };
      button.setAttribute('aria-pressed', 'true');
      label.textContent = UI.stopReading || 'Stop reading';
      window.speechSynthesis.speak(speech);
    });
    return button;
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    if (!open) silence();
  }
  function showTab(name) {
    var lessons = name === 'lessons';
    $('tab-lessons').setAttribute('aria-selected', String(lessons));
    $('tab-examples').setAttribute('aria-selected', String(!lessons));
    $('lessons-view').hidden = !lessons;
    $('examples-view').hidden = lessons;
  }
  toggle.addEventListener('click', function () { setOpen(panel.hidden); });
  $('tutorial-close').addEventListener('click', function () { setOpen(false); });
  $('tab-lessons').addEventListener('click', function () { showTab('lessons'); });
  $('tab-examples').addEventListener('click', function () { showTab('examples'); });
  document.querySelectorAll('[data-example]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (window.innerWidth <= 900) setOpen(false);
    });
  });

  function render() {
    drawLessons();
    stepBox.hidden = !showingStep;
    lessonsBox.hidden = showingStep;
    if (showingStep) drawStep();
  }

  function drawLessons() {
    lessonsBox.innerHTML = '';
    TUTORIALS.forEach(function (lesson, index) {
      var button = element('button', 'tutorial-lesson' + (done.indexOf(index) >= 0 ? ' done' : ''));
      button.type = 'button';
      button.setAttribute('aria-current', String(index === position.lesson));
      button.appendChild(element('span', 'lesson-number', done.indexOf(index) >= 0 ? '✓' : String(index + 1)));
      var text = element('span', 'lesson-text');
      text.appendChild(element('span', 'lesson-title', lesson.title));
      text.appendChild(element('small', null, lesson.subtitle));
      button.appendChild(text);
      button.appendChild(element('span', 'lesson-count', lesson.steps.length + ' ' + (UI.steps || 'steps')));
      button.addEventListener('click', function () {
        position = {lesson: index, step: 0};
        showingStep = true;
        write(STORE, position);
        render();
      });
      lessonsBox.appendChild(button);
    });
  }

  function markDone(lessonIndex) {
    if (done.indexOf(lessonIndex) < 0) { done.push(lessonIndex); write(DONE, done); }
  }

  function drawStep() {
    silence();
    var lesson = TUTORIALS[position.lesson], step = lesson.steps[position.step];
    var last = position.step === lesson.steps.length - 1;
    stepBox.innerHTML = '';
    stepBox.scrollTop = 0;

    var back = element('button', 'back-link', '← All lessons');
    back.type = 'button';
    back.addEventListener('click', function () { showingStep = false; render(); });
    stepBox.appendChild(back);

    var bar = element('div', 'progress');
    bar.setAttribute('aria-hidden', 'true');
    lesson.steps.forEach(function (_, i) { bar.appendChild(element('i', i < position.step ? 'on' : i === position.step ? 'here' : '')); });
    stepBox.appendChild(bar);
    stepBox.appendChild(element('div', 'step-count', (UI.lesson || 'Lesson') + ' ' + (position.lesson + 1) + ': ' + lesson.title + ' · ' + (UI.step || 'step') + ' ' + (position.step + 1) + ' ' + (UI.of || 'of') + ' ' + lesson.steps.length));
    stepBox.appendChild(element('h3', null, step.title));
    String(step.text).split('\n\n').forEach(function (paragraph) {
      stepBox.appendChild(element('p', 'tutorial-text', paragraph));
    });
    var listenRow = listenButton(step);
    if (listenRow) stepBox.appendChild(listenRow);

    stepBox.appendChild(element('div', 'block-title', UI.lineByLine || 'Line by line'));
    var rows = element('div', 'tutorial-code');
    var codeLines = step.code.split('\n');
    codeLines.forEach(function (line, lineIndex) {
      if (!line.trim()) return;
      var row = element('div', 'code-row');
      row.appendChild(element('pre', 'src', line));
      var note = explain(line, codeLines[lineIndex + 1]);
      if (note) row.appendChild(element('div', 'note', note));
      rows.appendChild(row);
    });
    stepBox.appendChild(rows);

    if (step.see) {
      var see = element('div', 'see-box');
      see.appendChild(element('div', 'block-title', UI.see || 'What you will see'));
      see.appendChild(element('pre', 'screen', step.see));
      stepBox.appendChild(see);
    }
    if (step.turn) {
      var turn = element('p', 'your-turn');
      turn.appendChild(element('b', null, UI.turn || 'Your turn'));
      turn.appendChild(document.createTextNode(step.turn));
      stepBox.appendChild(turn);
    }
    if (step.slip) {
      var slip = element('p', 'slip-box');
      slip.appendChild(element('b', null, UI.slip || 'Watch out'));
      slip.appendChild(document.createTextNode(step.slip));
      stepBox.appendChild(slip);
    }

    function keepBackup() {
      try { if (code.value.trim() && code.value !== step.code) localStorage.setItem(BACKUP, code.value); } catch (e) {}
    }
    function afterLoad(message) {
      code.dispatchEvent(new Event('input', {bubbles: true}));
      code.scrollTop = 0;
      code.focus();
      if (window.innerWidth <= 900) setOpen(false);
      document.dispatchEvent(new CustomEvent('kaviel:notice', {detail: message}));
      drawStep();
    }
    var actions = element('div', 'step-actions');
    var typeIt = element('button', 'btn primary type-it', UI.typeIt || 'Type it yourself');
    typeIt.type = 'button';
    typeIt.addEventListener('click', function () {
      keepBackup();
      code.value = 'start\n\nend\n';
      code.setSelectionRange(6, 6);
      afterLoad(UI.typeNote || 'Empty page ready. Type the lines, then press Run.');
      code.setSelectionRange(6, 6);
    });
    actions.appendChild(typeIt);
    var open = element('button', 'btn put-code', UI.putIt || 'Put it in the editor');
    open.type = 'button';
    open.addEventListener('click', function () {
      keepBackup();
      code.value = step.code;
      code.setSelectionRange(0, 0);
      var run = $('run');
      run.classList.add('nudge');
      setTimeout(function () { run.classList.remove('nudge'); }, 2400);
      afterLoad('Done. Now press the green Run button.');
    });
    actions.appendChild(open);
    stepBox.appendChild(actions);

    var nav = element('div', 'nav-row');
    var previous = element('button', 'btn', '← Back');
    previous.type = 'button';
    previous.disabled = position.lesson === 0 && position.step === 0;
    previous.addEventListener('click', function () {
      if (position.step > 0) position.step--;
      else if (position.lesson > 0) { position.lesson--; position.step = TUTORIALS[position.lesson].steps.length - 1; }
      write(STORE, position); render();
    });
    nav.appendChild(previous);

    var next = element('button', 'btn', last ? (position.lesson === TUTORIALS.length - 1 ? 'Finish' : 'Next lesson →') : 'Next step →');
    next.type = 'button';
    next.addEventListener('click', function () {
      if (!last) position.step++;
      else {
        markDone(position.lesson);
        if (position.lesson < TUTORIALS.length - 1) { position.lesson++; position.step = 0; }
        else { showingStep = false; document.dispatchEvent(new CustomEvent('kaviel:notice', {detail: 'You finished every lesson. Now go and make your own program.'})); }
      }
      write(STORE, position); render();
    });
    nav.appendChild(next);
    stepBox.appendChild(nav);

    var backup = null;
    try { backup = localStorage.getItem(BACKUP); } catch (e) {}
    if (backup !== null) {
      var restore = element('button', 'restore-code', 'Bring back the code I had before');
      restore.type = 'button';
      restore.addEventListener('click', function () {
        code.value = backup;
        code.dispatchEvent(new Event('input', {bubbles: true}));
        try { localStorage.removeItem(BACKUP); } catch (e) {}
        code.focus();
        drawStep();
      });
      stepBox.appendChild(restore);
    }
  }

  render();

  // A first visit opens the lessons on a big screen. After that the panel stays closed until asked for.
  var first = true;
  try { first = localStorage.getItem(VISITED) === null; localStorage.setItem(VISITED, '1'); } catch (e) {}
  if (first && window.innerWidth > 900) setOpen(true);
})();
