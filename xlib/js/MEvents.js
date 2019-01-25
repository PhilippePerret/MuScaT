/**
 * Pour la gestion des évènements
 *
 * Cet objet a été initié surtout à cause du problème de gestion des
 * flèches.
 */

const MEvents = {

  /**
   * Pour écrire en console les données importantes de l'évènement
   * keypress
   */
  console_key: function(ev){
    console.log(`keyCode:${ev.keyCode} | charCode:${ev.charCode} | which:${ev.which}`);
  },
  /**
   * Gestionnaire général des touches.
   * Normalement, on ne devrait faire appel qu'à lui, quelle que soit
   * la circonstance.
   */
  onkeypress: function(ev) {
    if(CodeField.focused){
      this.onkeypress_on_code_field(ev);
    } else if (CTags.selection) {
      this.onkeypress_with_selection(ev);
    } else {
      this.onkeypress_else(ev);
    }
  },

  /**
   * Gestionnaire de touches pressées quand on se trouve dans le
   * champ de code
   */
  onkeypress_on_code_field: function(ev){
    // console.log('-> onkeypress_on_code_field');
    var my = CodeField ;
    if(ev.keyCode == 13 && ev.altKey){
      Page.update();
      return stop(ev);
    } else if ( ev.keyCode == 16 && ev.metaKey && ev.shiftKey) {
      console.log("=> Commentaire ");
    }
    if(ev.metaKey){
      if(ev.shift){
        // CMD Maj

        // console.log("Avec métakey  et shift: keyCode: " + ev.keyCode + " / charCode: " + ev.charCode);
      }
      // console.log("Avec métakey : keyCode: " + ev.keyCode + " / charCode: " + ev.charCode);
    } else {
      // Pour vérifier que le champ est bien focusé (pour les tests)
      if(ev.keyCode == 'test'){
        CF.actived = true ;
      } else {
        CF.actived = false ;
      }
    }
    return true ;
  },

  /**
   * Gestionnaire d'évènements lorsqu'il y a une sélection mais qu'on
   * ne se trouve pas dans le champ de code
   */
  onkeypress_with_selection: function(ev){
    // console.log('-> onkeypress_with_selection');
    if ( ev.metaKey ){
      switch(ev.charCode){
        case 103: // CMD G => Grouper/dégropuer
          CTags.grouper_selected();return stop(ev);
          break;
        default:
          this.console_key(ev);
      }
    } else {
      switch (ev.keyCode) {
        case 37: // left
        CTags.moveLeftSelection(ev);return stop(ev);
        case 38: // up
        CTags.moveUpSelection(ev);return stop(ev);
        case 39: // right
        CTags.moveRightSelection(ev);return stop(ev);
        case 40: // down
        CTags.moveDownSelection(ev);return stop(ev);
        case 8:  // ERASE
        CTags.ask_for_erase(ev);return stop(ev);
        default:
        // Rien pour le moment
          this.console_key(ev);
      };
    }
    return true ;
  },

  /**
   * Gestionnaire de touche pressée quand on n'est ni dans le champ
   * de code et qu'il n'y a aucune sélection
   */
  onkeypress_else: function(ev){
    console.log('-> onkeypress_else');
  }
}
window.onkeypress = $.proxy(MEvents,'onkeypress') ;
