
// Objet gérant les Tags dans leur ensemble (à commencer par
// les sélections)
class CTagsClass {
  constructor(){
    this.class = 'CTags'
    this.last_tag_id = 0
    this.selection = null
    this.selections = []
    this.last_group_id = 0
  }

  /**
   * Exécute la méthode +method+ sur tous les tags
   */
  forEachTag(method, options){
      var i = 1, len = this.length ;
      if(options && options.from){i = options.from}
      if(options && options.to){len = options.to + 1}
      // console.log(`Boucle dans forEachTag de ${i} à ${len} (length=${this.length})`);
      for(i;i<=len;++i){method(this[i], i)};
    }

  /**
   * Pour répéter une opération sur tous les éléments sélectionnés
   */
  onEachSelected(method){
      for(var tag of this.selections){
        method(tag);
      }
    }

  /**
    * Inverse de la précédente
    * Reçoit {x: 120, y: 130} et retourne " x=120 y=130"
    * TODO Faire aussi de cette méthode une méthode générale/générique
    */
  compactLine(h){
    var arr = new Array();
    for(var k in h){arr.push(`${k}=${h[k]}`)};
    return arr.join(' ')
  }


  push(tag){
    if(undefined == tag.id){tag.id = ++ this.last_tag_id;}
    this[tag.id] = tag;
    this.length += 1 ;
    return tag; // pour chainage
  }

  onSelect(tag, with_maj){
    var my = this ;
    if (tag.selected){
      // console.log('-> tag est sélectionné')
      // Si c'est une reselection de l'élément déjà sélectionné,
      // on le désélectionne
      my.remove_from_selection(tag);
    } else {
      if (false == with_maj) { my.deselectAll() }
      my.selections.push(tag);
      tag.select();
      my.selection = tag ;
    }
  } // onSelect

  deselectAll(){
    var my = this ;
    my.selections.forEach(function(el){el.deselect()})
    my.selections = new Array();
    my.selection  = null ;
  }

  /**
   * Pour retirer le tag +tag+ de la sélection courante
   * (lorsqu'il n'est pas le tag courant)
   */
  remove_from_selection(tag){
    var my = this ;
    if(tag == my.selection){
      // Si le tag est le tag courant
      my.selections.pop();
      my.selection = null;
    } else {
      // Si le tag n'est pas le tag courant
      var new_selections = new Array();
      for(var tg of my.selections){
        if(tg.id == tag.id){continue};
        new_selections.push(tg);
      }
      my.selections = new_selections;
    };
    // Et on finit par le déselectionner
    tag.deselect();
  }

  // Méthode appelée quand on veut aligner des éléments
  align(alignement) {
    var my = this ;
    if (undefined == alignement){
      alignement = document.getElementById('alignement').value;
    }
    if (my.selections.length < 2) { error(t('thinks-to-align-required')) }
    else {
      var referent = my.selections[0] ;
      var value, method ;
      switch (alignement) {
        case 'up':
          prop = 'y'; value = referent.y ;
          break;
        case 'down':
          prop = '-y' ; value = referent.y + referent.jqObj.height();
          break;
        case 'left':
          prop = 'x' ; value = referent.x ;
          break;
        case 'right':
          prop = '-x' ; value = referent.x + referent.jqObj.width();
          break;
        default:
      }
      my.onEachSelected(function(tag){tag.update(prop, value)})
      Muscat.modified = true
      UI.hideTools();
    }
  }

  /**
   * Méthode appelée par le bouton outil "Grouper", quand il y a plusieurs
   * sélections, pour les grouper ou les dégrouper.
   */
  grouper_selected(){
    UI.hideTools();
    if ( !this.selections[0].group ) {
      var new_group = new TagsGroup();
      this.onEachSelected(function(tag){tag.add_in_group(new_group)});
    } else {
      this.selections[0].group.ungroup();
    }
  }

  /**
   * Appelée par un bouton outil pour répartir les images sélectionnées.
   * Normalement, ce sont des images de système. On les répartit régulièrement
   * entre le plus haut et le plus bas verticalement.
   */
  repartir_selected(){
    // Dans un premier temps, il faut trouver le plus haut
    var my = this
      , upper = null
      , lower = null
      ;
    // On classe les éléments par hauteur
    var sorteds = my.selections ;
    sorteds.sort(function(a,b){
      return a.y - b.y ;
    });

    var upper = sorteds[0] ;
    var lower = sorteds[sorteds.length - 1];
    var dist = lower.y - upper.y ;
    // console.log('dist:', dist);

    // TODO Faut-il considérer la hauteur de l'élément le plus bas, pour
    // répartir visuellement ?
    var esp = Number.parseInt(dist / (my.selections.length - 1),10);

    var i = 0 ;
    sorteds.forEach(function(tag){
      tag.update('y', upper.y + (i++ * esp)) ;
    });
    Muscat.modified = true
  }

  /**
   * Méthode directement appelée lorsque l'on clique sur un TAG
   * quelconque
   *
   * +ev+ est l'évènement click, mais il peut être null aussi.
   */
  onclick(tag, ev){
    // On ferme la boite d'outils si elle était ouverte
    if(UI.tools_are_opened()){UI.hideTools()}
    // On traite le clic sur l'élément courant
    if(tag.group){
      ev.shiftKey = true;
      tag.group.forEachTag(function(tag){tag.onClick(ev)})
    } else {
      if( !tag.locked ) {
        tag.onClick(ev);
      }
    }
    return stop(ev);
  }

  // ---------------------------------------------------------------------
  // Méthode d'action sur la sélection

  /**
   * Retourne la valeur du pas en fonction des modifiers qui sont
   * activés :
   *  - La touche majuscule aggrandit le pas
   *  - La touche ALT le diminue
   */
  pas_by_modifiers(ev){
    if(ev.shiftKey){
      return 50 ;
    } else if (ev.altKey) {
      return 1 ;
    } else {
      return 10 ;
    }
  }

  moveUpSelection(ev) {
    this.changeSelection('y', -this.pas_by_modifiers(ev)) ;
  }
  moveDownSelection(ev) {
    this.changeSelection('y', this.pas_by_modifiers(ev)) ;
  }
  moveRightSelection(ev) {
    this.changeSelection('x', this.pas_by_modifiers(ev)) ;
  }
  moveLeftSelection(ev) {
    this.changeSelection('x', -this.pas_by_modifiers(ev)) ;
  }
  changeSelection(prop, value){
    var my = this;
    my.selections.forEach(function(tag){
      // tag[prop] += value ;
      tag.update(prop, tag[prop] + value);
    })
  }

  ask_for_erase(ev){
    var my = this ;
    var nb = my.selections.length ;
    var msg ;
    if (nb > 1) {
      msg = t('all-selected', {nombre: nb})
    } else {
      msg = t('the-element', {ref: my.selections[0].ref});
    }
    F.ask(t('should-destroy', {what: msg}), {onOK: $.proxy(CTags,'erase_selections')});
  }

  erase_selections(){
    this.onEachSelected(function(tag){tag.update('destroyed', true)});
  }

  lines_selected_in_clipboard(){
    var my = this, arr = new Array() ;
    my.onEachSelected(function(tag){
      arr.push(tag.to_line);
    });
    clip(arr.join(RC) + RC);
    F.notify(t('code-lines-in-clipboard'));
  }

  get length(){return this._length || 0}
  set length(val){this._length = val}

} // CTagsClass
const CTags = new CTagsClass()
