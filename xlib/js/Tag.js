/** ---------------------------------------------------------------------
  *   Class Tag
  *   ---------
  *   Gestion générale des tags quand ils ne sont ni des LI dans la
  *   section de code ni des 'C' sur la table d'analyse.
  *
*** --------------------------------------------------------------------- */

class Tag {

  /** ---------------------------------------------------------------------
    *
    *   CLASSE
    *
  *** --------------------------------------------------------------------- */
  /**
    * Reçoit une ligne de code de TAG et retourne une table des
    * données qui en sont tirées.
    *
  **/
  static parseLine(str){
    // La table finale qui sera retournée
    const h = this.epureAndSplitRawLine(str)
    var datas = Object.assign([], h.data)
    const natureInit  = datas.shift()
    const natureValue = datas.shift()
    Object.assign(h, {nature_init:natureInit, text:natureValue})
    // On décompose les autres valeurs, qui doivent fonctionner par
    // paire avec un '='
    datas.forEach(function(paire){
      var [prop, value] = paire.split('=');
      Object.assign(h, {[prop]: value || true})
    });
    if (h.left)   { h.x = delete h.left   };
    if (h.top)    { h.y = delete h.top    };
    if (h.width)  { h.w = delete h.width  };
    if (h.height) { h.h = delete h.height };
    ['x','y'].forEach(function(prop){
      h[prop] && ( h[prop] = asPixels(h[prop]))
    });
    ['w','h'].forEach(function(prop){
      if(h[prop]){
        var pair = valueAndUnitOf(h[prop]);
        h[prop] = pair[0] ;
        h[`${prop}_unit`] = pair[1];
      };
    });
    return h ;
  }

  /**
    Reçoit la ligne brute, telle qu'elle peut se trouver dans le fichier
    tags.js.
    Elle retourne une table contenant :
      data:     [Array]     La liste des données (séparées par espace)
                            Note : sans la marque de verrou
      locked:   [Boolean]   True si la ligne est verrouillée
      line:     [String]    La ligne telle qu'elle a été soumise
      nature_init: [String] La nature initiale, le premier mot après le verrou

    Note : cette méthode sert aussi bien lors du chargement que lors de
    la modification des lignes.
  **/
  static epureAndSplitRawLine(line){
    var rg, type ;
    line = line.trim().replace(/[\t ]/g, ' ') ; //insécable et tabulation
    line = line.replace(/[\r\n]/g, ' ');
    line = line.replace(/ +/g, ' ') ;
    var nature_init ;
    // Marque de ligne verrouillée
    var premier_car   = line.substring(0,1);
    var deux_premiers = line.substring(0,2)
    var locked_line   = premier_car == '#' || deux_premiers == '🔒' ;
    const is_comment  = deux_premiers == '//'
    if (locked_line){
      // <= C'est une ligne verrouillée
      firstoff = line.substring(0,2) == '🔒' ? 2 : 1
      line = line.substring(firstoff,line.length).trim();
    } else if ( is_comment ) {
      line = line.substring(2,line.length).trim();
      nature_init = 'comment'
    }

    const data = line.split(' ')
    // Si la nature initiale (dans la langue, raccourcie ou entière) n'est pas
    // définie, c'est le premier mot des data
    nature_init || (nature_init = data[0])

    if (rg = line.match(/^([a-z]+) (.*) ([0-9]+) ([0-9]+)$/i)){
      // Est-ce une version raccourcie d'écriture :
      // <nature> <valeur> <y> <x>
      line = `${rg[1]} ${rg[2]} y=${rg[3]} x=${rg[4]}`;
    };

    return {data:data, isComment:is_comment, isEmpty:(line == ''), line:line, locked:locked_line, nature_init:nature_init}
  }

  /** ---------------------------------------------------------------------
    *
    *   INSTANCE
    *
  *** --------------------------------------------------------------------- */

  /**
    Instanciation de la tag
    -----------------------

    +Params+::
      +lineStr+:: [String] La ligne string, telle qu'elle est fournie par le
          code du fichier tags.js de l'analyse ou par le LITags du tag dans
          la liste de code. Ou encore lors d'une duplication.
  **/
  constructor(lineStr){

    // Analyse de la ligne et dispatch de toutes ses valeurs trouvées
    this.dispatch(this.parseLine(lineStr))

    // console.log("--- data:", data)

    /*
      Other values

      [1]
        L'ID pourra être affecté longtemps après l'instanciation, quand
        par exemple c'est une nouvelle ligne (un nouveau tag) dans un
        fichier tags.js très long.
    */
    this.id         = null // [1]

    /*
      State properties
    */
    this.built      = false;  // pour indiquer qu'il est construit
    this.selected   = false; // Indicateur de sélection
    this.destroyed  = false; // Indicateur de destruction
    this.modified   = false ;

  }

  /** ---------------------------------------------------------------------
    *
    * MÉTHODES DE DONNÉES
    *
    **/

