/*
  Gestion de la partition
  -----------------------

  Class MuScaT (alias : M)
  -------------

  M.lines     Contient dans l'ordre la liste des lignes physiques du code
              telles qu'elles peuvent être affichées, par exemple, dans le
              champ source

  M.tags      Contient dans l'ordre la liste des instances Tag de chaque
              ligne. En fait, on pourrait se passer de M.lines et reconstituer
              la liste des lignes en bouclant sur M.tags
              Attention car chaque élément n'est pas un tag. Les commentaires
              ou les lignes vides sont des notag (pour pouvoir posséder des
              méthodes communes)
*/


function  write(str) {
  $('body').append('<div>' + str + '</div>')
}

// La classe principale
// MuScaT pour "Mu Sc Ta (à l'envers)" pour "Music Score Tagger"
const MuScaT = {
  lines: [],
  motif_lines_added: null,

  // Première méthode appelée par document.ready
  //
  start_and_run: function(){
    // console.log('-> start_and_run');
    // On doit construire les éléments d'après les définitions faites dans
    // le fichier tag.js
    this.load() ;

    // return ; // pour le moment

    // Quand on clique sur la partition, en dehors d'un élément,
    // ça déselectionne tout
    // $('#tags').on('click', function(ev){CTags.desectionne_all()})
    if(!get_option('crop image')){
      $('#tags').on('click', $.proxy(Page, 'onClickOut'))
    }

    // Si l'option 'code beside' a été activée, il faut préparer la
    // page
    if (get_option('code beside')){
      Page.set_code_beside();
    }

    // Si l'option 'lines of reference' a été activée, il faut
    // ajouter les deux lignes repères
    if(get_option('lines of reference')){
      Page.build_lines_of_reference();
    }
  },

  /**
   * Actualisation de la page
   *
   * Méthode appelée par le bouton sous le champ de texte ou par
   * le raccourci clavier `ALT ENTRÉE` quand on se trouve dans le champ
   * de code.
   *
   * La méthode relit le code `Tags` (actualisé par Page.update) et regarde
   * les modifications opérées, qui peuvent être :
   *
   *  * une ligne n'a pas d'id => c'est un nouveau tag, on l'insère
   *  * une ligne a un id et elle est identique => on ne la touche pas
   *  * une ligne a un id et elle est différente => on l'actualise
   *
   */
  update: function(){
    var my = this ;
    // On boucle sur toutes les lignes de Tags tags.js pour
    // traiter les lignes, c'est-à-dire les instancier et les créer
    // dans le document.
    // TODO Noter que c'est presque la même méthode que pour `load` et
    // qu'il faut peut-être être plus DRY en employant un traitement à
    // peine différent
    var line_index = -1 ; // 0-start

    var   i=0
        , lines = Tags.trim().split(RC)
        , len=lines.length
        , line
        , itag
        , itag_prov ;

    for(i;i<len;++i){
      line = lines[i];
      try {
        var line = line.trim();
        line_index += 1

        // La ligne est strictement identique à ce qu'elle était précédemment,
        // on peut passer à la suite
        if (line == my.lines[line_index]){continue};

        // Ici, il faudrait voir si la ligne à un identifiant
        // Cet identifiant pour les lignes vide ou de commentaire, est
        // indiqué à la fin de la ligne par #<id>#
        // Pour un tag, il est noté `id=<id>`

        // On prend le tag qui se trouve normalement sur cette ligne
        // Remarquer qu'il a pu être modifié après l'ajout d'un nouveau tag
        // ici (ou d'une nouvelle ligne)
        itag = my.tags[line_index];
        // On construit un Tag provisoire avec la ligne courante, qui
        // nous dira si c'est un nouveau tag ou un tag modifié
        itag_prov = new TagProv(line, line_index);

        if(itag_prov.id){
          // <= le tag possède un identifiant
          // => il est connu, mais il ne correspond pas forcément à l'itag
          //    qui devrait se trouver là
          if (itag_prov.id == itag.id){
            // <= le tag correspond au tag qui se trouve sur cette ligne
            // => il faut juste l'updater avec les nouvelles données
            // TODO
          }
        } else {
          // <= C'est un tout nouveau tag (ou ligne vide, commentaire, etc.)
          // => On l'insert
          if(itag_prov.is_real_tag){
            line_index = new LineCode(line, line_index).treate();
          } else {
            // <= Pour une ligne de commentaire ou une ligne vide
            my.tags.splice(line_index, 0, new TagNot(line, line_index));
            my.lines.splice(line_index, 0, my.tags[line_index].to_line());
            // TODO Est-ce qu'on change les line_index ici ou on le
            // fera après la boucle ?
          }
        }
        // my.lines.push(line);
        // my.tags.push(new NoTag(line, line_index)); // renseigné plus tard
        // // console.log('Nombre de M.tags: ', M.tags.length);
        // if (line.length == 0){ throw('--- Chaine vide ---') }
        // if (line.substr(0,2) == '//'){ throw('--- Commentaire ---') }
      } catch (e) {
        console.error(e);
        continue ;
      }
      // // Une ligne à traiter
      // line_index = new LineCode(line, line_index).treate();
      // // line_index = my.treat_line(line, line_index);
      // // En mode crop image, il ne faut traiter qu'une fois
      // if (get_option('crop image')){
      //   break;
      // }
    }
    // Fin de boucle sur toutes les lignes

    this.update_code();

  },

  // Chargement et traitement du fichier `tags.js` qui doit définir les
  // tags et les images dans la constante Tags.
  //
  // Ce chargement alimentera la donnée Lines.lines contiendra toutes les
  // lignes, même les lignes vides et les commentaires, pour reproduire
  // un fichier actualisé en cas de déplacement.
  /**
   * Pour le moment, la méthode est appelée aussi à l'actualisation demandée
   * C'est-à-dire que tout le code de l'analyse est toujours reconstruit lors
   * d'une actualisation.
   * QUESTION: Ne serait-ce pas moins lourd de n'actualiser que ce qui doit
   * l'être ?
   */
  load: function(){
    my = this;

    // Il faut d'abord s'assurer que le fichier tags.js a été correctement
    // défini.
    if ('undefined' == typeof Tags) {
      alert('Il faut définir les images et les « tags » à poser dans le fichier `tag.js`');
      return ;
    }

    my.reset_all();
    var line_index = -1; // pour commencer à 0

    // On boucle sur toutes les lignes de Tags tags.js pour
    // traiter les lignes, c'est-à-dire les instancier et les créer
    // dans le document.
    lines = Tags.trim().split(RC);
    for(var i = 0, len=lines.length;i<len; ++i){
      e = lines[i];
      try {
        var line = e.trim();
        line_index += 1
        my.lines.push(line);
        my.tags.push(new TagNot(line, line_index)); // renseigné plus tard
        // console.log('Nombre de M.tags: ', M.tags.length);
        if (line.length == 0){ throw('--- Chaine vide ---') }
        if (line.substr(0,2) == '//'){ throw('--- Commentaire ---') }
      } catch (e) {
        // console.error(e);
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
  Des lignes de code ont été ajoutées (${my.motif_lines_added}), le nouveau code
  a été copié dans le presse-papier pour pouvoir être collé dans votre fichier
  tags.js.
        `);
      }
    }
  },

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
    my.tags.splice(idx, 0, itag);
    console.log(`Ligne insérée : "${new_line}" à l'index ${idx}`);

    // Après l'insertion d'une nouvelle ligne, il faut modifier l'index
    // de tous les tags suivants
    for(var i = idx + 1 ; i <= last_tag_id ; ++i ){
      var itag = my.tags[idx] ;
      console.log(`- +1 à index de ligne ${itag.index_line} (${itag.to_line()})`);
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

    navigator.clipboard.writeText(my.very_full_code() + RC) ;

  },


  // ---------------------------------------------------------------------
  // Méthodes fonctionnelles

  // Pour tout réinitialiser chaque fois qu'on actualise l'affichage
  // Pour les tests, appeler plutôt `reset_for_tests` (qui appelle aussi
  // celle-ci)
  reset_all: function(){
    my.tags   = new Array();
    my.lines  = new Array();
    window.last_tag_id = -1 ;
    $('section#tags')[0].innerHTML = '' ;
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
    // console.log('-> onMouseUpModeCrop');
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
  },



  // Pour remettre toutes les options à false
  reset_options: function(){
    for(var k in OPTIONS){
      if ('boolean' == typeof(OPTIONS[k])){OPTIONS[k] = false};
    }
  }
}

Object.defineProperties(MuScaT, {
})

// Alias
const M = MuScaT ;
