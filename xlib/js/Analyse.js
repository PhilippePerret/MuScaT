'use strict';
/** ---------------------------------------------------------------------
  *   Class Analyse
  *   -------------
  *   Gestion de l'analyse courante

  La constante A [Analyse] est l'analyse courante
*** --------------------------------------------------------------------- */
const ANALYSES_FOLDER = './_analyses_'
class Analyse {
  static init(){

  }

  /**
    +return+::[Analyse] Instance de l'analyse courante, définie par
        la constante ANALYSE du fichier analyse.js en racine de l'app
  **/
  static get current(){
    return this._current || ( this._current = new Analyse(ANALYSE) )
  }
  static set current(v){this._current = v}

  constructor(name /*i.e. le nom du dossier*/){
    this._name = name

    /*
      Propriétés d'état ou pseudo-état
    */
    // Pour savoir si c'est une animation
    this.animated = false
    this.hasSequenceImages = false

    // Pour connaitre l'état du chargement
    this.tagsLoaded = false
    this.optionsLoaded = false

    this.afterLoadTags    = this.afterLoadTags.bind(this)
    this.afterLoadOptions = this.afterLoadOptions.bind(this)
    this.prepareLines     = this.prepareLines.bind(this)
    this.buildTags        = this.buildTags.bind(this)
  }

  get isReady(){
    return this.isReady = this.tagsLoaded && this.optionsLoaded
  }

  /*
    Fonction de tags
  */
  // Exécute la fonction +method+ sur toutes les lignes de la
  // constante Tags.
  /**
    Exécute la fonction +method+ sur tous les tags ou comme méthode des tags
    +Params+::
      +method+::[Function] Exécute la fonction avec en premier argument la line

  **/
  forEachLine(method){
    return this.lines.map(line => method(line))
  }

  /**
    Exécute la fonction +method+ sur tous les tags ou comme méthode des tags
    +Params+::
      +method+::  Si [Function] Exécute la fonction avec en premier argument
          chaque tag [String] de this.tags
                  Si [String] method est une méthode de la ligne de tag

  **/
  forEachTag(method){
    if ( 'string' == typeof method) {
      return this.tags.map( tag => tag[method].call() )
    } else {
      return this.tags.map(tag => method(tag))
    }
  }
  /*
    Fonctions d'entrée/sortie
  */
  // Chargement des tags du fichier 'tags.js'
  loadTags(){
    console.log('-> loadTags')
    return new Promise((ok,ko) => {
      require(this.tags_path)
      .then(this.afterLoadTags)
      .then(ok)
      .catch(Muscat.onError)
    })
  }
  afterLoadTags(){
    return new Promise((ok,ko) => {
      try {
        // TODO Plus tard, vers des instances de Tag ou autre chose si la
        // classe Tag ne s'adapte pas bien au nouveau fonctionnement
        // TODO Peut-être une première lecture des tags pour voir si c'est
        // une animation par exemple
        console.log("tags =", this.tags)
        this.tagsLoaded = true
        ok()
      } catch (e) {
        ko(e)
      }
    })
  }

  /**
    Appelé par Muscat.load pour parser les tags et les afficher
  **/
  prepareLines(){
    console.log('-> Analyse.parseTags')

    // Note : cette méthode modifie les lines de l'analyse
    Images.treateSequences(this)

    // Regarder si le code (les lines) contient une séquence d'images
    // et la traiter.
    // JSTags.checkIfSequenceImage()

    // TODO Quand on remplacement CTags par this.tags, on pourra supprimer
    // cette ligne
    this.forEachTag( tag => CTags.push(tag) );

  }

  buildTags(){
    const my = this
    return new Promise((ok,ko) => {
      try {
        // On construit d'abord tous les tags, mais en les masquant si c'est
        // pour une animation.
        my.forEachTag(tag => {
          if ( tag.real ) { tag.build({visible: !my.animated}) };
          // On indique que c'est une animation si on rencontre le tag
          // 'START'. Noter qu'en le traitant seulement ici, ça permet
          // d'afficher tous les éléments précédent.
          if ( tag.is_anim_start ) { my.animated = true }
        });
        ok()
      } catch (err) { ko(err) }
    })
  }

  //
  /**
    @async
    Chargement des options du fichier 'options.js'
  **/
  loadOptions(){
    console.log('-> loadOptions')
    try {
      return new Promise((ok,ko)=>{
        require(this.options_path).then(this.afterLoadOptions).then(ok)
      })
    } catch (err) { ko(err) }
  }
  afterLoadOptions(){
    return new Promise((ok,ko)=>{
      this.optionsLoaded = true
      ok()
    })
  }

  pathof(relpath){
    return `${ANALYSES_FOLDER}/${this.name}/${relpath}`
  }

  set options(v){
    for(var k in v){
      // console.log("Je mets OPTIONS[%s] à %s", k, v[k])
      OPTIONS[k].value = v[k]
    }
  }

  /**
    Retourne les tags de l'analyse comme instances Tag
  **/
  get tags(){
    return this._tags || (this._tags = this.lines.map(line => new Tag(line)))
  }
  /**
    Appelé au chargement du fichier tag.js (par le require)
    On transforme le code brut en lignes de code et en tags
  **/
  set lines(v){
    if ( 'string' === typeof v ) {
      // Quand on vient du fichier tags.js
      this._lines = v.trim().split(RC)
    } else {
      // Quand on vient par exemple du traitement des séquences d'images
      this._lines = v
    }
  }
  get lines(){return this._lines}

  get name(){return this._name}

  get tags_path(){
    return this._tagspath || (this._tagspath = this.pathof('tags.js'))
  }
  get options_path(){
    return this._optionspath || (this._optionspath = this.pathof('options.js'))
  }

  get imagesFolder(){
    return this._imagesfolder || (this._imagesfolder = this.pathof('images'))
  }
}
Analyse.init()

Object.defineProperties(window, {
  A:{
    get:function(){
      return Analyse.current
    }
  }
})
