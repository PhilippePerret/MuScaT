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
  motif_lines_added: null,

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
    var   my = this
        , idx = itag.index_line
        , new_line = itag.to_line()

    my.lines.splice(idx, 0, new_line) ;
    // Après l'insertion d'une nouvelle ligne, il faut modifier l'index
    // de tous les tags suivants
    for(var i = idx ; i <= last_tag_id ; ++i ){
      var itag = ITags['obj'+i];
      itag.index_line += 1 ;
    }
    // On met la nouvelle ligne dans le clipboard pour la copier-coller
    navigator.clipboard.writeText(new_line + RC) ;
    // On l'actualise immédiatement dans le champ de saisie
    my.update_code() ;
  },

  update_code: function(){
    var my = this ;
    my.codeField().value = my.full_code() ;
  },

  // Retourne le code entier du fichier tags.js, mais sans "Tags = `"
  full_code: function(){
    var my = this ;
    var str_code = my.lines.join(RC) ;
    return str_code ;
  },

  // Retourne le code entier du fichier tags.js, même avec "Tags ="
  // et les options définies
  very_full_code: function(){
    var   opts = new Array()
        , opt ;
    for(opt in OPTIONS){
      if (OPTIONS[opt]){ opts.push("'" + opt + "'") }
    }
    if (opts.length){
      opts = 'options(' + opts.join(', ') + ') ;' + RC
    } else {
      opts = '' ;
    }
    // Le code complet re-composé
    return opts + 'Tags = `'+ RC + my.full_code() + RC + '`;'
  },

  codeField: function(){
    return document.getElementById('codeSource');
  },

  // Méthode appelée par le bouton pour afficher le code source
  // On met le code dans un champ de saisie (et dans le clipboard) pour
  // qu'il soit copié-collé
  show_code: function(message){
    var my = this ;
    // my.codeField().select();
    // document.execCommand("copy");
    if (!message){
      message = `
  Le code complet de votre partition tagguée est copié dans
  le presse-papier.

  Il vous suffit de le coller dans votre fichier tags.js
  en remplaçant tout le code (p.e. sélectionnez tout l'ancien
  code avant de coller le nouveau).
      `
    }

    alert(message);

    navigator.clipboard.writeText(my.very_full_code + RC) ;

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

    my.reset_all();
    var line_index = -1; // pour commencer à 0
    $('section#tags')[0].innerHTML = ''; // si option code beside utilisé

    // On boucle sur toutes les lignes du fichier tags.js pour
    // traiter les lignes, c'est-à-dire les instancier et les créer
    // dans le document.
    lines = Tags.trim().split(RC);
    for(var i = 0, len=lines.length;i<len; ++i){
      e = lines[i];
      try {
        var line = e.trim();
        my.lines.push(line);
        line_index += 1
        if (line.length == 0){ throw('--- Chaine vide ---') }
        if (line.substr(0,2) == '//'){ throw('--- Commentaire ---') }
      } catch (e) {
        continue ;
      }
      // Une ligne à traiter
      line_index = new LineCode(line, line_index).treate();
      // line_index = my.treat_line(line, line_index);
      // En mode crop image, il ne faut traiter qu'une fois
      if (get_option('crop image')){
        break;
      }
    }
    // Fin de boucle sur toutes les lignes

    if (get_option('crop image')){
      itag = ITags['obj0'];
      itag.x = 0 ; itag.y = 0 ; itag.update();
      itag.jqObj.css({'position': 'absolute', 'top': 0, 'left': 0});
      message("La découpe de l'image est prête.");
      this.set_observers_mode_crop();
      // Pour indicer chaque image
      my.indice_cropped_image = 0 ;
    } else {

      // Placement des observers
      this.set_observers();

      // Si des lignes ont été créées au cours ud processus,
      // on demande à l'utilisateur de sauver le code
      if (my.motif_lines_added) {
        my.show_code(`
  Des lignes de code ont été ajoutées ($(my.motif_lines_added)), le nouveau code
  a été copié dans le presse-papier pour pouvoir être collé dans votre fichier
  tags.js.
        `);
      }
    }
  },

  // ---------------------------------------------------------------------
  // Méthodes fonctionnelles

  // Pour tout réinitialiser chaque fois qu'on actualise l'affichage
  reset_all: function(){
    my.tags   = new Array();
    my.lines  = new Array();
    window.last_tag_id = -1 ;
    // ITags = {};
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
  },

  /**
   * Placement des observers pour le mode crop qui permet de découper une
   * image. Ou plus exactement, de définir les coordonnées de la découpe
   */
  set_observers_mode_crop: function(){
    // console.log('-> set_observers_mode_crop');
    // var   my = this
    //     , scoreTag = ITags['obj0']
    //     , scoreObj = scoreTag.jqObj ;

    window.onmousedown = $.proxy(MuScaT,'onMouseDownModeCrop');
    window.onmouseup   = $.proxy(MuScaT,'onMouseUpModeCrop');
    window.onmousemove = $.proxy(MuScaT,'onMouseMoveModeCrop');

    // console.log('<- set_observers_mode_crop');
  },
  cropper: function(){
    this._cropper = document.getElementById('cropper');
    if (this._cropper) {
      return this._cropper;
    } else {
      $('#tags').append('<div id="cropper" style="position:absolute;border:1px dashed green;"></div>');
      return this.cropper();
    }
  },
  onMouseDownModeCrop:function(ev){
    console.log('-> onMouseDownModeCrop');
    var   my = this
        , x = ev.pageX
        , y = ev.pageY ;
    my.cropStartX = x ;
    my.cropStartY = y ;
    var cropper = my.cropper();
    cropper.style.left = my.cropStartX + 'px' ;
    cropper.style.top = my.cropStartY + 'px' ;
    cropper.style.borderStyle = 'dashed';
    cropper.style.borderColor = 'green';
    my.scropping = true ;
    return stop(ev);
  },
  onMouseUpModeCrop: function(ev){
    // Quand on passe par ici, c'est qu'on a fini de sélectionner
    // la zone de l'image que l'on veut découper.
    // La méthode donne le code à utiliser pour convert
    console.log('-> onMouseUpModeCrop');
    var   my = this ;
    my.cropEndX = ev.pageX ;
    my.cropEndY = ev.pageY ;
    my.scropping = false ;
    var cropper = my.cropper();
    cropper.style.borderStyle = 'solid';
    cropper.style.borderColor = 'blue';

    // Calcul des valeurs
    var w = my.cropEndX - my.cropStartX ;
    var h = my.cropEndY - my.cropStartY ;
    var x = my.cropStartX ;
    var y = my.cropStartY ;
    // document.getElementById('tags').removeChild(my.cropper);
    var scoreTag = ITags['obj0'] ;
    var codeConvert = '-crop ' + w + 'x' + h + '+' + x + '+' + y ;
    var indiceImg  = ++ my.indice_cropped_image ;
    var extensionImg = get_option('images PNG') ? 'png' : 'jpg' ;
    codeConvert = 'convert ' + scoreTag.src + ' ' + codeConvert + ' ' + scoreTag.src + '-'+indiceImg+'.'+extensionImg;
    navigator.clipboard.writeText(codeConvert);
    message('Code à jouer en console : ' + codeConvert + ' (copié dans le presse-papier)');
    return stop(ev);
  },
  onMouseMoveModeCrop: function(ev){
    var   my = this
        , w = ev.pageX - my.cropStartX
        , h = ev.pageY - my.cropStartY ;
    if(my.scropping){
      var cropper = my.cropper();
      cropper.style.width  = w + 'px';
      cropper.style.height = h + 'px';
    }
    // console.log(x + ' / ' + y);
    return stop(ev);
  }
}

Object.defineProperties(MuScaT, {
})
