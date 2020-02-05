/*
  Gestion de la partition
  -----------------------

  Class MuScaT (alias : M)
  -------------

  Alias plus pratique : M

*/
// La classe principale
// MuScaT pour "Mu Sc Ta (à l'envers)" pour "Music Score Tagger"
const MuScaT = {
  class: 'MuScaT'
    // Liste des erreurs rencontrées (sert surtout aux textes)
  , motif_lines_added: null

    // Pour les tests, pour savoir que le premier fichier tags.js a été
    // chargé et ne pas le charger à chaque fois
  , tags_file_loaded: false

    /**
     * Nouvelle méthode utilisant les promises pour charger tous les
     * premiers éléments asynchrones.
     */
  , preload: function(){
      return new Promise(function(ok, ko){
        Cook.parse();

        // TODO DÉFINIR L'ANALYSE COURANTE POUR QUE A SOIT DÉFINI
        
        A.loadOptions() // pour connaitre la langue et le thème (if any)
        .then(Locales.PLoad)
        .then(Theme.PLoad)
        .then(ok)
        .catch(this.onPreloadError.bind(this))
    }
  , onPreloadError: function(err){
      error(err)
    }

  , loading_error: function(){
      F.error(function(){
        switch(M.lang){
          case 'en':
            return 'An error occured. Can’t launch MuScaT, sorry.';
            break;
          default:
            return 'Une erreur fatale est malheureusement survenue. Je ne peux pas lancer MuScaT…';
          }
        }());
    }

    /**
     * Toute première méthode appelée, qui va charger le fichier de données
     * _tags_.js de l'application. S'il ne le trouve pas ou qu'une erreur
     * se produit, l'application charge l'analyse 'Analyse_Sonate_Haydn' qui
     * se trouve toujours dans la distribution.
     */
  , load_analyse_data: function(){
      D.dfn('MuScaT#load_analyse_data');
      var my = this ;
      if (my.tags_file_loaded){// Pour le cas des tests par exemple
        return new Promise(function(ok,ko){ok()});
      };
      return new Promise(function(ok, ko){
        // On charge les éléments de l'analyse courante
        my.load_analyse_of(my.analyse_name)
          .then(this.onLoadingAnalyseDataOK.bind(this))
          .catch(this.onLoadingAnalyseDataError.bind(this))
      })
    }

    /**
      En cas de succès du chargement des données de l'analyse
    **/
  , onLoadingAnalyseDataOK: function(ok){
      console.log("load_analyse_of ok (analyse_name = '%s')", my.analyse_name)
      M.tags_file_loaded = true ;
      ok();
    }
    /**
      En cas d'erreur de chargement de l'analyse voulue
      (on charge l'analyse de Haydn qui se trouve toujours dans la distribution)
    **/
  , onLoadingAnalyseDataError: function(e){
      if (my.analyse_name == 'Analyse_Sonate_Haydn'){
        M.loading_error('analyse');
        console.error(e);
      } else {
        my.analyse_name = 'Analyse_Sonate_Haydn';
        ok();
        return my.load_analyse_data();
      }
    }


  , load_analyse_of: function(analyse_folder_name){
      var nodetags;
      return new Promise(function(ok, ko){
        nodetags = document.body.appendChild(document.createElement('script'));
        nodetags.id = 'script_tags_js';
        try {
          console.log("analyse_folder_name = ", analyse_folder_name)
          nodetags.src = `_analyses_/${analyse_folder_name}/_tags_.js`;
          D.dv('tags.js src', nodetags.src, 4);
          console.log("Fichier tags.js chargé avec succès (%s)", nodetags.src)

          Analyse.current = new Analyse(analyse_folder_name) // => A
          // Chargement par le fichier JSON (tags.json)
          A.loadTags()

        } catch (e) {
          console.error("ERREUR EN CHARGEANT ", nodetags.src)
          console.error(e)
          $(nodetags).remove();
          return ko();
        };
        $(nodetags)
          .on('load', ok)
          .on('error',function(e){
            // console.error(e);
            $(nodetags).remove();
            ko();
          });
      })
    }

  , start_and_run: function(){
      D.dfn('MuScat#start_and_run');
      return new Promise(function(ok,ko){
        // On prépare l'interface (notamment au niveau de la langue)
        UI.set_ui();
        // On doit construire les éléments d'après les définitions faites dans
        // le fichier tag.js
        M.load()
          .then(M.postLoad)
          .then(function(){
            D.d('--- END STARTUP ---');
            ok();
          })
          .catch(function(err){
            console.error('Une erreur s’est produite');
            console.error(err);
          });
      });
    }

    /**
     * Quand l'animation est demandée
     */
  , run_animation: function(){
      this.loadModule('Anim').then(function(){Anim.start()});
    }
    /**
     * Chargement du fichier _tags_.js, analyse du code et construction de
     * l'analyse sur la table.
     */
  , load: function(){
      D.dfn('Muscat#load')
      return new Promise(function(ok,ko){
        if ('undefined' == typeof Tags) {return alert(t('tags-undefined'))};
        M.reset_all();
        M.parse_tags_js();
        M.build_tags();
        M.traite_images()
          .then(M.endLoadingImages)
          .then(ok);
      });
    } // Fin du chargement des éléments

  , postLoad: function(){
      D.dfn('MuScaT#postLoad');
      return new Promise(function(ok,ko){
        // On met le titre du dossier d'analyse
        $('span#analyse_name').text(M.analyse_name);

        // Pour une raison pas encore expliquée, il arrive que les
        // éléments se bloquent et ne prenent plus leur position
        // absolute (bug dans le draggable de jQuery).
        // Donc, ici, on s'assure toujours que les éléments draggable
        // soit en bonne position
        // On fera la même chose, un peu plus bas, avec les lignes de
        // référence
        CTags.onEachTag(function(tg){tg.jqObj.css('position','absolute')});

        // Quand on clique sur la partition, en dehors d'un élément,
        // ça déselectionne tout
        // $('#tags').on('click', function(ev){CTags.deselectAll()})
        if(!Options.get('crop-image')){Page.observe()};
        // Dans tous les cas, on construit les liTags
        ULTags.build();
        // Si l'option 'lines-of-reference' a été activée, il faut
        // ajouter les deux lignes repères
        if(Options.get('lines-of-reference')){
          Page.build_lines_of_reference();
          Page.assure_lines_draggable();
        }
        // Si c'est une animation, on est prêt à la jouer
        if(M.animated){M.run_animation()};
        ok();
      });
    }
  , traite_images: function(){
      D.dfn('MuScaT#traite_images');
      return new Promise(function(ok,ko){
        if (M.treate_images_spaces) {
          Page.wait_to_treate_images_spaces().then(ok);
        } else {
          Page.wait_for_images().then(ok);
        }
      });
    }
    /**
      * Finir le chargement
     */
  , endLoadingImages: function(){
      D.dfn('MuScaT#endLoadingImages');
      return new Promise(function(ok,ko){
        if (Options.get('crop-image')){
          M.loadModule('cropper').then(function(){M.prepare_crop_image.bind(M)()});
        } else {
          // Si des lignes ont été créées au cours ud processus,
          // on demande à l'utilisateur de sauver le code
          if (M.motif_lines_added) {
            M.codeAnalyseInClipboard(t('code-lines-added', {motif: M.motif_lines_added}));
          }
        };
        ok();
      });
    } // load


  /**
   * Méthode qui construit les tags sur la table
   *
   * Note les watchers ne sont pas placés, ici, car ils le seront
   * d'un seul coup (cette méthode est seulement appelée par load)
   */
  , animated: false
  , build_tags: function(){
      var my = this ;
      // On construit d'abord tous les tags, mais en les masquant si c'est
      // pour une animation.
      CTags.onEachTag(function(itag){
        if(itag.real){itag.build({visible: !my.animated})};
        if(itag.is_anim_start){my.animated = true}
      });
    }

  // Méthode appelée par le bouton pour afficher le code source
  // On met le code dans le clipboard pour qu'il soit copié-collé
  , codeAnalyseInClipboard: function(message){
      console.warn("On ne met plus le code dans le clipboard (supprimer l'appel à la méthode 'codeAnalyseInClipboard')")
    }
  /**
   * Méthode secours pour obtenir le code complet de l'analyse,
   * quand la copie dans le presse-papier ne fonctionne pas.
   */
  , codeCompletSecours: function(){
      var my = this;
      var o = $('textarea#code-complet-secours');
      o.val(my.build_very_full_code());
      o.show().focus().select();
      UI.toggle_tools();
    }
  /**
   * Construit (de façon asychrone) le code complet du fichier _tags_.js
   */
  , build_very_full_code: function(){
      var my = this ;
      return '// Version X.X' + RC+RC + 'Tags = `'+ RC + this.full_code() + RC + '`;';
    }

  // Retourne le code complet des lignes de tags
  , full_code: function(){
      return this.full_code_lines().join(RC) ;
    }

    /**
      Retourne les lignes de code en format complet
      Pour le fichier _tags_.js ancienne formule (cf. full_code)
      et le fichier tags.json nouvelle formule
    **/
  , full_code_lines: function(){
      var arr = new Array() ;
      ULTags.onEachLITag(function(litag){
        arr.push(CTags[litag.id].to_line());
      })
      return arr
    }

  /**
   * Méthode qui prend le code du fichier Tags.js et le décompose pour
   * en tirer le code de l'analyse.
   */
  , parse_tags_js: function(){
      var my = this, itag ;
      console.log('-> parse_tags_js')
      my.check_sequence_image_in_tags();
      A.onEachTagsLine(function(line){
        CTags.push(new Tag(line)) ;
      });
    }

  /**
   * Méthode qui, avant toute autre opération sur les lignes de la donnée
   * Tags, regarde s'il n'y a pas une séquence d'images à traiter
   * Si c'est le cas, elle modifie le code pour que cette séquence soit
   * bien traitée.
   *
   * Note : l'option 'espacement-images' peut modifier l'espacement par
   * défaut
   */
  , check_sequence_image_in_tags: function(){
      console.log('-> check_sequence_image_in_tags')
      var my = this
        , lines_finales = new Array()
        , rg
        ;
      A.onEachTagsLine(function(line){
        // console.log("LINE: '%s'", line)
        if(rg = line.match(/^([^\/].*)\[([0-9]+)\-([0-9]+)\]([^ ]+)( (.*))?$/)){
          my.treate_as_sequence_images(rg, lines_finales);
        } else {
          lines_finales.push(line);
        }
      })
      Tags = lines_finales.join(RC);
    }
  , treate_as_sequence_images: function(dreg, lines_finales) {
      console.log('-> treate_as_sequence_images')
      var my          = this
        , bef_name    = dreg[1]
        , from_indice = Number.parseInt(dreg[2], 10)
        , to_indice   = Number.parseInt(dreg[3], 10)
        , suffix      = dreg[4]
        , aft_name    = (dreg[5]||'')
        , src_name
        , itag
        , i = from_indice
        , data_img    = CTags.parseLine(aft_name)
        , images_list = new Array()
        ;

      var left      = asPixels(Options.get('marge-gauche') || DEFAULT_SCORE_LEFT_MARGIN) ;
      var top_first = asPixels(Options.get('marge-haut') || DEFAULT_SCORE_TOP_MARGIN) ;
      var voffset   = asPixels(Options.get('espacement-images')) ;

      // Pour indiquer qu'il faut calculer la position des images en fonction
      // de 1. l'espacement choisi ou par défaut et 2. la hauteur de l'image
      my.treate_images_spaces = true ;

      // Il faut étudier aft_name pour voir si des données de position ou de
      // taille sont définies
      if (data_img.x) {
        // console.log('La marge-gauche est définie à ', data_img.x);
      } else {
        data_img.x = asPixels(left) ;
      }
      if (data_img.y) {
        // console.log("La marge-haute est définie à ", data_img.y)
        top_first = asPixels(data_img.y) ;
      } else {
        data_img.y = top_first - voffset ; // -voffset pour éviter une condition ci-dessous
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
        lines_finales.push(`${bef_name}${i}${suffix} ${CTags.compactLine(data_img)}`);
      };
      M.motif_lines_added = t('image-sequentielle');
    }


  // ---------------------------------------------------------------------
  // Méthodes fonctionnelles

  // Pour tout réinitialiser chaque fois qu'on actualise l'affichage
  // Pour les tests, appeler plutôt `reset_for_tests` (qui appelle aussi
  // celle-ci)
  , reset_all: function(){
      var my = this ;
      my.errors = new Array();
      CTags.last_tag_id = 0 ; // commence à 1
      Page.table_analyse[0].innerHTML = '' ;
      my.treate_images_spaces = false ;
      my.motif_lines_added = null ;
    }

  , loadModule: function(module_name){
      return new Promise(function(ok,ko){
        var nod = document.body.appendChild(document.createElement('script'));
        nod.src = `xlib/js/modules/${module_name}.js`;
        $(nod)
          .on('load', ok)
          .on('error', function(e){
            F.error(t('loading-module-failed', {name: module_name}));
          })
      });
  }
};
Object.defineProperties(MuScaT,{
  // Langue de l'application (on la change avec l'option 'lang'/'langue')
  lang:{
    get: function(){ return Options.get('lang').toLowerCase() } // 'fr par défaut'
  }
    /**
     * Le dossier contenant les images de l'analyse courante
     */
  , images_folder: {
      get:function(){
        if(!this._images_folder){
          this._images_folder = `_analyses_/${this.analyse_name}/images`;
        };
        return this._images_folder;
      }
      , set: function(value){
          // Pour les tests, on a besoin de redéfinir le path des images
          this._images_folder = value;
        }
    }

})

// Alias
const M = MuScaT ;
