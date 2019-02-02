/**
 * Classe de l'objet LI
 */
const LITag = function(itag){
  this.itag = itag;
  this.id   = itag.id;
  // Propriété indiquant si le tag est sélectionné
  // Noter qu'elle est mise à false alors que la valeur de ULTags.selected
  // peut-être encore mise à ce tag (parce que c'est au blur qu'on désélectionne
  // le LITag).
  this.selected   = false;
  this.built      = false;
  this.destroyed  = false;
  // Pour indiquer que c'est un nouveau tag. Quand c'est un nouveau
  // tag, on ne sort pas du champ inopinément
  this.new = false;
};

// ---------------------------------------------------------------------
// MÉTHODES DE CONSTRUCTION

/**
 * Méthode construisant le tag dans la liste
 * C'est aussi cette méthode qui ajoute le tag à la liste de ULTags.
 */
LITag.prototype.build = function(options){
  var my = this ;
  ULTags.jqObj.append(my.to_html());
  if(options && options.after){
    $(my.jqObj).insertAfter(options.after);
  }
  my.observe();
  ULTags.push(my);
  my.built = true ;
};
LITag.prototype.to_html = function(){
  var my = this ;
  var nod = document.createElement('li');
  nod.setAttribute('contentEditable', 'true');
  nod.setAttribute('data-id', my.itag.id);
  nod.id = `litag${my.id}` ;
  nod.innerHTML = my.itag.to_line() ;
  return nod ;
};

/**
 * Méthode principale de suppression d'un tag.
 * Noter que si les deux objets sont détruits, les deux instances
 * existent toujours, mais sont marquées destroyed
 */
LITag.prototype.remove = function(){
  var my = this ;
  my.destroyed = true ;
  my.jqObj.remove();
  my.itag.update('destroyed', true);
};
// ---------------------------------------------------------------------
//  MÉTHODES DE DONNÉES

LITag.prototype.parse_and_compare = function(){
  var my = this ;
  var txt = my.jqObj.text().trim().replace(/[\n\r]/g,'');
  my.jqObj.text(txt);
  var d = ULTags.epure_and_split_raw_line(txt);
  var tagprov = new Tag(d.data);
  tagprov.locked = d.locked;
  // console.log('tagprov:', tagprov);
  my.itag.compare_and_update_against(tagprov);
};

/**
 * Auparavant, ce code était exécuté au blur du LITag. Mais maintenant,
 * on veut rester dans le tag lorsqu'il a été modifié.
 * La méthode retourne `true` si le code a été modifié et `false` dans
 * le cas suivant.
 */
LITag.prototype.checkAndUpdate = function(){
  var my = this;
  my.newContent = my.jqObj.text();
  if (my.iniContent != my.newContent) {
    my.parse_and_compare(my.newContent);
    my.iniContent = my.newContent;
    return true; // pour dire que oui, il y a eu actualisation
  } else {
    return false;
  }
};

// ---------------------------------------------------------------------
//  MÉTHODES D'AFFICHAGE
/**
 * Cette méthode sert à montrer que le tag
 * est sélectionné sur la table d'analyse.
 * Avec la classe 'activated', on voit le litag.
 */
LITag.prototype.activate = function(){
  var my = this ;
  my.jqObj.addClass('activated');
  my.scrollIfNotVisible();
};
LITag.prototype.desactivate = function(){
  var my = this ;
  my.jqObj.removeClass('activated');
};

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

/**
 * Pour focusser sur le tag sur la table d'analyse
 */
LITag.prototype.focus_tag = function(){
  var my = ULTags[this.id];
  my.blur();
};
/**
 * Pour focusser sur cet élément
 */
LITag.prototype.focus = function(){
  var my = ULTags[this.id];
  my.desactivate(); // oui
  ULTags.activated = true ;
  my.jqObj.focus();
};
/**
 * Pour blurer complètement de cet élément
 */
LITag.prototype.blur = function(){
  var my = ULTags[this.id];
  my.desactivate();
  ULTags.activated = false ;
  my.jqObj.blur();
};
/**
 * Quand le tag a été modifié (sur la table d'analyse par exemple,
 * c'est cette méthode qu'on appelle pour actualiser la ligne)
 */
LITag.prototype.update = function(newLine){
  this.jqObj.text(newLine)
};

