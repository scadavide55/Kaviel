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
    ['Switch between light and dark', 'Passa da chiaro a scuro', 'Passer du clair au sombre'],
    ['Stop', 'Ferma', 'Arrêter'],
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
    ['The file could not be read. Your code is unchanged.', 'Non sono riuscito a leggere il file. Il codice è invariato.', 'Le fichier n\'a pas pu être lu. Ton code est inchangé.']
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

  // Lessons: [title, subtitle, [[step title, text, your turn], ...]]
  var LESSONS = {
    it: [
      ['Saluta', 'Il tuo primo programma', [
        ['Fai parlare il computer', 'Un programma è una lista di istruzioni. Il computer le legge dall\'alto verso il basso. Ogni programma inizia con start e finisce con end. La parola print fa dire qualcosa al computer.', 'Clicca il pulsante verde Esegui. Guarda il riquadro Risultato.'],
        ['Di\' più di una cosa', 'Ogni riga print dice una riga. Il computer le fa in ordine, come quando leggi un libro.', 'Aggiungi una riga che dice il tuo nome.'],
        ['Le parole vanno tra virgolette', 'Le parole si chiamano testo e stanno tra virgolette. I numeri non le vogliono. Il computer sa anche fare i conti.', 'Cambia il 7 con la tua età. Poi esegui di nuovo.'],
        ['Note per le persone', 'Una riga che inizia con # è una nota. Il computer la salta. Le note aiutano chi legge il codice dopo.', 'Scrivi una tua nota con # all\'inizio.']]],
      ['Nomi e scatole', 'Ricorda le cose per dopo', [
        ['Una scatola con un nome', 'define crea una scatola e le dà un nome. Ci metti dentro qualcosa. Dopo puoi usare il nome al posto della cosa.', 'Metti il tuo nome nella scatola.'],
        ['Cambia cosa c\'è dentro', 'set mette qualcosa di nuovo in una scatola che esiste già. La cosa vecchia sparisce.', 'Aggiungi un altro set per saltare avanti di dieci anni.'],
        ['Fai i conti', 'Il computer sa sommare +, sottrarre -, moltiplicare * e dividere /. Il segno % dà quello che resta dopo la divisione.', 'Prova un conto più grande, come 123 * 456.'],
        ['Mescola parole e scatole', 'print può mostrare tante cose in una riga. Usa + per attaccare pezzi di testo senza spazio in più.', 'Cambia l\'animale in un uccello. Quante zampe ha un uccello?']]],
      ['Fai domande', 'Parla con chi usa il tuo programma', [
        ['Prepara una domanda, poi falla', 'define ask{1} scrive la domanda numero 1. ask{1} la fa davvero e aspetta. Nel Risultato compare una casella. Scrivi una risposta e premi Invio. answer{1} contiene quello che hai scritto.', 'Eseguilo e scrivi il tuo nome.'],
        ['Due domande', 'Ogni domanda ha il suo numero, così le risposte non si mescolano.', 'Aggiungi una terza domanda sul tuo cibo preferito.'],
        ['Sotto i 18 o sopra i 18', 'Il computer può controllare un numero. under 18 vuol dire meno di 18. over 18 vuol dire 18 o più, quindi 18 conta come over.', 'Eseguilo due volte. Una con 10, una con 18.'],
        ['Trasforma una risposta in numero', 'Le risposte sono sempre testo, anche se scrivi cifre. number() trasforma il testo in un vero numero, così puoi fare i conti.', 'Fai stampare il numero per 100.']]],
      ['Fai scelte', 'Lascia decidere il programma', [
        ['Se questo, allora quello', 'Le righe rientrate sotto if sono sue. Vengono eseguite solo se il controllo è vero. Per rientrare usa due spazi o premi Tab.', 'Cambia il punteggio in 3. Cosa cambia?'],
        ['Altrimenti', 'else è l\'altra strada. Se il controllo è falso, vengono eseguite le righe di else. Si prende una sola strada.', 'Trova un punteggio che fa dire You win!'],
        ['Scegli su una riga', 'Quando il lavoro è piccolo, un secondo = lo mette sulla stessa riga del controllo. Leggilo così: se questo è vero, fai quello.', 'Cambia l\'età in 25.'],
        ['Confronta le parole', 'Si possono confrontare anche le parole. Un solo = chiede: sono uguali? Ricorda che maiuscole e minuscole sono diverse.', 'Cambia red in green.'],
        ['And, or, not', 'and vuole che entrambi i controlli siano veri. or ne vuole uno solo. not trasforma vero in falso. Metti le parentesi attorno al controllo che not deve girare.', 'Prova età 2, poi età 95.']]],
      ['Ancora e ancora', 'I cicli ripetono il lavoro per te', [
        ['Ripeti qualche volta', 'repeat 3 fa tre volte le righe rientrate. Il computer non si stanca mai.', 'Fallo cantare 10 volte.'],
        ['Continua finché', 'until controlla prima. Se il controllo è già vero, salta le righe. Altrimenti le esegue e controlla di nuovo. Dentro deve cambiare qualcosa, o non finisce mai.', 'Cambia 5 in 10.'],
        ['Conta con un ciclo', 'Un ciclo e una scatola fanno un contatore. Questa è la tabellina del sette. Cambi una cosa e compaiono dieci righe.', 'Cambia il 7 con il tuo numero preferito.'],
        ['Esci prima', 'break salta fuori dal ciclo subito. Usalo quando conosci già la risposta.', 'Cambia 50 in 200.']]],
      ['Fortuna', 'Dadi, monete e sorprese', [
        ['Scegli una cosa', 'pick sceglie una cosa a caso da un elenco. Ogni cosa ha la stessa probabilità. Eseguilo più volte per vedere risposte diverse.', 'Aggiungi il tuo animale preferito all\'elenco.'],
        ['Lancia una moneta', 'Scegli tra due sole cose ed ecco una moneta.', 'Eseguilo dieci volte. È giusta?'],
        ['Tira un dado', 'Puoi scegliere anche numeri. Un dado ha sei facce.', 'Cambialo in un dado a 20 facce.'],
        ['Probabilità ingiuste', 'I blocchi random ti fanno decidere la probabilità. Blocchi vicini sono una sola estrazione e ne viene eseguito uno solo. I numeri sommano 100.', 'Rendi il diamante più comune.']]],
      ['I tuoi comandi', 'Dai un nome a qualche riga', [
        ['Crea un comando', 'define con le parentesi crea una funzione: qualche riga con un nome. return restituisce la risposta. Puoi usarla quante volte vuoi.', 'Saluta il tuo migliore amico.'],
        ['Più di un ingresso', 'Metti più nomi dentro le parentesi, separati da virgole. Ognuno esiste solo dentro la funzione.', 'Trova l\'area di un giardino 25 per 8.'],
        ['Comandi che usano comandi', 'Una funzione può usarne altre. Pezzi piccoli fanno programmi grandi.', 'Crea una funzione che triplica un numero.'],
        ['Un comando che richiama se stesso', 'Una funzione può richiamare se stessa, se si avvicina a una fine. Si chiama ricorsione. 5! vuol dire 5 x 4 x 3 x 2 x 1.', 'Prova factorial(10).']]],
      ['Liste', 'Tante cose in un posto', [
        ['Una lista di cose', 'Le parentesi quadre fanno una lista. La prima cosa è la numero 1, la seconda la numero 2 e così via. length dice quante ce ne sono.', 'Stampa il secondo animale.'],
        ['Aggiungi e cambia', 'append mette una cosa nuova alla fine. set può cambiare un posto della lista.', 'Aggiungi altri due animali.'],
        ['Visita ogni elemento', 'Un ciclo con un contatore può visitare ogni posto della lista, uno dopo l\'altro.', 'Aggiungi un animale alla lista. Il ciclo funziona ancora?'],
        ['Somma una lista', 'Una scatola può raccogliere un totale mentre il ciclo visita ogni numero.', 'Aggiungi un altro prezzo.']]],
      ['Premi un tasto', 'Aspetta la tastiera', [
        ['Aspetta un tasto', 'define keypress{1} = C dà un nome al tasto C. La riga if aspetta che quel tasto venga premuto e poi fa la sua domanda. Gli altri tasti vengono ignorati.', 'Eseguilo. Prima prova a premere un tasto sbagliato.'],
        ['Altri tasti', 'Oltre alle lettere puoi usare Enter, Space, Escape, Tab e le frecce: ArrowUp, ArrowDown, ArrowLeft e ArrowRight.', 'Cambia Space in Enter.']]],
      ['Crea un gioco', 'Metti tutto insieme', [
        ['Indovina il numero', 'Il computer sceglie un numero segreto. Tu provi finché lo trovi. Il ciclo continua finché il tuo tentativo è il segreto, e i due piccoli if danno degli indizi.', 'Fai arrivare il numero segreto fino a 20.'],
        ['Un quiz con i punti', 'Una scatola chiamata points conta le risposte giuste. Ogni risposta giusta ne aggiunge una.', 'Scrivi una terza domanda tua.'],
        ['Sasso, carta, forbici', 'Il computer sceglie con pick. Poi le righe if decidono chi ha vinto. È un programma più grande: leggilo piano, una riga alla volta.', 'Aggiungi una riga che dice cosa succede se scrivi altro.']]],
      ['Errori', 'Capitano. Va bene così.', [
        ['Un errore di battitura', 'Tutti sbagliano. Quando una riga è sbagliata, Kaviel la salta, te lo dice e continua. Guarda il riquadro Problemi dopo aver eseguito.', 'Eseguilo. Poi clicca il problema per saltare alla riga.'],
        ['Un nome che non esiste', 'Una scatola va creata con define prima di usarla. Kaviel prova anche a indovinare cosa volevi dire.', 'Correggi la riga togliendo la e in più.'],
        ['Un conto impossibile', 'Certe cose non si possono fare, come dividere per zero. Il programma lo dice e va avanti.', 'Cambia lo 0 in 5.']]]
    ],
    fr: [
      ['Dire bonjour', 'Ton tout premier programme', [
        ['Fais parler l\'ordinateur', 'Un programme est une liste d\'instructions. L\'ordinateur les lit de haut en bas. Chaque programme commence par start et finit par end. Le mot print fait dire quelque chose à l\'ordinateur.', 'Clique sur le bouton vert Lancer. Regarde la boîte Résultat.'],
        ['Dis plusieurs choses', 'Chaque ligne print dit une ligne. L\'ordinateur les fait dans l\'ordre, comme quand tu lis un livre.', 'Ajoute une ligne qui dit ton prénom.'],
        ['Les mots vont entre guillemets', 'Les mots s\'appellent du texte et sont entre guillemets. Les nombres n\'en ont pas besoin. L\'ordinateur sait même faire le calcul.', 'Change le 7 en ton âge. Puis relance.'],
        ['Des notes pour les humains', 'Une ligne qui commence par # est une note. L\'ordinateur la saute. Les notes aident à comprendre le code plus tard.', 'Écris ta propre note avec un # au début.']]],
      ['Noms et boîtes', 'Retenir des choses pour plus tard', [
        ['Une boîte avec un nom', 'define fabrique une boîte et lui donne un nom. Tu mets quelque chose dedans. Ensuite tu peux utiliser le nom à la place de la chose.', 'Mets ton prénom dans la boîte.'],
        ['Change ce qu\'il y a dedans', 'set met quelque chose de nouveau dans une boîte qui existe déjà. L\'ancienne chose disparaît.', 'Ajoute un autre set pour avancer de dix ans.'],
        ['Fais des calculs', 'L\'ordinateur sait additionner +, soustraire -, multiplier * et diviser /. Le signe % donne ce qui reste après la division.', 'Essaie un plus gros calcul, comme 123 * 456.'],
        ['Mélange mots et boîtes', 'print peut montrer plusieurs choses sur une ligne. Utilise + pour coller des morceaux de texte sans espace en plus.', 'Change l\'animal en oiseau. Combien de pattes a un oiseau ?']]],
      ['Pose des questions', 'Parle avec la personne qui utilise ton programme', [
        ['Prépare une question, puis pose-la', 'define ask{1} écrit la question numéro 1. ask{1} la pose vraiment et attend. Une case apparaît dans le Résultat. Écris une réponse et appuie sur Entrée. answer{1} contient ce qui a été écrit.', 'Lance-le et écris ton prénom.'],
        ['Deux questions', 'Chaque question a son numéro, donc les réponses ne se mélangent jamais.', 'Ajoute une troisième question sur ton plat préféré.'],
        ['Moins de 18 ou plus de 18', 'L\'ordinateur peut vérifier un nombre. under 18 veut dire moins de 18. over 18 veut dire 18 ou plus, donc 18 compte comme over.', 'Lance-le deux fois. Une fois avec 10, une fois avec 18.'],
        ['Transforme une réponse en nombre', 'Les réponses sont toujours du texte, même si tu tapes des chiffres. number() transforme le texte en vrai nombre pour pouvoir calculer.', 'Fais afficher le nombre fois 100.']]],
      ['Fais des choix', 'Laisse le programme décider', [
        ['Si ceci, alors cela', 'Les lignes décalées sous if lui appartiennent. Elles ne s\'exécutent que si le test est vrai. Pour décaler, utilise deux espaces ou appuie sur Tab.', 'Change le score en 3. Qu\'est-ce qui change ?'],
        ['Sinon', 'else est l\'autre chemin. Quand le test est faux, les lignes de else s\'exécutent. On ne prend qu\'un seul chemin.', 'Trouve un score qui fait dire You win!'],
        ['Choisis sur une ligne', 'Quand le travail est petit, un deuxième = le met sur la même ligne que le test. Lis-le ainsi : si ceci est vrai, fais cela.', 'Change l\'âge en 25.'],
        ['Compare des mots', 'On peut aussi comparer des mots. Un seul = demande : est-ce pareil ? Souviens-toi que majuscules et minuscules sont différentes.', 'Change red en green.'],
        ['And, or, not', 'and veut que les deux tests soient vrais. or n\'en veut qu\'un. not change vrai en faux. Mets des parenthèses autour du test que not doit retourner.', 'Essaie l\'âge 2, puis l\'âge 95.']]],
      ['Encore et encore', 'Les boucles répètent le travail pour toi', [
        ['Répète quelques fois', 'repeat 3 fait trois fois les lignes décalées. L\'ordinateur ne se fatigue jamais.', 'Fais-le chanter 10 fois.'],
        ['Continue jusqu\'à ce que', 'until vérifie d\'abord. Si le test est déjà vrai, les lignes sont sautées. Sinon elles s\'exécutent et il revérifie. Quelque chose doit changer dedans, sinon ça ne finit jamais.', 'Change 5 en 10.'],
        ['Compte avec une boucle', 'Une boucle et une boîte font un compteur. Voici la table de sept. Tu changes une chose et dix lignes apparaissent.', 'Change le 7 en ton nombre préféré.'],
        ['Sors plus tôt', 'break sort de la boucle tout de suite. Utilise-le quand tu connais déjà la réponse.', 'Change 50 en 200.']]],
      ['Chance', 'Dés, pièces et surprises', [
        ['Choisis une chose', 'pick choisit une chose au hasard dans une liste. Chaque chose a la même chance. Relance plusieurs fois pour voir des réponses différentes.', 'Ajoute ton animal préféré à la liste.'],
        ['Lance une pièce', 'Choisis entre deux choses seulement et tu as une pièce.', 'Lance-le dix fois. Est-elle juste ?'],
        ['Lance un dé', 'Tu peux aussi choisir des nombres. Un dé a six faces.', 'Change-le en dé à 20 faces.'],
        ['Des chances inégales', 'Les blocs random te laissent fixer la chance. Des blocs côte à côte forment un seul tirage et un seul s\'exécute. Les nombres font 100 au total.', 'Rends le diamant plus fréquent.']]],
      ['Tes propres commandes', 'Donne un nom à quelques lignes', [
        ['Crée une commande', 'define avec des parenthèses crée une fonction : quelques lignes avec un nom. return renvoie la réponse. Tu peux l\'utiliser autant de fois que tu veux.', 'Dis bonjour à ton meilleur ami.'],
        ['Plus d\'une entrée', 'Mets plusieurs noms entre les parenthèses, séparés par des virgules. Chacun n\'existe que dans la fonction.', 'Trouve l\'aire d\'un jardin de 25 sur 8.'],
        ['Des commandes qui utilisent des commandes', 'Une fonction peut en utiliser d\'autres. De petits morceaux font de grands programmes.', 'Crée une fonction qui triple un nombre.'],
        ['Une commande qui s\'appelle elle-même', 'Une fonction peut s\'appeler elle-même, tant qu\'elle se rapproche d\'une fin. C\'est la récursivité. 5! veut dire 5 x 4 x 3 x 2 x 1.', 'Essaie factorial(10).']]],
      ['Listes', 'Plein de choses au même endroit', [
        ['Une liste de choses', 'Les crochets font une liste. La première chose est le numéro 1, la deuxième le numéro 2, et ainsi de suite. length dit combien il y en a.', 'Affiche le deuxième animal.'],
        ['Ajoute et change', 'append met une nouvelle chose à la fin. set peut changer une place de la liste.', 'Ajoute deux autres animaux.'],
        ['Visite chaque élément', 'Une boucle avec un compteur peut visiter chaque place de la liste, l\'une après l\'autre.', 'Ajoute un animal à la liste. La boucle marche-t-elle encore ?'],
        ['Additionne une liste', 'Une boîte peut collecter un total pendant que la boucle visite chaque nombre.', 'Ajoute un autre prix.']]],
      ['Appuie sur une touche', 'Attendre le clavier', [
        ['Attends une touche', 'define keypress{1} = C donne un nom à la touche C. La ligne if attend que cette touche soit pressée, puis pose sa question. Les autres touches sont ignorées.', 'Lance-le. Essaie d\'abord une mauvaise touche.'],
        ['D\'autres touches', 'En plus des lettres, tu peux utiliser Enter, Space, Escape, Tab et les flèches : ArrowUp, ArrowDown, ArrowLeft et ArrowRight.', 'Change Space en Enter.']]],
      ['Crée un jeu', 'Mets tout ensemble', [
        ['Devine le nombre', 'L\'ordinateur choisit un nombre secret. Tu essaies jusqu\'à le trouver. La boucle continue jusqu\'à ce que ton essai soit le secret, et les deux petits if donnent des indices.', 'Fais monter le nombre secret jusqu\'à 20.'],
        ['Un quiz avec des points', 'Une boîte appelée points compte les bonnes réponses. Chaque bonne réponse en ajoute une.', 'Écris une troisième question à toi.'],
        ['Pierre, feuille, ciseaux', 'L\'ordinateur choisit avec pick. Ensuite des lignes if décident qui a gagné. C\'est un plus gros programme : lis-le lentement, une ligne à la fois.', 'Ajoute une ligne qui dit ce qui se passe si tu écris autre chose.']]],
      ['Erreurs', 'Ça arrive. Ce n\'est pas grave.', [
        ['Une faute de frappe', 'Tout le monde se trompe. Quand une ligne est fausse, Kaviel la saute, te le dit et continue. Regarde la boîte Problèmes après avoir lancé.', 'Lance-le. Puis clique sur le problème pour aller à la ligne.'],
        ['Un nom qui n\'existe pas', 'Une boîte doit être créée avec define avant d\'être utilisée. Kaviel essaie même de deviner ce que tu voulais dire.', 'Corrige la ligne en enlevant le e en trop.'],
        ['Un calcul impossible', 'Certaines choses sont impossibles, comme diviser par zéro. Le programme le dit et continue.', 'Change le 0 en 5.']]]
    ]
  };

  var index = lang === 'en' ? 0 : LANGS.indexOf(lang);
  var table = {}, guide = {};
  if (index > 0) {
    UI.forEach(function (row) { table[row[0]] = row[index]; });
    GUIDE.forEach(function (row) { guide[row[0]] = row[index]; });
  }
  var lessonTitles = {};
  if (index > 0) LESSONS[lang].forEach(function (l, i) { lessonTitles[i] = l[0]; });

  var patterns = index === 0 ? [] : [
    [/^Opened (.+)\. Press Run when you are ready\.$/, ['Aperto $1. Premi Esegui quando sei pronto.', 'Ouvert : $1. Appuie sur Lancer quand tu es prêt.']],
    [/^Saved as (.+)\. Look in your Downloads folder\.$/, ['Salvato come $1. Guarda nella cartella Download.', 'Enregistré sous $1. Regarde dans ton dossier Téléchargements.']],
    [/^Line (\d+)$/, ['Riga $1', 'Ligne $1']],
    [/^· (\d+) problems?$/, ['· $1 problemi', '· $1 problèmes']],
    [/^(\d+) matches$/, ['$1 risultati', '$1 résultats']],
    [/^(\d+) match$/, ['1 risultato', '1 résultat']],
    [/^Ln (\d+), Col (\d+)$/, ['Rg $1, Col $2', 'Lg $1, Col $2']],
    [/^(\d+) steps$/, ['$1 passi', '$1 étapes']],
    [/^Lesson (\d+): (.*) · step (\d+) of (\d+)$/, ['Lezione $1: $2 · passo $3 di $4', 'Leçon $1 : $2 · étape $3 sur $4']]
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
          out = patterns[i][1][index - 1].replace(/\$(\d)/g, function (_, n) {
            var piece = m[Number(n)];
            if (patterns[i][0].source.indexOf('Lesson') === 1 && n === '2') {
              var li = Number(m[1]) - 1;
              if (lessonTitles[li]) piece = lessonTitles[li];
            }
            return piece;
          });
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

  window.KavielI18n = {
    lang: lang,
    matched: index === 0,
    lessons: function (tutorials) {
      if (index === 0) return;
      var data = LESSONS[lang];
      var ok = data.length === tutorials.length;
      tutorials.forEach(function (lesson, i) {
        var row = data[i];
        if (!row || row[2].length !== lesson.steps.length) { ok = false; return; }
        lesson.title = row[0];
        lesson.subtitle = row[1];
        lesson.steps.forEach(function (step, j) {
          step.title = row[2][j][0];
          step.text = row[2][j][1];
          step.turn = row[2][j][2];
        });
      });
      this.matched = ok;
    }
  };

  if (index > 0) {
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
