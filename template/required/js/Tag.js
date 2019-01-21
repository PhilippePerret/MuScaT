// Instanciation d'un tag
//
function Tag(data_line) {

  // Il ne faut peut-être plus affecter l'ID de cette manière, depuis
  // qu'on update vraiment l'animation (qu'on ne la reconstruit plus
  // de bout en bout à chaque actualisation du code)
  this.id = null ;

  this.real = true ; // pour indiquer que c'est un vrai tag (≠ NoTag)

  // Initialisation de toutes les valeurs
  this.domId  = null ;
  this.jqObj  = null ;
  this.domObj = null ;

  // Pour les coordonnées et l'aspect
  this.x = null;
  this.y = null;
  this.w = null; // width
  this.h = null; // height

  this.src = null ;  // fichier de l'image, dans './images/'
  this.text = null ; // Le texte de la cadence, de l'accord, etc.
  this.type = null ; // Le type de la cadence, de la ligne, etc.

  this.locked = false ; // indicateur de verrouillage

  // === Nature ===
  var nature = data_line.shift() ;

  // On conserve une copie de la valeur initiale, qui permettra notamment
  // de recréer la ligne exactement comme elle était, avec la valeur de
  // nature raccourcie et/ou dans la langue d'origine.
  this.nature_init = nature ;

  // Il faut consigner les données de la ligne, on en a besoin tout de
  // suite après.
  this.data_line  = data_line ;

  // La ligne réelle où est placé ce tag dans le fichier tags.js, pour pouvoir
  // la modifier quand elle est déplacée ou ajustée.
  // La propriété sera renseignée à la fin du premier parsing, pour tenir
  // compte des éventuels ajouts
  this.index_line = null ;

  // Mis à true quand l'élément est modifié (bougé), pour indiquer
  // qu'il faut faire quelque chose (mais peut-être pas, si les positions
  // sont enregistrées au fur et à mesure du déplacement)
  this.modified = false ;

  // On décompose complètement la ligne pour en tirer les informations
  // utiles, comme ses coordonnées ou son texte.
  this.decompose();

  /*
  // Pour débugger la décomposition (ajouter un "/" ci-dessus)
  dbug = {
    nature_init: this.nature_init,
    nature: this.nature,
    type: this.type,
  }
  if(this.src){dbug['src'] = this.src}
  if(this.text){dbug['text'] = this.text}
  console.log(dbug);
  //*/
}

// ---------------------------------------------------------------------
// Méthodes de coordonnées

// Pour obtenir la valeur x et y des éléments
// Plutôt que d'utiliser les méthodes top et left de jQuery (qui retournent
// des valeurs fantaisistes pour les objets transformés (rotate), on va
// voir directement dans le style de l'objet)
Tag.prototype.getX = function() {
  return this.hStyles()['left'] ;
}
Tag.prototype.getY = function() {
  return this.hStyles()['top'] ;
}
// Retourne une table de clé:valeur des styles définis
// dans la balise
Tag.prototype.hStyles = function(){
  var domstl  = this.domObj.style ;
  var hstyles = {};
  ['left', 'top','width', 'height'].forEach(function(prop){
    if (domstl[prop]) {
      value = domstl[prop] ;
      if (value.match(/px/)){
        value = parseInt(value.replace(/px/,''));
      }
      hstyles[prop] = value ;
    }
  })
  return hstyles;
}

// ---------------------------------------------------------------------
//  Méthodes de CONSTRUCTION

// Méthode qui construit l'élément dans la page
Tag.prototype.build = function(){
  var my = this ;
  Page.add(this);
}
// Pour transformer le tag en code HTML
// +params+ est un hash qui définit les codes css à utiliser
// en plus de ceux définis par l'instance courante. C'est par exemple la
// hauteur, en fonction des éléments déjà produits
Tag.prototype.to_html = function() {
  var my = this ;
  var css = [] ;

  var x = my.x || 100 ;
  css.push('left:' + x + 'px') ;
  var y = my.y || 100 ;
  css.push('top:'+ y + 'px') ;
  var w = my.w ? (my.w + 'px') : 'auto';
  css.push('width:' + w) ;

  css = css.join(';');

  /*/
  // Ajouter un "/" ci-dessus pour débugger
  console.log('Tag « '+(my.text||my.src||my.type)+' » #'+my.domId+' x = '+my.x+' / y = '+my.y);
  console.log('=> css = ' + css);
  //*/

  var classes = ['tag'] ;
  classes.push(my.nature) ;

  // Si le TAG ne définit pas ses x/y, on ajoute un style avec fond rouge
  // pour le signaler
  if (!my.x && !my.y){
    classes.push('warntag')
  }

  // Si le TAG est verrouillé on l'indique par une opacité moins grande
  // (ou autre style locked)
  // S'il n'est pas verrouillé, on ajoute une classe pour rendre le tag
  // draggable
  if(my.locked){classes.push('locked')}
  else {classes.push('drag')}

  switch (my.nature) {
    case 'score':
      return `<img id="${my.domId}" class="${classes.join(' ')}" src="images/${my.src}" style="${css}" />`
    case 'cadence':
    case 'text':
      // classes.push('typed') ; // permet d'ajouter du texte après
      classes.push(my.type) ;
      if (my.type == 'modulation'){
        return my.buildAsModulation(classes, css);
      }
      break;
    case 'line':
      classes.push('line'+my.code_line_by_type())
      break;
    default:
  }
  return `<span id="${my.domId}" class="${classes.join(' ')}" style="${css}">${my.text || ' '}</span>`;
}

