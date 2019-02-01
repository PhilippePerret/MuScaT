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
    // this.id   = ret.id ; // seulement pour les commentaires et vides
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

  this.built      = false;  // pour indiquer qu'il est construit
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
 * Retourne une référence humaine à l'élément, par exemple pour
 * le détruire, pour le message de confirmation.
 */
Tag.prototype.ref = function(){
  return `${(this.text || this.src || this.nature_init)} (#${this.id})`
};

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
    my.remove();
  };
};

/**
 * La ligne qui doit être enregistrée dans le fichier _tags_.js et
 * telle qu'elle est dans le champ ULTags
 */
Tag.prototype.to_line = function(){
  var my = this ;
  return (this.recompose().join(' ')).trim() ;
};

/**
 * Grand méthode d'actualisation du TAg
 * C'est devenu la méthode incontournable puisqu'elle gère aussi
 * l'historique des opérations (pour les annulations)
 *
 * Cf. La constante TAG_PROPERTIES_LIST
 */
Tag.prototype.update = function(prop, new_value, options) {
  var my = CTags[this.id];

  // 'c', pour la couleur, peut avoir été donné par 'color', on change
  // 'color' en 'c' ici.
  prop = my.own_prop_to_real_prop(prop);

  if(undefined == prop){
    // Appel de la méthode sans argument
    my.updateXY(); // ça fait tout, normalement

  } else {

    // impossible de mettre des valeurs inférieures à 5
    // if (undefined != new_value && new_value.match(/^[0-9.]+$/) && Number.parseInt(new_value,10) < 5) {
    if ('string' == typeof(new_value) && new_value.match(/^[0-9.]$/)){
      new_value = Number.parseInt(new_value,10);
    }
    if ('number' == typeof(new_value) && new_value < 5) {new_value = 5};

    // console.log(`Update de tag #${my.id}. Propriété ${prop} mise à ${new_value}`);

    if (!options || !options.no_histo){
      H.add([new HistoProp(my, prop, my[prop], new_value)]) ;
    }
    // Appelé avec un argument, c'est la propriété qu'il faut
    // actualiser
    switch (prop) {
      case 'nature':
        my.nature = new_value;break;
      case 'nature_init':
        my.nature_init = new_value;break;
      case 'type':
        my.updateType(new_value);break;
      case 'y':
      case 'top':
        my.updateY(new_value);break;
      case '-y':
      case 'bottom':
        my.updateY(new_value - my.jqObj.height());break;
      case 'x':
      case 'left':
        my.updateX(new_value);break;
      case '-x':
      case 'right':
        my.updateX(new_value - my.jqObj.width());break;
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
      case 'c':
        my.updateColor(new_value);break;
      case 'bgc':
        my.updateBackgroundColor(new_value);break;
      case 'fs':
        my.updateFontSize(new_value);break;
    }
  };
  my.litag.update(my.to_line());
};

/**
 * Transforme la propriété donnée en son vrai nom et mémorise sa forme
 * initiale.
 * Par exemple, la couleur est enregistrée dans le paramètre 'c', mais
 * elle peut être fournie avec 'color' ou 'couleur'. Dans ce cas, on
 * transforme 'couleur' en 'c' et on mémorise que le nom du paramètre,
 * pour la ligne, doit être `couleur` (pour que l'utilisateur ne soit pas
 * perturbé — grâce à `c_name`).
 */
Tag.prototype.own_prop_to_real_prop = function(prop){
  var my = this ;
  var real_prop = TAG_PROPS_TO_REAL[prop];
  if(undefined == real_prop){return prop};
  my[`${real_prop}_name`] = prop ;
  return real_prop;
}

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
  if(this.w){
    return {'width': `${this.w}${this.w_unit||'px'}`};
  } else {
    return {'width':''};
  }

};
Tag.prototype.width_to_str = function(){
  if(this.w){return `width:${this.w}${this.w_unit||'px'}`;}
  else {return ''}
};
Tag.prototype.height_to_obj = function(){
  if(this.h){return {'height': `${this.h}${this.h_unit||'px'}`};}
  else {return {'height':''}}
};
Tag.prototype.height_to_str = function(){
  if(this.h){return `height:${this.h}${this.h_unit||'px'}`;}
  else {return ''};
};

/**
 * Méthode qui sépare la valeur de l'unité
 */
