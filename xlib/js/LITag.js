/**
 * Classe de l'objet LI
 */
const LITag = function(itag){
  this.itag = itag;
  this.id   = itag.id;
};

// ---------------------------------------------------------------------
// MÉTHODES DE CONSTRUCTION

LITag.prototype.build = function(options){
  var my = this ;
  ULTags.jqObj.append(my.to_html());
  if(options && options.after){
    $(my.jqObj).insertAfter(options.after);
  }
  my.observe();
};
LITag.prototype.to_html = function(){
  var my = this ;
  var nod = document.createElement('li');
  nod.setAttribute('contentEditable', 'true');
  nod.setAttribute('data-id', my.itag.id);
  nod.id = `litag${my.id}` ;
  nod.innerHTML = my.itag.to_li() ;
  return nod ;
};

// ---------------------------------------------------------------------
//  MÉTHODES DE DONNÉES

LITag.prototype.focus_next = function(){
  var my = this;
  my.jqObj.blur();
  my.nextObj.focus();
};
LITag.prototype.focus_previous = function(){
  var my = this;
  my.jqObj.blur();
  my.prevObj.focus();
};
// ---------------------------------------------------------------------
//  MÉTHODES ÉVÈNEMENTIELLES

LITag.prototype.observe = function(){
  var my = this ;
  my.jqObj.on('focus', $.proxy(my, 'onFocus'));
  my.jqObj.on('blur', $.proxy(my, 'onBlur'));
  my.jqObj.on('keypress', $.proxy(my, 'onKeyPress'));
  my.jqObj.on('keyup', $.proxy(my, 'onKeyUp'));
  my.jqObj.on('keydown', $.proxy(my, 'onKeyDown'));
  // my.jqObj.on('click', function(){console.log(`Click dans #${my.id}`)});
}
LITag.prototype.onFocus = function(ev){
  var my = this ;
  console.log(`Focus dans #${my.id}`);
  my.activated  = true ;
  my.iniContent = my.jqObj.text();
  ULTags.selected = my ;
  // TODO : le mettre en exergue sur la table (pas en sélection)
};
LITag.prototype.onBlur = function(ev){
  var my = this ;
  console.log(`Blur de #${my.id}`);
  my.activated = false ;
  my.newContent = my.jqObj.text();
  if (my.iniContent != my.newContent) {
    my.itag.parse(my.newContent);
    my.modified = true; // Utile ?
  }
  ULTags.selected = null;
};
LITag.prototype.onKeyPress = function(ev){
};
LITag.prototype.onKeyUp = function(ev){
  switch (ev.keyCode) {
    case 9: // Touche tabulation
    case 13: // Touche entrée => nouveau tag ou prendre en compte ?
    case 40: // Flèche bas
      // console.log('Tabulation, je passe au suivant');
      this.focus_next();return stop(ev);
    case 91:
      MEvents.with_meta_key = false;
      this.creating = false;
      return stop(ev);
  }
  MEvents.console_key(ev);
};
LITag.prototype.onKeyDown = function(ev){
  switch (ev.keyCode) {
    case 38:
      this.focus_previous();return stop(ev);
    case 40: // Flèche bas
      this.focus_next();return stop(ev);
    case 13:
      if (MEvents.with_meta_key == true && !this.creating){
        this.creating = true ;
        // console.log('Touche entrée avec MÉTA => création')
        ULTags.create_after(this);
      }
      break;
    case 91:
      MEvents.with_meta_key = true;
      console.log('CMD pressée');
      break;
  }
}

// /FIn des méthodes évènementielles
// ---------------------------------------------------------------------

Object.defineProperties(LITag.prototype,{
    'prop': {'Description':'Pour voir'}
  , jqObj:{
      get: function(){return $(`li#litag${this.id}`);}
    }
    // Retourne l'ID du tag en le prenant dans le DOM
  , tag_id: {
      get: function(){return Number.parseInt(this.jqObj[0].getAttribute('data-id'),10)}
    }
    // Retourne l'objet jQuery suivant
  , nextObj:{
      get: function(){return this.jqObj.next();}
    }
  , prevObj:{
      get: function(){return this.jqObj.prev();}
    }
  , nextTag:{
      get: function(){return ITags[`tag${this.nextObj.tag_id}`];}
    }
})