  /**
    Nouvelle méthode unique qui prend la ligne telle qu'elle est fournie
    à l'instanciation (ligne de code) ou dans le LI et en extrait toutes
    les valeurs.

    Pour pouvoir faire des comparaisons, on produit seulement, ici, une
    table qui va contenir toutes les valeurs à dispatcher ensuite dans
    l'instance.
  **/
  parseLine(lineStr){
    let data = this.constructor.parseLine(lineStr)
    // data = this.getRealNatureAndTypeFrom(data)
    this.getRealNatureAndTypeFrom(data)
    // console.log("data après getRealNatureAndTypeFrom", data)
    this.setDefinitionsByType(data)
    // console.log("data après setDefinitionsByType", data)
    this.definitionsByText(data)
    // console.log("data après definitionsByText", data)
    // raise("Pour voir")
    return data
  }

  dispatch(data){
    for(var k in data ) { this[k] = data[k] }
  }

  getRealNatureAndTypeFrom(data){
    var nat, typ ;
    // Traitement des premières valeurs exceptionnelles
    if ( data.isComment ) {
      [data.nature, data.type] = ['COMMENT', null]
    } else if ( data.isEmpty ) {
      [data.nature, data.type] = ['EMPTYLINE', null]
    } else if ( undefined === NATURES[data.nature_init]) {
      error(t('unknown-nature', {nature: this.nature_init}));// Erreur nature indéfinie
      [data.nature, data.type] = [null, null] ;
    } else {
      // Traitement normal
      nat = NATURES[data.nature_init].aka || data.nature_init ;
      // Valeur raccourcie ?
      //  partie Mon_Intro => text Mon_Intro type=part
      if ( NATURES_SHORTCUTS[nat] ) {
        data.isNatureShortcut = true ;
        var dnature = NATURES_SHORTCUTS[nat];
        nat = dnature.real ;
        typ = dnature.type ; // réglage forcé du type
      }
      data.nature = nat ;
      typ && ( data.type = typ )
    }
  }

  /**
    Définitions à faire suivant le type défini
  **/
  setDefinitionsByType(data){
    if ( ! data.type ) return ;
    switch (data.nature) {
      case 'COMMENT':
      case 'EMPTYLINE':
      case 'cadence':
        break // le type est inchangé
      case 'text':
        data.type = TABLECOR_TYPES_TEXT[data.type] || data.type
        break
      case 'line':
        data.type = TABLECOR_TYPES_LINE[data.type] || data.type
        break
      // default:
        // console.error(t('prop-non-treated', {nature: data.nature}));
    }
  }