Tag.prototype.get_value_and_unit = function(fullvalue) {
  var my = this._domId ? CTags[this.id] : this ;
  if('number' == typeof(fullvalue)){
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
  console.log('thew',thew);
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

Tag.prototype.scrollIfNotVisible = function(){
  var my = CTags[this.id] ;
  if(!my.built){return};
  my.domObj.scrollIntoView({behavior: 'smooth'});
};

Tag.prototype.resize = function(prop, dim, mult, fin){
  var my  = CTags[this.id];
  var pas = (fin ? 1 : (5 * (mult ? 5 : 1))) * (dim ? -1 : 1) ;
  var unit = '';
  // Cas spécial de la hauteur avec 1) les images 2) les modulations
  if (prop == 'h' && (my.is_image || my.is_modulation)) {
    [my.h, my.h_unit] = my.getH();
    unit = my.h_unit;
  }
  // Cas spécial de la largeur avec les images
  if (prop == 'w' && my.is_image){
    [my.w, my.w_unit] = my.getW();
    unit = my.w_unit;
  };
  // Finalement, on affecte la dimension
  my.update(prop, `${Number.parseInt(my[prop],10)+pas}${unit}`);
};

Tag.prototype.move = function(sens, mult, fin){
  var my  = CTags[this.id];
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

  if ((!my.x || !my.y) && my.tag_without_coordonates){
    // On ne fait rien
  } else {
    css.push('left:' + (my.x || 100) + 'px') ;
    css.push('top:'+ (my.y || 100) + 'px') ;
    my.checkPositionned();
  }
  // Largeur et hauteur
  css.push(my.w ? my.width_to_str() : 'auto');
  if (my.h){ css.push(my.height_to_str()) };

  // Couleurs
  my.c    && css.push(`color:${my.c}`);
  my.bgc  && css.push(`background-color:${my.bgc}`);

  // Taille du caractère. Il peut être défini explicitement pour l'élément,
  // (prioritaire) ou pour le type de tag
  var fsize ;
  if (my.fs){fsize = my.fs}
  else if (fsize = my.defaultFontSize){
    if(`${fsize}`.match(/^[0-9.]+$/)){fsize += 'px'};
  };
  fsize && css.push(`font-size:${fsize}`);
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
      return `<img id="${my.domId}" data-id="${my.id}" class="${classes.join(' ')}" src="${IMAGES_FOLDER}/${my.src}" style="${css}" />`
    case 'cadence':
    case 'text':
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
  return `<span id="${my.domId}" data-id="${my.id}" class="${classes.join(' ')}" style="${css}">${ftext}</span>`;
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
  this.built = true ;
  return this; // chainage
};
Tag.prototype.remove = function(){
  var my = this ;
  my.jqObj.remove();
  my.built = false ;
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
<div id="${my.domId}" data-id="${my.id}" class="${classes.join(' ')}" style="${css}">
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

Tag.prototype.updateType = function(newt){
  var my = CTags[this.id];
  if(my.type){my.jqObj.removeClass(my.type)};
  my.type = newt;
  if(my.type){my.jqObj.addClass(my.type)};
};
Tag.prototype.updateXY = function(){
  var my = this ;
  my.update('x', my.x);
  my.update('y', my.y);
}
Tag.prototype.checkPositionned = function(){
  var my = this ;
  // Si le tag n'avait pas de coordonnées au départ, il avait reçu
  // la classe "warntag" qui l'affichait en rouge. Maintenant qu'il a
  // des coordonnées, on peut retirer cette classe.
  if (my.tag_without_coordonates || my.x && my.y){my.jqObj.removeClass('warntag');}
  else {my.jqObj.addClass('warntag')};
}
Tag.prototype.updateY = function(newy){
  this.y = newy;
  this.jqObj.css({'top': (this.y||100) + 'px'});
  this.checkPositionned();
};
Tag.prototype.updateX = function(newx){
  this.x = newx;
  this.jqObj.css({'left': (this.x||100) + 'px'});
  this.checkPositionned();
};
Tag.prototype.updateH = function(newh){
  var my = this ;
  if(my.nature == 'cadence'){return F.error(t('no-h-pour-cadence'))};
  if(newh === null){
    my.h = null; my.h_unit = null;
  } else {
    my.h = newh;
  };
  // Traitement particulier pour les modulations
  if(my.type == 'modulation'){
    if(my.h){
      my.jqObj.find('svg')[0].setAttribute('height', this.h + 50) ;
      var line = my.jqObj.find('svg line.vertline')[0] ;
      line.setAttribute('y2', Number.parseInt(line.getAttribute('y1'),10) + this.h);
    }
  } else {
    this.jqObj.css(my.height_to_obj());
  }
}
Tag.prototype.updateW = function(neww){
  // console.log('-> updateW');
  var my = CTags[this.id];
  if (my.type == 'modulation'){return F.error(t('no-w-pour-modulation'))};
  if(neww === null){
    my.w = null;
    my.w_unit = null;
  } else {
    var [new_w, new_w_unit] = my.get_value_and_unit(neww);
    if(my.nature == 'cadence'){
      // Pour une cadence, la largeur doit ajouter vers la
      // droite et laisser le bout à gauche
      var dif  = new_w - my.getW()[0];
      var newx = this.x - dif ;
      my.update('x', newx);
    }
    my.w      = new_w;
    my.w_unit = new_w_unit;
  }
  this.jqObj.css(my.width_to_obj()) ;
};

Tag.prototype.updateText = function(newt){
  var my = CTags[this.id];
  my.text = newt; // même si null
  if(my.type == 'modulation'){
    var [t, st] = my.text.split('/');
    my.main_text = t || '' ;
    my.sous_text = st || '' ;
    my.jqObj.find('svg text.main').text(my.main_text) ;
    my.jqObj.find('svg text.sous').text(my.sous_text) ;
  } else if (my.real ){
    my.domObj.innerHTML = my.text ;
  }
}
Tag.prototype.updateSrc = function(news){
  var my = CTags[this.id];
  my.src = news;
  my.domObj.src = `${IMAGES_FOLDER}/${my.src}` ;
}
Tag.prototype.updateLock = function(new_value){
  // Note : je ne sais pas pourquoi, ici, je dois utiliser cette
  // tournure avec new_value alors que pour les autres valeurs, ça
  // semble se faire normalement.
  var my = CTags[this.id];
  my.locked = new_value ;
  my.jqObj[my.locked ? 'addClass' : 'removeClass']('locked');
  if(my.locked && my.selected){CTags.remove_from_selection(my)};
  my[my.locked ? 'unobserve' : 'observe']();
}

Tag.prototype.updateDestroyed = function(value){
  var my = CTags[this.id];
  my.destroyed = value ;
  if(my.destroyed){
      if(my.real){my.remove()};
  } else {
    // Annulation de destruction. Il faut remettre l'objet à
    // sa place, à sa ligne
    my.build_and_watch();
  };
};
Tag.prototype.updateBackgroundColor = function(newc){
  var my = CTags[this.id];
  my.bgc = newc;
  my.jqObj.css('background-color',markColorToReal(newc));
};
Tag.prototype.updateColor = function(newc){
  var my = CTags[this.id];
  my.c = newc;
  my.jqObj.css('color', markColorToReal(newc));
};
function markColorToReal(mark){
  if(mark.match(/^[a-f0-9]{6,6}$/i)){mark = '#'+mark};
  return mark;
};

Tag.prototype.updateFontSize = function(newc){
  var my = CTags[this.id];
  my.fs = newc ;
  my.jqObj.css('font-size', my.fs || my.defaultFontSize || '')
}
// ---------------------------------------------------------------------

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
      varia = my.own_prop_to_real_prop(varia);
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
              console.error(t('prop-non-treated', {nature: my.nature}));
          };
        default:
        // Pour toutes les autres valeurs
        my[varia] = value ;
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

  // Si un type est défini, et que la nature n'est pas un raccourci
  // de nature, on écrit ce type
  if ( my.type && !my.is_nature_shortcut() ) {
    aLine.push('type='+my.type);
  }
  // La position
  ['x','y','c','bgc','fs'].forEach(function(prop){
    my[prop] && aLine.push(`${my.prop_username(prop)}=${my[prop]}`);
  })
  my.h && aLine.push(`${my.prop_username('h')}=${my.h}${my.h_unit||''}`);
  my.w && aLine.push(`${my.prop_username('w')}=${my.w}${my.w_unit||''}`);

  return aLine ;
}

// ---------------------------------------------------------------------
// Helpers

/**
 * Une valeur n'a pas été forcément donnée avec le nom exact de la
 * propriété. Cette méthode permet de récupérer le nom initial de la
 * propriété pour la rendre dans la ligne de code (pour que l'utilisateur
 * s'y retrouver).
 */
Tag.prototype.prop_username = function(prop){
  var my = this;
  var real_name = my[`${prop}_name`];
  if (undefined == real_name){return prop}
  else { return real_name };
};


// Retourne la position sous forme humaine
Tag.prototype.hposition = function(){
  var my = this ;
  return "x: " + my.x + ' / y: ' + my.y ;
}

// ---------------------------------------------------------------------
// Méthodes évènementielles

Tag.prototype.onStopMoving = function(){
  var my = CTags[this.id] ;
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

  var tagcopy;
  if (my.pour_copie){
    // Si le tag courant est sélectionné, on le déselectionne
    if(my.selected){CTags.onSelect(my)}
    // On fait la copie
    tagcopy = my.createCopy();
    // Il faut remettre le tag à sa place (seulement ici, pour que les valeurs
    // de x et y ci-dessus soit bien les nouvelles)
    my.x = prev_x ; my.y = prev_y ;
  } else {
    // Gérer l'historique des opérations.
    // Noter qu'il ne faut pas le faire pour la copie, puisque l'élément
    // original ne bouge pas, dans ce cas-là.
    H.add([new HistoProp(my, 'x', prev_x, my.x), new HistoProp(my, 'y', prev_y, my.y)]) ;
    message(t('new-position-tag', {ref: my.ref(), position: my.hposition()}));
  }
  // Que ce soit pour une copie ou pour un déplacement, il faut actualiser
  // les données de l'élément
  my.updateXY();
  // Il faudrait pouvoir sélectionner la copie, mais je n'y arrive pas…
  // if(tagcopy){CTags.onSelect(tagcopy)};
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
  var newtag    = CTags.push(new Tag(dline));
  var newlitag  = new LITag(newtag).build({after: my.litag.jqObj});
  newtag.build_and_watch();
  message(t('new-tag-created', {ref: my.ref()}));
  return newtag;
}

/**
 * Méthode qui doit comparer le tag courant avec tagComp (instancié d'après la
 * ligne dans le champ du code) et procéder au modification (dans l'instance
 * comme dans le DOM).
 *
 * Attention : maintenant, la nature même du tag peut être différente, ce qui
 * fait qu'il peut être construit ou non. Il faut en tenir compte.
 */
Tag.prototype.compare_and_update_against = function(tagComp) {
  var my = this ;
  my.modified = false ;

  if (tagComp.real && !my.built){
    // Pour pouvoir faire une "pré-construction" du tag, il faut donner
    // quelques propriétés tout de suite.
    my.nature_init = tagComp.nature_init ;
    my.type   = tagComp.type ;
    my.build_and_watch();
  } else if (!tagComp.real && my.built){
    my.remove();
  };
  for(var prop of TAG_PROPERTIES_LIST){
    are_different = tagComp[prop] != my[prop] ;
    if('undefined' != typeof(my[`${prop}_unit`])){
      are_different = are_different && tagComp[`${prop}_unit`] != my[`${prop}_unit`];
      if(are_different){tagComp[prop] += tagComp[`${prop}_unit`]} ;
    }
    // console.log(`Comparaison de ${prop} : ${my[prop]} / ${tagComp[prop]}`)
    if (are_different){
      // console.log(`Actualisation de ${prop}`);
      my.update(prop, tagComp[prop]) ;
      my.modified = true ;
    }
  }
  return my.modified == true ; // seulement pour les messages, je crois
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
  CTags.onSelect(my, ev.shiftKey);
  Page.getCoordonates(ev);
}
Tag.prototype.select = function(){
  var my = this ;
  my.jqObj.addClass('selected');
  my.litag.activate();
  my.selected = true ;
};

Tag.prototype.deselect = function(){
  var my = this ;
  my.jqObj.removeClass('selected');
  my.litag.desactivate();
  my.selected = false ;
};
/**
 * Activer le tag sur la table d'analyse. L'activation ne correspond
 * pas à une sélection, elle se produit lorsque le LITag correspondant
 * à ce tag est focussé
 */
Tag.prototype.activate = function(){
  var my = this ;
  my.scrollIfNotVisible();
  my.jqObj.addClass('activated');
  my.activated = true ;
};
Tag.prototype.desactivate = function(){
  var my = this ;
  my.jqObj.removeClass('activated');
  my.activated = false ;
};

// ---------------------------------------------------------------------
//  Méthodes de statut

/**
 * Pour introduire le tag dans un groupe
 */
Tag.prototype.add_in_group = function(igroup) {
  var my = CTags[this.id];
  my.group = igroup ;
  my.jqObj.addClass('grouped');
  igroup.tags.push(my);
};
Tag.prototype.ungroup = function(){
  var my = CTags[this.id];
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
        this._data_nature = NATURES[this.nature_init] ;
        if(this._data_nature.aka){this._data_nature = NATURES[this._data_nature.aka]};
      };
      return this._data_nature ;
    }
  }
  , nature: {
      get: function(){
        if( ! this._nature ){
          if(this.is_comment_line || this.is_empty_line){return null};
          if(!NATURES[this.nature_init]){
            error(t('unknown-nature', {nature: this.nature_init}));
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
          if(null == this.id){throw(t('unable-to-define-domid'))}
          this._domId = `tag${this.id}`
        }
        return this._domId ;
      },
      set: function(value){ this._domId = value }
    }
  , jqObj: {
      get: function(){return $(`#${this.domId}`);}
    }
  , domObj: {
      get: function(){return document.getElementById(this.domId);}
    }
  , litag:{
      get: function(){return ULTags[this.id];}
    }
  , defaultFontSize: {
      get:function(){return Options.get(`${this.nature} size`, {no_alert: true})}
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
  // avoir de coordonnées, comme par exemple les titres
  , tag_without_coordonates: {
    get: function(){return this.data_nature.no_coor == true;}
  }
})
