/**
 * Pour la gestion des évènements
 *
 * Cet objet a été initié surtout à cause du problème de gestion des
 * flèches.
 */

const MEvents = {
    pour: 'virgule'

  , ARROWKEY_TO_PROP: {37: 'w', 38: 'h', 39: 'w', 40: 'h'}
  , ARROWKEYS_SENS:   {37: 'l', 38: 't', 39: 'r', 40: 'd'}

  /**
   * Pour écrire en console les données importantes de l'évènement
   * keypress
   */
  , console_key: function(ev){
      console.log(`keyCode:${ev.keyCode} | charCode:${ev.charCode} | which:${ev.which}`);
    }
  /**
   * Gestionnaire général des touches.
   * Normalement, on ne devrait faire appel qu'à lui, quelle que soit
   * la circonstance.
   */
  , onkeypress: function(ev) {
      // console.log('-> onkeypress');
      if (!this.onkeypress_always(ev)){ return };
      if(CodeField.focused){
        this.onkeypress_on_code_field(ev);
      } else if (CTags.selections.length) {
        this.onkeypress_with_selection(ev);
      } else {
        this.onkeypress_else(ev);
      }
    }

  , onkeyup: function(ev){
      if (!this.onkeyup_always(ev)){ return };
      if(CodeField.focused){
        // this.onkeyup_on_code_field(ev);
      } else if (CTags.selections.length) {
        this.onkeyup_with_selection(ev);
      } else {
        // this.onkeyup_else(ev);
      }
    }

  , onkeydown: function(ev){
      if (!this.onkeydown_always(ev)){ return };
      if(CodeField.focused){
        // this.onkeydown_on_code_field(ev);
      } else if (CTags.selections.length) {
        this.onkeydown_with_selection(ev);
      } else {
        // this.onkeydown_else(ev);
      }
    }
  /**
   * Les flèches ne génèrent pas d'évènement keypress,
   */
  , onkeyup_with_selection: function(ev){
      if (ev.which == 87){
        this.w_is_pressed = false; return stop(ev);
      } else if (ev.which == 72){
        this.h_is_pressed = false; return stop(ev);
      }
      if (this.w_is_pressed || this.h_is_pressed){

      };
      if (this.w_is_pressed || this.h_is_pressed) {
        // Flèches avec "w" ou "y" appuyé
        switch (ev.keyCode) {
          case 37: // ALT + L  => diminuer en largeur (par la droite)
          case 38: // ALT + UP => diminuer en hauteur (par le haut)
          case 39: // ALT + R => diminuer en largeur (par la gauche)
          case 40: // ALT + DOWN => diminuer en hauteur par le bas
            prop = this.w_is_pressed ? 'w' : 'h' ;
            sens = this.ARROWKEYS_SENS[ev.keyCode];
            CTags.onEachSelected(function(itag){itag.set_dimension(prop, sens, ev.shiftKey)})
            return stop(ev);
            break;
        }
      };
      // this.console_key(ev);
    }
  , onkeydown_with_selection: function(ev){
      switch (ev.which) {
        case 87: /*  w */
        case 72: /* h  */
          CTags.selection.set_dimension('w', ev.altKey, ev.shiftKey, ev.ctrlKey);
          return stop(ev);
        case 88: /*  x */
        case 89: /*  y */
          // l, t, r, d
          var sens = ev.which == 88 ? (ev.altKey ? 'l' : 'r') : (ev.altKey ? 't' : 'd')
          CTags.onEachSelected(function(itag){itag.move(sens, ev.shiftKey, ev.ctrlKey)});
          return stop(ev);
        default:
          // this.console_key(ev);
      }
      switch (ev.keyCode) {
        case 37: // LEFT ARROW
        case 38: // UP ARROW
        case 39: // RIGH ARROW
        case 40: // DOWN ARROW
          sens = this.ARROWKEYS_SENS[ev.keyCode];
          CTags.onEachSelected(function(itag){itag.move(sens, ev.shiftKey, ev.ctrlKey)});
          return stop(ev);
      }
    }
  /**
   * Gestionnaire de touches qui est toujours appelé
   * S'il retourne true, on poursuit avec les autres gestionnaires, sinon
   * on s'arrête là.
   */
  , onkeypress_always: function(ev){
      if (ev.metaKey){
        switch(ev.charCode){
          case 122: // CMD Z / Annulation
            Historique.undo_last();
            return stop(ev);
        };
        // this.console_key(ev);
      };
      if(ev.charCode == 32 && this.onSpaceBar){
        this.onSpaceBar();
        this.onSpaceBar = null ;
        return stop(ev);
      };
      // this.console_key(ev);
      return true ;
    }

  , onkeyup_always: function(ev){
      switch (ev.which) {
        case 9:
          UI.tab_focus();
          return stop(ev);
      }
      // this.console_key(ev);
      return true ;
    }

  , onkeydown_always: function(ev){
      switch (ev.which) {
        case 9:
          return stop(ev);
      }
      // this.console_key(ev);
      return true ;
    }
  /**
   * Gestionnaire de touches pressées quand on se trouve dans le
   * champ de code
   */
  , onkeypress_on_code_field: function(ev){
    // console.log('-> onkeypress_on_code_field');
    var my = CodeField ;
    if(ev.keyCode == 13 && ev.altKey){
      Page.update();
      return stop(ev);
    } else if ( ev.keyCode == 16 && ev.metaKey && ev.shiftKey) {
      // console.log("=> Commentaire ");
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
          // this.console_key(ev);
      }
    } else {
      switch (ev.keyCode) {
        case 8:  // ERASE
        CTags.ask_for_erase(ev);return stop(ev);
        default:
        // Rien pour le moment
          // this.console_key(ev);
      };
    }
    return true ;
  },

  /**
   * Gestionnaire de touche pressée quand on n'est ni dans le champ
   * de code et qu'il n'y a aucune sélection
   */
  onkeypress_else: function(ev){
    // console.log('-> onkeypress_else');
  }
}
window.onkeypress = $.proxy(MEvents,'onkeypress') ;
window.onkeyup    = $.proxy(MEvents, 'onkeyup');
window.onkeydown  = $.proxy(MEvents, 'onkeydown');
