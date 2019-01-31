
const ULTags = {
    'pour': 'virgule'

  , selected: null // LITag sélectionné ou Null

  , setULHeight: function(){
      var my = this ;
      console.log('window.innerHeight:', window.innerHeight);
      console.log($(window).height());
      my.jqObj.css('height', ($(window).height() - 160) + 'px');
    }
    /**
     * Pour construire la liste des tags
     */
  , build: function(){
      var my = this;
      my.setULHeight();
      M.onEachTag(function(itag){$.proxy(new LITag(itag), 'build')()});
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
     * Méthode appelée pour créer une nouvelle ligne sous la ligne
     * courante (pour le moment sans tag)
     */
  , create_after: function(litagBefore){
      var my = this ;
      var itag  = new Tag('');
      itag.id = ++ M.last_tag_id;
      ITags[itag.domId] = itag;
      var litag = new LITag(itag);
      litag.build({after: litagBefore ? litagBefore.jqObj : null});
      litagBefore.jqObj.blur();
      litag.jqObj.focus();
      itag.build_and_watch();
    }
};
Object.defineProperties(ULTags,{
  jqObj:{
    get: function(){return $('#ultags')}
  }
})
