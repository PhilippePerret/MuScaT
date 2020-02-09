
const ULTags = {
    'pour': 'virgule'

  , length: 0             // Le nombre de LITags
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
      * Tient aussi à jour la propriété `length`, comme pour une liste.
      */
  , push: function(litag){
      // Pour permettre d'obtenir les items par ULTags[<id>]
      this[litag.id] = litag ;
      this.length ++ ;
    }
    /**
     * Pour construire la liste des tags
     */
  , build: function(){
      var my = this;
      return new Promise((ok,ko) => {
        try {
          my.setULHeight();
          CTags.forEachTag(function(tag){
            const litag = new LITag(tag)
            litag.build.call(litag)
          });
          ok()
        } catch (e) { ko(e) }
      })
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
      if(this.selected){
        this.selected.remove();
        this.length--;
        Muscat.modified = true
      }
      else {F.notify(t('choose-litag', {operation: t('detruire')}))}
    }

    /**
      Verrouille le ou les tags courants
    **/
  , lockTag: function(){
      if( this.selected ) {
        this.selected.tag.update('locked', !this.selected.tag.locked)
        Muscat.modified = true
        this.selected.jqObj.focus();
      } else {
        F.notify(t('choose-litag', {operation: t('lock')}))
      }
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
      var tag  = new Tag('');
      CTags.push(tag);
      var litag = new LITag(tag);
      litag.new = true ;
      if (litagBefore){
        litagBefore.jqObj.blur();
        litag.build({after: litagBefore.jqObj});
      } else {
        litag.build();
      }
      litag.jqObj.focus();
      tag.buildAndObserve();
      Muscat.modified = true
    }

    /**
     * Retourne le LITag qui se trouve à l'index +idx+
     */
  , index: function(idx){
      var nod = this.jqObj.find('> li')[idx];
      if(nod){
        var tid = nod.getAttribute('data-id');
        return this[tid];
      }
    }
  , first: function(){
      return this.index(0);
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
