/**
  * Pour la gestion de la page
  */
const Page = {

  /**
   * Méthode appelée par le bouton "Actualiser" pour prendre le code dans
   * le champ de texte et le passer à la moulinette.
   * Raccourci : ALT+ENTRÉE
   */
  update: function(){
    message('Actualisation demandée…');
    Tags = MuScaT.codeField().value ;
    MuScaT.update();
    message(' ');
  },

  /**
   * On doit s'assurer que les images sont bien chargées. Dans le cas
   * contraire, on signale une erreur à l'utilisateur.
   * Il y a deux méthodes pour gérer ça :
   *  - `wait_for_images`, qui est utilisée lorsque le code ne contient
   *    pas d'image-séquence.
   *  - `wait_to_treate_images_spaces` qui est utilisée lorsque le code
   *    contient une image-séquence.
   */
  wait_for_images: function(){
    var my = this ;
    my.counts = {
        images:  $('#tags img').length
      , loaded:  0
      , treated: 0
      , errors:  new Array()
    };
    $('#tags img')
      .on('load', function(){
        // On passe ici chaque fois qu'une image est chargée
        my.counts.loaded ++ ;
        my.counts.treated ++ ;
        if(my.counts.treated == my.counts.images){ my.conclusions_images() }
      })
      .on('error', function(){
        // On passe ici chaque fois qu'une image pose problème
        my.counts.errors.push($(this)[0].src) ;
        my.counts.treated ++ ;
        if(my.counts.treated == my.counts.images){ my.conclusions_images() }
        return true ;
      })
  },
  conclusions_images: function(){
    var my = this ;
    // Si des erreurs sont survenues
    if(my.counts.errors.length){
      var errs = new Array();
      // On va réduire le path à son path relatif dans le dossier
      // images de la table d'analyse.
      for(var path of my.counts.errors){
        var spath = new Array();
        for(var pname of path.split('/').reverse()){
          if(pname == '_table_analyse_'){break};
          spath.push(pname);
        }
        errs.push(spath.reverse().slice(2, spath.length).join('/'));
      }
      var msg = `Des erreurs sont survenues avec les images suivantes (introuvables) :${RC}  - ${errs.join(RC+'  - ')}${RC+RC}Merci de corriger le texte de votre analyse.`
      error(msg);
    }
  },
  wait_to_treate_images_spaces: function(){
    var my = this ;
    var unloadeds = $('.tags img').length ;
    $('.tags img')
      .on('load error', function(){
        -- unloadeds ;
        if(!unloadeds){my.treate_images_spaces()};
      });
  },
  treate_images_spaces: function(){
    var voffset = Options.get('espacement images') || DEFAULT_SCORES_SPACES ;
    var topImage ;
    M.onEachTag(function(itag){
      if(!itag.is_image){return};
      if(undefined == topImage){
        // <= Première image (ne pas la bouger)
        topImage = itag.jqObj.offset().top ;
      } else {
        itag.y = topImage ;
        itag.jqObj.css('top', topImage + 'px');
      }
      // Pour la prochaine image
      topImage = topImage + itag.jqObj.height() + voffset;
    });
  },

  /**
   * Préparation de la fenêtre pour travailler avec le code
   * à côté de la partition.
   */
  set_code_beside: function(){
    $('section#rcolumn').show();
  },

  /**
   * Affiche la ligne horizontale et la ligne verticale qui permettent
   * d'aligner des éléments.
   */
   build_lines_of_reference: function(){
     $('#refline_h').show();
     $('#refline_v').show();
     $('#refline_h').draggable({axis: 'x', stop:function(ev,ui){Cook.set('hline-left', ui.helper.offset().left)}});
     $('#refline_v').draggable({axis: 'y', stop:function(ev,ui){Cook.set('vline-top', ui.helper.offset().top)}});

     // La position des lignes repères peut être explicitement définie
     // dans le fichier _tags_.js (option), ou par cookie, après un premier
     // déplacement. La définition dans le fichier _tags_.js est toujours
     // prioritaire.
     var vpos = Options.get('vertical line offset') || Cook.get('vline-top');
     if(vpos){$('#refline_v').css('top', vpos + 'px')};
     var hpos = Options.get('horizontal line offset') || Cook.get('hline-left');
     if(hpos){$('#refline_h').css('left', hpos + 'px')};

   },

   assure_lines_draggable: function(){
     $('#refline_h').css('position','fixed');
     $('#refline_v').css('position','fixed');
   },

  /**
    * Ajoute un élément quelconque dans la page (image, cadence, accord, etc.)
    *
    * +itag+ Instance Tag de l'élément à mettre dans la page
    */
  // Pour ajouter un tag à la page
  // +itag+ est une instance Tag
  add: function(itag) {
    var my = this;
    // Note : avant, on faisait des corrections pour les valeurs, pour que
    // la première fois des tags ne se retrouvent pas au même endroit. On ne
    // le fait plus, ça pose trop de problèmes.
    // Si on est en mode animation, on doit faire apparaitre l'élément
    // doucement.
    var xpage = 1 ;
    my.table_analyse.append(M.animated ? $(itag.to_html()).fadeIn() : itag.to_html()) ;

    ITags[itag.domId] = itag ;

    // Si on est en mode animation, il faut voir si le tag est bien
    // placé dans la page (on doit le voir entièrement)
    if(M.animated){itag.scrollToIt()};

  },

  /**
    * Méthode appelée quand on clique sur la page, en dehors d'un tag
    * Ça permet notamment de :
    *   . fermer la boite d'outils si elle était ouvert
    *   . tout désélectionner
    *   . mettre les coordonnées dans le presse-papier
    */
  onClickOut: function(ev){
    // console.log(ev);
    if(UI.tools_are_opened()){UI.hide_tools()};
    CTags.deselect_all();
    this.getCoordonates(ev);
  },

  // Fonction qui affiche et met dans le presse papier les coordonnées
  // au click de souris.
  // La méthode est utilisées aussi bien pour la page en dehors des tags
  // que pour une image cliquée
  getCoordonates: function(ev){
    // console.log(ev);
    // var x = ev.pageX ;
    // var y = ev.pageY ;
    var x = ev.offsetX - 15 ;
    var y = ev.offsetY - 15 ;
    clip(' x='+x+" y="+y);
    message(`« x=${x} y=${y} » -> ${t('clipboard')}`);
  }
};
Object.defineProperties(Page,{
    pour_virgule: {}
  , table_analyse: {
      get: function(){
        if (!this._table_analyse){ this._table_analyse = $('#tags')};
        return this._table_analyse ;
      }
    }

})
