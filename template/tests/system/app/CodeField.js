Object.assign(CodeField,{

  // Retourne la ligne d'indice 1-start +line_number+
  line: function(line_number){
    return this.code.split(RC)[line_number - 1] ;
  },

  // Pour modifier le code source (dans le champ "à côté")
  //
  // +options+    Table pour options
  //  :add      Si true, on ajoute le nouveau code au bout, avec un
  //            retour chariot pour commencer
  //  :update   Si true, on actualise aussi l'affichage, comme si on avait
  //            fait ALT ENTRÉE
  //
  // Si +update_required+ est true, on actualise comme si on jouait
  // ALT ENTRÉE.
  change_code_source(new_code, options){
    if(undefined == options){options = {}};

    // Faut-il ajouter ou remplacer ?
    if (options.add){
      new_code = this.code + RC + new_code ;
    };

    // On met le nouveau code
    this.jqObj.val(new_code);

    // Si on doit activer
    if (options.update){
      this.domObj.focus(); // active le gestionnaire d'évènement
      // On vérifie si le gestionnaire a bien été enclenché (si la console a
      // le focus ça n'a pas marché)
      this.jqObj.trigger({type: 'keypress', keyCode: 'test'});
      if(!this.actived){
        var err_msg = 'Impossible de mettre le focus au champ de code. Il faut peut-être que vous activiez la fenêtre principale de l’application.';
        Tests.stop = true ;
        throw(err_msg);
      }
      this.jqObj.trigger({type: 'keypress', keyCode: 13, altKey: true});
    }
  }
  //change_code_source


})
Object.defineProperties(CodeField,{
  code: {
    get:function(){return $('#codeSource').val()}
  }
})