// La marque de modulation possède son propre code, complexe, à l'aide
// de SVG.
// +classes+  Classes CSS
Tag.prototype.buildAsModulation = function(classes, css){
  var my = this ;
  // my.main_text = "SOL min"; my.sous_text = "(sous-dom)"
  var vly1 = 65 ; // v=vertical, l=ligne, y1
  var vly2 = (vly1 + (my.h ? my.h : 20)) ;

  code = `
<div id="${my.domId}" class="${classes.join(' ')}" style="${css}">
  <svg xml:lang="fr" width=140 height=100
  xmlns="http://www.w3.org/2000/svg"
  xmlns:xlink="http://www.w3.org/1999/xlink">
    <text class="main" font-size=16 x="0" y="56" transform="rotate(-28 0 0)">${my.main_text || my.text}</text>
    <text class="sous" font-size=14 x="2" y="84" transform="rotate(-28 0 20)">${my.sous_text || ''}</text>
    <line stroke-width="2" x1="18" y1="64" x2="88" y2="26" stroke="black" stroke-linecap="round" />
    <line stroke-width="2" x1="18" y1="${vly1}" x2="18" y2="${vly2}" stroke="black" stroke-linecap="round" />
  </svg>
</div>`
  return code;
   /*
   <!-- NOTE : JOUER SUR CE y2 pour la hauteur du trait (h=XXX) -->
   <!-- NOTE : Pour descendre toute l'image dans son div, il faut incrémenter
               de la même valeur TOUS les y (même les y2)
   -->
    */
}
// Les attributs pour le SVG d'une modulation
const MODUL_SVG_ATTRS = {
  'xml:lang':     'fr',
  'width':        '140',
  'height':       '140',
  'xmlns':        'http://www.w3.org/2000/svg',
  'xmlns:xlink':  'http://www.w3.org/1999/xlink'
}
// Les attributs du texte principal (tonalité) pour le SVG modulation
const MODUL_MAIN_TEXT_ATTRS = {
  'font-size': '16', 'x': 0, 'y': 56, 'transform': 'rotate(-28deg 0 0)'
}
const MODUL_SOUS_TEXT_ATTRS = {
  'font-size': '14', 'x': 2, 'y': 84, 'transform': 'rotate(-28deg 0 0)'
}

// ---------------------------------------------------------------------
// Méthodes de transformation

Tag.prototype.updateXY = function(){
  var my = this ;
  my.updateX();
  my.updateY();
  // Si le tag n'avait pas de coordonnées au départ, il avait reçu
  // la classe "warntag" qui l'affichait en rouge. Maintenant qu'il a
  // des coordonnées, on peut retirer cette classe.
  my.jqObj.removeClass('warntag');
  MuScaT.update_line(my.index_line, my.to_line()) ;
}
Tag.prototype.updateY = function(){
  this.jqObj.css({'top': this.y + 'px'});
}
Tag.prototype.updateX = function(){
  this.jqObj.css({'left': this.x + 'px'});
}

Tag.prototype.setXAt = function(value) {
  var my = this ;
  my.x = value ;
}
Tag.prototype.setYAt = function(value) {
  var my = this ;
  my.y = value ;
}
// Méthode qui cale le bas du tag à +value+ (en fonction de sa hauteur)
Tag.prototype.setDownAt = function(value) {
  var my = this ;
  my.y = value - my.jqObj.height();
  if (my.y < 0) { my.y = 0}
}
// Cale le côté droit du tag à +value+ (en fonction de sa largeur)
Tag.prototype.setRightAt = function(value) {
  var my = this ;
  my.x = value - my.jqObj.width() ;
  if (my.x < 0) { my.x = 0 }
}

// Actualisation du tag, aussi bien dans l'affichage (objet DOM) que
// dans la feuille tags.js
Tag.prototype.update = function() {
  var my = this ;
  // Page.update(my);
  // MuScaT.update_line(my.index_line, my.to_line()) ;
  my.updateXY(); // ça fait tout, normalement
}

