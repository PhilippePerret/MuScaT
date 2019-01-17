/*
  Gestion de la partition
*/


function  write(str) {
  $('body').append('<div>' + str + '</div>')
}

// La classe principale
// MuScaT pour "Mu Sc Ta (à l'envers)" pour "Music Score Tagger"
const MuScaT = {
  lines: [],

  // Méthode qui actualise une ligne de donnée (appelée par une instance
  // Tag après son déplacement, par exemple)
  update_line: function(idx, new_line) {
    var   my = this ;
    my.lines[idx] = new_line ;
    // On met la nouvelle ligne dans le clipboard pour la copier-coller
    navigator.clipboard.writeText(new_line + RC) ;
    // On l'actualise immédiatement dans le champ de saisie
    my.update_code();
  },

  // Méthode qui insert une nouvelle ligne de donnée (lorsqu'il y a copie)
  insert_line: function(itag){
    console.log('-> insert_line');
    var   my = this
        , idx = itag.index_line
        , new_line = itag.to_line()

    my.lines.splice(idx, 0, new_line) ;
    // On met la nouvelle ligne dans le clipboard pour la copier-coller
    navigator.clipboard.writeText(new_line + RC) ;
    // On l'actualise immédiatement dans le champ de saisie
    my.update_code() ;
  },

  update_code: function(){
    var my = this ;
    my.codeField().value = my.full_code() ;
  },

  // Retourne le code entier du fichier tags.js, même avec "Tags = `"
  full_code: function(){
    var my = this ;
    var str_code = my.lines.join(RC) ;
    str_code = 'Tags = `'+ RC + str_code + RC + '`;'
    return str_code ;
  },

  codeField: function(){
    return document.getElementById('codeSource');
  },

  // Méthode appelée par le bouton pour afficher le code source
  // On met le code dans un champ de saisie (et dans le clipboard) pour
  // qu'il soit copié-collé
  show_code: function(){
    var my = this ;
    navigator.clipboard.writeText(my.full_code() + RC) ;
    // my.codeField().select();
    // document.execCommand("copy");
    alert(`
Le code complet de votre partition tagguée est copié dans
le presse-papier.

Il vous suffit de le coller dans votre fichier tags.js
en remplaçant tout le code (p.e. sélectionnez tout l'ancien
code avant de coller le nouveau).
`);
  },

  // Chargement et traitement du fichier `tags.js` qui doit définir les
  // tags et les images dans la constante Tags.
  // Ce chargement alimentera la donnée Lines.lines contiendra toutes les
  // lignes, même les lignes vides et les commentaires, pour reproduire
  // un fichier actualisé en cas de déplacement.
  load: function(){
    my = this;

    // Il faut d'abord s'assurer que le fichier tags.js a été correctement
    // défini.
    if ('undefined' == typeof Tags) {
      alert('Il faut définir les images et les « tags » à poser dans le fichier `tag.js`');
      return;
    }

    my.tags   = [];
    my.lines  = [];
    var line_index = -1; // pour commencer à 0
    $('section#tags')[0].innerHTML = ''; // si option code beside utilisé

    // On boucle sur toutes les lignes du fichier tags.js pour
    // traiter les lignes, c'est-à-dire les instancier et les créer
    // dans le document.
    Tags.trim().split(RC).forEach(function(e){
      try {
        var line = e.trim();
        my.lines.push(line);
        line_index += 1
        if (line.length == 0){ throw('--- Chaine vide ---') }
        if (line.substr(0,1) == '#'){ throw('--- Commentaire ---') }
      } catch (e) {
        return ;
      }
      // Une ligne à traiter
      my.treat_line(line, line_index);
    })

    // On finit en plaçant les observers
    this.set_observers();
  },

  // ---------------------------------------------------------------------
  // Méthodes fonctionnelles

  // Traitement d'une ligne de données dans Tags
  treat_line: function(line, iline){
    var my = this ;
    // Épuration de la ligne
    line = line.replace(/\t/g, ' ') ;
    line = line.replace(/ +/g, ' ') ;
    var data_line = line.split(' ') ;
    // Le premier mot doit être connu, sinon on génère une erreur
    if (my.should_know_first_word(data_line[0], iline)){
      tag = new Tag(data_line, iline) ;
      tag.build();
    }
  },

  should_know_first_word: function(kword, idx_line) {
    if (NATURES[kword]) {
      return true ;
    } else {
      alert('Le premier mot « '+kword+' » est inconnu. Je ne peux pas traiter la ligne ' + idx_line + '…')
    }
  },

  set_observers: function(){
    // On rend tous les éléments sensibles au click (mais sans propagation)
    $('section#tags .tag').on('click', CTags.onclick);

    // On ajout un observateur de clic sur les images (ils en ont déjà un
    // par .tag) pour qu'ils donnent les coordonnées au clic de la souris,
    // ce qui peut servir à place un élément sur l'image directement
    $('section#tags img').on('click', $.proxy(Page,'getCoordonates'))

    // On rend tous les éléments draggable
    $('section#tags .drag').draggable(DATA_DRAGGABLE)
  }
}
