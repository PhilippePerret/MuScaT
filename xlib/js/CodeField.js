/**
  * Pour gérer le champ de code
  *
  * Dans cette nouvelle mouture, CodeField est une liste qui contient les
  * tags sous forme de LI.
  */
const CodeField = {

  already_observed: false, // mise à true quand le champ a reçu ses gestionnaires
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
    if(my.already_observed){return};
    my.jqObj.on('focus', $.proxy(CodeField,'onFocus'));
    my.jqObj.on('blur', $.proxy(CodeField,'onBlur'));
    my.already_observed = true;
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

const ULTags = {
    'pour': 'virgule'

  , setULHeight: function(){
      var my = this ;
      console.log('window.innerHeight:', window.innerHeight);
      my.jqObj.css('height', ($(window).height() - 200) + 'px');
    }
    /**
     * Pour construire la liste des tags
     */
  , build: function(){
      var my = this;
      my.setULHeight();
      M.onEachTag(function(itag){$.proxy(new LITag(itag), 'build')()});
    }

    /**
     * Méthode appelée pour créer une nouvelle ligne sous la ligne
     * courante (pour le moment sans tag)
     */
  , create_after: function(litagBefore){
      var my = this ;
      var itag  = new Tag('');
      itag.id = ++ M.last_tag_id;
      ITags[itag.domId] = itag;
      var litag = new LITag(itag);
      litag.build({after: litagBefore.jqObj});
      litagBefore.jqObj.blur();
      litag.jqObj.focus();
      itag.build_and_watch();
    }
};
Object.defineProperties(ULTags,{
  jqObj:{
    get: function(){return $('#ultags')}
  }
})

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
  // TODO : le mettre en exergue sur la table (pas en sélection)
};
LITag.prototype.onBlur = function(ev){
  var my = this ;
  console.log(`Blur de #${my.id}`);
  my.activated = false ;
  my.newContent = my.jqObj.text();
  if (my.iniContent != my.newContent) {
    // Un changement a été opéré => décomposer la donnée
    // et mémoriser.
    console.log(`#${my.id} modified`);
    my.itag.parse(my.newContent);
    my.modified = true;
  }
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
