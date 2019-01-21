
// Objet gérant les Tags dans leur ensemble (à commencer par
// les sélection)
const CTags = {
  selection: null,    // La sélection courante (Tag)
  selections: [],   // Les sélections (Tag(s))

  on_select: function(itag, with_maj){
    var my = this ;
    if (my.selection == itag){
      // Si c'est une reselection de l'élément déjà sélectionné,
      // on le désélectionne
      itag.deselect();
      my.selections.pop();
      my.selection = null;
      my.desactiveOnKey();
    } else {
      if (false == with_maj) {my.desectionne_all()}
      my.selections.push(itag);
      itag.select();
      my.selection = itag;
      my.activeOnKey();
    }
  }, // on_select

  desectionne_all: function(){
    var my = this ;
    my.selections.forEach(function(el){el.deselect()})
    my.selections = new Array();
    my.desactiveOnKey();
  },

  // Quand on a une sélection, on peut activer les touches propres
  // aux sélections de tags
  activeOnKey: function(ev){
    var my = this ;
    my.old_on_keypress = window.onkeypress ;
    window.onkeypress = this.onKeySelection
  },
  // Quand on n'a plus de sélection, on désactive les touches propres
  // aux sélections de tags
  desactiveOnKey: function(ev){
    var my = this ;
    window.on_keypress = my.old_on_keypress ;
    my.old_on_keypress = null;
  },
  // Méthode évènementielle qui reçoit les touches pressées quand il y
  // a une sélection
  onKeySelection: function(ev){
    // console.log('kcode:'+ev.keyCode + ' | charCode:' + ev.charCode + ' | maj: ' + ev.shiftKey);
    switch (ev.keyCode) {
      case 37: // left
        CTags.moveLeftSelection(ev.shiftKey);return stop(ev);
      case 38: // up
        CTags.moveUpSelection(ev.shiftKey);return stop(ev);
      case 39: // right
        CTags.moveRightSelection(ev.shiftKey);return stop(ev);
      case 40: // down
        CTags.moveDownSelection(ev.shiftKey);return stop(ev);
      default:
      // Rien pour le moment
    }
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
      })
    }
  },

  // Méthode appelée par le on('click')
  onclick: function(ev){
    // On ferme la boite d'outils si elle était ouverte
    if(UI.tools_are_opened()){UI.hide_tools()}
    // On traite le clic sur l'élément courant
    var itag = ITags[$(this)[0].id] ;
    if( !itag.locked ) { itag.onClick(ev) } ;
    ev.stopPropagation();
    ev.preventDefault();
  },

  // ---------------------------------------------------------------------
  // Méthode d'action sur la sélection

  moveUpSelection: function(dem) {
    var   my = this
        , pas = -10 ;
    my.changeSelection('y', pas, dem) ;
  },
  moveDownSelection: function(dem) {
    var   my = this
        , pas = 10 ;
    my.changeSelection('y', pas, dem) ;
  },
  moveRightSelection: function(dem) {
    var   my = this
        , pas = 10;
    my.changeSelection('x', pas, dem) ;
  },
  moveLeftSelection: function(dem) {
    var   my = this
        , pas = -10 ;
    my.changeSelection('x', pas, dem) ;
  },
  changeSelection: function(prop, value, dem){
    var my = this;
    dem = dem ? 5 : 1
    my.selections.forEach(function(itag){
      itag[prop] += value * dem ;
      itag.update();
    })
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
