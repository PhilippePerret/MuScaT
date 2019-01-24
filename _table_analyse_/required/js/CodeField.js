/**
 * Pour gérer le champ de code
 */
const CodeField = {

  alreaday_observed: false, // mise à true quand le champ a reçu ses gestionnaires
  focused: false, // mis à true quand on est dedans (pour empêcher les flèches de déplacer les éléments par exemple)

  onFocus: function(){
    this.focused = true ; // pour le gestionnaire Events.onkeypress
  },
  onBlur: function(){
    this.focused = false ;
  },

  // Pour placer les observateurs sur le champ
  observe: function(){
    var my = this ;
    if(my.alreaday_observed){return};
    my.jqObj.on('focus', $.proxy(CodeField,'onFocus'));
    my.jqObj.on('blur', $.proxy(CodeField,'onBlur'));
    my.alreaday_observed = true;
  }
}
Object.defineProperties(CodeField, {

  domObj: {
    get: function(){return document.getElementById('codeSource')}
  },
  jqObj: {
    get: function(){return $('textarea#codeSource')}
  }
})

const CF = CodeField;
