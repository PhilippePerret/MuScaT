/*
  Gestion de la partition
  -----------------------

  Class MuScaT (alias : M)
  -------------

  M.tags      Contient dans l'ordre la liste des instances Tag de chaque
              ligne.
              Attention car chaque élément n'est pas un tag. Les commentaires
              ou les lignes vides sont des notag (pour pouvoir posséder des
              méthodes communes)
*/
// La classe principale
// MuScaT pour "Mu Sc Ta (à l'envers)" pour "Music Score Tagger"
const MuScaT = {
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

  /**
   * Cette méthode est appelée par toutes celles qui lancent des chargements,
   * à commencer par le chargement des langues et de l'analyse courante.
   * Une fois que tout est OK, la méthode lance `start_and_run`
   * Note : cette méthode fonctionne en parallèle de `loading_error` qui est
   * appelée en cas d'erreur.
   */
  loadings: {'messages': false, 'things': false, 'ui': false, 'analyse': false, 'theme': false, count: 5},
  test_if_ready: function(loading_id){
    this.loadings[loading_id] = true ;
    -- this.loadings.count ;
    // On doit d'abord attendre que le fichier _tags_.js soit chargé, avant
    // de charger les locales, car elles dépendent de la langue choisie.
    if(loading_id == 'analyse'){
      Locales.load();
      Theme.load(); // TODO vérifier si ça marche ou s'il faut charger plus tard
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

    // On met le titre du dossier d'analyse
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
      Page.table_analyse.on('click', $.proxy(Page, 'onClickOut'));
    }
    // Si l'option 'code beside' a été activée, il faut préparer la
    // page
    if (Options.get('code beside')){
      Page.set_code_beside();
    }

    // Dans tous les cas, maintenant, on construit la liste des tags
    ULTags.build();

    // Si l'option 'lines of reference' a été activée, il faut
    // ajouter les deux lignes repères
    if(Options.get('lines of reference')){
      Page.build_lines_of_reference();
      Page.assure_lines_draggable();
    }
  },

  /**
   * Chargement du fichier _tags_.js, analyse du code et construction de
   * l'analyse sur la table.
   */
  load: function(){
    var my = this ;

    // Il faut d'abord s'assurer que le fichier _tags_.js a été correctement
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
      my.loadModule('cropper', function(){$.proxy(MuScaT, 'prepare_crop_image')()});
    } else {
      // Placement des observers
      this.set_observers();
      // Si des lignes ont été créées au cours ud processus,
      // on demande à l'utilisateur de sauver le code
      if (my.motif_lines_added) {
        my.show_code(t('code-lines-added', {motif: my.motif_lines_added}));
      }
    }

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
          if ( itag.real ){
            itag.build();
            ++tag_idx ;
          } else {
            break;
          };
        } else {
          return message(t('fin-anim'));
        }
      };
      // Noter ci-dessous qu'on reprend le dernir index
      var method_next = $.proxy(MuScaT,'build_tags_for_anim', ++tag_idx) ;
      if (itag.is_comment_line && (itag.text||'').match(/PAUSE/)){
        // On s'arrête là en attendant une touche
        MEvents.onSpaceBar = method_next ;
        message(t('press-space-animation'));
      } else {
        // On marque une pause et on reprend
        my.timer = setTimeout(method_next, 40 * (100 - my.animation_speed));
      };
    }

  // Retourne le code complet des lignes de tags
  , full_code: function(){
      var arr = new Array() ;
      this.onEachTag(function(itag){arr.push(itag.to_line())})
      return arr.join(RC) ;
    }

  /**
   * Construit (de façon asychrone) le code complet du fichier _tags_.js
   */
  , build_very_full_code: function(options_to_tags_js){
      var my = this ;
      if (undefined === options_to_tags_js){
        return Options.to_tags_js();
      };
      return options_to_tags_js + 'Tags = `'+ RC + this.full_code() + RC + '`;' ;
    }

  // Méthode appelée par le bouton pour afficher le code source
  // On met le code dans le clipboard pour qu'il soit copié-collé
  , show_code: function(message){
    var my = this ;
    if (!message){message = t('full-code-in-clipboard')};
    F.notify(message);
    navigator.clipboard.writeText(my.build_very_full_code());
  },

  // ---------------------------------------------------------------------
  // Méthodes fonctionnelles

  /**
   * Méthode qui reçoit la ligne brute, telle qu'elle peut se trouver dans
   * le Tags du fichier _tags_.js et qui retourne un objet contenant
   * :data et :locked
   * :data est la liste des parties de la ligne (split avec espace), sans
   * la marque de verrou.
   * :locked est mis à true si la ligne est verrouillée.
   *
   * Note : cette méthode sert aussi bien lors du chargement que lors de
   * la modification des lignes.
   */
   // TODO Cette méthode doit être placée ailleurs, c'est plutôt une méthode de CTags
  epure_and_split_raw_line: function(line){
    var rg
      , type // 'real-tag', 'empty-line', 'comments-line'
      ;
    line = line.trim().replace(/\t/g, ' ') ;
    line = line.replace(/ +/g, ' ') ;
    // Marque de ligne verrouillée
    var premier_car = line.substring(0,1);
    var locked_line = premier_car == '*' || premier_car == '•' || line.substring(0,2) == '🔒' ;
    if (locked_line){
      // <= C'est une ligne verrouillée
      firstoff = line.substring(0,2) == '🔒' ? 2 : 1
      line = line.substring(firstoff,line.length).trim();
    };

    if (rg = line.match(/^([a-z]+) (.*) ([0-9]+) ([0-9]+)$/i)){
      // Est-ce une version raccourcie d'écriture :
      // <nature> <valeur> <y> <x>
      line = `${rg[1]} ${rg[2]} y=${rg[3]} x=${rg[4]}`;
    };

    return {data: line.split(' '), locked: locked_line, nature_init: line.split(' ')[0]}
  },

  // Pour tout réinitialiser chaque fois qu'on actualise l'affichage
  // Pour les tests, appeler plutôt `reset_for_tests` (qui appelle aussi
  // celle-ci)
  reset_all: function(){
    var my = this ;
    my.tags   = new Array();
    my.errors = new Array();
    my.last_tag_id = 0 ; // commence à 1
    Page.table_analyse[0].innerHTML = '' ;
    my.treate_images_spaces = false ;
    my.motif_lines_added = null ;
    // ITags = {};
  },

  set_observers: function(){
    // On rend tous les éléments sensibles au click (mais sans propagation)
    Page.table_analyse.find('.tag').on('click', CTags.onclick);
    // On ajout un observateur de clic sur les images (ils en ont déjà un
    // par .tag) pour qu'ils donnent les coordonnées au clic de la souris,
    // ce qui peut servir à place un élément sur l'image directement
    Page.table_analyse.find('img').on('click', $.proxy(Page,'getCoordonates'))
    // On rend tous les éléments draggable
    Page.table_analyse.find('.drag').draggable(DATA_DRAGGABLE)
  }

  /**
   * Chargement d'un module du dossier xlib/js/modules
   *
   * +module_name+  Le nom du module, sans 'js'
   * +fn_callback+  La méthode à appeler. Penser que cette méthode ne peut
   *                pas être une méthode du module puisqu'elle n'existe pas
   *                encore au moment du chargement. En revanche, ça peut être
   *                une fonction qui appelle cette méthode.
   */
  , loadModule: function(module_name, fn_callback){
      var nod = document.body.appendChild(document.createElement('script'));
      nod.src = `xlib/js/modules/${module_name}.js`;
      $(nod)
        .on('load', function(){fn_callback();})
        .on('error', function(){
          F.error(t('loading-module-failed', {name: module_name}));
        })
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
