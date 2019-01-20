/**
 * Pour gérer le champ de code
 */
const CodeField = {

  alreaday_observed: false, // mise à true quand le champ a reçu ses gestionnaires

  // Gestionnaire de touche pressée
  onKeypress: function(ev){
    // console.log('-> CodeField#onKeypress')
    var my = this ;
    if(ev.keyCode == 13 && ev.altKey){
      Page.update();
      return stop(ev);
    } else if ( ev.keyCode == 16 && ev.metaKey && ev.shiftKey) {
      console.log("=> Commentaire ")
    }
    if(ev.metaKey){
      if(ev.shift){
        // CMD Maj

        console.log("Avec métakey  et shift: keyCode: " + ev.keyCode + " / charCode: " + ev.charCode);
      }
      console.log("Avec métakey : keyCode: " + ev.keyCode + " / charCode: " + ev.charCode);
    } else {
      console.log("keyCode: " + ev.keyCode + " / charCode: " + ev.charCode)
    }

    return true ;
  },

  onFocus: function(){
    var my = this ;
    // console.log('-> CodeField#onFocus')
    // Il faut activer la gestion des évènements en conservant la trace de
    // l'ancien gestionnaire de touches
    my.previous_on_keypress = window.onkeypress ;
    window.onkeypress = null ;
    // my.jqObj.on('keyup', $.proxy(CodeField,'onKeypress'));
    my.jqObj.on('keypress', $.proxy(CodeField,'onKeypress'));
  },
  onBlur: function(){
    var my = this ;
    console.log('-> CodeField#onBlur');
    // Il faut désactiver la gestion des évènements
    // my.jqObj.on('keyup', null);
    my.jqObj.on('keypress', null);
    // Il faut remetre l'ancien gestionnaire général de touche
    window.onkeypress = my.previous_on_keypress ;
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
