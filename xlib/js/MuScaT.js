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
    // Liste des erreurs rencontrées (sert surtout aux textes)
  motif_lines_added: null

    /**
     * Toute première méthode appelée, qui va charger le fichier de données
     * _tags_.js de l'application. S'il ne le trouve pas ou qu'une erreur
     * se produit, l'application charge l'analyse 'Analyse_Sonate_Haydn' qui
     * se trouve toujours dans la distribution.
     */
  , load_analyse_data: function(){
      console.warn("OBSOLÈTE. La méthode load_analyse_data ne doit plus servir")
    }

    /**
      En cas de succès du chargement des données de l'analyse
    **/
  , onLoadingAnalyseDataOK: function(ok){
      console.warn("OBSOLÈTE. La méthode onLoadingAnalyseDataOK ne doit plus servir")
    }
    /**
      En cas d'erreur de chargement de l'analyse voulue
      (on charge l'analyse de Haydn qui se trouve toujours dans la distribution)
    **/
  , onLoadingAnalyseDataError: function(e){
      console.warn("OBSOLÈTE. La méthode onLoadingAnalyseDataError ne doit plus servir")
    }


  , load_analyse_of: function(analyse_folder_name){
      console.warn("OBSOLÈTE. La méthode load_analyse_of ne doit plus servir")
    }

  , start_and_run: function(){
      console.warn("OBSOLÈTE. La méthode start_and_run ne doit plus servir")
    }

    /**
     * Quand l'animation est demandée
     */
  , run_animation: function(){
      this.loadModule('Animation').then(function(){Animation.start()});
    }
    /**
     * Chargement du fichier _tags_.js, analyse du code et construction de
     * l'analyse sur la table.
     */
  , load: function(){
      console.warn("Le méthode MuScaT.load est obsolète")
    } // Fin du chargement des éléments

  , postLoad: function(){
      D.dfn('MuScaT#postLoad');
      return new Promise(function(ok,ko){
        // On met le titre du dossier d'analyse



        // Quand on clique sur la partition, en dehors d'un élément,
        // ça déselectionne tout
        // $('#tags').on('click', function(ev){CTags.deselectAll()})
        // Dans tous les cas, on construit les liTags
        // ULTags.build();
        // Si l'option 'lines-of-reference' a été activée, il faut
        // ajouter les deux lignes repères
        ok();
      });
    }
  , traite_images: function(){
      console.warn("OBSOLÈTE. La fonction traite_images ne doit plus être utilisée")
    }
    /**
      * Finir le chargement
     */
  , endLoadingImages: function(){
      console.warn("OBSOLÈTE. La fonction endLoadingImages ne doit plus être utilisée")
    } // load


  /**
   * Méthode qui construit les tags sur la table
   *
   * Note les watchers ne sont pas placés, ici, car ils le seront
   * d'un seul coup (cette méthode est seulement appelée par load)
   */
  , animated: false
  , build_tags: function(){
      console.warn("-> build_tags OBSOLÈTE")
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
      et le fichier tags.js nouvelle formule
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
      console.warn("OBSOLÈTE. Cf. Analyse.parseTags")
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
      console.warn("-> check_sequence_image_in_tags OBSOLÈTE")
    }
  , treate_as_sequence_images: function(dreg, lines_finales) {
      console.warn('-> treate_as_sequence_images OBSOLÈTE')
    }


  // ---------------------------------------------------------------------
  // Méthodes fonctionnelles


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
// Alias
const M = MuScaT ;