LITag.prototype.scrollIfNotVisible = function(){
  var my = ULTags[this.id] ;
  if(!my.built){return};
  my.domObj.scrollIntoView({behavior: 'smooth'});
};

// ---------------------------------------------------------------------
//  MÉTHODES ÉVÈNEMENTIELLES

LITag.prototype.observe = function(){
  var my = this ;
  // console.log(`-> observe #${my.id}`);
  my.jqObj.on('focus', $.proxy(my, 'onFocus'));
  my.jqObj.on('blur', $.proxy(my, 'onBlur'));
  my.jqObj.on('keypress', $.proxy(my, 'onKeyPress'));
  my.jqObj.on('keyup', $.proxy(my, 'onKeyUp'));
  my.jqObj.on('keydown', $.proxy(my, 'onKeyDown'));
  // my.jqObj.on('click', function(){console.log(`Click dans #${my.id}`)});
}
LITag.prototype.onFocus = function(ev){
  var my = this ;
  // console.log(`Focus dans #${my.id}`);
  my.activated    = true ;
  ULTags.activated = true ;
  my.itag.activate();
  my.iniContent   = my.jqObj.text();
  ULTags.selected = my ;
  my.jqObj.addClass('selected');
  my.selected   = true;
};
LITag.prototype.onBlur = function(ev){
  var my = this ;
  // console.log(`Blur de #${my.id}`);
  if(my.new){my.new = false};
  my.activated      = false ;
  ULTags.activated  = false ;
  my.checkAndUpdate();
  my.jqObj.removeClass('selected');
  my.itag.desactivate();
  my.selected = null; // ULTags.selected reste à ce tag
};
LITag.prototype.onKeyPress = function(ev){
  // switch (ev.keyCode) {
  //   case 9: // Touche tabulation
  //     // console.log('TAG dans onKeyPress');
  //     break;
  //     // return stop(ev); // ne rien faire, c'est pour sélectionner le code
  // }
};
LITag.prototype.onKeyUp = function(ev){
  switch (ev.keyCode) {
    case 9: // Touche tabulation
      if (this.tabHasBeenPressed){
        // console.log('TAG dans onKeyUp');
        this.jqObj.blur();
        this.itag.focus();
        this.tabHasBeenPressed = false;
      } else {
        // console.log('TAB dans onKeyUp mais sans DOWN (je ne fais rien)');
      }
      return stop(ev);
      // return stop(ev); // ne rien faire, c'est pour sélectionner le code
    case 13: // Touche entrée => nouveau tag ou prendre en compte ?
      // console.log('Tabulation, je passe au suivant');
      // Pour la touche Entrée, on ne passe au tag suivant que si le tag
      // courant n'a pas été modifié.
      if(false == this.checkAndUpdate()){this.focus_next()};
      return stop(ev);
    case 40: // Flèche bas
      this.focus_next();return stop(ev);
    case 91:
      MEvents.with_meta_key = false;
      this.creating = false;
      return stop(ev);
  }
  // MEvents.console_key(ev);
};
LITag.prototype.onKeyDown = function(ev){
  switch (ev.keyCode) {
    case 38:
      if (MEvents.with_meta_key){
        this.jqObj.insertBefore(this.jqObj.prev());
        this.jqObj.focus();
      } else {
        this.focus_previous();
      }
      return stop(ev);
    case 40: // Flèche bas
      if (MEvents.with_meta_key){
        this.jqObj.insertAfter(this.jqObj.next());
        this.jqObj.focus();
      } else {
        this.focus_next();
      }
      return stop(ev);
    case 13:
      if (MEvents.with_meta_key == true && !this.creating){
        this.creating = true ;
        // console.log('Touche entrée avec MÉTA => création')
        ULTags.create_after(this);
      }
      return stop(ev);
    case 9:
      // console.log('TAG dans onKeyDown');
      this.tabHasBeenPressed = true ;
      return stop(ev);
    case 91:
      MEvents.with_meta_key = true;
      // console.log('CMD pressée');
      break;
  }
}

// /Fin des méthodes évènementielles
// ---------------------------------------------------------------------

Object.defineProperties(LITag.prototype,{
    'prop': {'Description':'Pour voir'}
  , jqObj:{
      get: function(){return $(`li#litag${this.id}`);}
    }
  , domObj:{
      get: function(){return document.getElementById(`litag${this.id}`)}
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
      get: function(){return CTags[this.nextObj.tag_id];}
    }
})
