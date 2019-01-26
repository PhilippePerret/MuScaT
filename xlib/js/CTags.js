
// Objet gérant les Tags dans leur ensemble (à commencer par
// les sélection)
const CTags = {
  selection: null,    // La sélection courante (Tag)
  selections: [],     // Les sélections (Tag(s))
  last_group_id: 0,   // Pour les tags groupés

  /**
   * Pour répéter une opération sur tous les éléments sélectionnés
   */
  onEachSelected: function(method){
    for(var itag of this.selections){
      method(itag);
    }
  },

  on_select: function(itag, with_maj){
    var my = this ;
    if (itag.selected){
      // Si c'est une reselection de l'élément déjà sélectionné,
      // on le désélectionne
      my.remove_from_selection(itag);
    } else {
      if (false == with_maj) { my.deselect_all() }
      my.selections.push(itag);
      itag.select();
      my.selection = itag;
    }
  }, // on_select

  deselect_all: function(){
    var my = this ;
    my.selections.forEach(function(el){el.deselect()})
    my.selections = new Array();
    my.selection  = null ;
  },

  /**
   * Pour retirer le tag +itag+ de la sélection courante
   * (lorsqu'il n'est pas le tag courant)
   */
  remove_from_selection: function(itag){
    var my = this ;
    if(itag == my.selection){
      // Si le tag est le tag courant
      my.selections.pop();
      my.selection = null;
    } else {
      // Si le tag n'est pas le tag courant
      var new_selections = new Array();
      for(var tg of my.selections){
        if(tg.id == itag.id){continue};
        new_selections.push(tg);
      }
      my.selections = new_selections;
    };
    // Et on finit par le déselectionner
    itag.deselect();
  },

  // Méthode appelée quand on veut aligner des éléments
  align: function(alignement) {
    var my = this ;
    if (undefined == alignement){
      alignement = document.getElementById('alignement').value;
    }
    if (my.selections.length < 2) { error('Il faut choisir les éléments à aligner !') }
    else {
      var referent = my.selections[0] ;
      var value, method ;
      switch (alignement) {
        case 'up':
          method = 'setYAt' ; value = referent.y ;
          break;
        case 'down':
          method = 'setDownAt' ; value = referent.y + referent.jqObj.height();
          break;
        case 'left':
          method = 'setXAt' ; value = referent.x ;
          break;
        case 'right':
          method = 'setRightAt' ; value = referent.x + referent.jqObj.width();
          break;
        default:
      }
      my.selections.forEach(function(itag){
        $.proxy(itag, method, value)() ;
        $.proxy(itag,'updateXY')();
        // Note : pas d'update, c'est beaucoup plus simple de modifier
        // directement dans le DOM, l'élément existant
      });
      UI.hide_tools();
    }
  },

  /**
   * Méthode appelée par le bouton outil "Grouper", quand il y a plusieurs
   * sélections, pour les grouper ou les dégrouper.
   */
  grouper_selected: function(){
    UI.hide_tools();
    if ( !this.selections[0].group ) {
      var new_group = new TagsGroup();
      this.onEachSelected(function(itag){itag.add_in_group(new_group)});
    } else {
      this.selections[0].group.ungroup();
    }
  },

  /**
   * Méthode directement appelée lorsque l'on clique sur un TAG
   * quelconque
   */
  onclick: function(ev){
    // On ferme la boite d'outils si elle était ouverte
    if(UI.tools_are_opened()){UI.hide_tools()}
    // On traite le clic sur l'élément courant
    var itag = ITags[$(this)[0].id] ;
    if(itag.group){
      ev.shiftKey = true ;
      itag.group.onEachTag(function(itag){itag.onClick(ev)})
    } else {
      if( !itag.locked ) {
        itag.onClick(ev)
      }
    }
    return stop(ev);
  },

  // ---------------------------------------------------------------------
  // Méthode d'action sur la sélection

  /**
   * Retourne la valeur du pas en fonction des modifiers qui sont
   * activés :
   *  - La touche majuscule aggrandit le pas
   *  - La touche ALT le diminue
   */
  pas_by_modifiers: function(ev){
    if(ev.shiftKey){
      return 50 ;
    } else if (ev.altKey) {
      return 1 ;
    } else {
      return 10 ;
    }
  },
  moveUpSelection: function(ev) {
    this.changeSelection('y', -this.pas_by_modifiers(ev)) ;
  },
  moveDownSelection: function(ev) {
    this.changeSelection('y', this.pas_by_modifiers(ev)) ;
  },
  moveRightSelection: function(ev) {
    this.changeSelection('x', this.pas_by_modifiers(ev)) ;
  },
  moveLeftSelection: function(ev) {
    this.changeSelection('x', -this.pas_by_modifiers(ev)) ;
  },
  changeSelection: function(prop, value){
    var my = this;
    my.selections.forEach(function(itag){
      itag[prop] += value ;
      itag.update();
    })
  },
  ask_for_erase: function(ev){
    var my = this ;
    var nb = my.selections.length ;
    var msg ;
    if (nb > 1) {
      msg = `tous les éléments sélectionnés (${nb})`;
    } else {
      msg = `l'élément « ${M.lines[my.selections[0].index_line]} »`;
    }
    F.ask('Dois-je vraiment détruire ' + msg, {onOK: $.proxy(CTags,'erase_selections')});
  },

  erase_selections: function(){
    var my = this ;
    my.onEachSelected(function(itag){itag.update('destroyed', true)});
    M.update_code();
  },

  // ---------------------------------------------------------------------
  //  Méthodes de calcul
  /**
   * Retourne l'index, dans le fichier tags.js (i.e. la liste des lignes),
   * de la ligne qui se trouve juste après les coordonnées +y+, +x+
   * Cette méthode sert notamment pour la copie d'un tag (et plus tard pour
   * sa création), pour trouver où placer la nouvelle ligne.
   */
  get_index_line_before: function(y, x) {
    var last_tid, tid, itag ;
    for(tid in ITags){
      itag = ITags[tid] ;
      if (itag.y > y) {
        // On a trouvé un tag plus bas, il sera forcément après
        return itag.index_line ;
      } else if (itag.y == y && itag.x > x) {
        // On a trouvé un tag à la même hauteur, mais plus à droite
        // Il sera forcément après
        return itag.index_line ;
      }
      last_tid = tid ; // on le mémorise, si on ne trouve rien
    }
    return ITags[last_tid].index_line + 1 ; // au pire, à la fin
  }
}
