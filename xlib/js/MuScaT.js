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
      o.val(my.veryFullCode());
      o.show().focus().select();
      UI.toggle_tools();
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

};
// Alias
const M = MuScaT ;
