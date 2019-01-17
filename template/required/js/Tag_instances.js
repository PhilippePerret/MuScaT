
// Table de hashage qui contient toutes les instances Tag.
const ITags = {} ;

function Tag(data_line, iline) {
  this.id = ++ window.last_tag_id ;

  // Initialisation de toutes les valeurs
  this.domId  = 'obj'+this.id ; // "objX"
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

  // === Nature ===
  var nature = data_line.shift() ;

  // On conserve une copie de la valeur initiale, qui permettra notamment
  // de recréer la ligne exactement comme elle était, avec la valeur de
  // nature raccourcie et/ou dans la langue d'origine.
  this.nature_init = nature ;

  // Si c'est la version d'une autre langue
  if (NATURES[nature].aka) { nature = NATURES[nature].aka }

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
  if ( NATURES_SHORTCUTS[nature] ) {
    var dnature = NATURES_SHORTCUTS[nature];
    this.nature = dnature.real ;
    // this.type   = dnature.type ;
    data_line.push('type='+dnature.type)
  } else {
    this.nature = nature ;
  }
  this.data_line  = data_line ;

  // La ligne réelle où est placé ce tag dans le fichier tags.js, pour pouvoir
   // la modifier quand elle est déplacée ou ajustée.
  this.index_line = iline ;

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

  // Ce tag est ajouté à la liste des tags, ce qui permettra de le
  // retrouver rapidement.
  ITags[this.domId] = this ;

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
//  Méthodes de construction

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
  var x = my.x || 0 ;
  css.push('left:' + x + 'px') ;
  var y = my.y || 0 ;
  css.push('top:'+ y + 'px') ;
  var w = my.w ? (my.w + 'px') : 'auto';
  css.push('width:' + w) ;

  css = css.join(';');

  /*/
  // Ajouter un "/" ci-dessus pour débugger
  console.log('Tag « '+(my.text||my.src||my.type)+' » #'+my.domId+' x = '+my.x+' / y = '+my.y);
  console.log('=> css = ' + css);
  //*/

  var classes = ['drag'] ;
  classes.push('tag') ;
  classes.push(my.nature) ;

  switch (my.nature) {
    case 'score':
      return '<img id="obj'+my.id+'" class="tag drag" src="images/'+my.src+'" style="'+css+'">';
    case 'cadence':
    case 'text':
      classes.push('typed') ; // permet d'ajouter du texte après
      classes.push(my.type) ;
      break;
    case 'line':
      classes.push('line'+my.code_line_by_type())
      break;
    default:
  }
  return '<span id="obj'+my.id+'" class="'+classes.join(' ')+'" style="'+css+'">'+(my.text||'&nbsp;')+'</span>';
}

// ---------------------------------------------------------------------
// Méthodes de transformation

Tag.prototype.updateXY = function(){
  this.updateX();
  this.updateY();
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
  my.updateX();
  MuScaT.update_line(my.index_line, my.to_line()) ;
}
Tag.prototype.setYAt = function(value) {
  var my = this ;
  my.y = value ;
  my.updateY();
  MuScaT.update_line(my.index_line, my.to_line()) ;
}
// Méthode qui cale le bas du tag à +value+ (en fonction de sa hauteur)
Tag.prototype.setDownAt = function(value) {
  var my = this ;
  my.y = value - my.jqObj.height();
  if (my.y < 0) { my.y = 0}
  this.updateY();
  MuScaT.update_line(my.index_line, my.to_line()) ;
}
// Cale le côté droit du tag à +value+ (en fonction de sa largeur)
Tag.prototype.setRightAt = function(value) {
  var my = this ;
  my.x = value - my.jqObj.width() ;
  if (my.x < 0) { my.x = 0 }
  this.updateX();
  MuScaT.update_line(my.index_line, my.to_line()) ;
}

// Actualisation du tag, aussi bien dans l'affichage (objet DOM) que
// dans la feuille tags.js
Tag.prototype.update = function() {
  var my = this ;
  Page.update(my);
  MuScaT.update_line(my.index_line, my.to_line()) ;
}

// Méthode qui retourne l'objet HTML du DOM du tag
Tag.prototype.set_dom_objet = function(){
  var my = this ;
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
          my.x = value_int ; break ;
        case 'y':
          my.y = value_int ; break ;
        case 'w':
          my.w = value_int ; break ;
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
      }
    }
  })
}

// Méthode inverse de la précédente : elle recompose la ligne
// analysée
Tag.prototype.recompose = function(){
  var my = this ;
  line = new Array() ;
  // Premier mot (toujours celui donné)
  line.push(my.nature_init) ; // par exemple 'image', line', 'part', 'mesure'
  // Deuxième mot, la source ou le texte, ou rien
  my.src  && line.push(my.src) ;
  my.text && line.push(my.text.replace(/ /g,'_')) ;
  // Si un type est défini, et que la nature n'est pas un raccourci
  // de nature, on écrit ce type
  if ( my.type && !my.is_nature_shortcut() ) {
    line.push('type='+my.type)
  }
  // La position
  my.x && line.push('x=' + parseInt(my.x)) ;
  my.y && line.push('y=' + parseInt(my.y)) ;
  my.w && line.push('w=' + parseInt(my.w)) ;
  my.h && line.push('h=' + parseInt(my.h)) ;

  return line ;
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

Tag.prototype.onStartMoving = function(ev, ui){
  var my = this ;
  my.pour_copie = ev.altKey == true ;
}
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
    // C'est une copie
    // Il faut créer un nouveau tag à partir de celui-ci
    var dline   = my.to_line().split(' '); // TODO Il faut utiliser plutôt une méthode qui refait le array
    var newtag  = new Tag(dline, ITags['obj'+last_tag_id].index_line + 1) ;
    newtag.build();
    newtag.observe();
    // On doit insérer la ligne dans le code, au lieu de la remplacer
    MuScaT.insert_line(newtag.index_line, newtag.to_line()) ;
    // Il faut remettre le tag à sa place (seulement ici, pour que les valeurs
    // de x et y ci-dessus soit bien les nouvelles)
    my.x = prev_x ;
    my.y = prev_y ;
    my.updateXY();
    msg = 'Nouveau tag créé sur la partition (id #'+newtag.domId+'). N’oubliez pas de copier-coller sa ligne.'
  } else {
    // Ce n'est pas une copie, il faut enregistrement les changement de
    // l'objet
    msg = "Nouvelle position de l'élément #" + my.id + " (« "+(my.src || my.text)+" ») : " + my.hposition()
    MuScaT.update_line(my.index_line, my.to_line()) ;
  }
  // console.log(msg) ;
  message(msg);
  // On actualise les lignes de données tout de suite
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
}
Tag.prototype.deselect = function(){
  var my = this ;
  my.jqObj.removeClass('selected');
}

// ---------------------------------------------------------------------
//  Méthodes de statut

Tag.prototype.is_nature_shortcut = function(){
  return NATURES_SHORTCUTS[my.nature_init];
}