  /**
    Définir les autres valeurs particulières à l'instanciation (ou
    à la modification)
    C'est notamment cette méthode qui traite le texte.
  **/
  definitionsByText(data){
    // Par défaut (mais sera justement surclassé par cette méthode)
    // Traitement du text(e) en fonction de la nature
    switch(data.nature){
      case 'COMMENT':
        // data.text = data.line
        break
      case 'EMPTYLINE':
        data.text = ''
        break
      case 'score':
        data.src = data.text
        break
      case 'line':
        var ty = data.text.replace(/_+/g,'_').replace(/\-+/g,'-') ;
        data.type = TABLECOR_LIGNE_TYPE_GRAPH_TO_LETTER[ty] || ty ;
        break
      default:
        // Traitement de this.text pour les autres éléments
        // La plupart des autres éléments
        data.text = data.text.replace(/_/g, ' ') ;
        // Si le texte contient une balance, ça définit le
        // main-texte et le sous-texte
        if ( data.text.match(/\//) ) {
          [data.main_text, data.sous_text]= data.text.split('/') ;
        }
    }
  }


  /**
   * Grand méthode d'actualisation du TAg
   * C'est devenu la méthode incontournable puisqu'elle gère aussi
   * l'historique des opérations (pour les annulations)
   *
   * Cf. La constante TAG_PROPERTIES_LIST
   */
  update(prop, new_value, options) {
    var my = CTags[this.id];

    // 'c', pour la couleur, peut avoir été donné par 'color', on change
    // 'color' en 'c' ici.
    prop = my.own_prop_to_isRealTag_prop(prop);

    if(undefined == prop){
      // Appel de la méthode sans argument
      my.updateXY(); // ça fait tout, normalement

    } else {

      // impossible de mettre des valeurs inférieures à 5
      // if (undefined != new_value && new_value.match(/^[0-9.]+$/) && Number.parseInt(new_value,10) < 5) {

      // Quand on a un chiffre (string) on le transforme en nombre
      // Mais attention : certaines propriétés peuvent avoir un chiffre mais
      // doivent rester en String (comme le texte par exemple)
      if (prop != 'text' && 'string' == typeof(new_value) && new_value.match(/^[0-9.]$/)){
        new_value = Number.parseInt(new_value,10);
      }
      // Non : maintenant on laisse mettre n'importe quelle mesure, même négative
      // if ('number' == typeof(new_value) && new_value < 5) {new_value = 5}

      // console.log(`Update de tag #${my.id}. Propriété ${prop} mise à ${new_value}`);

      if (!options || !options.no_histo){
        H.add([new HistoProp(my, prop, my[prop], new_value)]) ;
      }
      // Appelé avec un argument, c'est la propriété qu'il faut
      // actualiser
      switch (prop) {
        case 'nature':
          // throw('On ne peut pas changer directement la nature d’un tag…');
          my.updateNature(new_value); break
        case 'nature_init':
          my.updateNatureInit(new_value);break
        case 'type':
          my.updateType(new_value);break
        case 'y':
        case 'top':
          my.updateY(new_value);break
        case '-y':
        case 'bottom':
          my.updateY(new_value - my.jqObj.height());break
        case 'x':
        case 'left':
          my.updateX(new_value);break
        case '-x':
        case 'right':
          my.updateX(new_value - my.jqObj.width());break
        case 'h':
        case 'height':
          my.updateH(new_value);break
        case 'w':
        case 'width':
          my.updateW(new_value);break
        case 'text':
          my.updateText(new_value);break
        case 'src':
          my.updateSrc(new_value);break
        case 'locked':
          my.updateLock(new_value);break
        case 'destroyed':
          my.updateDestroyed(new_value);break
        case 'c':
          my.updateColor(new_value);break
        case 'bgc':
          my.updateBackgroundColor(new_value);break
        case 'fs':
          my.updateFontSize(new_value);break
        default:
          // Dans le cas contraire, c'est une propriété qu'on peut
          // définir directement
          my[prop] = new_value ;
      }
    }
  }

  /**
   * Transforme la propriété donnée en son vrai nom et mémorise sa forme
   * initiale.
   * Par exemple, la couleur est enregistrée dans le paramètre 'c', mais
   * elle peut être fournie avec 'color' ou 'couleur'. Dans ce cas, on
   * transforme 'couleur' en 'c' et on mémorise que le nom du paramètre,
   * pour la ligne, doit être `couleur` (pour que l'utilisateur ne soit pas
   * perturbé — grâce à `c_name`).
   */
  own_prop_to_isRealTag_prop(prop){
    var my = this ;
    var isRealTag_prop = TAG_PROPS_TO_REAL[prop];
    if(undefined == isRealTag_prop){return prop}
    my[`${isRealTag_prop}_name`] = prop ;
    return isRealTag_prop;
  }

  // Reset de l'identifiant (quand copie, par exemple)
  reset_id() {
    var my = this ;
    my.id       = null ;
    my._domId   = null ;
    my._jqObj   = null ;
    my._domObj  = null ;
  }

  // ---------------------------------------------------------------------
  // Méthodes de coordonnées

  width_to_obj(){
    if(this.w){
      return {'width': `${this.w}${this.w_unit||'px'}`}
    } else {
      return {'width':''}
    }

  }
  width_to_str(){
    if(this.w){return `width:${this.w}${this.w_unit||'px'}`;}
    else {return ''}
  }
  height_to_obj(){
    if(this.h){return {'height': `${this.h}${this.h_unit||'px'}`}}
    else {return {'height':''}}
  }
  height_to_str(){
    if(this.h){return `height:${this.h}${this.h_unit||'px'}`;}
    else {return ''}
  }

  // Pour obtenir la valeur x et y des éléments
  // Plutôt que d'utiliser les méthodes top et left de jQuery (qui retournent
  // des valeurs fantaisistes pour les objets transformés (rotate), on va
  // voir directement dans le style de l'objet)
  /**
    * Pour obtenir les valeurs x et y des éléments
    * Car les méthodes `top` et `left` de jQuery retournent des valeurs
    * fantaisistes pour les objets transformés (rotate). Donc on va voir dans
    * l'attribut `style` directement, et on ne fait appel à jQuery que si on
    * ne trouve pas l'information dans l'attribut `style`.
   */
  getX() {
    return valueAndUnitOf(this.hStyles()['left'])[0] ;
  }
  getY() {
    return valueAndUnitOf(this.hStyles()['top'])[0] ;
  }
  // ATTENTION : contrairement à getX et getY, la fonction retourne un array
  // contenant [value, unit]
  getW(){
    var thew = this.hStyles()['width'] || this.jqObj.width();
    if (thew == 'auto') { return [this.jqObj.width(), 'px'] }
    else { return valueAndUnitOf(thew) }
  }
  // ATTENTION : contrairement à getX et getY, la fonction retourne un objet
  // contenant [value, unit]
  getH(){
    if(this.isModulation){
      var lin = this.jqObj.find('line.vertline');
      return [Number.parseInt(lin.attr('y2') - lin.attr('y1'), 10), 'px'];
    } else {
      var theh = this.hStyles()['height'] || this.jqObj.height();
      if (theh == 'auto'){return {value: this.jqObj.height(), unit: 'px'}}
      else { return valueAndUnitOf(theh) }
    }
  }
  // Retourne une table de clé:valeur des styles définis
  // dans la balise
  hStyles(){
    var my = CTags[this.id];
    var domstl  = my.domObj.style ;
    var jqPos   = my.jqObj.position();
    var hstyles = {}
    CONSTANTS_POS_ET_TAILLE.forEach(function(prop){
      if (domstl[prop]) { hstyles[prop] = domstl[prop] }
      else {
        // Si on ne trouve pas les valeurs dans l'attribut style, par
        // désespoir de cause on le récupère par jQuery
        switch (prop) {
          case 'left':
          case 'top':
            hstyles[prop] = Number(jqPos[prop]);
            break
          case 'width':
          case 'height':
            hstyles[prop] = my.jqObj[prop]();
        }
      }
    })
    return hstyles;
  }

  scrollIfNotVisible(){
    var my = CTags[this.id] ;
    if(!my.built){return}
    const topWindow = window.scrollY
    const botWindow = topWindow + window.outerHeight
    const milieu = Math.floor(window.innerHeight / 2) - 100
    // const top = this.jqObj.position().top
    const top = this.jqObj.offset().top
    const hei = this.jqObj.height()
    const bot = top + hei
    // console.log({topWindow:topWindow, botWindow:botWindow, milieu:milieu, top:top, height:hei, bot:bot })
    if ( bot > botWindow || top < topWindow ) {
      window.scroll(0, top - milieu)
    } else {
      // console.log("L'élément est visible")
    }
    // console.log("Offset domObj", this.jqObj.offset(), this.jqObj.position(), this.jqObj.height())
    // my.domObj.scrollIntoView({behavior: 'smooth'});
  }

  resize(prop, dim, mult, fin){
    var my  = CTags[this.id];
    var pas = (fin ? 1 : (5 * (mult ? 5 : 1))) * (dim ? -1 : 1) ;
    var unit = '';
    // Cas spécial de la hauteur avec 1) les images 2) les modulations
    if (prop == 'h' && (my.isImage || my.isModulation || !my.h)) {
      [my.h, my.h_unit] = my.getH();
      unit = my.h_unit;
    }
    // Cas spécial de la largeur avec les images
    if (prop == 'w' && (my.isImage || !my.w)){
      [my.w, my.w_unit] = my.getW();
      unit = my.w_unit;
    }
    // Finalement, on affecte la dimension
    my.update(prop, `${Number.parseInt(my[prop],10)+pas}${unit}`);
  }

  move(sens, mult, fin){
    var my  = CTags[this.id];
    var pas = fin ? 1 : (5 * (mult ? 5 : 1)) ;
    var [prop, mltpas] = function(sens){
      switch(sens){
        case 'l': return ['x', -1];
        case 'r': return ['x', 1];
        case 't': return ['y', -1];
        case 'd': return ['y', 1];
      }
    }(sens);
    my.update(prop, my[prop] + (pas * mltpas));
  }
  // ---------------------------------------------------------------------
  //  Méthodes de CONSTRUCTION

  // Pour transformer le tag en code HTML
  // +params+ est un hash qui définit les codes css à utiliser
  // en plus de ceux définis par l'instance courante. C'est par exemple la
  // hauteur, en fonction des éléments déjà produits
  get to_html() {
    var my  = this
      , css = []
      , classes = ['tag']
      ;

    if ((!my.x || !my.y) && my.isTagWithoutCoordonnates){
      // On ne fait rien
    } else {
      css.push('left:' + (my.x || 100) + 'px') ;
      css.push('top:'+ (my.y || 100) + 'px') ;
      my.checkPositionned();
    }
    // Largeur et hauteur
    // Largeur et hauteur par défaut pour les boites
    var w, h ;
    if(my.nature == 'box'){
      w = my.w ? my.width_to_str() : 'width:50px';
      h = my.h ? my.height_to_str() : 'height:50px';
    } else {
      w = my.w ? my.width_to_str() : 'width:auto';
      if (my.h){ h = my.height_to_str() }
    }
    w && css.push(w);
    h && css.push(h);

    // Couleurs
    my.c    && css.push(`color:${my.c}`);
    my.bgc  && css.push(`background-color:${my.bgc}`);

    // Taille du caractère. Il peut être défini explicitement pour l'élément,
    // (prioritaire) ou pour le type de tag
    var fsize ;
    if (my.fs){fsize = my.fs}
    fsize && css.push(`font-size:${fsize}`);
    switch (my.nature) {
      case 'text':
        switch (my.type) {
          case 'part':
            css.push('transform:rotate(-38.9deg);transform-origin:center');
            break
          default:

        }
    }
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
        // fabriqué par Images.treateImages de la nouvelle formule
        return my.imageTag.replace(/__classes__/,classes.join(' ')).replace(/__css__/,css)
        // tag.imageTag = `<img id="${my.domId}" data-id="${my.id}" class="${classes.join(' ')}" src="${A.imagesFolder}/${my.src}" style="${css}" />`
      case 'cadence':
      case 'text':
        classes.push(my.type) ;
        switch (my.type) {
          case 'modulation':    return my.buildAsModulation(classes, css);
          case 'analyst':       ftext = `${t('analyzed-by')} ${ftext}`;break
          case 'analysis_date': ftext = `${t('le-of-date')} ${ftext}`;break
        }
        break
      case 'line':
        classes.push('line'+my.codeLineByType)
        break
      default:
    }
    return `<span id="${my.domId}" data-id="${my.id}" class="${classes.join(' ')}" style="${css}">${ftext}</span>`;
  }

