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
  // Liste des erreurs rencontrées (sert surtout aux textes)
  motif_lines_added: null,

  // Exécute la fonction +method+ sur tous les tags de this.tags
  onEachTag: function(method, options){
    var i, len ;
    if(options && options.from){i = options.from}
    else {i = 0};
    if(options && options.to){len = options.to + 1}
    else {len = this.tags.length};
    for(i;i<len;++i){method(this.tags[i], i)};
  },
  // Exécute la fonction +method+ sur toutes les lignes de la
  // constante Tags.
  onEachTagsLine: function(method){
    var  i = 0, lines = Tags.trim().split(RC), len = lines.length ;
    for(i;i<len;++i){method(lines[i])};
  },
  // Exécute la fonction +method+ sur toutes les lignes de this.lines
  onEachLine: function(method){
    var i = 0, len = this.lines.length ;
    for(i;i<len;++i){method(this.lines[i])};
  },

  /**
   * Cette méthode est appelée par toutes celles qui lancent des chargements,
   * à commencer par le chargement des langues et de l'analyse courante.
   * Une fois que tout est OK, la méthode lance `start_and_run`
   * Note : cette méthode fonctionne en parallèle de `loading_error` qui est
   * appelée en cas d'erreur.
   */
  loadings: {'messages': false, 'things': false, 'ui': false, 'analyse': false, count: 4},
  test_if_ready: function(loading_id){
    this.loadings[loading_id] = true ;
    -- this.loadings.count ;
    // On doit d'abord attendre que le fichier tags.js soit chargé, avant
    // de charger les locales, car elles dépendent de la langue choisie.
    if(loading_id == 'analyse'){
      Locales.load();
    } else if ( this.loadings.count == 0 ){
      this.start_and_run();
    }
  },

  loading_error: function(){
    F.error(function(){
      switch(M.lang){
        case 'en':
          return 'An error occured. I can’t launch MuScaT, sorry.';
          break;
        default:
          return 'Une erreur fatale est malheureusement survenue. Je ne peux pas lancer MuScaT…';
        }
      }());
  },

  // Première méthode appelée par document.ready
  //
  start_and_run: function(){

    // On prépare l'interface (notamment au niveau de la langue)
    UI.set_ui();

    // console.log('-> start_and_run');
    // On doit construire les éléments d'après les définitions faites dans
    // le fichier tag.js
    this.load() ;

    // On met le titre
    $('span#analyse_name').text(ANALYSE);

    // Pour une raison pas encore expliquée, il arrive que les
    // éléments se bloquent et ne prenent plus leur position
    // absolute (bug dans le draggable de jQuery).
    // Donc, ici, on s'assure toujours que les éléments draggable
    // soit en bonne position
    // On fera la même chose, un peu plus bas, avec les lignes de
    // référence
    this.onEachTag(function(tg){tg.jqObj.css('position','absolute')});

    // Quand on clique sur la partition, en dehors d'un élément,
    // ça déselectionne tout
    // $('#tags').on('click', function(ev){CTags.deselect_all()})
    if(!Options.get('crop image')){
      $('#tags').on('click', $.proxy(Page, 'onClickOut'))
    }

    // Si l'option 'code beside' a été activée, il faut préparer la
    // page
    if (Options.get('code beside')){
      Page.set_code_beside();
    }

    // Si l'option 'lines of reference' a été activée, il faut
    // ajouter les deux lignes repères
    if(Options.get('lines of reference')){
      Page.build_lines_of_reference();
      Page.assure_lines_draggable();
    }
  },

  /**
   * Actualisation de la page
   *
   * Méthode appelée par le bouton sous le champ de texte ou par
   * le raccourci clavier `ALT ENTRÉE` quand on se trouve dans le champ
   * de code.
   *
   */
  update: function(){
    var my = this ;
    my.check_sequence_image_in_tags();
    my.new_tags = new Array();
    my.onEachTagsLine(function(line){
      my.new_tags.push(new Tag(line));
    })
    my.compare_old_and_new_tags();
  },


  compare_old_and_new_tags: function(){
    var my = this ;

    // On remet la liste à rien
    my.lines = new Array();

    // On va passer par une table qui contient en clé l'identifiant et
    // en valeur le tag, pour passer en revue tous les nouveaux tags (ou pas)
    my.htags = {};
    my.onEachTag(function(itag){ my.htags[itag.id] = itag });

    // console.log('tags:', my.tags);
    // console.log('htags:', my.htags);
    // console.log('new_tags:', my.new_tags);

    var i = 0
      , len = my.new_tags.length
      , itag
      ;
    for(i=0;i<len;++i){
      itag = my.new_tags[i] ;

      // Est-ce une copie d'une ligne ? (identifiant déjà traité)
      if(undefined == my.htags[itag.id]){
        itag.reset_id();
      };

      if (itag.id == null) {
        // <= C'est un nouveau tag
        // console.log(`Le tag d'index ${i} est nouveau`);
        itag.id = ++ my.last_tag_id;
        // console.log('Nouveau dernier ID : ', my.last_tag_id);
        itag.real && itag.build_and_watch();
      } else {
        // <= C'est un tag connu
        // console.log(`itag #${itag.id} : ${itag.text || itag.src}`);
        itag.real && itag.compare_and_update(my.htags[itag.id])
        // Dans tous les cas, on le retire de htags (pour savoir ceux
        // qu'il faudra détruire)
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

  /**
   * Méthodes qui actualisent tous les index lignes des
   * tags.
   * À partir de +from_index+ si options le désire.
   */
  update_index_lines: function(options){
    var my = this ;
    my.onEachTag(function(itag, idx){ itag.index_line = idx }, options);
  },
  update_index_line_from:function(from_index){
    this.update_index_lines({from: from_index});
  },


  /**
   * Chargement du fichier tags.js, analyse du code et construction de
   * l'analyse sur la table.
   */
  load: function(){
    var my = this ;

    // Il faut d'abord s'assurer que le fichier tags.js a été correctement
    // défini.
    if ('undefined' == typeof Tags) {
      alert(t('tags-undefined'));
      return ;
    }

    // Pour débug
    // console.log('dans load, Tags=', Tags);

    my.reset_all();

    my.parse_tags_js() ;

    my.set_ids_and_index() ;

    my.build_tags() ;

    if (my.treate_images_spaces) {
      Page.wait_to_treate_images_spaces();
    } else {
      Page.wait_for_images();
    }

    if (Options.get('crop image')){
      my.prepare_crop_image();
    } else {
      // Placement des observers
      this.set_observers();
      // Si des lignes ont été créées au cours ud processus,
      // on demande à l'utilisateur de sauver le code
      if (my.motif_lines_added) {
        my.show_code(t('code-lines-added', {motif: my.motif_lines_added}));
      }
    }

    this.update_code();

    // console.log('À la fin de load, last_tag_id = ', this.last_tag_id);
  },
  // load

  /**
   * Méthode qui prend le code du fichier Tags.js et le décompose pour
   * en tirer le code de l'analyse.
   */
  parse_tags_js: function(){
    var my = this, itag ;
    my.check_sequence_image_in_tags();
    my.onEachTagsLine(function(line){
      itag = new Tag(line) ;
      my.tags.push(itag) ;
      if(itag.id && itag.id > my.last_tag_id){my.last_tag_id = itag.id};
    });
  },
  //parse_tags_js

  /**
   * Méthode qui, avant toute autre opération sur les lignes de la donnée
   * Tags, regarde s'il n'y a pas une séquence d'images à traiter
   * Si c'est le cas, elle modifie le code pour que cette séquence soit
   * bien traitée.
   *
   * Note : l'option 'espacement images' peut modifier l'espacement par
   * défaut
   */
  check_sequence_image_in_tags: function(){
    var my = this
      , lines_finales = new Array()
      , rg
      ;
    my.onEachTagsLine(function(line){
      if(rg = line.match(/^([^\/].*)\[([0-9]+)\-([0-9]+)\]([^ ]+)( (.*))?$/)){
        my.treate_as_sequence_images(rg, lines_finales);
      } else {
        lines_finales.push(line);
      }
    })
    Tags = lines_finales.join(RC);
  },
  treate_as_sequence_images: function(dreg, lines_finales) {
    var my          = this
      , bef_name    = dreg[1]
      , from_indice = Number.parseInt(dreg[2], 10)
      , to_indice   = Number.parseInt(dreg[3], 10)
      , suffix      = dreg[4]
      , aft_name    = (dreg[5]||'')
      , src_name
      , itag
      , i = from_indice
      , data_img    = my.get_data_in_line(aft_name)
      , images_list = new Array()
      ;

    var left      = Options.get('marge gauche')       || DEFAULT_SCORE_LEFT_MARGIN ;
    var top_first = Options.get('marge haut')         || DEFAULT_SCORE_TOP_MARGIN ;
    var voffset   = Options.get('espacement images') ;

    // Pour indiquer qu'il faut calculer la position des images en fonction
    // de 1. l'espacement choisi ou par défaut et 2. la hauteur de l'image
    my.treate_images_spaces = true ;

    // Il faut étudier aft_name pour voir si des données de position ou de
    // taille sont définies
    if (data_img.x) {
      // console.log('La marge gauche est définie à ', data_img.x);
    } else {
      data_img.x = left ;
    }
    if (data_img.y) {
      // console.log("La marge haute est définie à ", data_img.y)
      top_first = data_img.y ;
    } else {
      data_img.y = top_first -  voffset ; // -voffset pour éviter une condition ci-dessous
    }
    if (data_img.w) {
      // console.log("La largeur est définie à ", data_img.w);
    };
    // if (data_img.h){
    //   console.log("La hauteur est définie à ", data_img.h);
    // }

    for(i;i<=to_indice;++i){
      // Placement vertical provisoire. La vraie position sera recalculée dans
      // Page.treate_images_spaces
      data_img.y += voffset ;
      lines_finales.push(bef_name + i + suffix + my.data_in_line_to_str(data_img));
    };
    M.motif_lines_added = t('image-sequentielle');
  },

  // Reçoit {x: 120, y: 130} et retourne " x=120 y=130"
  // Noter le ' ' au début (pour coller directement)
  data_in_line_to_str: function(h){
    var arr = new Array();
    for(var k in h){arr.push(`${k}=${h[k]}`)};
    return ' ' + arr.join(' ')
  },

  get_data_in_line: function(str){
      var h = {} ;
      str = str.trim().replace(/\t/g, ' ') ;
      str = str.replace(/ +/g, ' ') ;
      str.split(' ').forEach(function(paire){
        [prop, value] = paire.split('=');
        h[prop] = value || true ;
      });
      if (h.left)   { h.x = delete h.left   };
      if (h.top)    { h.y = delete h.top    };
      if (h.width)  { h.w = delete h.width  };
      if (h.height) { h.h = delete h.height };
      return h ;
    }

  /**
   * Méthode qui affecte les indices de lignes et les identifiants (aux
   * nouvelles lignes)
   */
  , set_ids_and_index: function(){
      var my = this ;
      my.onEachTag(function(itag, idx){
        itag.index_line = idx ;
        if(itag.id == null){ itag.id = ++ my.last_tag_id };
      });
    }

  /**
   * Méthode qui construit les tags sur la table
   *
   * Note les watchers ne sont pas placés, ici, car ils le seront
   * d'un seul coup (cette méthode est seulement appelée par load)
   */
  , animated: false
  , build_tags: function(){
      var my = this
        ;

      my.onEachTag(function(itag, idx){
        if(my.animated){return};
        my.lines.push(itag.to_line()) ; // p.e. ajout de l'id
        if(itag.real){itag.build()}
        else if(itag.is_comment_line && itag.text.match(/START/)){
          my.animated = true ;
          my.animation_speed = Options.get('animation speed');
          my.build_tags_for_anim(idx);
        }
      });
    }
  , build_tags_for_anim: function(tag_idx){
      var my      = this
        , nbtags  = my.tags.length
        , itag
        , i
        ;
      if (my.timer){clearTimeout(my.timer)};

      // On construit les tags jusqu'à trouver une ligne vide ou un
      // commentaire
      while(true) {
        itag = my.tags[tag_idx];
        if(itag){
          my.lines.push(itag.to_line());
          if ( itag.real ){
            itag.build();
            ++tag_idx ;
          } else {
            break;
          };
        } else {
          return message(t('fin-anim'));
        }
        my.update_code();
      };
      // Noter ci-dessous qu'on reprend le dernir index
      var method_next = $.proxy(MuScaT,'build_tags_for_anim', ++tag_idx) ;
      if (itag.is_comment_line && (itag.text||'').match(/PAUSE/)){
        // On s'arrête là en attendant une touche
        MEvents.onSpaceBar = method_next ;
        message(t('press-space-animation'));
      } else {
        // On marque une pause et on reprend
        my.timer = setTimeout(method_next, 40 * my.animation_speed);
      };
    }
  , prepare_crop_image: function(){
      itag = ITags['obj1'];
      itag.x = 0 ; itag.y = 0 ; itag.update();
      itag.jqObj.css({'position': 'absolute', 'top': 0, 'left': 0});
      message(t('crop-image-ready'));
      this.set_observers_mode_crop();
      // Pour indicer chaque image
      my.indice_cropped_image = 0 ;
    }

  // Méthode qui actualise une ligne de donnée (appelée par une instance
  // Tag après son déplacement, par exemple)
  , update_line: function(idx, new_line) {
      var   my = this ;
      if(undefined == new_line){ new_line = my.tags[idx].to_line() };
      my.lines[idx] = new_line ;
      // On met la nouvelle ligne dans le clipboard pour la copier-coller
      navigator.clipboard.writeText(new_line + RC) ;
      // On l'actualise immédiatement dans le champ de saisie
      my.update_code();
    }

  // Méthode qui insert une nouvelle ligne de donnée (lorsqu'il y a copie)
  , insert_line: function(itag){
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
    }

  , update_code: function(){
      var my = this ;
      my.codeField().value = my.full_code() ;
    }

  // Retourne le code entier du fichier tags.js, mais sans "Tags = `"
  , full_code: function(){
      var my = this ;
      var str_code = my.lines.join(RC) ;
      return str_code ;
    }

  /**
   * Construit (de façon asychrone) le code complet du fichier tags.js
   */
  , build_very_full_code: function(options_to_tags_js){
      var my = this ;
      if (undefined === options_to_tags_js){
        return Options.to_tags_js();
      };
      var vfc = options_to_tags_js + 'Tags = `'+ RC + this.full_code() + RC + '`;' ;
      navigator.clipboard.writeText(vfc);
    }

  , codeField: function(){
      return document.getElementById('codeSource');
    }

  // Méthode appelée par le bouton pour afficher le code source
  // On met le code dans un champ de saisie (et dans le clipboard) pour
  // qu'il soit copié-collé
  , show_code: function(message){
    var my = this ;
    if (!message){message = t('full-code-in-clipboard')};
    F.notice(message);
    my.build_very_full_code();
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
    var rg ;
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
    } else if (rg = line.match(/^([a-z]+) (.*) ([0-9]+) ([0-9]+)$/i)){
      // Est-ce une version raccourcie d'écriture :
      // <nature> <valeur> <y> <x>
      line = `${rg[1]} ${rg[2]} y=${rg[3]} x=${rg[4]}`;
    } ;

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
    var my = this ;
    var res = my.onEachTag(function(itag, i){
      if(itag.real){
        if (itag.y > y) { return Number.parseInt(i,10)};
        if (itag.y == y && itag.x > x){ return Number.parseInt(i,10)};
      }
    });
    if(res == null) { res = -1 };
    return res ;
  },
  // Pour tout réinitialiser chaque fois qu'on actualise l'affichage
  // Pour les tests, appeler plutôt `reset_for_tests` (qui appelle aussi
  // celle-ci)
  reset_all: function(){
    var my = this ;
    my.tags   = new Array();
    my.lines  = new Array();
    my.errors = new Array();
    my.last_tag_id = 0 ; // commence à 1
    $('section#tags')[0].innerHTML = '' ;
    my.treate_images_spaces = false ;
    my.motif_lines_added = null ;
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
    window.onmousedown = $.proxy(M,'onMouseDownModeCrop');
    window.onmouseup   = $.proxy(M,'onMouseUpModeCrop');
    window.onmousemove = $.proxy(M,'onMouseMoveModeCrop');

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
    var scoreTag = ITags['obj1'] ;
    var codeConvert = '-crop ' + w + 'x' + h + '+' + x + '+' + y ;
    var indiceImg  = ++ my.indice_cropped_image ;
    var extensionImg = Options.get('images PNG') ? 'png' : 'jpg' ;
    codeConvert = 'convert ' + scoreTag.src + ' ' + codeConvert + ' ' + scoreTag.src + '-'+indiceImg+'.'+extensionImg;
    navigator.clipboard.writeText(codeConvert);
    message(t('code-to-run', {code: codeConvert}));
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
};
Object.defineProperties(MuScaT,{
  // Langue de l'application (on la change avec l'option 'lang'/'langue')
  lang:{
    get: function(){ return Options.get('lang').toLowerCase() } // 'fr par défaut'
  }
})

// Alias
const M = MuScaT ;
