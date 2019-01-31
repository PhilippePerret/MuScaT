
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
        method(my.domObjetToLITag(olitag));
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
      console.log('Je dois peut-être actualiser le litag');
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
     * Reçoit un DOMElement et retourne l'instance LITag correspondante
     */
  , domObjetToLITag: function(domObj){
      return this[Number.parseInt(domObj.getAttribute('data-id'),10)];
    }
};
Object.defineProperties(ULTags,{
  jqObj:{
    get: function(){return $('#ultags')}
  }
})
