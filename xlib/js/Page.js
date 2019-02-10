/**
  * Pour la gestion de la page
  */
const Page = {
    class: 'Page'
  , RECTIF_X: 30  // On peut aussi utiliser RX (cf. tout en bas)
  , RECTIF_Y: 30  // On peut aussi utiliser RY (cf. tout en bas)
  /**
    * Ajoute un élément quelconque dans la page (image, cadence, accord, etc.)
    *
    * +itag+ Instance Tag de l'élément à mettre dans la page
    *
    * Note : la méthode n'ajoute plus le tag à CTags, il faut le faire
    * au moment de la création de l'instance définitive (pas à son instanciation
    * car on instancie des Tags sans pour autant qu'ils existent vraiment).
    */
  , add: function(itag) {
      var my = this;
      // Note : avant, on faisait des corrections pour les valeurs, pour que
      // la première fois des tags ne se retrouvent pas au même endroit. On ne
      // le fait plus, ça pose trop de problèmes.
      // Si on est en mode animation, on doit faire apparaitre l'élément
      // doucement.
      var xpage = 1 ;
      my.table_analyse.append(itag.to_html());
    }

  /**
   * Méthode appelée par le bouton "Actualiser" pour prendre le code dans
   * le champ de texte et le passer à la moulinette.
   * Raccourci : ALT+ENTRÉE
   */
  , update: function(){
      message(t('update-required'));
      Tags = MuScaT.codeField().value ;
      MuScaT.update();
      message(' ');
    }

    /**
     * Reçoit un noeud (tag sur la table) et retourne l'itag
     * correspondant.
     */
  , tagFromNode: function(node){
      return CTags[Number.parseInt(node.getAttribute('data-id'),10)];
    }

  /**
    * Méthode appelée quand on clique sur la page, en dehors d'un tag
    * Ça permet notamment de :
    *   . fermer la boite d'outils si elle était ouvert
    *   . tout désélectionner
    *   . mettre les coordonnées dans le presse-papier
    *   . déclencher la sélection par rectangle
    */
  , onClickOut: function(ev){
      // console.log(ev);
      if(UI.tools_are_opened()){UI.hide_tools()};
      CTags.deselectAll();
      Page.getCoordonates(ev);
    }

  , onMouseDown: function(ev){
      // console.log('-> Page.onMouseDown')
      // this.rectSelection.start();
      return true;
    }
  , onMouseUp: function(ev){
      // this.rectSelection.stop();
      // +ev+ n'est pas défini, par exemple, quand on passe par ici avec
      // la touche ESCAPE.
      if(ev){
        this.onClickOut(ev);
        return stop(ev);
      } else { return false };
    }

  /**
   * On doit s'assurer que les images sont bien chargées. Dans le cas
   * contraire, on signale une erreur à l'utilisateur.
   * Il y a deux méthodes pour gérer ça :
   *  - `wait_for_images`, qui est utilisée lorsque le code ne contient
   *    pas d'image-séquence.
   *  - `wait_to_treate_images_spaces` qui est utilisée lorsque le code
   *    contient une image-séquence.
   */
  , wait_for_images: function(){
      return new Promise(function(ok,ko){
        Page.counts = {
            images:  $('#tags img').length
          , loaded:  0
          , treated: 0
          , errors:  new Array()
        };
        // S'il n'y a aucune image, on peut s'arrêter tout de suite
        if (Page.counts.images == 0){return ok();}
        $('#tags img')
          .on('load', function(){
            // On passe ici chaque fois qu'une image est chargée
            Page.counts.loaded ++ ;
            Page.counts.treated ++ ;
            if(Page.counts.treated == Page.counts.images){
              // Toutes les images ont été traitées, soit en bon soit en
              // erreur
              Page.conclusions_images();
              ok();
            }
          })
          .on('error', function(){
            // On passe ici chaque fois qu'une image pose problème
            Page.counts.errors.push($(this)[0].src) ;
            Page.counts.treated ++ ;
            if(Page.counts.treated == Page.counts.images){
              Page.conclusions_images();
              ok();// Oui, car une erreur, même la dernière, ne peut être fatale
            }
          })
      });
    }
  , conclusions_images: function(){
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
        var msg = `${t('images-errors-occured', {errors: errs.join(RC+'  - '), rc: RC})}${RC+RC}${t('please-fix-the-code')}`
        error(msg);
      }
    }

  , wait_to_treate_images_spaces: function(){
      var my = this ;
      return new Promise(function(ok,ko){
        Page.loadImages()
          .then(Page.treate_images_spaces)
          .then(ok);
      })
    }

  , loadImages: function(){
      return new Promise(function(ok,ko){
        var unloadeds = $('#tags img').length ;
        $('#tags img')
          .on('load error', function(){
            -- unloadeds ;
            if(unloadeds == 0){ok()};
            return true;
          });
      })
    }

  , treate_images_spaces: function(fn_suite){
      return new Promise(function(ok,ko){
        var voffset = asPixels(Options.get('espacement images') || DEFAULT_SCORES_SPACES) ;
        var topImage ;
        CTags.onEachTag(function(itag){
          if(!itag.is_image){return};
          if(undefined == topImage){
            // <= Première image (ne pas la bouger)
            topImage = Number.parseInt(itag.jqObj.offset().top,10) ;
          } else {
            itag.y = topImage ;
            itag.jqObj.css('top', topImage + 'px');
          }
          // Pour la prochaine image
          topImage = topImage + itag.jqObj.height() + voffset;
        });
        ok();
      })
    }

  /**
   * Affiche la ligne horizontale et la ligne verticale qui permettent
   * d'aligner des éléments.
   */
   , build_lines_of_reference: function(){
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

     }

   , assure_lines_draggable: function(){
       $('#refline_h').css('position','fixed');
       $('#refline_v').css('position','fixed');
     }
  , showVisorMaybe: function(){
      if(Options.get('visor')){this.showVisorAtCoordonates();}
    }
  , showVisorAtCoordonates: function(){
      var my = this ;
      if($('#visor').length == 0){
        var nod = document.createElement('div');
        nod.id = 'visor';
        $('#tags').append(nod);
      } else { nod = $('#visor')[0] };
      nod.style.left = this.lastX+'px';
      nod.style.top  = this.lastY+'px';
  }

  // Fonction qui affiche et met dans le presse papier les coordonnées
  // au click de souris.
  // La méthode est utilisées aussi bien pour la page en dehors des tags
  // que pour une image cliquée
  , getCoordonates: function(ev){
      // console.log(ev);
      var x = this.lastX = ev.pageX - 45 ;
      var y = this.lastY = ev.pageY - 45 ;
      // var x = ev.offsetX - 15 ;
      // var y = ev.offsetY - 15 ;
      clip(' x='+x+" y="+y);
      message(`« x=${x} y=${y} » -> ${t('clipboard')}`);
      this.showVisorMaybe();
    }

  , observe: function(){
      // Pour le rectangle de sélection
      // Pour initier tous les déplacements (dont le rectangle de sélection
      // mais tous les autres aussi)
      Mover.init();
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

});

const RX = Page.RECTIF_X;
const RY = Page.RECTIF_Y;
