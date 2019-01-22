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
// La classe principale
// MuScaT pour "Mu Sc Ta (à l'envers)" pour "Music Score Tagger"
const MuScaT = {
  lines: new Array(),
  tags:  new Array(),
  motif_lines_added: null,

  // Première méthode appelée par document.ready
  //
  start_and_run: function(){
    // console.log('-> start_and_run');
    // On doit construire les éléments d'après les définitions faites dans
    // le fichier tag.js
    this.load() ;

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
    var   i = 0
        , lines = Tags.trim().split(RC)
        , len = lines.length
        , line
        , itag
        ;
    my.new_tags = new Array();
    for(i;i<len;++i){
      my.new_tags.push(new Tag(lines[i].trim()));
    };
    // On peut maintenant comparer .tags et .new_tags
    my.compare_old_and_new_tags();
  },
  compare_old_and_new_tags: function(){
    var my = this ;
    var i = 0
      , len   = my.tags.length
      , itag
      ;
    // On remet la liste à rien
    my.lines = new Array();

    // On va passer par une table qui contient en clé l'identifiant et
    // en valeur le tag, pour passer en revue tous les nouveaux tags (ou pas)
    my.htags = {};
    for(i;i<len;++i){
      itag = my.tags[i];
      my.htags[itag.id] = itag;
    }
    // console.log('tags:', my.tags);
    // console.log('htags:', my.htags);
    // console.log('new_tags:', my.new_tags);
    i = 0 ;
    len = my.new_tags.length ;
    for(i=0;i<len;++i){
      itag = my.new_tags[i] ;
      if (itag.id == null) {
        // <= C'est un nouveau tag
        // console.log(`Le tag d'index ${i} est nouveau`);
        itag.id = ++ my.last_tag_id;
        if(itag.real){
          itag.build_and_watch();
        }
      } else {
        // <= C'est un tag connu
        // S'il n'est pas modifié, on
        if (itag.compare_and_update(my.htags[itag.id])){
          // <= Le tag a été modifié
          // console.log(`Le tag ${itag.id} a été modifié`);
        } else {
          // <= Le tag n'a pas été modifié
          // console.log(`Le tag ${itag.id} n'a pas été modifié`);
        }
        // Dans tous les cas, on le retire de htags
        delete my.htags[itag.id] ;
      }

      my.lines.push(itag.to_line());
    };

    // Il doit rester dans htags les tags supprimés
    for(var id in my.htags){
      itag = my.htags[id] ;
      itag.destroy() ;
      // console.log(`Le tag #${itag.id} a été supprimé`);
    }

    // On passe la liste
    my.tags = my.new_tags ;

    // On actualise les index de lignes
    my.update_index_lines();
    // On actualise le code
    my.update_code();
  },


  update_index_lines: function(){
    var my = this
      , i = 0
      , len = my.tags.length
      ;
    for(i;i<len;++i){ my.tags[i].index_line = i }
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
    var my = this ;

    // Il faut d'abord s'assurer que le fichier tags.js a été correctement
    // défini.
    if ('undefined' == typeof Tags) {
      alert('Il faut définir les images et les « tags » à poser dans le fichier `tag.js`');
      return ;
    }

    // Pour débug
    // console.log('dans load, Tags=', Tags);

    my.reset_all();

    my.parse_tags_js() ;

    my.set_ids_and_index() ;

    my.build_tags() ;

    if (get_option('crop image')){
      my.prepare_crop_image();
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

    this.update_code();

  },
  // load

  /**
   * Méthode qui prend le code du fichier Tags.js et le décompose pour
   * en tirer le code de l'analyse.
   */
  parse_tags_js: function(){
    var my = this
      , lines
      , iline = 0
      , line
      , lineCode
      , lines_count
      ;

    // On boucle sur toutes les lignes de Tags tags.js pour
    // traiter les lignes, c'est-à-dire les instancier et les créer
    // dans le document.
    lines = Tags.trim().split(RC) ;
    lines_count = lines.length ;
    // Boucle sur toutes les lignes
    for(iline;iline<lines_count;++iline){
      my.tags.push(new Tag(lines[iline].trim()));
    }
  },
  //parse_tags_js

  /**
   * Méthode qui affecte les indices de lignes et les identifiants (aux
   * nouvelles lignes)
   */
  set_ids_and_index: function(){
    var i = 0, len = this.tags.length, itag ;
    for(i;i<len;++i){
      itag = this.tags[i] ; // Tag ou TagNot
      itag.index_line = i ;
      // On définit toujours l'ID du tag, même s'il est déjà défini,
      // car cela définit le domId
      // itag.set_id(itag.id || ++this.last_tag_id) ;
      if(itag.id == null){ itag.id = ++this.last_tag_id };
    }
  },
  /**
   * Méthode qui construit les tags sur la table
   */
  build_tags: function(){
    var i = 0, len = this.tags.length;
    for(i;i<len;++i){
      this.lines.push(this.tags[i].to_line()) ; // p.e. ajout de l'id
      if(this.tags[i].real){this.tags[i].build()};
    }
  },

  prepare_crop_image: function(){
    itag = ITags['obj0'];
    itag.x = 0 ; itag.y = 0 ; itag.update();
    itag.jqObj.css({'position': 'absolute', 'top': 0, 'left': 0});
    message("La découpe de l'image est prête.");
    this.set_observers_mode_crop();
    // Pour indicer chaque image
    my.indice_cropped_image = 0 ;
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

    if (idx == -1) {
      my.lines.push(new_line);
      my.tags.push(itag)
      idx = my.tags.length - 1 ;
      itag.index_line = idx ;
      console.log(`Ligne insérée : "${new_line}" à la fin`);
    } else {
      my.lines.splice(idx, 0, new_line) ;
      my.tags.splice(idx, 0, itag);
      console.log(`Ligne insérée : "${new_line}" à l'index ${idx}`);

      // Après l'insertion d'une nouvelle ligne, il faut modifier l'index
      // de tous les tags suivants
      var i   = idx + 1
        , len = my.tags.length
        ;
      for(i;i<len;++i ){
        var tg = my.tags[i] ;
        console.log(`- +1 à index de ligne ${tg.index_line} (${tg.to_line()})`);
        tg.index_line += 1 ;
      }

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
    var   my = this
        , opts = new Array()
        , opt ;
    for(opt in OPTIONS){
      if (!OPTIONS[opt].aka){
        if(OPTIONS[opt].boolean){
          if (OPTIONS[opt].value) {opts.push("'" + opt + "'")};
        } else {
          var val = OPTIONS[opt].value ;
          if ('string' == typeof(val)){ val= "'"+val+"'"}
          opts.push("'" + opt + "', " + val);
        }

      };
    };
    if (opts.length){
      opts = 'options(' + opts.join(', ') + ') ;' + RC ;
    } else {
      opts = '' ;
    };
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
    console.log('-> show_code');
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

  /**
   * Méthode qui reçoit la ligne brute, telle qu'elle peut se trouver dans
   * le Tags du fichier tags.js et qui retourne un objet contenant
   * :data et :locked
   * :data est la liste des parties de la ligne (split avec espace), sans
   * la marque de verrou.
   * :locked est mis à true si la ligne est verrouillée.
   *
   * Note : cette méthode sert aussi bien lors du chargement que lors de
   * la modification des lignes.
   */
  epure_and_split_raw_line: function(line){
    line = line.trim().replace(/\t/g, ' ') ;
    line = line.replace(/ +/g, ' ') ;
    // Marque de ligne verrouillée
    var premier_car = line.substring(0,1);
    var locked_line = premier_car == '*' || premier_car == '•' || line.substring(0,2) == '🔒' ;
    if (locked_line){
      // <= C'est une ligne verrouillée
      firstoff = line.substring(0,2) == '🔒' ? 2 : 1
      line = line.substring(firstoff,line.length).trim();
    }
    // La ligne est-elle un commentaire ou une ligne vide qui contient
    // son identifiant ?
    id = null ;
    if (rg = line.match(/#([0-9]+)#/)){
      id    = Number.parseInt(rg[1],10) ;
      line  = line.replace(/#([0-9]+)#/,'').trim();
    }
    return {data: line.split(' '), locked: locked_line, id: id}
  },

  /**
   * Recherche l'index de ligne d'un tag qui serait à la position x/y
   * si les lignes correspondent à l'affichage.
   * Cette méthode est appelée à la création d'un nouvelle élément (par
   * duplication au départ) pour savoir où ajouter la nouvelle ligne,
   * pour ne pas la mettre à la fin.
   */
  get_line_for_position: function(x, y){
    var my = this
      , i  = 0
      , len = my.tags.length
      , itag
      ;
    for(i;i<len;++i){
      itag = my.tags[i] ;
      if(itag.real){
        if (itag.y > y) { return Number.parseInt(i,10)};
        if (itag.y == y && itag.x > x){ return Number.parseInt(i,10)};
      }
    }
    return -1 ;
  },
  // Pour tout réinitialiser chaque fois qu'on actualise l'affichage
  // Pour les tests, appeler plutôt `reset_for_tests` (qui appelle aussi
  // celle-ci)
  reset_all: function(){
    var my = this ;
    my.tags   = new Array();
    my.lines  = new Array();
    my.last_tag_id = -1 ;
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
      if (OPTIONS[k].boolean){ OPTIONS[k].value = false;}
      else {OPTIONS[k].value = null };
    }
  }
}

// Alias
const M = MuScaT ;