// Méthode qui définit, d'après l'identifiant, le domId, et
// l'objet HTML du DOM du tag
Tag.prototype.set_dom_objet = function(){
  var my = this ;
  my.domId  = `obj${this.id}`;
  my.jqObj  = $('#'+my.domId);
  my.domObj = my.jqObj[0];
}

// Return un code pour le style de la ligne
// Ce code fonctionne en trois caractères :
//  1. bit indiquant s'il y a une ligne verticale pour commencer 0/1
//  2. bit indiquant si la ligne est en haut ou en bas (B/T)
//  3. bit indiquant s'il y a une ligne verticale à la fin.
Tag.prototype.code_line_by_type = function() {
  var my = this ;
  var c = '' ;
  c += ['U', 'L'].includes(my.type) ? '1' : '0' ;
  c += ['U', 'L', 'V'].includes(my.type) ? 'B' : 'T' ; // ligne bottom/top
  c += ['U', 'V', '^'].includes(my.type) ? '1' : '0' ;
  return c;
}

// ---------------------------------------------------------------------
//  Méthodes d'analyse

// Méthode qui décompose la donnée fournie à l'instanciation pour en
// déduire les données connues
Tag.prototype.decompose = function(){
  var my = this;
  this.data_line.forEach(function(el){
    // first_letter = el.substr(0,1).toLowerCase();
    // write('el = ' + el + ' / première lettre : "'+first_letter+'"');
    if (el.split('=').length > 1){
      varia = el.split('=')[0].trim();
      value = el.split('=')[1].trim();
      value_int = Number.parseInt(value,10);
      switch (varia) {
        case 'x':
        case 'y':
        case 'w':
        case 'h':
        case 'id':
          my[varia] = value_int ; break ;
        // case 'x':
        //   my.x = value_int ; break ;
        // case 'y':
        //   my.y = value_int ; break ;
        // case 'w':
        //   my.w = value_int ; break ;
        // case 'h':
        //   my.h = value_int ; break ;
        // case 'id':
        //   my.id = value_int ; break ;
        case 'type':
          switch (my.nature) {
            case 'cadence':
              my.type = value ; break;
            case 'text':
              my.type = TABLECOR_TYPES_TEXT[value] || value ; break;
            case 'line':
              my.type = TABLECOR_TYPES_LINE[value] || value ; break;
            default:
              console.error("La propriété 'type' de la nature '"+my.nature+"' n'est pas traitée…")
          }
      }
    } else {
      // En fonction du nature de l'objet (image, cadence, etc.), un
      // élément sans valeur signifie différentes choses
      // write("Définition en fonction du nature ("+my.nature+")")
      switch (my.nature) {
        case 'score':
          my.src = el; break;
        case 'line':
          var ty = el.replace(/_+/g,'_').replace(/\-+/g,'-') ;
          my.type = TABLECOR_LIGNE_TYPE_GRAPH_TO_LETTER[ty] || ty ;
          break;
        default:
          // La plupart des autres éléments
          my.text = el.replace(/_/g, ' ') ;
          // Si le texte contient une balance, ça définit le
          // main-texte et le sous-texte
          if(my.text.match(/\//)){
            d = my.text.split('/') ;
            my.main_text = d[0] ;
            my.sous_text = d[1] ;
          }
      }
    }
  })
}

// Méthode inverse de la précédente : elle recompose la ligne
// analysée
// Return un Array de toutes les valeurs
Tag.prototype.recompose = function(){
  var my = this ;
  aLine = new Array() ;
  // Indicateur de verrouillage si la ligne est verrouillé
  if (my.locked){aLine.push('🔒')}
  // Premier mot (toujours celui donné)
  aLine.push(my.nature_init) ; // par exemple 'image', line', 'part', 'mesure'
  // Deuxième mot, la source ou le texte, ou rien
  my.src  && aLine.push(my.src) ;
  my.text && aLine.push(my.text.replace(/ /g,'_')) ;

  // L'identifiant
  aLine.push(`id=${my.id}`) ;

  // Si un type est défini, et que la nature n'est pas un raccourci
  // de nature, on écrit ce type
  if ( my.type && !my.is_nature_shortcut() ) {
    aLine.push('type='+my.type)
  }
  // La position
  my.x && aLine.push('x=' + parseInt(my.x)) ;
  my.y && aLine.push('y=' + parseInt(my.y)) ;
  my.w && aLine.push('w=' + parseInt(my.w)) ;
  my.h && aLine.push('h=' + parseInt(my.h)) ;

  return aLine ;
}

// ---------------------------------------------------------------------
// Helpers

// Retoune la ligne telle qu'elle doit être dans le fichier tags.js
// Attention : ici il ne s'agit pas d'une ligne au sens de l'élément graphique,
// mais de la ligne de CODE qui définit l'élément graphique dans tags.js
Tag.prototype.to_line = function() {
  // On sépare toutes les valeurs par une espace
  return this.recompose().join(' ') ;
}

// Retourne la position sous forme humaine
Tag.prototype.hposition = function(){
  var my = this ;
  return "x: " + my.x + ' / y: ' + my.y ;
}

// ---------------------------------------------------------------------
// Méthodes évènementielles

Tag.prototype.onStopMoving = function(){
  var my = this ;
  var msg ;
  // Utile pour la copie
  var   prev_x = my.x
      , prev_y = my.y
      , position = my.jqObj.offset();

  // Dans tous les cas, pour une copie ou un pur déplacement, on doit
  // mettre les x et y à leur valeur. Pour la copie, ils serviront pour
  // le nouveau tag et on remettra ensuite les anciennes valeurs.
  my.x = my.getX();
  my.y = my.getY();

  if (my.pour_copie){
    my.createCopy();
    // Il faut remettre le tag à sa place (seulement ici, pour que les valeurs
    // de x et y ci-dessus soit bien les nouvelles)
    my.x = prev_x ; my.y = prev_y ;
  } else {
    message("Nouvelle position de l'élément #" + my.id + " (« "+(my.src || my.text)+" ») : " + my.hposition());
  }
  // Que ce soit pour une copie ou pour un déplacement, il faut actualiser
  // les données de l'élément
  my.updateXY();
}

Tag.prototype.onStartMoving = function(ev, ui){
  var my = this ;
  my.pour_copie = ev.altKey == true ;
}

// ---------------------------------------------------------------------
//  Méthodes de création

Tag.prototype.createCopy = function() {
  var my = this ;
  // Il faut créer un nouveau tag à partir de celui-ci
  var dline   = my.recompose() ;
  var newtag  = new Tag(dline, CTags.get_index_line_before(my.y, my.x)) ;
  newtag.build();
  newtag.observe();
  MuScaT.insert_line(newtag) ;
  message('Nouveau tag créé sur la partition (id #'+newtag.domId+'). N’oubliez pas de copier-coller sa ligne.');
}

// Méthode qui place les observeurs sur l'élément, lorsqu'il a été
// créé après la première fabrication (copies)
Tag.prototype.observe = function(){
  var my = this ;
  my.jqObj.draggable(DATA_DRAGGABLE) ;
  my.jqObj.on('click', CTags.onclick) ;
}

Tag.prototype.onClick = function(ev){
  var my = this ;
  // console.log(ev);
  var withMaj = ev.shiftKey;
  CTags.on_select(my, ev.shiftKey) ;
}
Tag.prototype.select = function(){
  var my = this ;
  my.jqObj.addClass('selected');
  my.selectCodeLine();
}
// Méthode qui sélectionne le code du tag dans codeSource
Tag.prototype.selectCodeLine = function(){
  var my = this, offStart, offEnd ;
  if(false == window.get_option('code beside')){return}
  CodeField.domObj.focus();
  if ( my.index_line > 0){
    offStart = MuScaT.lines.slice(0, my.index_line).join(RC).length + 1 ;
  } else { offStart = 0 }
  offEnd = offStart + MuScaT.lines[my.index_line].length ;
  CodeField.domObj.setSelectionRange(offStart,offEnd);
  var timer = setTimeout(function(){
    my.domObj.focus();
    CodeField.domObj.setSelectionRange(offStart,offStart);
  }, 2000);
}

Tag.prototype.deselect = function(){
  var my = this ;
  my.jqObj.removeClass('selected');
}

// ---------------------------------------------------------------------
//  Méthodes de statut

Tag.prototype.is_nature_shortcut = function(){
  return !!this._is_nature_shortcut ;
}

// Définit l'identifiant, et avec lui l'identifiant DOM du tag
Tag.prototype.set_id = function(value){
  this.id = value ;
  this.domId = `obj${this.id}`;
  ITags[this.domId] = this ;
}

Object.defineProperties(Tag.prototype,{
  nature: {
    get: function(){
      if( ! this._nature ){
        this._nature = NATURES[this.nature_init].aka || this.nature_init ;
        // Certaines natures sont des raccourcis, par exemple :
        //    partie Mon_Introduction ...
        // correspond à :
        //    text Mon_Introduction type=part
        // Ou encore :
        //    mesure 11 ....
        // correspond à :
        //    text 10 type=measure
        // Il faut donc transformer ces raccourcis ici et quand on redonne
        // la ligne.
        if ( NATURES_SHORTCUTS[this._nature] ) {
          this._is_nature_shortcut = true ;
          var dnature = NATURES_SHORTCUTS[this._nature];
          this._nature = dnature.real ;
          this.type    = dnature.type ;
        } else {
        }
      }
      return this._nature;
    },
    set: function(value){ this._nature = value }
  }
})
