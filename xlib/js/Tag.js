// Instanciation d'un tag
//
function Tag(data_line) {
  var locked ;

  // Si +data_line+ est un string, c'est la ligne qui est passée de
  // façon brute
  if ('string' == typeof(data_line)){
    var ret = M.epure_and_split_raw_line(data_line) ;
    data_line = ret.data ;
    locked    = ret.locked ;
    this.id   = ret.id ; // seulement pour les commentaires et vides
  } else {
    locked  = false ;
    this.id = null ;
  }

  // Note sur l'ID
  // Il pourra être affecté longtemps après l'instanciation, quand
  // par exemple c'est une nouvelle ligne (un nouveau tag) dans un
  // fichier _tags_.js très long.

  // Pour les coordonnées et l'aspect
  this.x = null;
  this.y = null;
  this.w = null; // width
  this.w_unit = null;
  this.h = null; // height
  this.h_unit = null;

  this.src = null;  // fichier de l'image, dans './images/'
  this.text = null; // Le texte de la cadence, de l'accord, etc.
  this.type = null; // Le type de la cadence, de la ligne, etc.

  this.locked     = locked; // indicateur de verrouillage
  this.selected   = false; // Indicateur de sélection
  this.destroyed  = false; // Indicateur de destruction

  // === Nature ===
  var nature = data_line.shift() ;

  // On conserve une copie de la valeur initiale, qui permettra notamment
  // de recréer la ligne exactement comme elle était, avec la valeur de
  // nature raccourcie et/ou dans la langue d'origine.
  this.nature_init = nature ;

  // Il faut consigner les données de la ligne, on en a besoin tout de
  // suite après.
  this.data_line  = data_line ;

  // La ligne réelle où est placé ce tag dans le fichier _tags_.js, pour pouvoir
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

/** ---------------------------------------------------------------------
  *
  * MÉTHODES DE DONNÉES
  *
  **/

/**
 * Nouvelle méthode, depuis qu'on met le code sous forme de UL, pour
 * parser la nouvelle ligne modifiée.
 * Noter qu'ici la ligne peut changer du tout au tout, devenir commentaire
 * en étant ligne vide, devenir ligne vide en ayant été tag, etc.
 */
Tag.prototype.parse = function(newline){
  var my = this ;
  var ret = M.epure_and_split_raw_line(newline) ;
  my.data_line  = ret.data ;
  my.locked     = ret.locked ;
  // nature_init permettra de déterminer le type du tag, vrai tag ou
  // ligne vide ou ligne de commentaires
  my.nature_init = ret.nature_init ;
  // TODO la méthode decompose doit déjà savoir si le tag est une
  // ligne vide, un commentaire ou un vrai tag. Il faut les régler ici
  my.decompose();
  // Si l'objet n'est pas encore construit, il faut le construire, sinon,
  // il faut seulement l'updater
  if (my.jqObj.length == 0){
    // L'objet n'existe pas encore, il faut le construire (note : si c'est
    // une ligne vide ou un commentaire, rien ne sera construit)
    my.build_and_watch()
  } else if (my.is_empty_line || my.is_comment_line){
    // Le tag a changé de nature, il est devenu une ligne vide ou
    // un commentaire => il faut le détruire
    my.jqObj.remove();
  } else {
    // Le tag existe mais ses données ont peut-être changées, on
    // l'actualise.
    // TODO
  }
};

/**
 * La ligne qui doit être enregistrée dans le fichier _tags_.js
 *
 * Note : la différence avec 'to_line' est qu'ici on ne met pas
 * l'identifiant.
 */
Tag.prototype.to_li = function(){
  var my = this ;
  console.log(this.recompose({for_li: true}))
  return (this.recompose({for_li: true}).join(' ')).trim() ;
};

// Retoune la ligne telle qu'elle doit être dans le fichier _tags_.js
// Attention : ici il ne s'agit pas d'une ligne au sens de l'élément graphique,
// mais de la ligne de CODE qui définit l'élément graphique dans _tags_.js
Tag.prototype.to_line = function() {
  // On sépare toutes les valeurs par une espace
  return (this.recompose().join(' ')).trim() ;
}

/**
 * Grand méthode d'actualisation du TAg
 * C'est devenu la méthode incontournable puisqu'elle gère aussi
 * l'historique des opérations (pour les annulations)
 *
 */
Tag.prototype.update = function(prop, new_value, options) {
  var my = ITags[this.domId];
  if(undefined == prop){
    // Appel de la méthode sans argument
    my.updateXY(); // ça fait tout, normalement

  } else if (undefined!=new_value && Number.parseInt(new_value,10) < 5) {
    return ; // impossible de mettre des valeurs inférieures à 5
    // Noter que même les pourcentages seront rejetés
  } else {
    if (!options || !options.no_histo){
      H.add([new HistoProp(my, prop, my[prop], new_value)]) ;
    }
    // Appelé avec un argument, c'est la propriété qu'il faut
    // actualiser
    switch (prop) {
      case 'y':
      case 'top':
        my.updateY(new_value);break;
      case 'x':
      case 'left':
        my.updateX(new_value);break;
      case 'h':
      case 'height':
        my.updateH(new_value);break;
      case 'w':
      case 'width':
        my.updateW(new_value);break;
      case 'text':
        my.updateText(new_value);break;
      case 'src':
        my.updateSrc(new_value);break;
      case 'locked':
        my.updateLock(new_value);break;
      case 'destroyed':
        my.updateDestroyed(new_value);break;
    }
  }
};



// Reset de l'identifiant (quand copie, par exemple)
Tag.prototype.reset_id = function() {
  var my = this ;
  my.id       = null ;
  my._domId   = null ;
  my._jqObj   = null ;
  my._domObj  = null ;
};

// ---------------------------------------------------------------------
// Méthodes de coordonnées

Tag.prototype.width_to_obj = function(){
  return {'width': `${this.w}${this.w_unit||'px'}`};
};
Tag.prototype.width_to_str = function(){
  return `width:${this.w}${this.w_unit||'px'}`;
};
Tag.prototype.height_to_obj = function(){
  return {'height': `${this.h}${this.h_unit||'px'}`};
};
Tag.prototype.height_to_str = function(){
  return `height:${this.h}${this.h_unit||'px'}`;
};

/**
 * Méthode qui sépare la valeur de l'unité
 */
Tag.prototype.get_value_and_unit = function(fullvalue) {
  var my = this._domId ? ITags[this.domId] : this ;
  if('number'==typeof(fullvalue)){
    return [fullvalue, 'px'];
  } else {
    var arr = fullvalue.trim().match(/^([0-9\.]+)([a-z%]+)?$/);
    if ( !arr ){ return [null, null] }
    else { return [Number.parseInt(arr[1],10), arr[2]] };
  };
};
// Pour obtenir la valeur x et y des éléments
// Plutôt que d'utiliser les méthodes top et left de jQuery (qui retournent
// des valeurs fantaisistes pour les objets transformés (rotate), on va
// voir directement dans le style de l'objet)
Tag.prototype.getX = function() {
  return this.get_value_and_unit(this.hStyles()['left'])[0] ;
};
Tag.prototype.getY = function() {
  return this.get_value_and_unit(this.hStyles()['top'])[0] ;
};
// ATTENTION : contrairement à getX et getY, la fonction retourne un array
// contenant [value, unit]
Tag.prototype.getW = function(){
  var thew = this.hStyles()['width'] || this.jqObj.width();
  if (thew == 'auto') { return [this.jqObj.width(), 'px'] }
  else { return this.get_value_and_unit(thew) };
};
// ATTENTION : contrairement à getX et getY, la fonction retourne un objet
// contenant [value, unit]
Tag.prototype.getH = function(){
  if(this.is_modulation){
    var lin = this.jqObj.find('line.vertline');
    return [Number.parseInt(lin.attr('y2') - lin.attr('y1'), 10), 'px'];
  } else {
    var theh = this.hStyles()['height'] || this.jqObj.height();
    if (theh == 'auto'){return {value: this.jqObj.height(), unit: 'px'}}
    else { return this.get_value_and_unit(theh) };
  }
};
// Retourne une table de clé:valeur des styles définis
// dans la balise
Tag.prototype.hStyles = function(){
  var domstl  = this.domObj.style ;
  var hstyles = {};
  ['left','top','width','height'].forEach(function(prop){
    if (domstl[prop]) { hstyles[prop] = domstl[prop] } ;
  })
  return hstyles;
};

// Méthode qui s'arrange pour rendre le tag visible dans la
// fenêtre actuelle.
Tag.prototype.setVisibleInWindow = function(){
  var my = ITags[this.domId]
    , top = my.jqObj.offset().top
    , hei = my.domObj.offsetHeight
    , bot = top + hei
    , scro = window.scrollY
    , winh = $(window).height()  // La hauteu visible
    // Les hauteurs limites, en haut et en bas
    , limVisibleTop = scro
    , limVisibleBot = scro + winh
    , scro_required
    ;

  if (top < limVisibleTop + 20 || bot > limVisibleBot - 20 ) {
    if ( hei < winh ) {
      // Si la dimension de l'objet n'excède pas la dimension de
      // la fenêtre. On le place au centre.
      scro_required = Number.parseInt(top - (hei/2) - 10, 10) ;
    } else {
      scro_required = top - 10 ;
    }
  }
  // On scrolle pour voir l'élément
  if (scro_required){window.scroll(0, scro_required)};
};

Tag.prototype.set_dimension = function(prop, dim, mult, fin){
  var my  = ITags[this.domId];
  var pas = (fin ? 1 : (5 * (mult ? 5 : 1))) * (dim ? -1 : 1) ;
  // Cas spécial de la hauteur avec 1) les images 2) les modulations
  if (prop == 'h' && !my.h && (my.is_image || my.is_modulation)) {
    [my.h, my.h_unit] = my.getH();
  }
  // Cas spécial de la largeur avec les images
  if (prop == 'w' && my.is_image && !my.w){
    [my.w, my.w_unit] = my.getW();
  };
  // Finalement, on affecte la dimension
  my.update(prop, my[prop] + pas);
};

Tag.prototype.move = function(sens, mult, fin){
  var my  = ITags[this.domId];
  var pas = fin ? 1 : (5 * (mult ? 5 : 1)) ;
  var [prop, mltpas] = function(sens){
    switch(sens){
      case 'l': return ['x', -1];
      case 'r': return ['x', 1];
      case 't': return ['y', -1];
      case 'd': return ['y', 1];
    };
  }(sens);
  my.update(prop, my[prop] + (pas * mltpas));
}
// ---------------------------------------------------------------------
//  Méthodes de CONSTRUCTION

// Pour transformer le tag en code HTML
// +params+ est un hash qui définit les codes css à utiliser
// en plus de ceux définis par l'instance courante. C'est par exemple la
// hauteur, en fonction des éléments déjà produits
Tag.prototype.to_html = function() {
  var my = this
    , css = []
    , classes = ['tag']
    ;

  if (!my.x && !my.y && my.tag_without_coordonates){
    // On ne fait rien
  } else {
    css.push('left:' + (my.x || 100) + 'px') ;
    css.push('top:'+ (my.y || 100) + 'px') ;
    if (!my.x && !my.y){
      classes.push('warntag')
    }
  }
  // Largeur et hauteur
  css.push(my.w ? my.width_to_str() : 'auto');
  if (my.h){ css.push(my.height_to_str()) };

  css = css.join(';')+';';

  /*/
  // Ajouter un "/" ci-dessus pour débugger
  console.log('Tag « '+(my.text||my.src||my.type)+' » #'+my.domId+' x = '+my.x+' / y = '+my.y);
  console.log('=> css = ' + css);
  //*/

  classes.push(my.nature) ;

  // Si le TAG est verrouillé on l'indique par une opacité moins grande
  // (ou autre style locked)
  // S'il n'est pas verrouillé, on ajoute une classe pour rendre le tag
  // draggable
  if(my.locked){classes.push('locked')}
  else {classes.push('drag')}

  var ftext = my.text || '';
  switch (my.nature) {
    case 'score':
      return `<img id="${my.domId}" class="${classes.join(' ')}" src="${IMAGES_FOLDER}/${my.src}" style="${css}" />`
    case 'cadence':
    case 'text':
      // classes.push('typed') ; // permet d'ajouter du texte après
      classes.push(my.type) ;
      switch (my.type) {
        case 'modulation':    return my.buildAsModulation(classes, css);
        case 'analyst':       ftext = `${t('analyzed-by')} ${ftext}`;break;
        case 'analysis_date': ftext = `${t('le-of-date')} ${ftext}`;break;
      }
      // Si un style précis est défini, on le prend
      if (MTHEME[`${my.nature}.${my.type}`]){
        css += Th.get(`${my.nature}.${this.type}`, my.jqObj);
      }
      break;
    case 'line':
      classes.push('line'+my.code_line_by_type())
      break;
    default:
  }
  return `<span id="${my.domId}" class="${classes.join(' ')}" style="${css}">${ftext}</span>`;
};

// Construit le tag et pose les observers dessus. Mais seulement si
// c'est un "vrai" tag (pas une ligne de commentaire ou une ligne vide)
Tag.prototype.build_and_watch = function(){
  this.real && this.build().observe();
};
// Méthode qui construit l'élément dans la page
Tag.prototype.build = function(){
  // console.log(`Construction du tag #${this.id} (y=${this.y})`);
  Page.add(this);
  return this; // chainage
};

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
    <line class="biasline" stroke-width="2" x1="18" y1="64" x2="88" y2="26" stroke="black" stroke-linecap="round" />
    <line class="vertline" stroke-width="2" x1="18" y1="${vly1}" x2="18" y2="${vly2}" stroke="black" stroke-linecap="round" />
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
Tag.prototype.updateY = function(newy){
  if(undefined != newy){
    if (newy < 5){return};
    this.y = newy;
  };
  this.jqObj.css({'top': this.y + 'px'});
};
Tag.prototype.updateX = function(newx){
  if(undefined != newx){
    if (newx < 5){return};
    this.x = newx;
  };
  this.jqObj.css({'left': this.x + 'px'});
};
Tag.prototype.updateH = function(newh){
  var my = this ;
  if(my.nature == 'cadence'){return F.error(t('no-h-pour-cadence'))};
  if(undefined != newh) {
    if (newh < 5){return};
    my.h = newh;
  };
  // Traitement particulier pour les modulations
  if(my.type == 'modulation'){
    my.jqObj.find('svg')[0].setAttribute('height', this.h + 50) ;
    var line = my.jqObj.find('svg line.vertline')[0] ;
    line.setAttribute('y2', Number.parseInt(line.getAttribute('y1'),10) + this.h);
  } else {
    this.jqObj.css(my.height_to_obj());
  }
}
Tag.prototype.updateW = function(neww){
  var my = ITags[this.domId];
  if (my.type == 'modulation'){return F.error(t('no-w-pour-modulation'))};
  if(undefined != neww){
    if (neww < 5){return};
    var [new_w, new_w_unit] = my.get_value_and_unit(neww);
    if(my.nature == 'cadence'){
      // Pour une cadence, la largeur doit ajouter vers la
      // droite et laisser le bout à gauche
      var dif  = new_w - my.getW()[0];
      var newx = this.x - dif ;
      my.update('x', newx);
    }
    my.w = new_w ;
  }
  this.jqObj.css(my.width_to_obj()) ;
}

Tag.prototype.updateText = function(newt){
  var my = ITags[this.domId];
  if(undefined != newt){ my.text = newt };
  if(my.type == 'modulation'){
    var [t, st] = my.text.split('/');
    my.main_text = t || '' ;
    my.sous_text = st || '' ;
    my.jqObj.find('svg text.main').text(my.main_text) ;
    my.jqObj.find('svg text.sous').text(my.sous_text) ;
  } else {
    my.domObj.innerHTML = my.text ;
  }
}
Tag.prototype.updateSrc = function(news){
  if(undefined != news){ this.src = news };
  this.domObj.src = `${IMAGES_FOLDER}/${this.src}` ;
}
Tag.prototype.updateLock = function(new_value){
  // Note : je ne sais pas pourquoi, ici, je dois utiliser cette
  // tournure avec new_value alors que pour les autres valeurs, ça
  // semble se faire normalement.
  var my = ITags[this.domId];
  my.locked = new_value ;
  my.jqObj[my.locked ? 'addClass' : 'removeClass']('locked');
  if(my.locked && my.selected){CTags.remove_from_selection(my)};
  my[my.locked ? 'unobserve' : 'observe']();
}

Tag.prototype.updateDestroyed = function(value){
  var my = ITags[this.domId];
  my.destroyed = value ;
  if(my.destroyed){
      if(my.real){
        my.jqObj.remove() ;
        M.lines.splice(my.index_line,1);
        M.tags.splice(my.index_line,1);
      };
  } else {
    // Annulation de destruction. Il faut remettre l'objet à
    // sa place, à sa ligne
    if (my.index_line < M.tags.length){
      M.tags .splice(my.index_line, 0, my);
      M.lines.splice(my.index_line, 0, my.to_line());
    } else {
      M.tags.push(my);
      M.lines.push(my.to_line());
      my.index_line = M.lines.length - 1;
    };
    my.build();
  };
  M.update_index_line_from(my.index_line);
};

// ---------------------------------------------------------------------

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
  var my = this ;
  if(my.is_comment_line){
    my.text = my.data_line.join(' ');
    return ;
  } else if(my.is_empty_line){
    my.text = '';
    return ;
  }
  // else
  my.data_line.forEach(function(el){
    // first_letter = el.substr(0,1).toLowerCase();
    // write('el = ' + el + ' / première lettre : "'+first_letter+'"');
    if (el.split('=').length > 1){
      varia = el.split('=')[0].trim();
      value = el.split('=')[1].trim();
      value_int = Number.parseInt(value,10);
      switch (varia) {
        case 'x':
        case 'y':
        case 'id':
          my[varia] = value_int ; break ;
        case 'h':
        case 'w':
          // Pour la hauteur et la largeur, valeur et unité sont stockées
          // dans deux propriétés différentes, w et w_unit, h et y_unit
          var [new_val, new_unit] = my.get_value_and_unit(value);
          my[varia] = new_val;
          my[`${varia}_unit`] = new_unit;
          break;
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
Tag.prototype.recompose = function(options){
  var my = this ;

  if(my.is_empty_line){return ['']};

  aLine = new Array() ;
  // Indicateur de verrouillage si la ligne est verrouillé
  if (my.locked){aLine.push('🔒')}
  // Premier mot (toujours celui donné)
  aLine.push(my.nature_init) ; // par exemple 'image', line', 'part', 'mesure'
  // Deuxième mot, la source ou le texte, ou rien
  my.src  && aLine.push(my.src) ;
  my.text && aLine.push(my.is_comment_line ? my.text : my.text.replace(/ /g,'_')) ;

  // L'identifiant
  if(!(options && options.for_li)){
    aLine.push(`id=${my.id}`);
  }

  // Si un type est défini, et que la nature n'est pas un raccourci
  // de nature, on écrit ce type
  if ( my.type && !my.is_nature_shortcut() ) {
    aLine.push('type='+my.type);
  }
  // La position
  my.x && aLine.push('x=' + parseInt(my.x));
  my.y && aLine.push('y=' + parseInt(my.y));
  my.h && aLine.push('h=' + my.h + (my.h_unit||'')) ;
  my.w && aLine.push('w=' + my.w + (my.w_unit||'')) ;

  return aLine ;
}

// ---------------------------------------------------------------------
// Helpers


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
    // Gérer l'historique des opérations.
    // Noter qu'il ne faut pas le faire pour la copie, puisque l'élément
    // original ne bouge pas, dans ce cas-là.
    H.add([new HistoProp(my, 'x', prev_x, my.x), new HistoProp(my, 'y', prev_y, my.y)]) ;
    message("Nouvelle position de l'élément #" + my.id + " (« "+(my.src || my.text)+" ») : " + my.hposition());
  }
  // Que ce soit pour une copie ou pour un déplacement, il faut actualiser
  // les données de l'élément
  my.updateXY();
};

Tag.prototype.onStartMoving = function(ev, ui){
  var my = this ;
  my.pour_copie = (ev.altKey == true) ;
};

// ---------------------------------------------------------------------
//  Méthodes de création

Tag.prototype.createCopy = function() {
  var my = this ;
  // Il faut créer un nouveau tag à partir de celui-ci
  var dline   = my.recompose() ;
  var newtag  = new Tag(dline) ;
  newtag.index_line = M.get_line_for_position(newtag.x, newtag.y) ; // peut être = -1
  newtag.id = ++ M.last_tag_id ;
  M.insert_line(newtag) ;
  newtag.build_and_watch();
  message(`Nouveau tag créé sur la partition (id #${newtag.id}). N’oubliez pas de copier-coller sa ligne ou tout le code dans votre fichier _tags_.js.`);
}

/**
 * Méthode qui doit comparer le tag courant avec tagComp (instancié d'après la
 * ligne dans le champ du code) et procéder au modification (dans l'instance
 * comme dans le DOM).
 */
 const TAG_PROPERTIES_LIST = ['x', 'y', 'h', 'w', 'type', 'nature', 'nature_init', 'text', 'src', 'locked'] ;

Tag.prototype.compare_and_update = function(tagComp) {
  this.modified = false ;
  for(var prop of TAG_PROPERTIES_LIST){
    if (tagComp[prop] != this[prop]){
      this.update(prop, this[prop]) ;
      this.modified = true ;
    }
  }
  return this.modified == true ; // seulement pour les messages, je crois
};


// Méthode qui place les observeurs sur l'élément, lorsqu'il a été
// créé après la première fabrication (copies)
Tag.prototype.observe = function(){
  var my = this ;
  if( ! my.is_draggabled ){
    my.jqObj.draggable(DATA_DRAGGABLE) ;
    my.is_draggabled = true ;
  }
  my.jqObj.draggable('option', 'disabled', false) ;
  my.jqObj.on('click', CTags.onclick) ;
};

Tag.prototype.unobserve = function(){
  var my = this ;
  if( ! my.is_draggabled ){
    my.jqObj.draggable(DATA_DRAGGABLE) ;
    my.is_draggabled = true ;
  }
  my.jqObj.draggable('option', 'disabled', true) ;
  my.jqObj.off('click') ;
}

Tag.prototype.onClick = function(ev){
  var my = this ;
  var withMaj = ev.shiftKey;
  CTags.on_select(my, ev.shiftKey);
  Page.getCoordonates(ev);
}
Tag.prototype.select = function(){
  var my = this ;
  my.jqObj.addClass('selected');
  if(Options.get('code beside')){my.selectCodeLine()};
  my.selected = true ;
}
// Méthode qui sélectionne le code du tag dans codeSource
Tag.prototype.selectCodeLine = function(){
  var my = this, offStart, offEnd ;
  CF.domObj.focus();
  if ( my.index_line > 0){
    offStart = M.lines.slice(0, my.index_line).join(RC).length + 1 ;
  } else { offStart = 0 }
  offEnd = offStart + M.lines[my.index_line].length ;
  CF.domObj.setSelectionRange(offStart,offEnd);

  var timer = setTimeout(function(){
    CF.domObj.setSelectionRange(offStart,offStart);
    CF.domObj.blur();
  }, 1000);
}

Tag.prototype.deselect = function(){
  var my = this ;
  my.jqObj.removeClass('selected');
  my.selected = false ;
}

// ---------------------------------------------------------------------
//  Méthodes de statut

/**
 * Pour introduire le tag dans un groupe
 */
Tag.prototype.add_in_group = function(igroup) {
  var my = ITags[this.domId];
  my.group = igroup ;
  my.jqObj.addClass('grouped');
  igroup.tags.push(my);
};
Tag.prototype.ungroup = function(){
  var my = ITags[this.domId];
  my.group = null ;
  my.jqObj.removeClass('grouped');
};

Tag.prototype.is_nature_shortcut = function(){
  return !!this._is_nature_shortcut ;
};

Object.defineProperties(Tag.prototype,{
  data_nature: {
    get:function(){
      if (!this._data_nature){
        this._data_nature = NATURES[NATURES[this.nature_init].aka || this.nature_init] ;
      };
      return this._data_nature ;
    }
  }
  , nature: {
      get: function(){
        if( ! this._nature ){
          if(this.is_comment_line || this.is_empty_line){return null};
          if(!NATURES[this.nature_init]){
            error(`La nature de tag "${this.nature_init}" est inconnue. Merci de corriger le code.`);
            return null ;
          }
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
  // DOM
  , domId: {
      get: function(){
        if(undefined == this._domId){
          if(null == this.id){throw('Impossible de définir domId, l’identifiant du tag est null…')}
          this._domId = `tag${this.id}`
        }
        return this._domId ;
      },
      set: function(value){ this._domId = value }
    }
  , jqObj: {
      get: function(){
        if(!this._jqOjb){
          this._jqObj = $(`#${this.domId}`) ;
        }
        return this._jqObj;
      },
      set: function(value){ this._jqObj = value }
    }
  , domObj: {
      get: function(){
        if(!this._domObj){
          this._domObj = document.getElementById(this.domId);
        }
        return this._domObj;
      },
      set: function(value){this._domObj = value; }
    }

  // Nature de la ligne du tag
  , real: {
      get:function(){return !this.is_comment_line && !this.is_empty_line;}
    }
  , is_comment_line: {
      get: function(){return this.nature_init == '//'}
    }
  , is_empty_line: {
      get: function(){return this.nature_init == ''}
    }
  , is_image: {
      get: function(){return this.nature == 'score' }
    }
  , is_modulation:{
      get: function(){return this.type == 'modulation'}
    }
  // Return true si c'est une nature de tag qui peut ne pas
  // avoir de coordonnées
  , tag_without_coordonates: {
    get: function(){return this.data_nature.no_coor == true;}
  }
})
