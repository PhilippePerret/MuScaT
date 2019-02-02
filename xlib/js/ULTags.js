
const ULTags = {
    'pour': 'virgule'

  , items:    new Array() // les LITags
  , selected: null        // LITag sélectionné ou Null
  , activated: false      // Pour les gestionnaires de touche

    /**
     * Joue la méthode +method+ sur tous les LITags, mais en les
     * prenant dans le DOM, c'est-à-dire dans l'ordre affiché.
     */
  , onEachLITag: function(method){
      var my = this ;
      my.jqObj.find('> li').each(function(idx, olitag){
        var litag = my.domObjetToLITag(olitag);
        if(litag.destroyed){
          // Mais normalement ça ne devrait pas arriver puisqu'on
          // lit depuis la liste affichée elle-même, et qu'un litag
          // détruit n'est pas affiché.
          return;
        }
        method(litag);
      })
    }
    /**
      * Méthodes pour que ULTags réagisse comme une liste
      * Pour ajouter le litag +litag+ à sa liste de LITags
      */
  , push: function(litag){
      // Pour permettre d'obtenir les items par ULTags[<id>]
      this[litag.id] = litag ;
    }
    /**
     * Pour construire la liste des tags
     */
  , build: function(){
      var my = this;
      my.setULHeight();
      CTags.onEachTag(function(itag){$.proxy(new LITag(itag), 'build')()});
    }
  /**
  * Régler la hauteur du UL pour qu'il tienne bien sur la page
  */
  , setULHeight: function(){
      var my = this ;
      var h   = $(window).height() - 160 ;
      (h < 2000) || (h = 2000) ;
      my.jqObj.css('height', `${h}px`);
    }

    /**
     * Méthode appelée par le bouton + pour ajouter un tag
     */
  , addTag: function(){
      this.create_after(this.selected);
    }
    /**
     * Méthode appelée par le bouton - pour supprimer le tag courant
     */
  , removeTag: function(){
      if(this.selected){this.selected.remove();}
      else {F.notify(t('choose-litag', {operation: t('detruire')}))}
    }

    /**
     * Méthode appelée par la touche Entrée quand il y a une sélection
     * sur la table d'analyse. Peut-être qu'il faudrait que ce soit
     * CTags qui la reçoive, mais je pense que c'est le litag qu'il faut
     * actualiser (this.selected)
     */
  , updateTag: function(){
      var my = this ;
      // Sans sélection, ne rien faire
      if(!my.selected && !my.activated){return};
      // console.log('Je dois peut-être actualiser le litag');
    }
    /**
     * Méthode appelée pour créer une nouvelle ligne sous la ligne
     * courante (pour le moment sans tag)
     */
  , create_after: function(litagBefore){
      var my = this ;
      var itag  = new Tag('');
      CTags.push(itag);
      var litag = new LITag(itag);
      litag.new = true ;
      if (litagBefore){
        litagBefore.jqObj.blur();
        litag.build({after: litagBefore.jqObj});
      } else {
        litag.build();
      }
      litag.jqObj.focus();
      itag.build_and_watch();
    }

    /**
     * Retourne le LITag qui se trouve à l'index +idx+
     */
  , index: function(idx){
      var nod = this.jqObj.find('> li')[idx];
      var tid = nod.getAttribute('data-id');
      return this[tid];
    }
  , first: function(){
      return this.index(0);
    }

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
  , epure_and_split_raw_line: function(line){
      var rg
        , type // 'real-tag', 'empty-line', 'comments-line'
        ;
      line = line.trim().replace(/[\t ]/g, ' ') ; //insécable et tabulation
      line = line.replace(/[\r\n]/g, ' ');
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

      return {data: line.split(' '), line: line, locked: locked_line, nature_init: line.split(' ')[0]}
    }

    /**
     * Reçoit un DOMElement et retourne l'instance LITag correspondante
     */
  , domObjetToLITag: function(domObj){
      return this[Number.parseInt(domObj.getAttribute('data-id'),10)];
    }
};
Object.defineProperties(ULTags,{
    'prop': {'key':'virgule'}
  , jqObj:{
      get: function(){return $('#ultags')}
    }
  , domObj:{
    get: function(){return document.getElementById('ultags');}
  }
})
