/* Lesson texts for the Kaviel editor, in English, Italiano and Français.
   The code of every step lives in tutorials.js and never changes with the language.
   A step is [title, explanation, what you will see, your turn, watch out].
   Paragraphs inside the explanation are separated by a blank line. */
window.KavielLessons = {
  en: {
    ui: {
      lesson: 'Lesson', step: 'step', of: 'of', steps: 'steps',
      lineByLine: 'Line by line', see: 'What you will see', turn: 'Your turn', slip: 'Watch out',
      typeIt: 'Type it yourself', putIt: 'Put it in the editor', typeNote: 'Empty page ready. Type the lines you see in the lesson, then press Run.',
      listen: 'Listen', stopReading: 'Stop reading'
    },
    explain: {
      start: 'The program begins here.',
      end: 'The program ends here.',
      note: 'A note for people. The computer skips it.',
      print: 'Shows this on the screen.',
      printEmpty: 'Shows nothing: there is no text after print.',
      askDef: 'Writes question {n}. It does not ask it yet.',
      ask: 'Asks question {n} now and waits for a typed answer.',
      keyDef: 'Chooses the key to wait for.',
      keyIf: 'Waits for that key, then asks the question.',
      fnDef: 'Starts a new command of your own, called {name}. The pushed-in lines are what it does.',
      pick: 'Makes a box called {name} and puts a random choice in it.',
      define: 'Makes a box called {name} and puts a value in it.',
      set: 'Puts a new value in the box. The old value is gone.',
      ifInline: 'If the check is true, do the action on the same line.',
      askNow: 'Asks the question now, and puts the answer in the box.',
      ifCall: 'If the check is true, runs the command on the same line.',
      newLine: 'The \\n inside the text starts a new line.',
      ifBlock: 'Checks something. The pushed-in lines below only run if it is true.',
      else: 'Otherwise: these lines run when the check above was false.',
      repeat: 'Does the pushed-in lines below again and again, this many times.',
      until: 'Keeps doing the pushed-in lines until this becomes true. It checks before every turn.',
      breakIt: 'Leaves the loop right now.',
      random: 'One chance in the draw, out of 100. Only one of the blocks next to each other runs.',
      returnIt: 'Sends this value back to the place that used the command.',
      append: 'Adds a value at the end of the list.',
      forEach: 'Goes through the list, one item at a time. The pushed-in lines run once for every item, and the name holds the item.',
      upper: 'Makes every letter big.',
      lower: 'Makes every letter small.',
      trim: 'Takes away the spaces at the two ends.',
      part: 'Takes a piece of the text, from one position to another.',
      split: 'Breaks the text where the separator is, and gives a list.',
      join: 'Glues the pieces of a list, with this text in between.',
      whole: 'Divides and keeps only the whole part, without what comes after the point.',
      rest: 'Gives what is left after a whole division.',
      value: 'Shows one of the three plain values of the language: true, false or nothing.',
      compare: 'Works out the check first, and print shows the answer: true or false.',
      nothingValue: 'Puts the empty value in the box: nothing has been given to it yet.',
      nestedList: 'A list of lists: every row is a list of its own.',
      appendRow: 'Adds a whole row at the end of the table.',
      twice: 'Reads the row first, then the item inside that row.'
    },
    lessons: [
      ['Meet the editor', 'A tour before you start', [
        ['Your workspace', `This is where you will write programs. A program is a list of instructions for the computer, in the same way a recipe is a list of instructions for cooking.

The big white box is where you write. The black box on the right is called Output: it works like the computer's screen and shows what your program says. The box under it is Problems: it tells you when something is wrong, and it always says which line.`, `The word Hello! appears in the black Output box.`, `Press the green Run button in the top right corner.`, ``],
        ['Run, Stop and Save', `Run starts your program. Stop ends it, in case it keeps going. Save puts your program on your computer as a file that ends in .kv, so you can keep it forever. Open brings a saved file back. New gives you an empty page.

The page also remembers your work by itself, but a saved file is the safest.`, `Hello again!`, `Press Save and find the file in your Downloads folder. Then press New, and then Open to bring your program back.`, ``],
        ['How these lessons work', `Every lesson is made of small steps. In each step you read what an idea means, you see the code with a short note beside every line, and then you try it.

There are two buttons. Type it yourself gives you an empty page, so you can type the lines. Typing is how you really learn. Put it in the editor fills in the finished code for you.

If you get stuck, nothing breaks. Kaviel never crashes: it tells you what is wrong and keeps going.`, `I can type code!`, `Press Type it yourself, type the three lines you see on the left, and press Run.`, `Type the lines exactly. Quotes and spaces matter.`]
      ]],
      ['Say hello', 'Your very first program', [
        ['Make the computer talk', `Computers do exactly what you tell them, one instruction after another, from the top to the bottom. Every instruction is one line.

Every Kaviel program starts with the word start and finishes with the word end, like a sandwich with bread on both sides. In the middle, the word print tells the computer to show something on the screen.`, `Hello!`, `Run it. Then change Hello! to your own word and run it again.`, `Spell print correctly. If you write prnt, Kaviel tells you and skips that line.`],
        ['Say more than one thing', `Each print line shows one new line of text. The computer does them in order, the way you read a book from top to bottom.

The order matters. If you swap two lines, the words come out swapped too.`, `Hello!
My name is Kaviel.
Nice to meet you.`, `Add one more line that says your own name. Then swap two lines and see what happens.`, ``],
        ['Words go inside quotes', `Words are called text, and text is always written between double quotes, like this: "hello". The quotes tell the computer: these letters are only words, not a command.

Numbers are different. They do not need quotes. And the computer can do sums for you: write 2 + 3 and it shows 5.`, `I am learning to code.
7
5`, `Change the 7 to your age. Then try print 100 - 1.`, `If you forget the quotes, like print Hello, Kaviel thinks Hello is the name of a box and tells you to use quotes.`],
        ['Notes for people', `Sometimes you want to leave a message inside the code, for yourself or for a friend, without the computer reading it. Start the line with # and the computer skips it.

Good programmers write notes all the time, so that later they remember why they wrote something.`, `The note above is invisible.`, `Write your own note with a # at the start. Run it: the output does not change.`, ``],
        ['An empty line', `Sometimes you want a gap between two things you say, like the space between two paragraphs. print nothing makes the computer say an empty line.

nothing is a word of the language that means "no value". You will meet it again in lesson 6.`, `Hello!

Bye!`, `Add an empty line between your own two lines.`, `Do not write print alone on a line: Kaviel says that print needs something to show. Write print nothing.`]
      ]],
      ['Names and boxes', 'Remember things for later', [
        ['A box with a name', `Imagine a box with a label on it. You can put something inside, and later you ask for it by reading the label. The word define makes a new box.

Here the label is name, and inside the box is the word Ada. After that, whenever you write name, the computer opens the box and uses what is inside.`, `Ada
Hello Ada`, `Put your own name in the box.`, `Use define only once for each box. To change it later, use set (next step).`],
        ['Change what is inside', `set puts something new in a box that already has a label. The old thing is thrown away and the new one takes its place.

Think of a scoreboard: when somebody scores, the number changes, but it is still the same scoreboard.`, `Now: 7
Next year: 8`, `Add another set line that jumps ahead ten years.`, `If you set a box that was never made, Kaviel makes it and warns you. It is usually a typo.`],
        ['Do maths', `The computer is very fast at maths. + adds, - subtracts, * multiplies and / divides. The sign % gives what is left over after a division: 10 % 3 is 1, because 3 fits three times in 10 and 1 is left.

The star * means times, because the letter x looks like any other letter.`, `15
5
50
2
1`, `Try a big sum, like 123 * 456.`, `Dividing by zero is impossible. Kaviel tells you and goes on.`],
        ['Mix words and boxes', `print can show many things in one line, one after the other. Words, numbers and boxes can be mixed. The computer puts a space between them.

If you want to glue pieces together with no space, use +, like "Woof" + "!".`, `My pet is a dog
It has 4 legs.
Total legs for 3 pets: 12
Woof!!`, `Change the pet to a bird and the legs to 2.`, `A + between words glues them together with no space at all.`]
      ]],
      ['Ask questions', 'Talk with the person using your program', [
        ['Prepare a question, then ask it', `To talk with the person using your program you need two steps. First you write the question down: define ask{1} writes question number 1, but does not ask it yet. Then ask{1} really asks it and waits.

When you run it, a box appears in the Output. Type your answer and press Enter. The answer is saved, and answer{1} is how you read it back.`, `What is your name? Ada
Hello Ada`, `Run it and type your name.`, `The curly brackets { } are part of the name. They are not round brackets.`],
        ['Two questions', `Every question has its own number, so the answers never get mixed up. Question 1 goes with answer{1}, question 2 goes with answer{2}.

You can ask them in any order. The number is what links a question to its answer.`, `Your name? Ada
Your city? Rome
Ada lives in Rome`, `Add a third question about your favourite food.`, ``],
        ['Under 18 or over 18', `Kaviel has two special words to compare numbers: under and over. under 18 means smaller than 18. over 18 means bigger than 18, so 18 itself is neither under nor over. A third word, is, asks for exactly that number: answer{1} = is 18.

The lines below are the short way to write a choice. They read like English: if the answer is under 18, print this.`, `Type 10: You are under 18.
Type 18: You are exactly 18.`, `Run it twice. Once with 10, once with 18.`, `If you type a word instead of a number, Kaviel says it is not a number and carries on.`],
        ['Turn an answer into a number', `An answer is always text, even when you type digits. Text and numbers are different things. Add 1 to the text "5" and you get 51, because the computer glues them together.

number() turns text into a real number. After that the maths works properly.

For comparing you do not need it: = reads the number out of the text, so answer{1} = 18 works.`, `Type 4:
Double is 8
Plus ten is 14`, `Make it print the number times 100.`, `number() only works when the text really is a number.`],
        ['A question in one line', `So far a question took three lines. When you have only one question, there is a shorter way: ask with brackets asks right away, and gives you back what the person typed.

The answer is always text, even when the person types a number.`, `What is your name? Ada
Hello Ada`, `Ask for a favourite colour and say it back.`, `The question goes between quotes, like any text. End it with a space so the answer does not touch it.`]
      ]],
      ['Make choices', 'Let the program decide', [
        ['If this, then that', `A program can choose. if looks at something and only runs the lines under it when it is true. Those lines are pushed to the right by two spaces. The Tab key does that for you.

The last print is not pushed to the right, so it always runs, whatever happens above.`, `You win!
Well done.
The game is over.`, `Change the score to 3. Which lines disappear?`, `If you forget to push the lines in, Kaviel warns you that the if has nothing under it.`],
        ['Otherwise', `else is the other road. When the check is false, the lines under else run instead. Only one road is taken, never both.

Think of a fork in a path: go left if the check is true, go right if it is false.`, `Try again.`, `Find a score that makes it say You win!`, `Write else right after the lines of the if, at the same level as the if.`],
        ['Choose on one line', `When the job is small you can write it all on one line. A second = puts the action on the same line as the check. Read it like this: if the age is 16, then print.

The first = in the line means equal. The second = only separates the check from the action.`, `Exactly sixteen
Younger`, `Change the age to 25 and run it.`, ``],
        ['Compare words', `You can compare words too. A single = asks: are these two exactly the same? Big and small letters count, so "Red" and "red" are different.

Like a traffic light: if the colour is red, stop. Otherwise, go.`, `Stop!`, `Change red to green and run it again.`, `Words in quotes must match exactly, capital letters included.`],
        ['And, or, not', `Sometimes one check is not enough. and needs both checks to be true. or needs at least one of them. not turns true into false.

In this program, 9 is more than 5 and less than 13, so the first check passes. The age is not ten, so the last check passes too.`, `You are a kid.
You are not ten.`, `Try age 2, then age 95. Which lines appear?`, `Brackets make it clear: not (age = 10). Without them it works the same, because not reads the whole comparison after it.`]
      ]],
      ['True, false and nothing', 'Yes, no, and empty', [
        ['Yes and no', `A check is not only something you read on the page: the computer answers it with true or false. 5 > 3 is true, and 5 < 3 is false.

These two words are values, like numbers and texts. You can put one in a box, print it, or compare it with something else.`, `true
false
true`, 'Print the answer to 10 > 2, then the answer to 2 > 10.', `true and false are written without quotes and without capital letters.`],
        ['The value that is not there', `Sometimes a box exists but nothing has been put in it yet. That value is called nothing, and it means "no value".

Printing it gives an empty line, and you can ask whether a box still holds it. It is how a program says "I have nothing here".`, `
true
Ada`, 'Make a second box with nothing in it, and print it.', `nothing is not the text "nothing": inside quotes it becomes a word you can see.`]
      ]],
      ['Again and again', 'Loops repeat work for you', [
        ['Repeat a few times', `A loop does the same thing again and again, so you do not have to write the same line many times. repeat 3 runs the pushed-in lines three times.

The last print is not pushed to the right, so it only runs once, after the loop has finished.`, `La la la! (three times)
That was a song.`, `Make it sing 10 times.`, `The lines for the loop must be pushed to the right. If not, they run only once.`],
        ['Keep going until', `until keeps repeating until something becomes true. Before every turn it asks: is this already true? If yes, it stops. If no, it does the lines once more.

Inside, set n = n + 1 adds one to n each turn. Without it n would never change and the loop would never end. If that happens, the Stop button is there, and Kaviel also stops runaway programs by itself.`, `n is 1
n is 2
... up to n is 5
Done`, `Change 5 to 10.`, `Always change something inside an until loop, or it never ends.`],
        ['Count with a loop', `A loop plus a box makes a counter. The box n starts at 1. Each turn it prints one line of the seven times table and then adds 1 to n.

With only a few lines you get ten lines of output. Change one number and the whole table changes.`, `1 x 7 = 7
2 x 7 = 14
... up to 10 x 7 = 70`, `Change the 7 to your favourite number.`, ``],
        ['Leave early', `break jumps out of the loop immediately. It is useful when you have already found what you were looking for.

The loop could count up to 100, but it breaks at the first number whose square is bigger than 50.`, `The first number whose square is above 50 is 8`, `Change 50 to 200.`, ``]
      ]],
      ['Luck', 'Dice, coins and surprises', [
        ['Pick one thing', `pick chooses one item from the list you write, completely at random. Every item has the same chance. Because it is random, every Run can give a different answer.

Games use luck all the time: dice, cards, treasure chests.`, `Today you are a cat
(or a dog, an owl or a fox: it changes)`, `Run it five times. Then add your favourite animal to the list.`, `Separate the items with commas.`],
        ['Flip a coin', `A coin has two sides, so pick between two things. Nobody can guess the result.

Run it many times: heads and tails should each come up about half of the time.`, `The coin says heads
(or tails)`, `Run it ten times. Is it fair?`, ``],
        ['Roll a die', `You can pick numbers too. A normal die has six sides, so we pick from 1 to 6.

The last line is a one-line choice: if the die is 6, print Lucky!`, `You rolled a 4
(it changes, and Lucky! only shows on a 6)`, `Change it to a die with 20 sides.`, ``],
        ['Unfair chances', `Sometimes you want some things to be rare. A random block has a number: its chance out of 100. Blocks right next to each other are one draw, and only one of them runs.

Here the pebble comes 80 times out of 100, the coin 19 times, and the diamond only once.`, `Rolling the magic box...
Just a pebble. (most of the time)`, `Make the diamond more common, but keep the total at 100.`, `The chances should add up to 100. If not, Kaviel warns you and fixes the numbers.`]
      ]],
      ['Your own commands', 'Give a few lines a name', [
        ['Make a command', `A command of your own is a little machine you build. It has a name, it takes something in, and it gives something back. Write define, a name, and brackets with what it takes in.

return sends the answer back. After this, greet("Ada") works like a brand new Kaviel command, and you can use it as many times as you like.`, `Hello Ada!
Hello Luca!`, `Say hello to your best friend.`, `The lines of the command must be pushed to the right under define.`],
        ['More than one input', `A command can take in several things. Put them in the brackets, separated by commas. These names only exist inside the command, like tools inside a toolbox.

When you call area(3, 4), width becomes 3 and height becomes 4.`, `A 3 by 4 room is 12 square metres
A 10 by 10 field is 100`, `Find the area of a 25 by 8 garden.`, `Give the right number of inputs. Too few or too many is an error.`],
        ['Commands that use commands', `A command can use another command. Small pieces make big programs.

Here quadruple uses double two times: 5 becomes 10, and 10 becomes 20.`, `20`, `Make a command that triples a number.`, ``],
        ['A command that calls itself', `A command can call itself, a bit like standing between two mirrors.

It only works if every call gets closer to an end. Here factorial(5) is 5 times factorial(4), and so on, down to factorial(0), which is simply 1. That is the end.`, `5! is 120`, `Try factorial(10).`, `Always have an ending case. Without it the command would call itself forever. Kaviel stops it after 128 calls.`],
        ['A command that does something', `A command does not have to give an answer back. It can just do things, like print. Then there is no return.

You can call it from the one-line if: if birthday = cheer("Ada") runs the command only when birthday is true. This works when the line has no indented lines under it.`, `Hooray for Ada
The end`, `Make birthday false and run again. What changes?`, `If you put indented lines under the if, the = becomes a comparison instead. A line alone means: do this.`]
      ]],
      ['Lists', 'Many things in one place', [
        ['A list of things', `A box can hold one thing. A list is a box with many places, one after another. You make one with square brackets and commas.

Each place has a number. The first place is 1, the second is 2. You ask for the first with pets[1]. length counts how many things there are.`, `First: cat
Last: fox
All: ["cat", "dog", "fox"]
How many: 3`, `Print the second pet.`, `Places are counted from 1 here, not from 0.`],
        ['Add and change', `append puts a new thing at the end of the list. set can change one place: set pets[1] = "lion" replaces the first item.

The list grows when you append. It keeps its size when you set.`, `["lion", "dog", "owl"]`, `Add two more animals.`, `Asking for a place that does not exist, like pets[10], is an error. It tells you the real length.`],
        ['Visit every item', `To do something with every item of a list, use a loop with a counter. i starts at 1 and goes up by one each turn, until it is bigger than the length of the list.

pets[i] means the item at place i, so the loop shows each pet, one after the other.`, `1 cat
2 dog
3 owl`, `Add an animal to the list. Does the loop still work?`, ``],
        ['One at a time', `for each gives you one item at a time, with a name you choose. No counter, no position, no length. It reads like the sentence you would say out loud, and break leaves it early.`, `cat
dog
owl`, `Add a fourth animal. Notice that nothing else has to change.`, ``],
        ['Add up a list', `A box can collect a total while the loop visits every number. total starts at 0. Each turn, the current price is added to it.

It is the same idea as a shop till adding up what you buy.`, `Total: 20`, `Add another price to the list.`, ``],
        ['Pick from a list', `In lesson 8, pick chose between things you wrote one by one. When the things are already in a list, write pick and the name of the list.

Every item has the same chance, and every run can give a different answer.`, `Today you are a dog
(it could be a cat or a fox: it changes each time)`, `Add two more pets to the list and run it five times.`, `Write pick pets with no quotes: pets is the name of the box that holds the list.`]
      ]],
      ['Lists inside lists', 'A table in a list', [
        ['A list of lists', `A list can hold anything, even other lists. Two brackets make a row, and a list of rows makes a table.

You read it with two positions: the row first, then the item inside that row. grid[2][1] means the second row, first item in it.`, `[[1, 2], [3, 4]]
3`, 'Change the 4 to 9 with set, then print the whole grid.', `grid[2][1] is 3, not 2: rows come first.`],
        ['A table of players', `This is how a score table is made: one list, and a small list for every player. append adds a row to the outer list, and for each walks the rows.

Inside every row you read the name and the points. One idea, used twice, and you have a table.`, `Ada 10
Luca 7`, 'Add a third player with 12 points.', `append adds a row to the outer list. To change a point inside a row, use set row[2] = 12.`]
      ]],
      ['Words and letters', 'Play with text', [
        ['Big letters, small letters', `The computer can change the size of letters. upper makes every letter big, lower makes every letter small.

Both do not change the old text: they give you back a new one, so the word you started from is still there.`, `KAVIEL
kaviel`, 'Print your own name in small letters.', `upper and lower want a text. upper(5) is an error.`],
        ['Cut the spaces', `When a person types an answer, spaces often sneak in at the beginning or at the end. You cannot see them, but the computer can, and two texts that look the same stop being equal.

trim takes those spaces away. It is the first thing to do with an answer you want to compare.`, `[Ada]`, 'Remove trim, run again, and look at the brackets.', `trim removes spaces only at the two ends, never the ones in the middle.`],
        ['Take one piece', `part cuts a piece out of a text. You give it the text, the position where the piece starts and where it ends, and both positions count.

Positions start at 1, exactly as in a list, so the first letter is at 1 and not at 0.`, `Kaviel
iel`, 'Print the first four letters of the word.', `If you ask for a position bigger than the text, Kaviel tells you how many letters there are.`],
        ['Split it, join it', `split breaks a text wherever it finds a separator, and gives you a list. join does the opposite: it takes a list and a piece of text, and glues the pieces with that text in between.

Two words, one idea: pieces and whole. It is how a chat turns a sentence into words.`, `["a", "b", "c"]
a-b-c
3`, 'Split your own sentence on the space and join it with a plus sign.', `The separator must be at least one character, so split(text, "") is an error.`],
        ['New lines and quotes', `Two little tricks live inside a text. \\n means "start a new line here", so one print can show two lines. And \\" puts a real quote mark inside a text without ending it.

The backslash \\ tells Kaviel that the next letter is special. It leans the other way from the slash /.`, `Ada
Luca
"Kaviel"`, `Print your name and your age on two lines with only one print.`, `The backslash leans to the left: \\ . A slash / does nothing special.`]
      ]],
      ['Numbers that stay whole', 'Without a comma', [
        ['Two slashes', `A division with one slash gives the exact answer, and it can have a part after the point: 7 / 2 is 3.5.

With two slashes you keep only the whole part: 7 // 2 is 3. It is called whole division, and it is what you need to count things: you cannot have half a chair.`, `3.5
3`, 'Try 9 // 3 and 10 // 3.', `Do not write // when you want the exact answer.`],
        ['What is left over', `The per cent sign gives what is left after a whole division. 7 % 2 is 1, because 2 fits three times in 7 and 1 is left.

It is the quickest way to ask "is this number even?": if it is even, the rest of the division by 2 is 0.`, `1
0`, 'Print the rest of 10 divided by 3.', `The sign follows the left side: -7 % 2 is -1, not 1.`],
        ['A whole average', `Now you can do what a shop does: add up the prices, divide by how many there are, and keep whole numbers.

total // count gives the average without anything after the point, which is what you want when the answer must be a whole coin.`, `3`, 'Change total to 20 and run it again. Then try 17 / 5 to see the difference.', `If count is 0, Kaviel refuses to divide and tells you why.`]
      ]],
      ['Numbers with a point', 'Not only whole', [
        ['A part after the point', `Not every answer is whole. With one slash a division can give a part after the point: 10 / 4 is 2.5.

Kaviel writes that part with a point and not with a comma, so that the same program runs the same way on every computer. You may type a comma, and it will be understood.`, `4.5
2.5
0.3`, 'Print 7 / 2 and 7 // 2 together, and look at the difference.', `Two slashes give a whole number; one slash gives the exact answer.`],
        ['Below zero', `A number can be smaller than zero. Write a minus in front of it: -5 is five below zero, like a temperature in winter.

Two minuses make a plus: -3 * -2 is 6. It is the same rule as a debt that is cancelled twice ending up as money.`, `-3
-7
6`, 'Print a temperature that starts at 3 and falls by 8.', `The rest follows the sign of the left side: -7 % 2 is -1, not 1.`]
      ]],
      ['Draw with letters', 'Patterns', [
        ['A row of stars', `A text can grow. Start from an empty text, "", and add one star at every turn: after five turns you have a row of five stars.

This is how a computer draws when there is no drawing program: with letters, one after the other.`, `*****`, 'Make a row of twenty stars.', `An empty text is "" — two quotes with nothing between them.`],
        ['A triangle', `Put the growing text inside a loop that runs one more time each turn, and print it every turn: you get a triangle.

It is the same two ideas as before, a text that grows and a loop that goes on, and the picture comes out by itself.`, `*
**
***
****
*****`, 'Make the triangle grow by two stars at a time.', `If a loop never ends, press Escape to stop it. Kaviel stops it for you after a while.`],
        ['A frame around a name', `join repeats something: three pieces of three dashes, glued with nothing between them, give a bar of nine dashes.

With a bar above and a bar below you have a sign. A computer draws every picture this way: small pieces, repeated in the right order.`, `---------
Ada
---------`, 'Make the frame wider, and put your own name inside.', `join wants a list of texts. Numbers in the list are turned into text for you.`]
      ]],
      ['Press a key', 'Wait for the keyboard', [
        ['Wait for one key', `So far, the person typed a whole answer and pressed Enter. Sometimes you want just one key press, like Press any key to start in a game.

define keypress{1} = C chooses the key C. The if line waits until that key is pressed, then asks the question. Other keys are ignored.`, `Press C to continue.
(nothing happens until you press C)
What is your name?`, `Run it. First press a wrong key. Then press C.`, `Click on the page first, so the key presses go to it.`],
        ['Other keys', `Besides letters, you can wait for these keys: Enter, Space, Escape, Tab and the arrows ArrowUp, ArrowDown, ArrowLeft and ArrowRight.`, `Press Space to begin.
Your favourite colour?`, `Change Space to Enter.`, `Write the key name with the same capital letters.`]
      ]],
      ['Make a game', 'Put it all together', [
        ['Guess the number', `Now we put everything together. The computer picks a secret number with pick. You keep guessing until you find it. The loop runs until your guess equals the secret.

Inside the loop: ask the question, turn the answer into a number, count one more try, and give a hint if the guess is too big or too small.`, `Guess a number from 1 to 10: 5
Too small.
... and so on, until
You got it in 3 tries!`, `Make the secret number go up to 20.`, `number(answer{1}) is important. Without it the answer is text, and text is not compared as a number.`],
        ['A quiz with points', `A box called points counts the right answers. It starts at 0. Every right answer adds 1 with set points = points + 1.

At the end, print shows the total. The empty lines are only there to make the program easier to read.`, `Correct!
Correct!
You got 2 out of 2.`, `Write a third question of your own and give points for it too.`, `Answers are compared as text, so write them exactly: "4" and "green".`],
        ['Rock, paper, scissors', `This is a bigger program, so read it slowly, one block at a time. The computer picks with pick. You type your choice. Then, for each thing you might have chosen, there is a block that decides who wins.

The big if blocks have smaller if lines pushed to the right inside them. That is allowed: choices inside choices.`, `I chose paper
(it changes) then You win!, I win! or A draw!`, `At the end, add a line that says what happens if you type something else.`, `Type the words exactly: rock, paper or scissors, in small letters.`]
      ]],
      ['Mistakes', 'They happen. It is fine.', [
        ['A typo', `Everybody makes mistakes, even people who code for a living. Many programs crash when something is wrong. Kaviel does not: it skips the broken line, tells you about it, and keeps going.

Look at the Problems box after you run this. It shows the line number and says what it thinks you meant.`, `Hello!
But this one still works.
(and a problem on line 3)`, `Click the problem to jump to the line. Then fix the typo.`, ``],
        ['A name that does not exist', `A box must be made with define before you use it. If you write a name that does not exist, Kaviel looks for names that are close and suggests one. Here agee has one letter too many.

Reading error messages is a real skill. They are on your side.`, `Fixed: 8
(and a problem on line 3)`, `Fix the line by removing the extra e.`, ``],
        ['Impossible maths', `Some things cannot be done, like dividing by zero. The program tells you, skips that line, and goes on to the next one. Nothing stops.

This is the big idea of Kaviel: a mistake is not the end. You always see what happened and where.`, `5
Still running!
(and a problem on line 3)`, `Change the 0 to a 5. The problem goes away.`, ``]
      ]],
      ['Your big project', 'Build a treasure game, step by step', [
        ['Start your story', `Now you will build a real game, one small piece at a time. It is a treasure hunt on an island. After every step the game gets bigger, and it always works.

The first piece is a welcome. The game asks for your name and then says hello to you. You already know everything you need for this.`, `What is your name? Ada
Welcome to the island, Ada
Find as many coins as you can.`, `Press Type it yourself, write the program and run it. Then change the story: use another place instead of an island.`, ``],
        ['Choose a way', `A good game lets the player choose. Now we add a second question: left or right. The game says something different for each answer.

It uses if and else, just like in the lesson about choices.`, `Which way: left or right? left
You walk into a cave.`, `Run it two times: once with left, once with right. Then change the cave into something else.`, `Write left in small letters, exactly like in the program.`],
        ['Add luck and coins', `Now the game gets exciting. A box called coins starts at 0. Then a random block gives a 70 out of 100 chance to find 5 coins, and a 30 out of 100 chance to meet a crab.

set coins = coins + 5 adds 5 to the box. The two random blocks are next to each other, so only one of them happens.`, `You find 5 coins!
(or the crab. It changes every time.)
You have 5 coins.`, `Run it many times. Change 5 coins to 10 coins. Keep 70 and 30 adding up to 100.`, `The two chances must add up to 100.`],
        ['Play three days', `One day is too short. Now the game lasts three days. A box called day counts 1, 2, 3. When it is bigger than 3, the loop stops.

The question ask{2} is inside the loop, so the game asks left or right again every day. All the lines pushed to the right belong to the loop.`, `Day 1
(a way and some luck)
Day 2
(a way and some luck)
Day 3
(a way and some luck)`, `Change until day > 3 to until day > 5 and play five days.`, `Do not forget set day = day + 1, or the game never ends.`],
        ['The end of the game', `At the end the game tells you what happened. It shows how many coins you found. Then two small choices say if you are rich: more than 10 coins, or not.

This is a whole game! It has questions, choices, luck, a loop and a box that counts. You used almost everything from the lessons.`, `Ada found 15 coins.
You are rich!`, `Play it three times. Can you get more than 10 coins?`, ``],
        ['Make it your own', `Real programmers never stop at the first version. Here are some ideas to make the game yours:

Change the story and the words. Add a third way with one more question. Make the prize bigger. Add a rare treasure with one more random block.

When you are happy, press Save to keep your game as a .kv file. Show it to your family and your friends!`, `Your own game!`, `Change at least three things in the game. Then press Save.`, `If something breaks, look in the Problems box. It tells you the line.`]
      ]]
    ]
  },

  it: {
    ui: {
      lesson: 'Lezione', step: 'passo', of: 'di', steps: 'passi',
      lineByLine: 'Riga per riga', see: 'Cosa vedrai', turn: 'Tocca a te', slip: 'Attenzione',
      typeIt: 'Scrivilo tu', putIt: 'Mettilo nell\'editor', typeNote: 'Pagina vuota pronta. Scrivi le righe che vedi nella lezione, poi premi Esegui.',
      listen: 'Ascolta', stopReading: 'Ferma la lettura'
    },
    explain: {
      start: 'Il programma inizia qui.',
      end: 'Il programma finisce qui.',
      note: 'Una nota per le persone. Il computer la salta.',
      print: 'Mostra questo sullo schermo.',
      printEmpty: 'Non mostra niente: dopo print non c\'è testo.',
      askDef: 'Scrive la domanda {n}. Non la fa ancora.',
      ask: 'Fa adesso la domanda {n} e aspetta una risposta scritta.',
      keyDef: 'Sceglie il tasto da aspettare.',
      keyIf: 'Aspetta quel tasto, poi fa la domanda.',
      fnDef: 'Inizia un tuo nuovo comando, chiamato {name}. Le righe spostate a destra sono ciò che fa.',
      pick: 'Crea una scatola chiamata {name} e ci mette una scelta a caso.',
      define: 'Crea una scatola chiamata {name} e ci mette un valore.',
      set: 'Mette un nuovo valore nella scatola. Il vecchio valore sparisce.',
      ifInline: 'Se il controllo è vero, fa l\'azione sulla stessa riga.',
      askNow: 'Fa subito la domanda e mette la risposta nella scatola.',
      ifCall: 'Se il controllo è vero, fa girare il comando sulla stessa riga.',
      newLine: 'Il \\n dentro il testo va a capo.',
      ifBlock: 'Controlla qualcosa. Le righe spostate a destra sotto vengono eseguite solo se è vero.',
      else: 'Altrimenti: queste righe vengono eseguite se il controllo sopra era falso.',
      repeat: 'Fa le righe spostate a destra qui sotto ancora e ancora, tante volte.',
      until: 'Continua a fare le righe spostate a destra finché questo diventa vero. Controlla prima di ogni giro.',
      breakIt: 'Esce subito dal ciclo.',
      random: 'Una possibilità nell\'estrazione, su 100. Solo uno dei blocchi vicini viene eseguito.',
      returnIt: 'Rimanda questo valore al punto in cui è stato usato il comando.',
      append: 'Aggiunge un valore alla fine della lista.',
      forEach: 'Passa la lista, un elemento alla volta. Le righe rientrate girano una volta per ogni elemento, e il nome contiene l’elemento.',
      upper: 'Rende grandi tutte le lettere.',
      lower: 'Rende piccole tutte le lettere.',
      trim: 'Toglie gli spazi ai due estremi.',
      part: 'Prende un pezzo del testo, da una posizione all’altra.',
      split: 'Spezza il testo dove c’è il separatore e dà una lista.',
      join: 'Incolla i pezzi di una lista, mettendo questo testo in mezzo.',
      whole: 'Divide e tiene solo la parte intera, senza quello che viene dopo la virgola.',
      rest: 'Dà quello che avanza dopo una divisione intera.',
      value: 'Stampa uno dei tre valori semplici del linguaggio: true, false o nothing.',
      compare: 'Calcola prima il controllo, e print mostra la risposta: true o false.',
      nothingValue: 'Mette il valore vuoto nella scatola: non le è ancora stato dato niente.',
      nestedList: 'Una lista di liste: ogni riga è una lista per conto suo.',
      appendRow: 'Aggiunge una riga intera in fondo alla tabella.',
      twice: 'Legge prima la riga, poi l’elemento dentro quella riga.'
    },
    lessons: [
      ['Conosci l\'editor', 'Un giro prima di iniziare', [
        ['Il tuo spazio di lavoro', `Qui scriverai i programmi. Un programma è una lista di istruzioni per il computer, come una ricetta è una lista di istruzioni per cucinare.

Il grande riquadro bianco è dove scrivi. Il riquadro nero a destra si chiama Risultato: è come lo schermo del computer e mostra cosa dice il tuo programma. Il riquadro sotto è Problemi: ti dice quando qualcosa non va, e dice sempre in quale riga.`, `La parola Ciao! compare nel riquadro nero del Risultato.`, `Premi il pulsante verde Esegui in alto a destra.`, ``],
        ['Esegui, Ferma e Salva', `Esegui fa partire il programma. Ferma lo interrompe, se non finisce mai. Salva mette il programma sul tuo computer come file che finisce con .kv, così lo tieni per sempre. Apri riporta un file salvato. Nuovo ti dà una pagina vuota.

La pagina ricorda il tuo lavoro anche da sola, ma un file salvato è più sicuro.`, `Ciao di nuovo!`, `Premi Salva e trova il file nella cartella Download. Poi premi Nuovo e poi Apri per riportare il programma.`, ``],
        ['Come funzionano le lezioni', `Ogni lezione è fatta di piccoli passi. In ogni passo leggi cosa significa un'idea, vedi il codice con una breve nota accanto a ogni riga, e poi provi.

Ci sono due pulsanti. Scrivilo tu ti dà una pagina vuota, così scrivi le righe. Scrivere è il modo in cui si impara davvero. Mettilo nell'editor inserisce il codice già pronto.

Se ti blocchi non si rompe niente. Kaviel non si blocca mai: ti dice cosa non va e continua.`, `So scrivere codice!`, `Premi Scrivilo tu, scrivi le tre righe che vedi a sinistra e premi Esegui.`, `Scrivi le righe esattamente. Virgolette e spazi contano.`]
      ]],
      ['Saluta', 'Il tuo primo programma', [
        ['Fai parlare il computer', `I computer fanno esattamente quello che dici loro, un'istruzione dopo l'altra, dall'alto verso il basso. Ogni istruzione è una riga.

Ogni programma Kaviel inizia con la parola start e finisce con la parola end, come un panino con il pane da entrambi i lati. In mezzo, la parola print dice al computer di mostrare qualcosa sullo schermo.`, `Ciao!`, `Eseguilo. Poi cambia Ciao! con una tua parola e riesegui.`, `Scrivi bene print. Se scrivi prnt, Kaviel te lo dice e salta quella riga.`],
        ['Di\' più di una cosa', `Ogni riga print mostra una nuova riga di testo. Il computer le fa in ordine, come quando leggi un libro dall'alto in basso.

L'ordine conta. Se scambi due righe, anche le parole escono scambiate.`, `Ciao!
Mi chiamo Kaviel.
Piacere di conoscerti.`, `Aggiungi una riga che dice il tuo nome. Poi scambia due righe e guarda cosa succede.`, ``],
        ['Le parole vanno tra virgolette', `Le parole si chiamano testo, e il testo si scrive sempre tra virgolette doppie, così: "ciao". Le virgolette dicono al computer: queste lettere sono solo parole, non un comando.

I numeri sono diversi. Non vogliono le virgolette. E il computer sa fare i conti: scrivi 2 + 3 e mostra 5.`, `Sto imparando a programmare.
7
5`, `Cambia il 7 con la tua età. Poi prova print 100 - 1.`, `Se dimentichi le virgolette, come in print Ciao, Kaviel pensa che Ciao sia il nome di una scatola e ti dice di usare le virgolette.`],
        ['Note per le persone', `A volte vuoi lasciare un messaggio dentro il codice, per te o per un amico, senza che il computer lo legga. Inizia la riga con # e il computer la salta.

I bravi programmatori scrivono note di continuo, per ricordarsi dopo perché hanno scritto qualcosa.`, `La nota qui sopra è invisibile.`, `Scrivi una tua nota con # all'inizio. Eseguilo: il risultato non cambia.`, ``],
        ['Una riga vuota', `A volte vuoi uno spazio tra due cose che dici, come tra due paragrafi. print nothing fa dire al computer una riga vuota.

nothing è una parola del linguaggio e vuol dire "nessun valore". La ritroverai nella lezione 6.`, `Ciao!

A presto!`, `Metti una riga vuota tra due righe tue.`, `Non scrivere print da solo su una riga: Kaviel dice che print ha bisogno di qualcosa da mostrare. Scrivi print nothing.`]
      ]],
      ['Nomi e scatole', 'Ricorda le cose per dopo', [
        ['Una scatola con un nome', `Immagina una scatola con un'etichetta. Puoi metterci dentro qualcosa e dopo chiederla leggendo l'etichetta. La parola define crea una scatola nuova.

Qui l'etichetta è name e dentro la scatola c'è la parola Ada. Dopo, ogni volta che scrivi name, il computer apre la scatola e usa quello che c'è dentro.`, `Ada
Ciao Ada`, `Metti il tuo nome nella scatola.`, `Usa define una sola volta per ogni scatola. Per cambiarla dopo usa set (passo successivo).`],
        ['Cambia cosa c\'è dentro', `set mette qualcosa di nuovo in una scatola che ha già un'etichetta. La cosa vecchia viene buttata e quella nuova prende il suo posto.

Pensa a un tabellone dei punti: quando qualcuno segna, il numero cambia, ma il tabellone è sempre lo stesso.`, `Adesso: 7
Anno prossimo: 8`, `Aggiungi un altro set che salta avanti di dieci anni.`, `Se usi set su una scatola che non esiste, Kaviel la crea e ti avvisa. Di solito è un errore di battitura.`],
        ['Fai i conti', `Il computer è velocissimo con la matematica. + somma, - sottrae, * moltiplica e / divide. Il segno % dà quello che resta dopo una divisione: 10 % 3 fa 1, perché 3 sta tre volte in 10 e resta 1.

La stella * vuol dire per, perché la lettera x sembra una lettera qualsiasi.`, `15
5
50
2
1`, `Prova un conto grande, come 123 * 456.`, `Dividere per zero è impossibile. Kaviel te lo dice e va avanti.`],
        ['Mescola parole e scatole', `print può mostrare tante cose in una riga, una dopo l'altra. Parole, numeri e scatole si possono mescolare. Il computer mette uno spazio in mezzo.

Se vuoi attaccare i pezzi senza spazio, usa +, come in "Bau" + "!".`, `Il mio animale è un cane
Ha 4 zampe.
Zampe di 3 animali: 12
Bau!!`, `Cambia l'animale in un uccello e le zampe in 2.`, `Un + tra parole le attacca senza nessuno spazio.`]
      ]],
      ['Fai domande', 'Parla con chi usa il tuo programma', [
        ['Prepara una domanda, poi falla', `Per parlare con chi usa il tuo programma servono due passi. Prima scrivi la domanda: define ask{1} scrive la domanda numero 1 ma non la fa ancora. Poi ask{1} la fa davvero e aspetta.

Quando lo esegui, nel Risultato compare una casella. Scrivi la risposta e premi Invio. La risposta viene salvata, e answer{1} serve per rileggerla.`, `Come ti chiami? Ada
Ciao Ada`, `Eseguilo e scrivi il tuo nome.`, `Le parentesi graffe { } fanno parte del nome. Non sono parentesi tonde.`],
        ['Due domande', `Ogni domanda ha il suo numero, così le risposte non si mescolano. La domanda 1 va con answer{1}, la domanda 2 va con answer{2}.

Puoi farle in qualsiasi ordine. Il numero è ciò che collega una domanda alla sua risposta.`, `Il tuo nome? Ada
La tua città? Rome
Ada vive a Rome`, `Aggiungi una terza domanda sul tuo cibo preferito.`, ``],
        ['Sotto i 18 o sopra i 18', `Kaviel ha due parole speciali per confrontare i numeri: under e over. under 18 vuol dire più piccolo di 18. over 18 vuol dire più grande di 18, quindi 18 non è né sotto né sopra. Una terza parola, is, chiede esattamente quel numero: answer{1} = is 18.

Le righe qui sotto sono il modo corto di scrivere una scelta. Si leggono come in inglese: se la risposta è under 18, stampa questo.`, `Scrivi 10: Hai meno di 18 anni.
Scrivi 18: Hai 18 anni o più.`, `Eseguilo due volte. Una con 10, una con 18.`, `Se scrivi una parola invece di un numero, Kaviel dice che non è un numero e continua.`],
        ['Trasforma una risposta in numero', `Una risposta è sempre testo, anche se scrivi cifre. Testo e numeri sono cose diverse. Se aggiungi 1 al testo "5" ottieni 51, perché il computer li attacca.

number() trasforma il testo in un vero numero. Dopo, la matematica funziona bene.

Per confrontare non serve: = legge il numero dentro il testo, quindi answer{1} = 18 funziona.`, `Scrivi 4:
Il doppio è 8
Più dieci fa 14`, `Fai stampare il numero per 100.`, `number() funziona solo se il testo è davvero un numero.`],
        ['Una domanda in una riga', `Finora una domanda occupava tre righe. Quando hai una domanda sola c'è una via più corta: ask con le parentesi fa la domanda subito e ti restituisce quello che la persona ha scritto.

La risposta è sempre testo, anche se la persona scrive un numero.`, `Come ti chiami? Ada
Ciao Ada`, `Chiedi il colore preferito e ripetilo.`, `La domanda va tra virgolette, come ogni testo. Finiscila con uno spazio, così la risposta non la tocca.`]
      ]],
      ['Fai scelte', 'Lascia decidere il programma', [
        ['Se questo, allora quello', `Un programma può scegliere. if guarda qualcosa ed esegue le righe sotto solo se è vero. Quelle righe sono spostate a destra di due spazi. Il tasto Tab lo fa per te.

L'ultimo print non è spostato a destra, quindi viene sempre eseguito, qualunque cosa succeda sopra.`, `Hai vinto!
Bravo.
Il gioco è finito.`, `Cambia il punteggio in 3. Quali righe spariscono?`, `Se dimentichi di spostare le righe a destra, Kaviel ti avvisa che sotto l'if non c'è niente.`],
        ['Altrimenti', `else è l'altra strada. Quando il controllo è falso, vengono eseguite le righe sotto else. Si prende una sola strada, mai tutte e due.

Pensa a un bivio: vai a sinistra se il controllo è vero, a destra se è falso.`, `Riprova.`, `Trova un punteggio che fa dire Hai vinto!`, `Scrivi else subito dopo le righe dell'if, allo stesso livello dell'if.`],
        ['Scegli su una riga', `Quando il lavoro è piccolo puoi scrivere tutto su una riga. Un secondo = mette l'azione sulla stessa riga del controllo. Leggilo così: se l'età è 16, allora stampa.

Il primo = nella riga vuol dire uguale. Il secondo = separa solo il controllo dall'azione.`, `Esattamente sedici
Più piccolo`, `Cambia l'età in 25 ed eseguilo.`, ``],
        ['Confronta le parole', `Si possono confrontare anche le parole. Un solo = chiede: queste due cose sono esattamente uguali? Maiuscole e minuscole contano, quindi "Red" e "rosso" sono diverse.

Come un semaforo: se il colore è rosso, fermati. Altrimenti, vai.`, `Fermo!`, `Cambia rosso in verde e riesegui.`, `Le parole tra virgolette devono essere identiche, maiuscole comprese.`],
        ['And, or, not', `A volte un solo controllo non basta. and vuole che entrambi i controlli siano veri. or ne vuole almeno uno. not trasforma vero in falso.

In questo programma 9 è più di 5 e meno di 13, quindi il primo controllo passa. L'età non è dieci, quindi passa anche l'ultimo.`, `Sei un bambino.
Non hai dieci anni.`, `Prova età 2, poi età 95. Quali righe compaiono?`, `Le parentesi rendono chiaro: not (age = 10). Senza funziona uguale, perché not legge tutto il confronto che segue.`]
      ]],
      ['Vero, falso e niente', 'Sì, no e vuoto', [
        ['Sì e no', `Un controllo non è solo qualcosa che leggi: il computer risponde con true o false. 5 > 3 è true, e 5 < 3 è false.

Queste due parole sono valori, come i numeri e i testi. Puoi metterle in una scatola, stamparle o confrontarle con qualcos’altro.`, `true
false
true`, 'Stampa la risposta a 10 > 2, poi quella a 2 > 10.', `true e false si scrivono senza virgolette e senza maiuscola.`],
        ['Il valore che non c’è', `A volte una scatola esiste ma non ci hai ancora messo niente. Quel valore si chiama nothing e vuol dire "nessun valore".

Stamparlo dà una riga vuota, e puoi chiedere se una scatola lo contiene ancora. È così che un programma dice "qui non ho niente".`, `
true
Ada`, 'Crea una seconda scatola con nothing dentro e stampala.', `nothing non è il testo "nothing": tra virgolette diventa una parola che si vede.`]
      ]],
      ['Ancora e ancora', 'I cicli ripetono il lavoro per te', [
        ['Ripeti qualche volta', `Un ciclo fa la stessa cosa ancora e ancora, così non devi scrivere la stessa riga tante volte. repeat 3 esegue tre volte le righe spostate a destra.

L'ultimo print non è spostato a destra, quindi viene eseguito una volta sola, quando il ciclo è finito.`, `La la la! (tre volte)
Era una canzone.`, `Fallo cantare 10 volte.`, `Le righe del ciclo devono essere spostate a destra. Altrimenti vengono eseguite una volta sola.`],
        ['Continua finché', `until continua a ripetere finché qualcosa diventa vero. Prima di ogni giro chiede: è già vero? Se sì, si ferma. Se no, rifà le righe.

Dentro, set n = n + 1 aggiunge uno a n a ogni giro. Senza, n non cambierebbe mai e il ciclo non finirebbe. In quel caso c'è il pulsante Ferma, e Kaviel ferma da solo i programmi che non finiscono.`, `n vale 1
n vale 2
... fino a n vale 5
Fatto`, `Cambia 5 in 10.`, `Dentro un ciclo until cambia sempre qualcosa, o non finisce mai.`],
        ['Conta con un ciclo', `Un ciclo e una scatola fanno un contatore. La scatola n parte da 1. A ogni giro stampa una riga della tabellina del sette e poi aggiunge 1 a n.

Con poche righe ottieni dieci righe di risultato. Cambi un numero e cambia tutta la tabellina.`, `1 x 7 = 7
2 x 7 = 14
... fino a 10 x 7 = 70`, `Cambia il 7 con il tuo numero preferito.`, ``],
        ['Esci prima', `break salta fuori dal ciclo subito. Serve quando hai già trovato quello che cercavi.

Il ciclo potrebbe contare fino a 100, ma si ferma al primo numero il cui quadrato è maggiore di 50.`, `Il primo numero con il quadrato sopra 50 è 8`, `Cambia 50 in 200.`, ``]
      ]],
      ['Fortuna', 'Dadi, monete e sorprese', [
        ['Scegli una cosa', `pick sceglie una cosa dalla lista che scrivi, del tutto a caso. Ogni cosa ha la stessa probabilità. Essendo casuale, ogni Esegui può dare una risposta diversa.

I giochi usano la fortuna di continuo: dadi, carte, forzieri del tesoro.`, `Oggi sei un gatto
(o cane, gufo, volpe: cambia)`, `Eseguilo cinque volte. Poi aggiungi il tuo animale preferito alla lista.`, `Separa le cose con le virgole.`],
        ['Lancia una moneta', `Una moneta ha due facce, quindi scegli tra due cose. Nessuno può indovinare il risultato.

Eseguilo tante volte: testa e croce dovrebbero uscire circa metà delle volte ciascuna.`, `La moneta dice testa
(oppure croce)`, `Eseguilo dieci volte. È giusta?`, ``],
        ['Tira un dado', `Puoi scegliere anche numeri. Un dado normale ha sei facce, quindi scegliamo da 1 a 6.

L'ultima riga è una scelta su una riga: se il dado è 6, stampa Fortunato!`, `Hai fatto 4
(cambia, e Fortunato! compare solo con il 6)`, `Cambialo in un dado a 20 facce.`, ``],
        ['Probabilità ingiuste', `A volte vuoi che certe cose siano rare. Un blocco random ha un numero: la sua probabilità su 100. Blocchi vicini sono una sola estrazione, e ne viene eseguito uno solo.

Qui il sassolino esce 80 volte su 100, la moneta 19 volte, e il diamante solo una.`, `Apro la scatola magica...
Solo un sassolino. (quasi sempre)`, `Rendi il diamante più comune, ma tieni il totale a 100.`, `Le probabilità devono sommare 100. Se no Kaviel ti avvisa e sistema i numeri.`]
      ]],
      ['I tuoi comandi', 'Dai un nome a qualche riga', [
        ['Crea un comando', `Un comando tuo è una piccola macchina che costruisci. Ha un nome, prende qualcosa dentro e restituisce qualcosa. Scrivi define, un nome e le parentesi con quello che prende.

return rimanda indietro la risposta. Dopo, greet("Ada") funziona come un comando Kaviel nuovo di zecca, e puoi usarlo quante volte vuoi.`, `Ciao Ada!
Ciao Luca!`, `Saluta il tuo migliore amico.`, `Le righe del comando devono essere spostate a destra sotto define.`],
        ['Più di un ingresso', `Un comando può prendere più cose. Mettile tra parentesi, separate da virgole. Questi nomi esistono solo dentro il comando, come gli attrezzi dentro una cassetta.

Quando chiami area(3, 4), width diventa 3 e height diventa 4.`, `Una stanza 3 per 4 misura 12 metri quadrati
Un campo 10 per 10 misura 100`, `Trova l'area di un giardino 25 per 8.`, `Dai il numero giusto di ingressi. Troppo pochi o troppi sono un errore.`],
        ['Comandi che usano comandi', `Un comando può usarne un altro. Pezzi piccoli fanno programmi grandi.

Qui quadruple usa double due volte: 5 diventa 10, e 10 diventa 20.`, `20`, `Crea un comando che triplica un numero.`, ``],
        ['Un comando che richiama se stesso', `Un comando può richiamare se stesso, un po' come stare tra due specchi.

Funziona solo se ogni chiamata si avvicina a una fine. Qui factorial(5) è 5 per factorial(4), e così via fino a factorial(0), che fa semplicemente 1. Quella è la fine.`, `5! fa 120`, `Prova factorial(10).`, `Metti sempre un caso finale. Senza, il comando si richiamerebbe per sempre. Kaviel lo ferma dopo 128 chiamate.`],
        ['Un comando che fa qualcosa', `Un comando non deve per forza restituire una risposta. Può anche solo fare cose, come print. Allora non c'è return.

Puoi chiamarlo dall'if su una riga: if birthday = cheer("Ada") fa girare il comando solo quando birthday è vero. Funziona quando sotto la riga non ci sono righe rientrate.`, `Evviva Ada
Fine`, `Metti birthday a false e riesegui. Cosa cambia?`, `Se sotto l'if metti righe rientrate, il = diventa un confronto. Una riga da sola vuol dire: fai questo.`]
      ]],
      ['Liste', 'Tante cose in un posto', [
        ['Una lista di cose', `Una scatola può tenere una cosa. Una lista è una scatola con tanti posti, uno dopo l'altro. Si fa con le parentesi quadre e le virgole.

Ogni posto ha un numero. Il primo posto è 1, il secondo è 2. Chiedi il primo con pets[1]. length conta quante cose ci sono.`, `Primo: gatto
Ultimo: volpe
Tutti: ["gatto", "cane", "volpe"]
Quanti: 3`, `Stampa il secondo animale.`, `Qui i posti si contano da 1, non da 0.`],
        ['Aggiungi e cambia', `append mette una cosa nuova alla fine della lista. set può cambiare un posto: set pets[1] = "leone" sostituisce il primo elemento.

La lista cresce con append. Con set mantiene la stessa lunghezza.`, `["leone", "cane", "gufo"]`, `Aggiungi altri due animali.`, `Chiedere un posto che non esiste, come pets[10], è un errore. Ti dice la lunghezza vera.`],
        ['Visita ogni elemento', `Per fare qualcosa con ogni elemento di una lista usa un ciclo con un contatore. i parte da 1 e sale di uno a ogni giro, finché supera la lunghezza della lista.

pets[i] vuol dire l'elemento al posto i, quindi il ciclo mostra ogni animale, uno dopo l'altro.`, `1 gatto
2 cane
3 gufo`, `Aggiungi un animale alla lista. Il ciclo funziona ancora?`, ``],
        ['Uno alla volta', `for each ti dà un elemento alla volta, con il nome che scegli tu. Niente contatore, niente posizione, niente length. Si legge come la frase che diresti ad alta voce, e break esce prima.`, `cat
dog
owl`, `Aggiungi un quarto animale. Nota che non cambia nient'altro.`, ``],
        ['Somma una lista', `Una scatola può raccogliere un totale mentre il ciclo visita ogni numero. total parte da 0. A ogni giro gli viene aggiunto il prezzo corrente.

È la stessa idea di una cassa del negozio che somma quello che compri.`, `Totale: 20`, `Aggiungi un altro prezzo alla lista.`, ``],
        ['Scegli da una lista', `Nella lezione 8 pick sceglieva tra cose scritte una per una. Quando le cose sono già in una lista, scrivi pick e il nome della lista.

Ogni elemento ha la stessa possibilità, e a ogni esecuzione la risposta può cambiare.`, `Oggi sei un cane
(potrebbe essere un gatto o una volpe: cambia ogni volta)`, `Aggiungi altri due animali alla lista e riesegui cinque volte.`, `Scrivi pick pets senza virgolette: pets è il nome della scatola che contiene la lista.`]
      ]],
      ['Liste dentro le liste', 'Una tabella in una lista', [
        ['Una lista di liste', `Una lista può contenere qualsiasi cosa, anche altre liste. Due parentesi fanno una riga, e una lista di righe fa una tabella.

La leggi con due posizioni: prima la riga, poi l’elemento dentro quella riga. grid[2][1] vuol dire seconda riga, primo elemento.`, `[[1, 2], [3, 4]]
3`, 'Cambia il 4 in 9 con set, poi stampa tutta la griglia.', `grid[2][1] è 3, non 2: prima viene la riga.`],
        ['Una tabella di giocatori', `Ecco come si fa una classifica: una lista, e una lista piccola per ogni giocatore. append aggiunge una riga alla lista esterna, e for each passa le righe una per una.

Dentro ogni riga leggi il nome e i punti. Un’idea sola, usata due volte, e hai una tabella.`, `Ada 10
Luca 7`, 'Aggiungi un terzo giocatore con 12 punti.', `append aggiunge una riga alla lista esterna. Per cambiare un punto dentro una riga, usa set row[2] = 12.`]
      ]],
      ['Parole e lettere', 'Gioca con il testo', [
        ['Lettere grandi, lettere piccole', `Il computer può cambiare la dimensione delle lettere. upper rende ogni lettera grande, lower la rende piccola.

Nessuno dei due cambia il testo di partenza: ti danno un testo nuovo, e la parola da cui sei partito resta com'era.`, `KAVIEL
kaviel`, 'Stampa il tuo nome in lettere piccole.', `upper e lower vogliono un testo. upper(5) è un errore.`],
        ['Taglia gli spazi', `Quando una persona scrive una risposta, spesso entrano degli spazi all’inizio o alla fine. Tu non li vedi, il computer sì, e due testi che sembrano uguali smettono di esserlo.

trim toglie quegli spazi. È la prima cosa da fare con una risposta che vuoi confrontare.`, `[Ada]`, 'Togli trim, esegui di nuovo e guarda le parentesi.', `trim toglie gli spazi solo ai due estremi, mai quelli in mezzo.`],
        ['Prendi un pezzo', `part taglia un pezzo da un testo. Gli dai il testo, la posizione dove comincia il pezzo e quella dove finisce, e contano tutte e due.

Le posizioni partono da 1, come nelle liste, quindi la prima lettera è alla posizione 1 e non 0.`, `Kaviel
iel`, 'Stampa le prime quattro lettere della parola.', `Se chiedi una posizione più grande del testo, Kaviel ti dice quante lettere ci sono.`],
        ['Dividi e riunisci', `split spezza un testo dove trova un separatore e ti dà una lista. join fa il contrario: prende una lista e un pezzo di testo, e incolla i pezzi mettendo quel testo in mezzo.

Due parole, un’idea sola: i pezzi e il tutto. È così che una chat trasforma una frase in parole.`, `["a", "b", "c"]
a-b-c
3`, 'Dividi una tua frase sullo spazio e riuniscila con un segno più.', `Il separatore deve essere almeno un carattere, quindi split(text, "") è un errore.`],
        ['A capo e virgolette', `Dentro un testo vivono due piccoli trucchi. \\n vuol dire "vai a capo qui", così un solo print può mostrare due righe. E \\" mette un vero segno di virgolette dentro il testo senza chiuderlo.

La barra rovesciata \\ dice a Kaviel che la lettera dopo è speciale. Pende dall'altra parte rispetto alla barra normale /.`, `Ada
Luca
"Kaviel"`, `Stampa il tuo nome e la tua età su due righe con un solo print.`, `La barra rovesciata pende a sinistra: \\ . La barra normale / non fa niente di speciale.`]
      ]],
      ['Numeri interi', 'Senza virgola', [
        ['Due barre', `Una divisione con una barra dà la risposta esatta, e può avere una parte dopo la virgola: 7 / 2 fa 3,5.

Con due barre tieni solo la parte intera: 7 // 2 fa 3. Si chiama divisione intera, ed è quella che serve per contare le cose: mezza sedia non esiste.`, `3.5
3`, 'Prova 9 // 3 e 10 // 3.', `Non scrivere // quando vuoi la risposta esatta.`],
        ['Quello che avanza', `Il segno di percento dà quello che resta dopo una divisione intera. 7 % 2 fa 1, perché il 2 sta tre volte nel 7 e avanza 1.

È il modo più rapido per chiedere "questo numero è pari?": se è pari, il resto della divisione per 2 è 0.`, `1
0`, 'Stampa il resto di 10 diviso 3.', `Il segno segue il lato sinistro: -7 % 2 fa -1, non 1.`],
        ['Una media intera', `Ora puoi fare quello che fa un negozio: sommare i prezzi, dividere per quanti sono, e tenere numeri interi.

total // count dà la media senza niente dopo la virgola, che è quello che vuoi quando la risposta deve essere una moneta intera.`, `3`, 'Cambia total in 20 e riesegui. Poi prova 17 / 5 per vedere la differenza.', `Se count è 0, Kaviel rifiuta di dividere e ti dice perché.`]
      ]],
      ['Numeri con la virgola', 'Non solo interi', [
        ['Una parte dopo la virgola', `Non tutte le risposte sono intere. Con una sola barra una divisione può dare una parte dopo la virgola: 10 / 4 fa 2,5.

Kaviel scrive quella parte con il punto e non con la virgola, così lo stesso programma gira uguale su ogni computer. Tu puoi scrivere la virgola: viene capita.`, `4.5
2.5
0.3`, 'Stampa 7 / 2 e 7 // 2 insieme, e guarda la differenza.', `Due barre danno un numero intero; una barra dà la risposta esatta.`],
        ['Sotto lo zero', `Un numero può essere più piccolo di zero. Scrivi un meno davanti: -5 è cinque sotto zero, come una temperatura d’inverno.

Due meno fanno un più: -3 * -2 fa 6. È la stessa regola di un debito cancellato due volte che diventa denaro.`, `-3
-7
6`, 'Stampa una temperatura che parte da 3 e scende di 8.', `Il resto segue il segno del lato sinistro: -7 % 2 fa -1, non 1.`]
      ]],
      ['Disegna con le lettere', 'Forme', [
        ['Una fila di stelle', `Un testo può crescere. Parti da un testo vuoto, "", e aggiungi una stella a ogni giro: dopo cinque giri hai una fila di cinque stelle.

È così che un computer disegna quando non c’è un programma per disegnare: con le lettere, una dopo l’altra.`, `*****`, 'Fai una fila di venti stelle.', `Un testo vuoto è "" — due virgolette con niente in mezzo.`],
        ['Un triangolo', `Metti il testo che cresce dentro un ciclo che gira una volta in più a ogni giro, e stampalo ogni volta: ottieni un triangolo.

Sono le stesse due idee di prima, un testo che cresce e un ciclo che continua, e il disegno viene da sé.`, `*
**
***
****
*****`, 'Fai crescere il triangolo di due stelle alla volta.', `Se un ciclo non finisce, premi Esc per fermarlo. Kaviel lo ferma da solo dopo un po’.`],
        ['Una cornice intorno a un nome', `join ripete una cosa: tre pezzi di tre trattini, incollati senza niente in mezzo, danno una barra di nove trattini.

Con una barra sopra e una sotto hai un cartello. Un computer disegna ogni figura così: pezzi piccoli, ripetuti nell’ordine giusto.`, `---------
Ada
---------`, 'Fai la cornice più larga e mettici dentro il tuo nome.', `join vuole una lista di testi. I numeri nella lista diventano testo da soli.`]
      ]],
      ['Premi un tasto', 'Aspetta la tastiera', [
        ['Aspetta un tasto', `Finora la persona scriveva una risposta intera e premeva Invio. A volte vuoi solo la pressione di un tasto, come Premi un tasto per iniziare in un gioco.

define keypress{1} = C sceglie il tasto C. La riga if aspetta che quel tasto venga premuto, poi fa la domanda. Gli altri tasti vengono ignorati.`, `Premi C per continuare.
(non succede niente finché non premi C)
Come ti chiami?`, `Eseguilo. Prima premi un tasto sbagliato. Poi premi C.`, `Clicca prima sulla pagina, così i tasti arrivano a lei.`],
        ['Altri tasti', `Oltre alle lettere puoi aspettare questi tasti: Enter, Space, Escape, Tab e le frecce ArrowUp, ArrowDown, ArrowLeft e ArrowRight.`, `Premi Space per iniziare.
Il tuo colore preferito?`, `Cambia Space in Enter.`, `Scrivi il nome del tasto con le stesse maiuscole.`]
      ]],
      ['Crea un gioco', 'Metti tutto insieme', [
        ['Indovina il numero', `Adesso mettiamo tutto insieme. Il computer sceglie un numero segreto con pick. Tu provi finché lo trovi. Il ciclo continua finché il tuo tentativo è uguale al segreto.

Dentro il ciclo: fai la domanda, trasforma la risposta in numero, conta un tentativo in più e dai un indizio se il numero è troppo grande o troppo piccolo.`, `Indovina un numero da 1 a 10: 5
Troppo piccolo.
... e così via, fino a
Ci sei riuscito in 3 tentativi!`, `Fai arrivare il numero segreto fino a 20.`, `number(answer{1}) è importante. Senza, la risposta è testo, e il testo non si confronta come un numero.`],
        ['Un quiz con i punti', `Una scatola chiamata points conta le risposte giuste. Parte da 0. Ogni risposta giusta aggiunge 1 con set points = points + 1.

Alla fine print mostra il totale. Le righe vuote servono solo a rendere il programma più leggibile.`, `Giusto!
Giusto!
Hai preso 2 su 2.`, `Scrivi una terza domanda tua e dai punti anche per quella.`, `Le risposte si confrontano come testo, quindi scrivile esatte: "4" e "verde".`],
        ['Sasso, carta, forbici', `È un programma più grande, quindi leggilo piano, un blocco alla volta. Il computer sceglie con pick. Tu scrivi la tua scelta. Poi, per ogni cosa che potevi scegliere, c'è un blocco che decide chi ha vinto.

I grandi blocchi if hanno righe if più piccole spostate a destra dentro. È permesso: scelte dentro le scelte.`, `Io ho scelto carta
(cambia) poi Hai vinto!, Ho vinto io! oppure Pareggio!`, `Alla fine aggiungi una riga che dice cosa succede se scrivi altro.`, `Scrivi le parole esatte: sasso, carta o forbici, in minuscolo.`]
      ]],
      ['Errori', 'Capitano. Va bene così.', [
        ['Un errore di battitura', `Tutti sbagliano, anche chi programma per lavoro. Molti programmi si bloccano quando qualcosa non va. Kaviel no: salta la riga rotta, te lo dice e continua.

Guarda il riquadro Problemi dopo aver eseguito. Mostra il numero della riga e dice cosa pensa che volevi scrivere.`, `Ciao!
Ma questa funziona ancora.
(e un problema alla riga 3)`, `Clicca il problema per saltare alla riga. Poi correggi l'errore.`, ``],
        ['Un nome che non esiste', `Una scatola va creata con define prima di usarla. Se scrivi un nome che non esiste, Kaviel cerca nomi simili e te ne suggerisce uno. Qui agee ha una lettera in più.

Leggere i messaggi di errore è una vera abilità. Sono dalla tua parte.`, `Corretto: 8
(e un problema alla riga 3)`, `Correggi la riga togliendo la e in più.`, ``],
        ['Un conto impossibile', `Certe cose non si possono fare, come dividere per zero. Il programma te lo dice, salta quella riga e va alla successiva. Non si ferma niente.

È l'idea grande di Kaviel: un errore non è la fine. Vedi sempre cosa è successo e dove.`, `5
Sto ancora andando!
(e un problema alla riga 3)`, `Cambia lo 0 in 5. Il problema sparisce.`, ``]
      ]],
      ['Il tuo grande progetto', 'Costruisci un gioco del tesoro, passo dopo passo', [
        ['Inizia la storia', `Ora costruirai un vero gioco, un pezzetto alla volta. È una caccia al tesoro su un'isola. Dopo ogni passo il gioco diventa più grande, e funziona sempre.

Il primo pezzo è un benvenuto. Il gioco chiede il tuo nome e poi ti saluta. Sai già tutto quello che serve.`, `Come ti chiami? Ada
Benvenuto sull'isola, Ada
Trova più monete che puoi.`, `Premi Scrivilo tu, scrivi il programma ed eseguilo. Poi cambia la storia: usa un altro posto invece di un'isola.`, ``],
        ['Scegli una strada', `Un bel gioco fa scegliere chi gioca. Ora aggiungiamo una seconda domanda: sinistra o destra. Il gioco dice una cosa diversa per ogni risposta.

Usa if ed else, come nella lezione sulle scelte.`, `Quale strada: sinistra o destra? sinistra
Entri in una grotta.`, `Eseguilo due volte: una con sinistra, una con destra. Poi cambia la grotta in qualcos'altro.`, `Scrivi sinistra in minuscolo, proprio come nel programma.`],
        ['Aggiungi fortuna e monete', `Ora il gioco diventa emozionante. Una scatola chiamata coins parte da 0. Poi un blocco random dà 70 possibilità su 100 di trovare 5 monete e 30 su 100 di incontrare un granchio.

set coins = coins + 5 aggiunge 5 alla scatola. I due blocchi random sono vicini, quindi ne succede uno solo.`, `Trovi 5 monete!
(oppure il granchio. Cambia ogni volta.)
Hai 5 monete.`, `Eseguilo tante volte. Cambia 5 monete in 10 monete. Tieni 70 e 30 che sommano 100.`, `Le due probabilità devono sommare 100.`],
        ['Gioca tre giorni', `Un giorno è troppo poco. Ora il gioco dura tre giorni. Una scatola chiamata day conta 1, 2, 3. Quando è più grande di 3, il ciclo si ferma.

La domanda ask{2} è dentro il ciclo, quindi il gioco chiede sinistra o destra ogni giorno. Tutte le righe spostate a destra sono del ciclo.`, `Giorno 1
(una strada e un po' di fortuna)
Giorno 2
(una strada e un po' di fortuna)
Giorno 3
(una strada e un po' di fortuna)`, `Cambia until day > 3 in until day > 5 e gioca cinque giorni.`, `Non dimenticare set day = day + 1, o il gioco non finisce mai.`],
        ['La fine del gioco', `Alla fine il gioco ti dice cosa è successo. Mostra quante monete hai trovato. Poi due piccole scelte dicono se sei ricco: più di 10 monete, oppure no.

Questo è un gioco intero! Ha domande, scelte, fortuna, un ciclo e una scatola che conta. Hai usato quasi tutto delle lezioni.`, `Ada ha trovato 15 monete.
Sei ricco!`, `Giocalo tre volte. Riesci a prendere più di 10 monete?`, ``],
        ['Fallo tuo', `I veri programmatori non si fermano alla prima versione. Ecco alcune idee per rendere il gioco tuo:

Cambia la storia e le parole. Aggiungi una terza strada con una domanda in più. Rendi il premio più grande. Aggiungi un tesoro raro con un altro blocco random.

Quando sei contento, premi Salva per tenere il gioco come file .kv. Mostralo alla tua famiglia e ai tuoi amici!`, `Il tuo gioco!`, `Cambia almeno tre cose nel gioco. Poi premi Salva.`, `Se qualcosa si rompe, guarda il riquadro Problemi. Ti dice la riga.`]
      ]]
    ]
  },

  fr: {
    ui: {
      lesson: 'Leçon', step: 'étape', of: 'sur', steps: 'étapes',
      lineByLine: 'Ligne par ligne', see: 'Ce que tu verras', turn: 'À toi', slip: 'Attention',
      typeIt: 'Écris-le toi-même', putIt: 'Mets-le dans l\'éditeur', typeNote: 'Page vide prête. Écris les lignes que tu vois dans la leçon, puis appuie sur Lancer.',
      listen: 'Écouter', stopReading: 'Arrêter la lecture'
    },
    explain: {
      start: 'Le programme commence ici.',
      end: 'Le programme finit ici.',
      note: 'Une note pour les humains. L\'ordinateur la saute.',
      print: 'Montre ceci à l\'écran.',
      printEmpty: 'Ne montre rien : il n\'y a pas de texte après print.',
      askDef: 'Écrit la question {n}. Elle n\'est pas encore posée.',
      ask: 'Pose maintenant la question {n} et attend une réponse écrite.',
      keyDef: 'Choisit la touche à attendre.',
      keyIf: 'Attend cette touche, puis pose la question.',
      fnDef: 'Commence une nouvelle commande à toi, appelée {name}. Les lignes poussées à droite sont ce qu\'elle fait.',
      pick: 'Crée une boîte appelée {name} et y met un choix au hasard.',
      define: 'Crée une boîte appelée {name} et y met une valeur.',
      set: 'Met une nouvelle valeur dans la boîte. L\'ancienne disparaît.',
      ifInline: 'Si le test est vrai, fait l\'action sur la même ligne.',
      askNow: 'Pose tout de suite la question et met la réponse dans la boîte.',
      ifCall: 'Si le test est vrai, lance la commande sur la même ligne.',
      newLine: 'Le \\n dans le texte va à la ligne.',
      ifBlock: 'Vérifie quelque chose. Les lignes poussées à droite en dessous ne s\'exécutent que si c\'est vrai.',
      else: 'Sinon : ces lignes s\'exécutent si le test du dessus était faux.',
      repeat: 'Fait les lignes poussées à droite en dessous encore et encore, ce nombre de fois.',
      until: 'Continue les lignes poussées à droite jusqu\'à ce que ceci devienne vrai. Il vérifie avant chaque tour.',
      breakIt: 'Sort de la boucle tout de suite.',
      random: 'Une chance dans le tirage, sur 100. Un seul des blocs côte à côte s\'exécute.',
      returnIt: 'Renvoie cette valeur à l\'endroit où la commande a été utilisée.',
      append: 'Ajoute une valeur à la fin de la liste.',
      forEach: 'Parcourt la liste, un élément à la fois. Les lignes en retrait tournent une fois par élément, et le nom contient l’élément.',
      upper: 'Rend toutes les lettres grandes.',
      lower: 'Rend toutes les lettres petites.',
      trim: 'Enlève les espaces aux deux bouts.',
      part: 'Prend un morceau du texte, d’une position à l’autre.',
      split: 'Casse le texte là où est le séparateur et donne une liste.',
      join: 'Colle les morceaux d’une liste, avec ce texte entre eux.',
      whole: 'Divise et garde seulement la partie entière, sans ce qui vient après la virgule.',
      rest: 'Donne ce qui reste après une division entière.',
      value: 'Affiche une des trois valeurs simples du langage : true, false ou nothing.',
      compare: 'Calcule d’abord le test, et print montre la réponse : true ou false.',
      nothingValue: 'Met la valeur vide dans la boîte : on ne lui a encore rien donné.',
      nestedList: 'Une liste de listes : chaque ligne est une liste à part.',
      appendRow: 'Ajoute une ligne entière au bout du tableau.',
      twice: 'Lit la ligne d’abord, puis l’élément dans cette ligne.'
    },
    lessons: [
      ['Découvre l\'éditeur', 'Un tour avant de commencer', [
        ['Ton espace de travail', `C'est ici que tu écriras des programmes. Un programme est une liste d'instructions pour l'ordinateur, comme une recette est une liste d'instructions pour cuisiner.

La grande boîte blanche est l'endroit où tu écris. La boîte noire à droite s'appelle Résultat : c'est comme l'écran de l'ordinateur et elle montre ce que dit ton programme. La boîte en dessous est Problèmes : elle te dit quand quelque chose ne va pas, et elle indique toujours la ligne.`, `Le mot Salut! apparaît dans la boîte noire Résultat.`, `Appuie sur le bouton vert Lancer en haut à droite.`, ``],
        ['Lancer, Arrêter et Enregistrer', `Lancer démarre ton programme. Arrêter le coupe, s'il ne finit jamais. Enregistrer met ton programme sur ton ordinateur dans un fichier qui finit par .kv, pour le garder toujours. Ouvrir ramène un fichier enregistré. Nouveau te donne une page vide.

La page se souvient aussi de ton travail toute seule, mais un fichier enregistré est plus sûr.`, `Salut encore!`, `Appuie sur Enregistrer et trouve le fichier dans ton dossier Téléchargements. Puis appuie sur Nouveau, puis sur Ouvrir pour ramener ton programme.`, ``],
        ['Comment marchent les leçons', `Chaque leçon est faite de petites étapes. À chaque étape, tu lis ce que veut dire une idée, tu vois le code avec une courte note à côté de chaque ligne, puis tu essaies.

Il y a deux boutons. Écris-le toi-même te donne une page vide pour que tu tapes les lignes. Taper, c'est comme ça qu'on apprend vraiment. Mets-le dans l'éditeur met le code déjà prêt.

Si tu es coincé, rien ne casse. Kaviel ne plante jamais : il te dit ce qui ne va pas et continue.`, `Je sais écrire du code!`, `Appuie sur Écris-le toi-même, tape les trois lignes que tu vois à gauche et appuie sur Lancer.`, `Tape les lignes exactement. Les guillemets et les espaces comptent.`]
      ]],
      ['Dire bonjour', 'Ton tout premier programme', [
        ['Fais parler l\'ordinateur', `Les ordinateurs font exactement ce que tu leur dis, une instruction après l'autre, de haut en bas. Chaque instruction est une ligne.

Chaque programme Kaviel commence par le mot start et finit par le mot end, comme un sandwich avec du pain des deux côtés. Au milieu, le mot print dit à l'ordinateur de montrer quelque chose à l'écran.`, `Salut!`, `Lance-le. Puis change Salut! en un mot à toi et relance.`, `Écris bien print. Si tu écris prnt, Kaviel te le dit et saute cette ligne.`],
        ['Dis plusieurs choses', `Chaque ligne print montre une nouvelle ligne de texte. L'ordinateur les fait dans l'ordre, comme tu lis un livre de haut en bas.

L'ordre compte. Si tu échanges deux lignes, les mots sortent aussi échangés.`, `Salut!
Je m'appelle Kaviel.
Enchanté de te connaître.`, `Ajoute une ligne qui dit ton prénom. Puis échange deux lignes et regarde ce qui se passe.`, ``],
        ['Les mots vont entre guillemets', `Les mots s'appellent du texte, et le texte s'écrit toujours entre guillemets doubles, comme ça : "salut". Les guillemets disent à l'ordinateur : ces lettres sont juste des mots, pas une commande.

Les nombres sont différents. Ils n'ont pas besoin de guillemets. Et l'ordinateur sait calculer : écris 2 + 3 et il montre 5.`, `J'apprends à programmer.
7
5`, `Change le 7 en ton âge. Puis essaie print 100 - 1.`, `Si tu oublies les guillemets, comme dans print Salut, Kaviel pense que Salut est le nom d'une boîte et te dit d'utiliser des guillemets.`],
        ['Des notes pour les humains', `Parfois tu veux laisser un message dans le code, pour toi ou pour un ami, sans que l'ordinateur le lise. Commence la ligne par # et l'ordinateur la saute.

Les bons programmeurs écrivent des notes tout le temps, pour se rappeler plus tard pourquoi ils ont écrit quelque chose.`, `La note au-dessus est invisible.`, `Écris ta propre note avec un # au début. Lance : le résultat ne change pas.`, ``],
        ['Une ligne vide', `Parfois tu veux un vide entre deux choses que tu dis, comme entre deux paragraphes. print nothing fait dire une ligne vide à l'ordinateur.

nothing est un mot du langage qui veut dire « aucune valeur ». Tu le retrouveras dans la leçon 6.`, `Salut!

À bientôt!`, `Mets une ligne vide entre deux lignes à toi.`, `N'écris pas print tout seul sur une ligne : Kaviel dit que print a besoin de quelque chose à montrer. Écris print nothing.`]
      ]],
      ['Noms et boîtes', 'Retenir des choses pour plus tard', [
        ['Une boîte avec un nom', `Imagine une boîte avec une étiquette. Tu peux mettre quelque chose dedans, et plus tard tu le demandes en lisant l'étiquette. Le mot define crée une nouvelle boîte.

Ici l'étiquette est name, et dans la boîte il y a le mot Ada. Ensuite, chaque fois que tu écris name, l'ordinateur ouvre la boîte et utilise ce qu'il y a dedans.`, `Ada
Salut Ada`, `Mets ton prénom dans la boîte.`, `Utilise define une seule fois pour chaque boîte. Pour la changer ensuite, utilise set (étape suivante).`],
        ['Change ce qu\'il y a dedans', `set met quelque chose de nouveau dans une boîte qui a déjà une étiquette. L'ancienne chose est jetée et la nouvelle prend sa place.

Pense à un tableau des scores : quand quelqu'un marque, le nombre change, mais c'est toujours le même tableau.`, `Maintenant: 7
L'année prochaine: 8`, `Ajoute un autre set qui avance de dix ans.`, `Si tu utilises set sur une boîte qui n'existe pas, Kaviel la crée et te prévient. C'est souvent une faute de frappe.`],
        ['Fais des calculs', `L'ordinateur est très rapide en maths. + additionne, - soustrait, * multiplie et / divise. Le signe % donne ce qui reste après une division : 10 % 3 fait 1, parce que 3 rentre trois fois dans 10 et il reste 1.

L'étoile * veut dire fois, parce que la lettre x ressemble à une lettre normale.`, `15
5
50
2
1`, `Essaie un gros calcul, comme 123 * 456.`, `Diviser par zéro est impossible. Kaviel te le dit et continue.`],
        ['Mélange mots et boîtes', `print peut montrer plusieurs choses sur une ligne, l'une après l'autre. Mots, nombres et boîtes peuvent se mélanger. L'ordinateur met un espace entre eux.

Si tu veux coller les morceaux sans espace, utilise +, comme dans "Ouaf" + "!".`, `Mon animal est un chien
Il a 4 pattes.
Pattes pour 3 animaux: 12
Ouaf!!`, `Change l'animal en oiseau et les pattes en 2.`, `Un + entre des mots les colle sans aucun espace.`]
      ]],
      ['Pose des questions', 'Parle avec la personne qui utilise ton programme', [
        ['Prépare une question, puis pose-la', `Pour parler avec la personne qui utilise ton programme, il faut deux étapes. D'abord tu écris la question : define ask{1} écrit la question numéro 1 mais ne la pose pas encore. Ensuite ask{1} la pose vraiment et attend.

Quand tu lances, une case apparaît dans le Résultat. Écris ta réponse et appuie sur Entrée. La réponse est gardée, et answer{1} sert à la relire.`, `Comment tu t'appelles ? Ada
Salut Ada`, `Lance-le et écris ton prénom.`, `Les accolades { } font partie du nom. Ce ne sont pas des parenthèses.`],
        ['Deux questions', `Chaque question a son numéro, donc les réponses ne se mélangent jamais. La question 1 va avec answer{1}, la question 2 va avec answer{2}.

Tu peux les poser dans n'importe quel ordre. Le numéro relie une question à sa réponse.`, `Ton prénom ? Ada
Ta ville ? Rome
Ada habite à Rome`, `Ajoute une troisième question sur ton plat préféré.`, ``],
        ['Moins de 18 ou plus de 18', `Kaviel a deux mots spéciaux pour comparer des nombres : under et over. under 18 veut dire plus petit que 18. over 18 veut dire plus grand que 18, donc 18 n'est ni l'un ni l'autre. Un troisième mot, is, demande exactement ce nombre : answer{1} = is 18.

Les lignes ci-dessous sont la façon courte d'écrire un choix. Elles se lisent comme en anglais : si la réponse est under 18, affiche ceci.`, `Tape 10 : Tu as moins de 18 ans.
Tape 18 : Tu as 18 ans ou plus.`, `Lance-le deux fois. Une fois avec 10, une fois avec 18.`, `Si tu tapes un mot au lieu d'un nombre, Kaviel dit que ce n'est pas un nombre et continue.`],
        ['Transforme une réponse en nombre', `Une réponse est toujours du texte, même si tu tapes des chiffres. Texte et nombres sont différents. Si tu ajoutes 1 au texte "5", tu obtiens 51, parce que l'ordinateur les colle.

number() transforme le texte en vrai nombre. Ensuite les maths marchent bien.

Pour comparer, ce n'est pas la peine : = lit le nombre dans le texte, donc answer{1} = 18 marche.`, `Tape 4 :
Le double est 8
Plus dix fait 14`, `Fais afficher le nombre fois 100.`, `number() ne marche que si le texte est vraiment un nombre.`],
        ['Une question en une ligne', `Jusqu'ici une question prenait trois lignes. Quand tu n'as qu'une question, il y a plus court : ask avec des parenthèses pose la question tout de suite et te rend ce que la personne a tapé.

La réponse est toujours du texte, même si la personne tape un nombre.`, `Comment tu t'appelles ? Ada
Salut Ada`, `Demande une couleur préférée et répète-la.`, `La question va entre guillemets, comme tout texte. Termine-la par une espace pour que la réponse ne la touche pas.`]
      ]],
      ['Fais des choix', 'Laisse le programme décider', [
        ['Si ceci, alors cela', `Un programme peut choisir. if regarde quelque chose et n'exécute les lignes en dessous que si c'est vrai. Ces lignes sont poussées vers la droite de deux espaces. La touche Tab le fait pour toi.

Le dernier print n'est pas poussé à droite, donc il s'exécute toujours, quoi qu'il arrive au-dessus.`, `Tu as gagné!
Bien joué.
Le jeu est fini.`, `Change le score en 3. Quelles lignes disparaissent ?`, `Si tu oublies de pousser les lignes à droite, Kaviel te prévient que le if n'a rien en dessous.`],
        ['Sinon', `else est l'autre chemin. Quand le test est faux, les lignes sous else s'exécutent à la place. On ne prend qu'un seul chemin, jamais les deux.

Pense à une fourche : va à gauche si le test est vrai, à droite s'il est faux.`, `Réessaie.`, `Trouve un score qui fait dire Tu as gagné!`, `Écris else juste après les lignes du if, au même niveau que le if.`],
        ['Choisis sur une ligne', `Quand le travail est petit, tu peux tout écrire sur une ligne. Un deuxième = met l'action sur la même ligne que le test. Lis-le ainsi : si l'âge est 16, alors affiche.

Le premier = dans la ligne veut dire égal. Le deuxième = sépare seulement le test de l'action.`, `Exactement seize
Plus jeune`, `Change l'âge en 25 et lance.`, ``],
        ['Compare des mots', `On peut aussi comparer des mots. Un seul = demande : ces deux choses sont-elles exactement pareilles ? Majuscules et minuscules comptent, donc "Red" et "rouge" sont différents.

Comme un feu : si la couleur est rouge, arrête-toi. Sinon, avance.`, `Stop!`, `Change rouge en vert et relance.`, `Les mots entre guillemets doivent être identiques, majuscules comprises.`],
        ['And, or, not', `Parfois un seul test ne suffit pas. and veut que les deux tests soient vrais. or en veut au moins un. not change vrai en faux.

Dans ce programme, 9 est plus que 5 et moins que 13, donc le premier test passe. L'âge n'est pas dix, donc le dernier passe aussi.`, `Tu es un enfant.
Tu n'as pas dix ans.`, `Essaie l'âge 2, puis l'âge 95. Quelles lignes apparaissent ?`, `Les parenthèses rendent ça clair : not (age = 10). Sans elles ça marche pareil, car not lit toute la comparaison qui suit.`]
      ]],
      ['Vrai, faux et rien', 'Oui, non et vide', [
        ['Oui et non', `Un test n’est pas seulement quelque chose que tu lis : l’ordinateur y répond avec true ou false. 5 > 3 est true, et 5 < 3 est false.

Ces deux mots sont des valeurs, comme les nombres et les textes. Tu peux en mettre un dans une boîte, l’afficher, ou le comparer à autre chose.`, `true
false
true`, 'Affiche la réponse à 10 > 2, puis celle à 2 > 10.', `true et false s’écrivent sans guillemets et sans majuscule.`],
        ['La valeur qui n’est pas là', `Parfois une boîte existe mais tu n’as encore rien mis dedans. Cette valeur s’appelle nothing, et elle veut dire « aucune valeur ».

L’afficher donne une ligne vide, et tu peux demander si une boîte la contient encore. C’est ainsi qu’un programme dit « je n’ai rien ici ».`, `
true
Ada`, 'Crée une deuxième boîte avec nothing dedans et affiche-la.', `nothing n’est pas le texte "nothing" : entre guillemets, ça devient un mot visible.`]
      ]],
      ['Encore et encore', 'Les boucles répètent le travail pour toi', [
        ['Répète quelques fois', `Une boucle fait la même chose encore et encore, pour que tu n'aies pas à écrire la même ligne plusieurs fois. repeat 3 exécute trois fois les lignes poussées à droite.

Le dernier print n'est pas poussé à droite, donc il ne s'exécute qu'une fois, quand la boucle est finie.`, `La la la! (trois fois)
C'était une chanson.`, `Fais-le chanter 10 fois.`, `Les lignes de la boucle doivent être poussées à droite. Sinon elles ne s'exécutent qu'une fois.`],
        ['Continue jusqu\'à ce que', `until continue à répéter jusqu'à ce que quelque chose devienne vrai. Avant chaque tour il demande : est-ce déjà vrai ? Si oui, il s'arrête. Si non, il refait les lignes.

Dedans, set n = n + 1 ajoute un à n à chaque tour. Sans ça n ne changerait jamais et la boucle ne finirait pas. Dans ce cas il y a le bouton Arrêter, et Kaviel arrête aussi tout seul les programmes qui ne finissent pas.`, `n vaut 1
n vaut 2
... jusqu'à n vaut 5
Fini`, `Change 5 en 10.`, `Dans une boucle until, change toujours quelque chose, sinon elle ne finit jamais.`],
        ['Compte avec une boucle', `Une boucle et une boîte font un compteur. La boîte n commence à 1. À chaque tour elle affiche une ligne de la table de sept puis ajoute 1 à n.

Avec peu de lignes tu obtiens dix lignes de résultat. Tu changes un nombre et toute la table change.`, `1 x 7 = 7
2 x 7 = 14
... jusqu'à 10 x 7 = 70`, `Change le 7 en ton nombre préféré.`, ``],
        ['Sors plus tôt', `break sort de la boucle tout de suite. C'est utile quand tu as déjà trouvé ce que tu cherchais.

La boucle pourrait compter jusqu'à 100, mais elle s'arrête au premier nombre dont le carré dépasse 50.`, `Le premier nombre dont le carré dépasse 50 est 8`, `Change 50 en 200.`, ``]
      ]],
      ['Chance', 'Dés, pièces et surprises', [
        ['Choisis une chose', `pick choisit une chose dans la liste que tu écris, complètement au hasard. Chaque chose a la même chance. Comme c'est au hasard, chaque Lancer peut donner une réponse différente.

Les jeux utilisent la chance tout le temps : dés, cartes, coffres au trésor.`, `Aujourd'hui tu es un chat
(ou chien, hibou, renard : ça change)`, `Lance-le cinq fois. Puis ajoute ton animal préféré à la liste.`, `Sépare les choses avec des virgules.`],
        ['Lance une pièce', `Une pièce a deux faces, donc choisis entre deux choses. Personne ne peut deviner le résultat.

Lance-le plein de fois : pile et face devraient sortir environ la moitié du temps chacun.`, `La pièce dit pile
(ou face)`, `Lance-le dix fois. Est-elle juste ?`, ``],
        ['Lance un dé', `Tu peux aussi choisir des nombres. Un dé normal a six faces, donc on choisit de 1 à 6.

La dernière ligne est un choix sur une ligne : si le dé fait 6, affiche Chanceux!`, `Tu as fait 4
(ça change, et Chanceux! n'apparaît que sur un 6)`, `Change-le en dé à 20 faces.`, ``],
        ['Des chances inégales', `Parfois tu veux que certaines choses soient rares. Un bloc random a un nombre : sa chance sur 100. Des blocs côte à côte forment un seul tirage, et un seul s'exécute.

Ici le caillou sort 80 fois sur 100, la pièce 19 fois, et le diamant une seule fois.`, `J'ouvre la boîte magique...
Juste un caillou. (presque toujours)`, `Rends le diamant plus fréquent, mais garde le total à 100.`, `Les chances doivent faire 100 au total. Sinon Kaviel te prévient et corrige les nombres.`]
      ]],
      ['Tes propres commandes', 'Donne un nom à quelques lignes', [
        ['Crée une commande', `Une commande à toi est une petite machine que tu construis. Elle a un nom, elle prend quelque chose et elle renvoie quelque chose. Écris define, un nom, et des parenthèses avec ce qu'elle prend.

return renvoie la réponse. Ensuite, greet("Ada") marche comme une toute nouvelle commande Kaviel, et tu peux l'utiliser autant de fois que tu veux.`, `Salut Ada!
Salut Luca!`, `Dis bonjour à ton meilleur ami.`, `Les lignes de la commande doivent être poussées à droite sous define.`],
        ['Plus d\'une entrée', `Une commande peut prendre plusieurs choses. Mets-les entre parenthèses, séparées par des virgules. Ces noms n'existent que dans la commande, comme des outils dans une boîte à outils.

Quand tu appelles area(3, 4), width devient 3 et height devient 4.`, `Une pièce de 3 sur 4 mesure 12 mètres carrés
Un champ de 10 sur 10 mesure 100`, `Trouve l'aire d'un jardin de 25 sur 8.`, `Donne le bon nombre d'entrées. Trop ou pas assez, c'est une erreur.`],
        ['Des commandes qui utilisent des commandes', `Une commande peut en utiliser une autre. De petits morceaux font de grands programmes.

Ici quadruple utilise double deux fois : 5 devient 10, et 10 devient 20.`, `20`, `Crée une commande qui triple un nombre.`, ``],
        ['Une commande qui s\'appelle elle-même', `Une commande peut s'appeler elle-même, un peu comme être entre deux miroirs.

Ça ne marche que si chaque appel se rapproche d'une fin. Ici factorial(5) est 5 fois factorial(4), et ainsi de suite jusqu'à factorial(0), qui fait simplement 1. C'est la fin.`, `5! fait 120`, `Essaie factorial(10).`, `Mets toujours un cas de fin. Sans lui, la commande s'appellerait pour toujours. Kaviel l'arrête après 128 appels.`],
        ['Une commande qui fait quelque chose', `Une commande n'a pas besoin de rendre une réponse. Elle peut juste faire des choses, comme print. Alors il n'y a pas de return.

Tu peux l'appeler depuis le if sur une ligne : if birthday = cheer("Ada") lance la commande seulement quand birthday est vrai. Ça marche quand la ligne n'a pas de lignes décalées dessous.`, `Hourra pour Ada
Fin`, `Mets birthday à false et relance. Qu'est-ce qui change ?`, `Si tu mets des lignes décalées sous le if, le = devient une comparaison. Une ligne seule veut dire : fais ceci.`]
      ]],
      ['Listes', 'Plein de choses au même endroit', [
        ['Une liste de choses', `Une boîte peut tenir une chose. Une liste est une boîte avec plein de places, l'une après l'autre. On la fait avec des crochets et des virgules.

Chaque place a un numéro. La première place est 1, la deuxième est 2. Tu demandes la première avec pets[1]. length compte combien il y a de choses.`, `Premier: chat
Dernier: renard
Tous: ["chat", "chien", "renard"]
Combien: 3`, `Affiche le deuxième animal.`, `Ici les places se comptent à partir de 1, pas de 0.`],
        ['Ajoute et change', `append met une nouvelle chose à la fin de la liste. set peut changer une place : set pets[1] = "lion" remplace le premier élément.

La liste grandit avec append. Avec set elle garde la même taille.`, `["lion", "chien", "hibou"]`, `Ajoute deux autres animaux.`, `Demander une place qui n'existe pas, comme pets[10], est une erreur. Elle te dit la vraie longueur.`],
        ['Visite chaque élément', `Pour faire quelque chose avec chaque élément d'une liste, utilise une boucle avec un compteur. i commence à 1 et monte de un à chaque tour, jusqu'à dépasser la longueur de la liste.

pets[i] veut dire l'élément à la place i, donc la boucle montre chaque animal, l'un après l'autre.`, `1 chat
2 chien
3 hibou`, `Ajoute un animal à la liste. La boucle marche-t-elle encore ?`, ``],
        ['Un à la fois', `for each te donne un élément à la fois, avec le nom que tu choisis. Pas de compteur, pas de position, pas de length. Ça se lit comme la phrase que tu dirais à voix haute, et break sort plus tôt.`, `cat
dog
owl`, `Ajoute un quatrième animal. Remarque que rien d'autre ne change.`, ``],
        ['Additionne une liste', `Une boîte peut collecter un total pendant que la boucle visite chaque nombre. total commence à 0. À chaque tour, le prix courant lui est ajouté.

C'est la même idée qu'une caisse de magasin qui additionne ce que tu achètes.`, `Total: 20`, `Ajoute un autre prix à la liste.`, ``],
        ['Choisir dans une liste', `Dans la leçon 8, pick choisissait parmi des choses écrites une par une. Quand les choses sont déjà dans une liste, écris pick et le nom de la liste.

Chaque élément a la même chance, et chaque lancement peut donner une autre réponse.`, `Aujourd'hui tu es un chien
(ce pourrait être un chat ou un renard : ça change à chaque fois)`, `Ajoute deux autres animaux à la liste et relance cinq fois.`, `Écris pick pets sans guillemets : pets est le nom de la boîte qui contient la liste.`]
      ]],
      ['Des listes dans des listes', 'Un tableau dans une liste', [
        ['Une liste de listes', `Une liste peut contenir n’importe quoi, même d’autres listes. Deux crochets font une ligne, et une liste de lignes fait un tableau.

Tu la lis avec deux positions : la ligne d’abord, puis l’élément dans cette ligne. grid[2][1] veut dire deuxième ligne, premier élément.`, `[[1, 2], [3, 4]]
3`, 'Change le 4 en 9 avec set, puis affiche toute la grille.', `grid[2][1] vaut 3, pas 2 : la ligne vient d’abord.`],
        ['Un tableau de joueurs', `Voilà comment on fait un classement : une liste, et une petite liste pour chaque joueur. append ajoute une ligne à la liste extérieure, et for each parcourt les lignes une par une.

Dans chaque ligne tu lis le nom et les points. Une seule idée, utilisée deux fois, et tu as un tableau.`, `Ada 10
Luca 7`, 'Ajoute un troisième joueur avec 12 points.', `append ajoute une ligne à la liste extérieure. Pour changer un point dans une ligne, utilise set row[2] = 12.`]
      ]],
      ['Mots et lettres', 'Joue avec le texte', [
        ['Grandes lettres, petites lettres', `L’ordinateur peut changer la taille des lettres. upper rend chaque lettre grande, lower la rend petite.

Aucun des deux ne change le texte de départ : ils te donnent un nouveau texte, et le mot d’origine reste là.`, `KAVIEL
kaviel`, 'Affiche ton prénom en petites lettres.', `upper et lower veulent un texte. upper(5) est une erreur.`],
        ['Coupe les espaces', `Quand une personne tape une réponse, des espaces se glissent souvent au début ou à la fin. Tu ne les vois pas, l’ordinateur si, et deux textes qui se ressemblent ne sont plus égaux.

trim enlève ces espaces. C’est la première chose à faire avec une réponse que tu veux comparer.`, `[Ada]`, 'Enlève trim, relance, et regarde les parenthèses.', `trim enlève les espaces seulement aux deux bouts, jamais ceux du milieu.`],
        ['Prends un morceau', `part coupe un morceau dans un texte. Tu lui donnes le texte, la position où le morceau commence et celle où il finit, et les deux comptent.

Les positions commencent à 1, comme dans une liste, donc la première lettre est à 1 et pas à 0.`, `Kaviel
iel`, 'Affiche les quatre premières lettres du mot.', `Si tu demandes une position plus grande que le texte, Kaviel dit combien de lettres il y a.`],
        ['Sépare et réunir', `split casse un texte là où il trouve un séparateur, et te donne une liste. join fait le contraire : il prend une liste et un morceau de texte, et colle les morceaux avec ce texte entre eux.

Deux mots, une seule idée : les morceaux et le tout. C’est ainsi qu’un chat transforme une phrase en mots.`, `["a", "b", "c"]
a-b-c
3`, 'Sépare une de tes phrases sur l’espace et réunis-la avec un signe plus.', `Le séparateur doit faire au moins un caractère, donc split(text, "") est une erreur.`],
        ['Retours à la ligne et guillemets', `Deux petits trucs vivent dans un texte. \\n veut dire « va à la ligne ici », donc un seul print peut montrer deux lignes. Et \\" met un vrai guillemet dans le texte sans le fermer.

La barre oblique inverse \\ dit à Kaviel que la lettre suivante est spéciale. Elle penche de l'autre côté que la barre normale /.`, `Ada
Luca
"Kaviel"`, `Affiche ton prénom et ton âge sur deux lignes avec un seul print.`, `La barre oblique inverse penche vers la gauche : \\ . La barre normale / n'a rien de spécial.`]
      ]],
      ['Nombres entiers', 'Sans virgule', [
        ['Deux barres', `Une division avec une barre donne la réponse exacte, et elle peut avoir une partie après la virgule : 7 / 2 fait 3,5.

Avec deux barres tu gardes seulement la partie entière : 7 // 2 fait 3. On l’appelle division entière, et c’est celle qu’il faut pour compter des choses : une demi-chaise n’existe pas.`, `3.5
3`, 'Essaie 9 // 3 et 10 // 3.', `N’écris pas // quand tu veux la réponse exacte.`],
        ['Ce qui reste', `Le signe pour cent donne ce qui reste après une division entière. 7 % 2 fait 1, parce que 2 tient trois fois dans 7 et il reste 1.

C’est le moyen le plus rapide de demander « ce nombre est-il pair ? » : s’il est pair, le reste de la division par 2 est 0.`, `1
0`, 'Affiche le reste de 10 divisé par 3.', `Le signe suit le côté gauche : -7 % 2 fait -1, pas 1.`],
        ['Une moyenne entière', `Maintenant tu peux faire ce que fait un magasin : additionner les prix, diviser par le nombre d’articles, et garder des nombres entiers.

total // count donne la moyenne sans rien après la virgule, ce qu’il te faut quand la réponse doit être une pièce entière.`, `3`, 'Change total en 20 et relance. Puis essaie 17 / 5 pour voir la différence.', `Si count vaut 0, Kaviel refuse de diviser et dit pourquoi.`]
      ]],
      ['Nombres à virgule', 'Pas seulement entiers', [
        ['Une partie après la virgule', `Toutes les réponses ne sont pas entières. Avec une seule barre, une division peut donner une partie après la virgule : 10 / 4 fait 2,5.

Kaviel écrit cette partie avec un point et non avec une virgule, pour que le même programme tourne pareil sur chaque ordinateur. Tu peux taper une virgule : elle est comprise.`, `4.5
2.5
0.3`, 'Affiche 7 / 2 et 7 // 2 ensemble, et regarde la différence.', `Deux barres donnent un nombre entier ; une barre donne la réponse exacte.`],
        ['Sous zéro', `Un nombre peut être plus petit que zéro. Écris un moins devant : -5, c’est cinq sous zéro, comme une température d’hiver.

Deux moins font un plus : -3 * -2 fait 6. C’est la même règle qu’une dette annulée deux fois qui devient de l’argent.`, `-3
-7
6`, 'Affiche une température qui part de 3 et descend de 8.', `Le reste suit le signe du côté gauche : -7 % 2 fait -1, pas 1.`]
      ]],
      ['Dessine avec des lettres', 'Formes', [
        ['Une rangée d’étoiles', `Un texte peut grandir. Pars d’un texte vide, "", et ajoute une étoile à chaque tour : après cinq tours tu as une rangée de cinq étoiles.

C’est ainsi qu’un ordinateur dessine quand il n’y a pas de programme pour dessiner : avec des lettres, l’une après l’autre.`, `*****`, 'Fais une rangée de vingt étoiles.', `Un texte vide, c’est "" — deux guillemets avec rien entre eux.`],
        ['Un triangle', `Mets le texte qui grandit dans une boucle qui tourne une fois de plus à chaque tour, et affiche-le à chaque tour : tu obtiens un triangle.

Ce sont les deux mêmes idées qu’avant, un texte qui grandit et une boucle qui continue, et le dessin vient tout seul.`, `*
**
***
****
*****`, 'Fais grandir le triangle de deux étoiles à la fois.', `Si une boucle ne finit pas, appuie sur Esc pour l’arrêter. Kaviel l’arrête seul au bout d’un moment.`],
        ['Un cadre autour d’un nom', `join répète une chose : trois morceaux de trois tirets, collés avec rien entre eux, donnent une barre de neuf tirets.

Avec une barre au-dessus et une en dessous tu as un panneau. Un ordinateur dessine chaque image ainsi : de petits morceaux, répétés dans le bon ordre.`, `---------
Ada
---------`, 'Élargis le cadre et mets ton propre nom dedans.', `join veut une liste de textes. Les nombres de la liste deviennent du texte tout seuls.`]
      ]],
      ['Appuie sur une touche', 'Attendre le clavier', [
        ['Attends une touche', `Jusqu'ici, la personne tapait une réponse entière et appuyait sur Entrée. Parfois tu veux juste un appui sur une touche, comme Appuie sur une touche pour commencer dans un jeu.

define keypress{1} = C choisit la touche C. La ligne if attend que cette touche soit pressée, puis pose la question. Les autres touches sont ignorées.`, `Appuie sur C pour continuer.
(rien ne se passe tant que tu n'appuies pas sur C)
Comment tu t'appelles ?`, `Lance-le. D'abord appuie sur une mauvaise touche. Puis appuie sur C.`, `Clique d'abord sur la page, pour que les touches lui arrivent.`],
        ['D\'autres touches', `En plus des lettres, tu peux attendre ces touches : Enter, Space, Escape, Tab et les flèches ArrowUp, ArrowDown, ArrowLeft et ArrowRight.`, `Appuie sur Space pour commencer.
Ta couleur préférée ?`, `Change Space en Enter.`, `Écris le nom de la touche avec les mêmes majuscules.`]
      ]],
      ['Crée un jeu', 'Mets tout ensemble', [
        ['Devine le nombre', `Maintenant on met tout ensemble. L'ordinateur choisit un nombre secret avec pick. Tu essaies jusqu'à le trouver. La boucle continue jusqu'à ce que ton essai soit égal au secret.

Dans la boucle : pose la question, transforme la réponse en nombre, compte un essai de plus et donne un indice si le nombre est trop grand ou trop petit.`, `Devine un nombre de 1 à 10 : 5
Trop petit.
... et ainsi de suite, jusqu'à
Tu as réussi en 3 essais!`, `Fais monter le nombre secret jusqu'à 20.`, `number(answer{1}) est important. Sans lui la réponse est du texte, et le texte ne se compare pas comme un nombre.`],
        ['Un quiz avec des points', `Une boîte appelée points compte les bonnes réponses. Elle commence à 0. Chaque bonne réponse ajoute 1 avec set points = points + 1.

À la fin, print montre le total. Les lignes vides sont là seulement pour rendre le programme plus lisible.`, `Correct!
Correct!
Tu as eu 2 sur 2.`, `Écris une troisième question à toi et donne aussi des points pour elle.`, `Les réponses se comparent comme du texte, donc écris-les exactement : "4" et "vert".`],
        ['Pierre, feuille, ciseaux', `C'est un plus gros programme, donc lis-le lentement, un bloc à la fois. L'ordinateur choisit avec pick. Tu écris ton choix. Ensuite, pour chaque chose que tu pouvais choisir, il y a un bloc qui décide qui a gagné.

Les grands blocs if ont de plus petites lignes if poussées à droite dedans. C'est permis : des choix dans des choix.`, `J'ai choisi feuille
(ça change) puis Tu as gagné!, J'ai gagné! ou Égalité!`, `À la fin, ajoute une ligne qui dit ce qui se passe si tu écris autre chose.`, `Écris les mots exacts : pierre, feuille ou ciseaux, en minuscules.`]
      ]],
      ['Erreurs', 'Ça arrive. Ce n\'est pas grave.', [
        ['Une faute de frappe', `Tout le monde se trompe, même ceux qui programment pour leur métier. Beaucoup de programmes plantent quand quelque chose ne va pas. Pas Kaviel : il saute la ligne cassée, te le dit et continue.

Regarde la boîte Problèmes après avoir lancé. Elle montre le numéro de ligne et dit ce qu'elle pense que tu voulais écrire.`, `Salut!
Mais celle-ci marche encore.
(et un problème à la ligne 3)`, `Clique sur le problème pour aller à la ligne. Puis corrige la faute.`, ``],
        ['Un nom qui n\'existe pas', `Une boîte doit être créée avec define avant d'être utilisée. Si tu écris un nom qui n'existe pas, Kaviel cherche des noms proches et t'en suggère un. Ici agee a une lettre de trop.

Lire les messages d'erreur est une vraie compétence. Ils sont de ton côté.`, `Corrigé: 8
(et un problème à la ligne 3)`, `Corrige la ligne en enlevant le e en trop.`, ``],
        ['Un calcul impossible', `Certaines choses sont impossibles, comme diviser par zéro. Le programme te le dit, saute cette ligne et passe à la suivante. Rien ne s'arrête.

C'est la grande idée de Kaviel : une erreur n'est pas la fin. Tu vois toujours ce qui s'est passé et où.`, `5
Ça tourne encore!
(et un problème à la ligne 3)`, `Change le 0 en 5. Le problème disparaît.`, ``]
      ]],
      ['Ton grand projet', 'Construis un jeu du trésor, étape par étape', [
        ['Commence l\'histoire', `Maintenant tu vas construire un vrai jeu, un petit morceau à la fois. C'est une chasse au trésor sur une île. Après chaque étape le jeu devient plus grand, et il marche toujours.

Le premier morceau est un message de bienvenue. Le jeu demande ton prénom puis te dit bonjour. Tu sais déjà tout ce qu'il faut.`, `Comment tu t'appelles ? Ada
Bienvenue sur l'île, Ada
Trouve le plus de pièces possible.`, `Appuie sur Écris-le toi-même, écris le programme et lance-le. Puis change l'histoire : utilise un autre endroit qu'une île.`, ``],
        ['Choisis un chemin', `Un bon jeu laisse le joueur choisir. Maintenant on ajoute une deuxième question : gauche ou droite. Le jeu dit quelque chose de différent pour chaque réponse.

Il utilise if et else, comme dans la leçon sur les choix.`, `Quel chemin : gauche ou droite ? gauche
Tu entres dans une grotte.`, `Lance-le deux fois : une fois avec gauche, une fois avec droite. Puis change la grotte en autre chose.`, `Écris gauche en minuscules, exactement comme dans le programme.`],
        ['Ajoute de la chance et des pièces', `Maintenant le jeu devient passionnant. Une boîte appelée coins commence à 0. Ensuite un bloc random donne 70 chances sur 100 de trouver 5 pièces et 30 sur 100 de rencontrer un crabe.

set coins = coins + 5 ajoute 5 à la boîte. Les deux blocs random sont côte à côte, donc un seul arrive.`, `Tu trouves 5 pièces!
(ou le crabe. Ça change à chaque fois.)
Tu as 5 pièces.`, `Lance-le plein de fois. Change 5 pièces en 10 pièces. Garde 70 et 30 pour faire 100.`, `Les deux chances doivent faire 100.`],
        ['Joue trois jours', `Un jour, c'est trop court. Maintenant le jeu dure trois jours. Une boîte appelée day compte 1, 2, 3. Quand elle est plus grande que 3, la boucle s'arrête.

La question ask{2} est dans la boucle, donc le jeu demande gauche ou droite chaque jour. Toutes les lignes poussées à droite sont dans la boucle.`, `Jour 1
(un chemin et un peu de chance)
Jour 2
(un chemin et un peu de chance)
Jour 3
(un chemin et un peu de chance)`, `Change until day > 3 en until day > 5 et joue cinq jours.`, `N'oublie pas set day = day + 1, sinon le jeu ne finit jamais.`],
        ['La fin du jeu', `À la fin le jeu te dit ce qui s'est passé. Il montre combien de pièces tu as trouvées. Puis deux petits choix disent si tu es riche : plus de 10 pièces, ou pas.

C'est un jeu entier ! Il a des questions, des choix, de la chance, une boucle et une boîte qui compte. Tu as utilisé presque tout des leçons.`, `Ada a trouvé 15 pièces.
Tu es riche!`, `Joue trois fois. Peux-tu avoir plus de 10 pièces ?`, ``],
        ['Fais-le à toi', `Les vrais programmeurs ne s'arrêtent jamais à la première version. Voici des idées pour rendre le jeu à toi :

Change l'histoire et les mots. Ajoute un troisième chemin avec une question de plus. Rends le prix plus gros. Ajoute un trésor rare avec un autre bloc random.

Quand tu es content, appuie sur Enregistrer pour garder ton jeu en fichier .kv. Montre-le à ta famille et à tes amis !`, `Ton propre jeu !`, `Change au moins trois choses dans le jeu. Puis appuie sur Enregistrer.`, `Si quelque chose casse, regarde la boîte Problèmes. Elle te dit la ligne.`]
      ]]
    ]
  }
};