  // Construit le tag et pose les observers dessus. Mais seulement si
  // c'est un "vrai" tag (pas une ligne de commentaire ou une ligne vide)
  buildAndObserve(options){
    this.isRealTag && this.build(options).observe();
  }
  // Méthode qui construit l'élément dans la page
  build(options){
    Page.add(this);
    this.built = true ;
    if(options && options.visible === false){
      this.jqObj.hide();
    }
    return this; // chainage
  }
  // Pour l'animation, par exemple
  reveal(options){
    var my = this ;
    if(undefined==options){options={duration:400, exergue: false}}
    if(options.exergue){
      var old_bgc = my.jqObj.css('border-color');
      my.jqObj.css('border-color','red');
    }
    my.jqObj.fadeIn(options.duration, function(){
      if(options.exergue){
        my.jqObj.css('border-color',old_bgc);
      }
    });
    this.scrollIfNotVisible()
    // my.domObj.scrollIntoView({behavior: 'smooth'});
  }
  remove(){
    var my = this ;
    my.jqObj.remove();
    my.built = false ;
  }


  // La marque de modulation possède son propre code, complexe, à l'aide
  // de SVG.
  // +classes+  Classes CSS
  buildAsModulation(classes, css){
    var my = this ;
    // my.main_text = "SOL min"; my.sous_text = "(sous-dom)"
    var vly1 = 65 ; // v=vertical, l=ligne, y1
    var vly2 = (vly1 + (my.h ? my.h : 20)) ;

    const code = `
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

  // ---------------------------------------------------------------------
  // Méthodes de transformation

  updateNature(newn){
    this._nature = newn
  }
  updateNatureInit(newn){
    var my = CTags[this.id];
    my.jqObj.removeClass(my.nature);
    my.nature_init = newn;
    if ( my.built ) { my.jqObj.replaceWith(my.to_html) }
  }

  updateType(newt){
    var my = CTags[this.id];
    if(my.type){my.jqObj.removeClass(my.type)}
    my.type = newt;
    if(my.type){my.jqObj.addClass(my.type)}
  }

  updateXY(){
    var my = this ;
    my.update('x', my.x);
    my.update('y', my.y);
  }
  checkPositionned(){
    var my = this ;
    // Si le tag n'avait pas de coordonnées au départ, il avait reçu
    // la classe "warntag" qui l'affichait en rouge. Maintenant qu'il a
    // des coordonnées, on peut retirer cette classe.
    if (my.isTagWithoutCoordonnates || my.x && my.y){my.jqObj.removeClass('warntag');}
    else {my.jqObj.addClass('warntag')}
  }
  updateY(newy){
    this.y = newy;
    this.jqObj.css({'top': (this.y||100) + 'px'});
    this._surf = null ;
    this.checkPositionned();
  }
  updateX(newx){
    this.x = newx;
    this.jqObj.css({'left': (this.x||100) + 'px'});
    this._surf = null ;
    this.checkPositionned();
  }
  updateH(newh){
    var my = this ;
    if(my.nature == 'cadence'){return F.error(t('no-h-pour-cadence'))}
    if(newh === null){
      my.h = null; my.h_unit = null;
    } else {
      [my.h, my.h_unit] = valueAndUnitOf(newh);
      // var [new_h, new_h_unit] = valueAndUnitOf(newh);
      // my.h = new_h;
      // my.h_unit = new_h_unit;
    }
    this._surf = null ;
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
  updateW(neww){
    // console.log('-> updateW');
    var my = CTags[this.id];
    if (my.type == 'modulation'){return F.error(t('no-w-pour-modulation'))}
    if(neww === null){
      my.w = null;
      my.w_unit = null;
    } else {
      var [new_w, new_w_unit] = valueAndUnitOf(neww);
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
    this._surf = null ;
    this.jqObj.css(my.width_to_obj()) ;
  }

  updateText(newt){
    var my = CTags[this.id];
    my.text = newt; // même si null
    if(my.type == 'modulation'){
      var [t, st] = my.text.split('/');
      my.main_text = t || '' ;
      my.sous_text = st || '' ;
      my.jqObj.find('svg text.main').text(my.main_text) ;
      my.jqObj.find('svg text.sous').text(my.sous_text) ;
    } else if (my.isRealTag ){
      my.domObj.innerHTML = my.text ;
    }
  }
  updateSrc(news){
    var my = CTags[this.id];
    my.src = news;
    my.domObj.src = `${M.images_folder}/${my.src}` ;
  }
  updateLock(new_value){
    // Note : je ne sais pas pourquoi, ici, je dois utiliser cette
    // tournure avec new_value alors que pour les autres valeurs, ça
    // semble se faire normalement.
    var my = CTags[this.id];
    my.locked = new_value ;
    my.jqObj[my.locked ? 'addClass' : 'removeClass']('locked');
    if(my.locked && my.selected){CTags.remove_from_selection(my)}
    my[my.locked ? 'unobserve' : 'observe']();
  }

  updateDestroyed(value){
    var my = CTags[this.id];
    my.destroyed = value ;
    if(my.destroyed){
        if(my.isRealTag){my.remove()}
    } else {
      // Annulation de destruction. Il faut remettre l'objet à
      // sa place, à sa ligne
      my.buildAndObserve();
    }
  }
  updateBackgroundColor(newc){
    var my = CTags[this.id];
    my.bgc = newc;
    my.jqObj.css('background-color',markColorToReal(newc));
  }
  updateColor(newc){
    var my = CTags[this.id];
    my.c = newc;
    my.jqObj.css('color', markColorToReal(newc));
  }
  markColorToReal(mark){
    if(mark.match(/^[a-f0-9]{6,6}$/i)){mark = '#'+mark}
    return mark;
  }

  updateFontSize(newc){
    var my = CTags[this.id];
    my.fs = newc ;
    my.jqObj.css('font-size', my.fs || my.defaultFontSize || '')
  }
  // ---------------------------------------------------------------------


  // ---------------------------------------------------------------------
  //  Méthodes d'analyse

  /**
   * La ligne qui doit être enregistrée dans le fichier _tags_.js et
   * telle qu'elle est dans le champ ULTags
   */
  get to_line(){
    var my = this ;
    return (this.recompose().join(' ')).trim() ;
  }

  // Méthode inverse de la précédente : elle recompose la ligne
  // analysée
  // Return un Array de toutes les valeurs
  recompose(options){
    const my = this
    if ( my.isEmpty ) {
      return ['']
    } else if ( my.isComment ) {
      return [`// ${my.line}`]
    } else {
      const aLine = new Array() ;
      // Indicateur de verrouillage si la ligne est verrouillé
      if (my.locked){aLine.push('🔒')}
      // Premier mot (toujours celui donné)
      aLine.push(my.nature_init) ; // par exemple 'image', line', 'part', 'mesure'
      // Deuxième mot, la source ou le texte, ou rien
      my.src  && aLine.push(my.src) ;
      try {
        my.text && aLine.push(my.isComment ? my.text : my.text.replace(/ /g,'_')) ;
      } catch (e) {
        console.error("Une erreur a été rencontrée (j'ai remplacé par une texte '-no text-') : ", e)
        console.error("La tag = ", this)
        aLine.push('-no_text-')
      }

      // Si un type est défini, et que la nature n'est pas un raccourci
      // de nature, on écrit ce type
      if ( my.type && !my.isNatureShortcut ) {
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
  }

  // ---------------------------------------------------------------------
  // Helpers

  /**
   * Une valeur n'a pas été forcément donnée avec le nom exact de la
   * propriété. Cette méthode permet de récupérer le nom initial de la
   * propriété pour la rendre dans la ligne de code (pour que l'utilisateur
   * s'y retrouve).
   */
  prop_username(prop){
    var my = this;
    var isRealTag_name = my[`${prop}_name`];
    if (undefined == isRealTag_name){return prop}
    else { return isRealTag_name }
  }


  // Retourne la position sous forme humaine
  hposition(){
    var my = this ;
    return "x: " + my.x + ' / y: ' + my.y ;
  }


  // ---------------------------------------------------------------------
  //  Méthodes de création

  createCopy() {
    var my = this ;
    // Il faut créer un nouveau tag à partir de celui-ci
    const lineStr   = my.recompose() ;
    const newtag    = CTags.push(new Tag(lineStr));
    const newlitag  = new LITag(newtag).build({after: my.litag.jqObj});
    newtag.buildAndObserve();
    message(t('new-tag-created', {ref: my.ref}));
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
  compareAndUpdateAgainst(newLine) {
    const my = this
    // console.log('-> compareAndUpdateAgainst (%s)', newLine)
    // On part du principe qu'il n'y aura pas de différences
    my.modified = false ;
    // Les nouvelles données
    const newData = this.parseLine(newLine)
    // console.log("newData dans compare = ", newData)

    // if (tagComp.isRealTag && !my.built){
    //   // Pour pouvoir faire une "pré-construction" du tag, il faut donner
    //   // quelques propriétés tout de suite.
    //   my.nature_init = tagComp.nature_init ;
    //   my.type   = tagComp.type ;
    //   my.buildAndObserve();
    // } else if (!tagComp.isRealTag && my.built){
    //   my.remove();
    // }

    var hasBeenModified = false
    TAG_PROPERTIES_LIST.forEach( prop => {
      if ( my[prop] != newData[prop] ){
        my.update(prop, newData[prop]) ;
        my.modified = true ;
        hasBeenModified = true
      }
    })

    if ( hasBeenModified ) {
      my.litag.update(my.to_line); // Actualisation de la ligne de code
      Muscat.modified = true
    }


  }


  // ---------------------------------------------------------------------
  // MÉTHODES ÉVÈNEMENTIELLES

  // Méthode qui place les observeurs sur l'élément, lorsqu'il a été
  // créé après la première fabrication (copies)
  observe(){
    var my = this ;
    if ( my.locked ) return ;// suffit pour bloquer l'élément
    my.jqObj
      .on('mousedown',  my.onMouseDown.bind(my) )
      .on('mouseup',    my.onMouseUp.bind(my)   )
      ;
  }

  unobserve(){
    var my = this ;
    my.jqObj
      .off('mousedown')
      .off('mouseup')
      ;
  }

  onStopMoving(ev){
    // console.log('-> onStopMoving #', this.ref);
    var my = CTags[this.id] ;
    var msg ;
    // Utile pour la copie
    var   prev_x = my.x
        , prev_y = my.y
        , position = my.jqObj.offset()
        , pour_copie = ev.altKey
        ;

    // CTags.currentMovingTag = null ;

    // Dans tous les cas, pour une copie ou un pur déplacement, on doit
    // mettre les x et y à leur valeur. Pour la copie, ils serviront pour
    // le nouveau tag et on remettra ensuite les anciennes valeurs.
    my.x = my.getX();
    my.y = my.getY();

    var tagcopy;
    if (pour_copie){
      // Si le tag courant est sélectionné, on le déselectionne
      if(my.selected){CTags.onSelect(my)}
      // On fait la copie
      tagcopy = my.createCopy();
      tagcopy.onClick({shiftKey: false});//on sélectionne la copie
      // Il faut remettre le tag à sa place (seulement ici, pour que les valeurs
      // de x et y ci-dessus soit bien les nouvelles)
      my.x = prev_x ; my.y = prev_y ;
    } else {
      // Gérer l'historique des opérations.
      // Noter qu'il ne faut pas le faire pour la copie, puisque l'élément
      // original ne bouge pas, dans ce cas-là.
      H.add([new HistoProp(my, 'x', prev_x, my.x), new HistoProp(my, 'y', prev_y, my.y)]) ;
      message(t('new-position-tag', {ref: my.ref, position: my.hposition()}));
    }
    // Que ce soit pour une copie ou pour un déplacement, il faut actualiser
    // les données de l'élément
    my.updateXY();
  }

  startMoving(ev){
    // console.log('début de déplacement de #', this.id);
    Mover.start(this, ev);
  }
  stopMoving(ev){
    // console.log('arrêt de déplacement de #',this.id);
    Mover.stop(this, ev);
  }

  onMouseDown(ev){
    console.log("-> onMouseDown")
    this.downed = true ;
    this.startMoving(ev);
    return stop(ev);
  }
  onMouseUp(ev){
    // Si le tag a vraiment été cliqué (mouse down), on
    // effectue un click normal. Sinon, on retourne false
    if (this.downed){
      this.downed = false ;
      CTags.onclick(this, ev);
      this.stopMoving(ev);
      return stop(ev);
    } else {
      return true; // pour se propager à la page
    }
  }

  onClick(ev){
    var my = this ;
    CTags.onSelect(my, ev.shiftKey);
    if(isEvent(ev)){
      Page.getCoordonates(ev);
      return stop(ev)
    }
  }
  /**
   * Méthode pour focusser dans le Tag.
   * Utilisé par exemple pour basculer de la
   * sélection du code à la sélection du tag.
   */
  focus(){
    var my = CTags[this.id];
    CTags.onSelect(my);
    my.jqObj.focus(); // pas de listener
  }
  blur(){
    // console.log('-> Tag#blur', this.ref);
    var my = CTags[this.id];
    CTags.onSelect(my); // pour déselectionner
    my.jqObj.blur(); // pas de listener
  }
  /**
   * Méthode appelée par exemple quand on TAB sur le tag,
   * pour focusser sur le LITag et blurer d'ici
   */
  focus_litag(){
    var my = CTags[this.id];
    CTags.activated = false ;
    my.blur();
    my.litag.focus();
  }
  select(){
    var my = CTags[this.id];
    // console.log('-> select', my.ref);
    my.jqObj.addClass('selected');
    // console.log(my.jqObj);
    my.litag.activate();
    my.selected = true ;
  }

  deselect(){
    var my = this ;
    // console.log('-> deselect', my.ref);
    my.jqObj.removeClass('selected');
    my.litag.desactivate();
    my.selected = false ;
  }
  /**
   * Activer le tag sur la table d'analyse. L'activation ne correspond
   * pas à une sélection, elle se produit lorsque le LITag correspondant
   * à ce tag est focussé
   */
  activate(){
    var my = this ;
    my.scrollIfNotVisible();
    my.jqObj.addClass('activated');
  }
  desactivate(){
    var my = this ;
    my.jqObj.removeClass('activated');
  }

  /**
   * Pour introduire le tag dans un groupe
   */
  add_in_group(igroup) {
    var my = CTags[this.id];
    my.group = igroup ;
    my.jqObj.addClass('grouped');
    igroup.tags.push(my);
  }
  ungroup(){
    var my = CTags[this.id];
    my.group = null ;
    my.jqObj.removeClass('grouped');
  }


  /*
    PROPERTIES ----------------------------------------------------------------
  */


  /**
    +return+:: [String] code pour le style de la ligne
    Ce code fonctionne en trois caractères :
      1. bit indiquant s'il y a une ligne verticale pour commencer 0/1
      2. bit indiquant si la ligne est en haut ou en bas (B/T)
      3. bit indiquant s'il y a une ligne verticale à la fin.
  **/
  get codeLineByType() {
    var my = this ;
    var c = '' ;
    c += ['U', 'L', 'K', 'N'].includes(my.type) ? '1' : '0' ;
    c += ['U', 'L', 'V'].includes(my.type) ? 'B' : 'T' ; // ligne bottom/top
    c += ['U', 'V', '^', 'N'].includes(my.type) ? '1' : '0' ;
    return c;
  }


  /**
   * Retourne une référence humaine à l'élément, par exemple pour
   * le détruire, pour le message de confirmation.
   */
  get ref(){
    return `${(this.text || this.src || this.nature_init)} (#${this.id})`
  }

  get domId(){
    if(undefined == this._domId){
      if(null == this.id){throw(t('unable-to-define-domid'))}
      this._domId = `tag${this.id}`
    }
    return this._domId ;
  }
  set domId(value){ this._domId = value }

  get data_nature(){
    if (!this._data_nature){
      this._data_nature = NATURES[this.nature_init] ;
      if(!this._data_nature){
        error(t('unknown-nature', {nature: this.nature_init}));
        return null ;
      } else if (this._data_nature.aka){
        this._data_nature = NATURES[this._data_nature.aka];
      }
    }
    return this._data_nature ;
  }

  get nature(){ return this._nature }
  set nature(value){ this._nature = value }

  get type(){return this._type}
  set type(v){this._type = v}

  /*
    Dom methods
  */

  // +return+:: [jQuerySet] L'objet jQuery du tag
  get jqObj(){return $(`#${this.domId}`)}

  // +return+:: [HTMLElement] L'objet Dom du tag
  get domObj(){
    // console.log('-> domObj avec domId', this.domId);
    return document.getElementById(this.domId);
  }

  // +return+:: [Surf] La surface du tag sur la partition
  get surf(){
    if(!this._surf){
      this._surf = new Surf({x:this.x, y: this.y, w:this.getW()[0], h: this.getH()[0]});
    }
    return this._surf;
  }

  // +return+:: [LITag] le LITag du tag, dans la liste de code
  get litag(){return ULTags[this.id];}

  // +return+:: [Number] Taille par défaut de la font
  get defaultFontSize(){return Options.get(`${this.nature} size`, {no_alert: true})}

  // +return+:: [String] Nature de la ligne du tag
  get isRealTag(){return !this.isComment && !this.isEmpty;}


  /*
    State methods
  */

  // +return+:: [Boolean] True si le tag est d'une nature raccourcie
  //    Par exemple 'mes 12' est la nature raccourcie de 'text 12 type=mesure'
  get isNatureShortcut(){return this._isnatureshortcut || false }
  set isNatureShortcut(v){this._isnatureshortcut = v}

  // +return+::[Boolean] true si le tag est un commentaire
  get isComment(){return this._iscommentline}
  set isComment(v){this._iscommentline = v}

  // +return+::[Boolean] true si le tag est une ligne vide
  get isEmpty(){return this._isemptyline}
  set isEmpty(v){ this._isemptyline = v }

  // +return+::[Boolean] true si le tag est une image
  get isImage(){return this.nature == 'score' }

  // +return+::[Boolean] true si le tag est une modulation
  get isModulation(){return this.type == 'modulation'}

  // +return+::[Boolean] true si le tag contient le démarrage de l'application
  get isAutomationStart(){return this.isComment && this.text.match(/START/)}

  // +return+::[Boolean] true si le tag contient le démarrage de l'application
  get isTagWithoutCoordonnates(){return this.data_nature.no_coor == true}

} // /Tag
