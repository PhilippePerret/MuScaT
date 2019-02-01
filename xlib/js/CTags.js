
// Objet gérant les Tags dans leur ensemble (à commencer par
// les sélections)
const CTags = {
    class: 'CTags'
  , last_tag_id: 0      // Dernier ID attribué à un tag
  , selection: null    // La sélection courante (Tag)
  , selections: []     // Les sélections (Tag(s))
  , last_group_id: 0   // Pour les tags groupés

  /**
   * Exécute la méthode +method+ sur tous les tags
   */
  , onEachTag: function(method, options){
      var i = 1, len = this.length ;
      if(options && options.from){i = options.from}
      if(options && options.to){len = options.to + 1}
      // console.log(`Boucle dans onEachTag de ${i} à ${len} (length=${this.length})`);
      for(i;i<=len;++i){method(this[i], i)};
    }

  /**
   * Pour répéter une opération sur tous les éléments sélectionnés
   */
  , onEachSelected: function(method){
      for(var itag of this.selections){
        method(itag);
      }
    }

  , push: function(itag){
      if(undefined == itag.id){itag.id = ++ this.last_tag_id;}
      this[itag.id] = itag;
      this.length += 1 ;
      return itag; // pour chainage
    }

  , on_select: function(itag, with_maj){
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
    } // on_select

  , deselect_all: function(){
      var my = this ;
      my.selections.forEach(function(el){el.deselect()})
      my.selections = new Array();
      my.selection  = null ;
    }

  /**
   * Pour retirer le tag +itag+ de la sélection courante
   * (lorsqu'il n'est pas le tag courant)
   */
  , remove_from_selection: function(itag){
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
    }

  // Méthode appelée quand on veut aligner des éléments
  , align: function(alignement) {
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
        my.onEachSelected(function(itag){itag.update(prop, value)})
        UI.hide_tools();
      }
    }

  /**
   * Méthode appelée par le bouton outil "Grouper", quand il y a plusieurs
   * sélections, pour les grouper ou les dégrouper.
   */
  , grouper_selected: function(){
      UI.hide_tools();
      if ( !this.selections[0].group ) {
        var new_group = new TagsGroup();
        this.onEachSelected(function(itag){itag.add_in_group(new_group)});
      } else {
        this.selections[0].group.ungroup();
      }
    }

  /**
   * Appelée par un bouton outil pour répartir les images sélectionnées.
   * Normalement, ce sont des images de système. On les répartit régulièrement
   * entre le plus haut et le plus bas verticalement.
   */
  , repartir_selected: function(){
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
    console.log('dist:', dist);

    // TODO Faut-il considérer la hauteur de l'élément le plus bas, pour
    // répartir visuellement ?
    var esp = Number.parseInt(dist / (my.selections.length - 1),10);

    var i = 0 ;
    sorteds.forEach(function(itag){
      itag.update('y', upper.y + (i++ * esp)) ;
    });

  }

  /**
   * Méthode directement appelée lorsque l'on clique sur un TAG
   * quelconque
   */
  , onclick: function(ev){
    // On ferme la boite d'outils si elle était ouverte
    if(UI.tools_are_opened()){UI.hide_tools()}
    // On traite le clic sur l'élément courant
    var itag = CTags[Number.parseInt($(this)[0].getAttribute('data-id'),10)] ;
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
  }

  , ask_for_erase: function(ev){
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

  , erase_selections: function(){
      var my = this ;
      my.onEachSelected(function(itag){itag.update('destroyed', true)});
    }

  , lines_selected_in_clipboard: function(){
      var my = this, arr = new Array() ;
      my.onEachSelected(function(itag){
        arr.push(itag.to_line());
      });
      clip(arr.join(RC) + RC);
      F.notify(t('code-lines-in-clipboard'));
    }
};
Object.defineProperties(CTags,{

    property: {'value':'virgule'}
    // Retourne le nombre de Tag(s) consignés
  , length:{
      get:function(){return this._length || 0},
      set:function(val){this._length = val}
  }
})
