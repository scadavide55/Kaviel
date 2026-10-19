/* Interface languages for the Kaviel editor: English, Italiano, Français.
   The language itself (keywords, engine messages, code) stays in English.
   Strings are looked up by their English text; unknown text is left alone. */
(function () {
  'use strict';
  var LANGS = ['en', 'it', 'fr'];
  var lang = 'en';
  try { lang = localStorage.getItem('kaviel.lang') || ''; } catch (e) {}
  if (LANGS.indexOf(lang) < 0) {
    var nav = (navigator.language || 'en').slice(0, 2);
    lang = LANGS.indexOf(nav) >= 0 ? nav : 'en';
  }
  document.documentElement.lang = lang;

  var select = document.getElementById('lang');
  if (select) {
    select.value = lang;
    select.addEventListener('change', function () {
      try { localStorage.setItem('kaviel.lang', select.value); } catch (e) {}
      location.reload();
    });
  }

  // [English, Italiano, Français]
  var UI = [
    ['Click to rename your file', 'Clicca per rinominare il file', 'Clique pour renommer le fichier'],
    ['File name', 'Nome del file', 'Nom du fichier'],
    ['edited', 'modificato', 'modifié'],
    ['You changed this file since you last saved it', 'Hai modificato il file dopo l\'ultimo salvataggio', 'Tu as modifié le fichier depuis la dernière sauvegarde'],
    ['Files', 'File', 'Fichiers'],
    ['New', 'Nuovo', 'Nouveau'],
    ['Start a new empty program', 'Inizia un programma vuoto', 'Commencer un programme vide'],
    ['Open', 'Apri', 'Ouvrir'],
    ['Open a .kv file from your computer', 'Apri un file .kv dal tuo computer', 'Ouvrir un fichier .kv de ton ordinateur'],
    ['Save', 'Salva', 'Enregistrer'],
    ['Save this program on your computer · Cmd/Ctrl+S', 'Salva il programma sul computer · Cmd/Ctrl+S', 'Enregistrer le programme sur ton ordinateur · Cmd/Ctrl+S'],
    ['Lessons', 'Lezioni', 'Leçons'],
    ['Lessons and examples', 'Lezioni ed esempi', 'Leçons et exemples'],
    ['Help', 'Aiuto', 'Aide'],
    ['Quick help · press ?', 'Aiuto veloce · premi ?', 'Aide rapide · appuie sur ?'],
    ['Running on the Kaviel 1.5 beta engine', 'Gira sul motore Kaviel 1.5 beta', 'Tourne sur le moteur Kaviel 1.5 beta'],
    ['beta', 'beta', 'bêta'],
    ['Switch between light and dark', 'Passa da chiaro a scuro', 'Passer du clair au sombre'],
    ['Stop', 'Ferma', 'Arrêter'],
    ['Treasure hunt', 'Caccia al tesoro', 'Chasse au trésor'], ['Your biggest program', 'Il tuo programma più grande', 'Ton plus gros programme'],
    ['Stop the program · Esc', 'Ferma il programma · Esc', 'Arrêter le programme · Esc'],
    ['Run', 'Esegui', 'Lancer'],
    ['Run your program · Cmd/Ctrl+Enter', 'Esegui il programma · Cmd/Ctrl+Invio', 'Lancer le programme · Cmd/Ctrl+Entrée'],
    ['Examples', 'Esempi', 'Exemples'],
    ['Lessons and examples', 'Lezioni ed esempi', 'Leçons et exemples'],
    ['Close the lessons panel', 'Chiudi il pannello', 'Fermer le panneau'],
    ['Close', 'Chiudi', 'Fermer'],
    ['Pick a small program. It opens in the editor, and you press Run.', 'Scegli un piccolo programma. Si apre nell\'editor e tu premi Esegui.', 'Choisis un petit programme. Il s\'ouvre dans l\'éditeur et tu appuies sur Lancer.'],
    ['Hello', 'Ciao', 'Bonjour'], ['Say hello', 'Saluta', 'Dire bonjour'],
    ['Two questions', 'Due domande', 'Deux questions'], ['Ask a name and an age', 'Chiedi nome ed età', 'Demander un nom et un âge'],
    ['Under or over', 'Sotto o sopra', 'Moins ou plus'], ['Are you 18 yet?', 'Hai già 18 anni?', 'As-tu déjà 18 ans ?'],
    ['Dice', 'Dado', 'Dé'], ['Roll with luck', 'Tira con fortuna', 'Lancer avec de la chance'],
    ['Guess the number', 'Indovina il numero', 'Devine le nombre'], ['A small game', 'Un piccolo gioco', 'Un petit jeu'],
    ['Times table', 'Tabellina', 'Table de multiplication'], ['Counting with a loop', 'Contare con un ciclo', 'Compter avec une boucle'],
    ['Quiz', 'Quiz', 'Quiz'], ['Ask, check, count points', 'Chiedi, controlla, conta i punti', 'Demander, vérifier, compter les points'],
    ['Rock, paper, scissors', 'Sasso, carta, forbici', 'Pierre, feuille, ciseaux'], ['Play against the computer', 'Gioca contro il computer', 'Jouer contre l\'ordinateur'],
    ['Collatz', 'Collatz', 'Collatz'], ['A famous number puzzle', 'Un famoso rompicapo di numeri', 'Un célèbre casse-tête de nombres'],
    ['One item at a time', 'Un elemento alla volta', 'Un élément à la fois'], ['for each', 'for each', 'for each'],
    ['The citadel', 'La cittadella', 'La citadelle'], ['The biggest program of all', 'Il programma più grande di tutti', 'Le plus grand programme de tous'],
    ['One item at a time', 'Un elemento alla volta', 'Un élément à la fois'], ['for each', 'for each', 'for each'],
    ['Your own commands', 'I tuoi comandi', 'Tes propres commandes'], ['Functions', 'Funzioni', 'Fonctions'],
    ['A list of pets', 'Una lista di animali', 'Une liste d\'animaux'], ['Many things in one', 'Tante cose in una', 'Plusieurs choses en une'],
    ['Wait for a key', 'Aspetta un tasto', 'Attendre une touche'], ['Press C to go on', 'Premi C per continuare', 'Appuie sur C pour continuer'],
    ['Mistakes', 'Errori', 'Erreurs'], ['See what a mistake looks like', 'Guarda come appare un errore', 'Voir à quoi ressemble une erreur'],
    ['Example', 'Esempio', 'Exemple'], ['Your code', 'Il tuo codice', 'Ton code'],
    ['Your program', 'Il tuo programma', 'Ton programme'],
    ['Smaller text', 'Testo più piccolo', 'Texte plus petit'], ['Bigger text', 'Testo più grande', 'Texte plus grand'],
    ['Find · Cmd/Ctrl+F', 'Cerca · Cmd/Ctrl+F', 'Chercher · Cmd/Ctrl+F'], ['Find in code', 'Cerca nel codice', 'Chercher dans le code'],
    ['Find…', 'Cerca…', 'Chercher…'], ['Find text', 'Testo da cercare', 'Texte à chercher'],
    ['Previous match', 'Risultato precedente', 'Résultat précédent'], ['Next match', 'Risultato successivo', 'Résultat suivant'], ['Close search', 'Chiudi la ricerca', 'Fermer la recherche'],
    ['Saved in this browser', 'Salvato in questo browser', 'Enregistré dans ce navigateur'],
    ['Not saved. Press Save to keep a copy', 'Non salvato. Premi Salva per tenere una copia', 'Non enregistré. Appuie sur Enregistrer pour garder une copie'],
    ['Output', 'Risultato', 'Résultat'], ['Clear the output', 'Pulisci il risultato', 'Effacer le résultat'],
    ['Nothing here yet.', 'Ancora niente qui.', 'Rien ici pour l\'instant.'], ['Press the green Run button.', 'Premi il pulsante verde Esegui.', 'Appuie sur le bouton vert Lancer.'],
    ['Your program printed nothing.', 'Il programma non ha stampato niente.', 'Ton programme n\'a rien affiché.'],
    ['Write print and something to show, like print "Hi".', 'Scrivi print e qualcosa da mostrare, come print "Ciao".', 'Écris print et quelque chose à montrer, comme print "Salut".'],
    ['Your answer', 'La tua risposta', 'Ta réponse'], ['Type your answer', 'Scrivi la tua risposta', 'Écris ta réponse'], ['Send', 'Invia', 'Envoyer'],
    ['Press the', 'Premi il tasto', 'Appuie sur la touche'], ['key to go on', 'per continuare', 'pour continuer'],
    ['Running…', 'In esecuzione…', 'En cours…'], ['Waiting for your answer', 'Aspetto la tua risposta', 'J\'attends ta réponse'], ['Waiting for a key', 'Aspetto un tasto', 'J\'attends une touche'],
    ['Problems', 'Problemi', 'Problèmes'], ['No problems.', 'Nessun problema.', 'Aucun problème.'],
    ['Press Run and any problems will show up here.', 'Premi Esegui e i problemi compariranno qui.', 'Appuie sur Lancer et les problèmes apparaîtront ici.'],
    ['Ready when you are.', 'Pronto quando vuoi.', 'Prêt quand tu veux.'],
    ['You changed the code. Press Run to check it again.', 'Hai cambiato il codice. Premi Esegui per controllare di nuovo.', 'Tu as changé le code. Appuie sur Lancer pour revérifier.'],
    ['You changed the code. The output is from the previous run.', 'Hai cambiato il codice. Il risultato è dell\'esecuzione precedente.', 'Tu as changé le code. Le résultat vient de l\'exécution précédente.'],
    ['Example opened. Press Run to try it.', 'Esempio aperto. Premi Esegui per provarlo.', 'Exemple ouvert. Appuie sur Lancer pour l\'essayer.'],
    ['File opened. Press Run to try it.', 'File aperto. Premi Esegui per provarlo.', 'Fichier ouvert. Appuie sur Lancer pour l\'essayer.'],
    ['New empty program. Write something between start and end.', 'Nuovo programma vuoto. Scrivi qualcosa tra start e end.', 'Nouveau programme vide. Écris quelque chose entre start et end.'],
    ['Something went wrong inside the editor, not in your program. Your code is safe. Try Run again, or press Save to keep a copy.', 'Qualcosa è andato storto nell\'editor, non nel tuo programma. Il codice è al sicuro. Riprova Esegui o premi Salva per tenere una copia.', 'Un problème est survenu dans l\'éditeur, pas dans ton programme. Ton code est en sécurité. Réessaie Lancer ou appuie sur Enregistrer pour garder une copie.'],
    ['Editor error. You can try Run again.', 'Errore dell\'editor. Puoi riprovare Esegui.', 'Erreur de l\'éditeur. Tu peux réessayer Lancer.'],
    ['error', 'errore', 'erreur'], ['warning', 'avviso', 'avertissement'], ['hint', 'suggerimento', 'astuce'],
    ['No matches', 'Nessun risultato', 'Aucun résultat'],
    ['Your code stays on this computer.', 'Il tuo codice resta su questo computer.', 'Ton code reste sur cet ordinateur.'],
    ['Keyboard shortcuts', 'Scorciatoie da tastiera', 'Raccourcis clavier'],
    ['Drop your .kv file to open it', 'Rilascia il file .kv per aprirlo', 'Dépose ton fichier .kv pour l\'ouvrir'],
    ['Quick help', 'Aiuto veloce', 'Aide rapide'], ['Close help', 'Chiudi l\'aiuto', 'Fermer l\'aide'],
    ['Say something', 'Di\' qualcosa', 'Dire quelque chose'], ['Keep a value', 'Ricorda un valore', 'Garder une valeur'], ['Make a choice', 'Fai una scelta', 'Faire un choix'],
    ['Choose on one line', 'Scegli su una riga', 'Choisir sur une ligne'], ['Do it again', 'Rifallo', 'Recommencer'], ['Ask a question', 'Fai una domanda', 'Poser une question'],
    ['Your own command', 'Un tuo comando', 'Ta propre commande'], ['A list', 'Una lista', 'Une liste'], ['Luck', 'Fortuna', 'Chance'],
    ['Keyboard', 'Tastiera', 'Clavier'], ['Indent', 'Rientra', 'Indenter'], ['Unindent', 'Togli il rientro', 'Désindenter'], ['Find', 'Cerca', 'Chercher'],
    ['← All lessons', '← Tutte le lezioni', '← Toutes les leçons'], ['Put it in the editor', 'Mettilo nell\'editor', 'Mets-le dans l\'éditeur'],
    ['← Back', '← Indietro', '← Retour'], ['Next step →', 'Passo successivo →', 'Étape suivante →'], ['Next lesson →', 'Lezione successiva →', 'Leçon suivante →'], ['Finish', 'Fine', 'Terminer'],
    ['Your turn', 'Tocca a te', 'À toi'], ['Bring back the code I had before', 'Riporta il codice di prima', 'Remets le code que j\'avais avant'],
    ['Done. Now press the green Run button.', 'Fatto. Ora premi il pulsante verde Esegui.', 'C\'est fait. Appuie maintenant sur le bouton vert Lancer.'],
    ['You finished every lesson. Now go and make your own program.', 'Hai finito tutte le lezioni. Ora crea un tuo programma.', 'Tu as fini toutes les leçons. Crée maintenant ton propre programme.'],
    ['Started a new program.', 'Nuovo programma iniziato.', 'Nouveau programme commencé.'], ['Undo', 'Annulla', 'Annuler'],
    ['Output cleared. Your code is still there.', 'Risultato pulito. Il tuo codice c\'è ancora.', 'Résultat effacé. Ton code est toujours là.'],
    ['That is not a .kv file. Pick a file that ends in .kv.', 'Non è un file .kv. Scegli un file che finisce con .kv.', 'Ce n\'est pas un fichier .kv. Choisis un fichier qui finit par .kv.'],
    ['That file is too big. The editor opens files up to 1 MB.', 'Il file è troppo grande. L\'editor apre file fino a 1 MB.', 'Ce fichier est trop gros. L\'éditeur ouvre des fichiers jusqu\'à 1 Mo.'],
    ['Your code changed while the file was opening. Open the file again to replace it.', 'Il codice è cambiato mentre il file si apriva. Riapri il file per sostituirlo.', 'Ton code a changé pendant l\'ouverture. Rouvre le fichier pour le remplacer.'],
    ['The file could not be read. Your code is unchanged.', 'Non sono riuscito a leggere il file. Il codice è invariato.', 'Le fichier n\'a pas pu être lu. Ton code est inchangé.'],
    ['Download', 'Scarica', 'Télécharger'],
    ['Download Kaviel for your computer', 'Scarica Kaviel per il tuo computer', 'Télécharge Kaviel pour ton ordinateur'],
    ['The installer is not here yet.', 'L\'installer non è ancora qui.', 'L\'installateur n\'est pas encore là.'],
    ['Symbols', 'Simboli', 'Symboles'],
    ['Quotation mark', 'Virgolette', 'Guillemets'],
    ['Open round bracket', 'Parentesi tonda aperta', 'Parenthèse ouvrante'],
    ['Close round bracket', 'Parentesi tonda chiusa', 'Parenthèse fermante'],
    ['Open curly bracket', 'Parentesi graffa aperta', 'Accolade ouvrante'],
    ['Close curly bracket', 'Parentesi graffa chiusa', 'Accolade fermante'],
    ['Open square bracket', 'Parentesi quadra aperta', 'Crochet ouvrant'],
    ['Close square bracket', 'Parentesi quadra chiusa', 'Crochet fermant'],
    ['Equals sign', 'Segno uguale', 'Signe égal'],
    ['Comment sign', 'Segno di commento', 'Signe de commentaire'],
    ['Comma', 'Virgola', 'Virgule']
  ];
  var GUIDE = [
    ['A program begins with <code>start</code> and finishes with <code>end</code>. Words in quotes are text. A line that begins with <code>#</code> is a note for people; the computer skips it.',
     'Un programma inizia con <code>start</code> e finisce con <code>end</code>. Le parole tra virgolette sono testo. Una riga che inizia con <code>#</code> è una nota per le persone: il computer la salta.',
     'Un programme commence par <code>start</code> et finit par <code>end</code>. Les mots entre guillemets sont du texte. Une ligne qui commence par <code>#</code> est une note pour les humains : l\'ordinateur la saute.'],
    ['<code>define</code> makes a new name. <code>set</code> gives it a new value.',
     '<code>define</code> crea un nuovo nome. <code>set</code> gli dà un nuovo valore.',
     '<code>define</code> crée un nouveau nom. <code>set</code> lui donne une nouvelle valeur.'],
    ['Lines pushed in by two spaces belong to the line above them.',
     'Le righe rientrate di due spazi appartengono alla riga sopra.',
     'Les lignes décalées de deux espaces appartiennent à la ligne du dessus.'],
    ['<code>under 18</code> means less than 18. <code>over 18</code> means 18 or more.',
     '<code>under 18</code> vuol dire meno di 18. <code>over 18</code> vuol dire 18 o più.',
     '<code>under 18</code> veut dire moins de 18. <code>over 18</code> veut dire 18 ou plus.'],
    ['<code>repeat 3</code> does it 3 times. <code>until</code> keeps going until the thing is true.',
     '<code>repeat 3</code> lo fa 3 volte. <code>until</code> continua finché la cosa non è vera.',
     '<code>repeat 3</code> le fait 3 fois. <code>until</code> continue jusqu\'à ce que la chose soit vraie.'],
    ['<code>define ask{1}</code> writes the question. <code>ask{1}</code> asks it. <code>answer{1}</code> is what the person typed.',
     '<code>define ask{1}</code> scrive la domanda. <code>ask{1}</code> la fa. <code>answer{1}</code> è ciò che la persona ha scritto.',
     '<code>define ask{1}</code> écrit la question. <code>ask{1}</code> la pose. <code>answer{1}</code> est ce que la personne a écrit.'],
    ['A function is a few lines with a name. <code>return</code> gives back the result.',
     'Una funzione è qualche riga con un nome. <code>return</code> restituisce il risultato.',
     'Une fonction est quelques lignes avec un nom. <code>return</code> renvoie le résultat.'],
    ['The first item is number 1. <code>append</code> adds one at the end. <code>length</code> counts.',
     'Il primo elemento è il numero 1. <code>append</code> ne aggiunge uno alla fine. <code>length</code> conta.',
     'Le premier élément est le numéro 1. <code>append</code> en ajoute un à la fin. <code>length</code> compte.'],
    ['Only one of the blocks runs. The numbers are the chances and add up to 100.',
     'Viene eseguito un solo blocco. I numeri sono le probabilità e sommano 100.',
     'Un seul des blocs s\'exécute. Les nombres sont les chances et font 100 au total.']
  ];

  var index = lang === 'en' ? 0 : LANGS.indexOf(lang);
  var table = {}, guide = {};
  if (index > 0) {
    UI.forEach(function (row) { table[row[0]] = row[index]; });
    GUIDE.forEach(function (row) { guide[row[0]] = row[index]; });
  }

  var patterns = index === 0 ? [] : [
    [/^Opened (.+)\. Press Run when you are ready\.$/, ['Aperto $1. Premi Esegui quando sei pronto.', 'Ouvert : $1. Appuie sur Lancer quand tu es prêt.']],
    [/^Saved as (.+)\. Look in your Downloads folder\.$/, ['Salvato come $1. Guarda nella cartella Download.', 'Enregistré sous $1. Regarde dans ton dossier Téléchargements.']],
    [/^Line (\d+)$/, ['Riga $1', 'Ligne $1']],
    [/^· (\d+) problems?$/, ['· $1 problemi', '· $1 problèmes']],
    [/^(\d+) matches$/, ['$1 risultati', '$1 résultats']],
    [/^(\d+) match$/, ['1 risultato', '1 résultat']],
    [/^Ln (\d+), Col (\d+)$/, ['Rg $1, Col $2', 'Lg $1, Col $2']],
    [/^(\d+) steps$/, ['$1 passi', '$1 étapes']],
    [/^Nothing$/, ['Niente', 'Rien']]
  ];

  function translate(text) {
    var core = text.trim();
    if (!core) return text;
    var out = null;
    if (Object.prototype.hasOwnProperty.call(table, core)) out = table[core];
    else {
      for (var i = 0; i < patterns.length && out === null; i++) {
        var m = core.match(patterns[i][0]);
        if (m) {
          out = patterns[i][1][index - 1].replace(/\$(\d)/g, function (_, n) { return m[Number(n)]; });
        }
      }
    }
    if (out === null) return text;
    return text.slice(0, text.indexOf(core)) + out + text.slice(text.indexOf(core) + core.length);
  }

  var SKIP = 'pre, textarea, #out, #answer-prompt, #lang, .problem .msg, .problem .hint, script, style';
  function skipped(node) {
    var el = node.nodeType === 1 ? node : node.parentElement;
    return !el || !!el.closest(SKIP);
  }
  function walk(root) {
    var text = document.createTreeWalker(root, NodeFilter.SHOW_TEXT), node, list = [];
    while ((node = text.nextNode())) list.push(node);
    list.forEach(function (n) {
      if (skipped(n)) return;
      var t = translate(n.nodeValue);
      if (t !== n.nodeValue) n.nodeValue = t;
    });
    var scope = root.nodeType === 1 ? [root].concat(Array.prototype.slice.call(root.querySelectorAll('*'))) : [];
    scope.forEach(function (el) {
      if (el.closest && el.closest(SKIP.replace('.problem .msg, .problem .hint, ', ''))) { if (el.id !== 'lang') return; }
      ['title', 'aria-label', 'placeholder'].forEach(function (attr) {
        if (el.hasAttribute && el.hasAttribute(attr)) {
          var t = translate(el.getAttribute(attr));
          if (t !== el.getAttribute(attr)) el.setAttribute(attr, t);
        }
      });
      if (el.matches && el.matches('.guide-grid p') && Object.prototype.hasOwnProperty.call(guide, el.innerHTML)) el.innerHTML = guide[el.innerHTML];
    });
  }

  // Translate only the text between quotes in a piece of Kaviel code.
  var literals = {};
  if (index > 0) (window.KavielStrings || []).forEach(function (row) { literals[row[0]] = row[index]; });
  function code(source) {
    if (index === 0) return source;
    return source.replace(/"((?:[^"\\\n]|\\.)*)"/g, function (whole, inner) {
      return Object.prototype.hasOwnProperty.call(literals, inner) ? '"' + literals[inner] + '"' : whole;
    });
  }
  window.KavielI18n = {lang: lang, code: code, t: translate};

  if (index > 0) {
    document.querySelectorAll('.guide-grid pre').forEach(function (pre) { pre.textContent = code(pre.textContent); });
    walk(document.body);
    new MutationObserver(function (records) {
      records.forEach(function (r) {
        if (r.type === 'characterData') {
          if (!skipped(r.target)) { var t = translate(r.target.nodeValue); if (t !== r.target.nodeValue) r.target.nodeValue = t; }
        } else r.addedNodes.forEach(function (n) {
          if (n.nodeType === 3) { if (!skipped(n)) { var t = translate(n.nodeValue); if (t !== n.nodeValue) n.nodeValue = t; } }
          else if (n.nodeType === 1 && !skipped(n)) walk(n);
        });
      });
    }).observe(document.body, {childList: true, characterData: true, subtree: true});
  }
})();
