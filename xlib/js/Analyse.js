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
  static get current(){ return this._current }
  static set current(v){this._current = v}

  constructor(name /*i.e. le nom du dossier*/){
    this._name = name

    // Pour connaitre l'état du chargement
    this.tagsLoaded = false
    this.optionsLoaded = false

    this.afterLoadTags    = this.afterLoadTags.bind(this)
    this.afterLoadOptions = this.afterLoadOptions.bind(this)
  }

  checkIfReady(){
    this.isReady = this.tagsLoaded && this.optionsLoaded
    this.isReady && this.onReady()
  }

  onReady(){
    console.log("Les tags et les options sont chargées !")
  }

  /*
    Fonction de tags
  */
  // Exécute la fonction +method+ sur toutes les lignes de la
  // constante Tags.
  /**
    Exécute la fonction +method+ sur tous les tags ou comme méthode des tags
    +Params+::
      +method+::  Si [Function] Exécute la fonction avec en premier argument
          chaque tag [String] de this.tags
                  Si [String] method est une méthode de la ligne de tag
                  NOTE Ça sera vraiment utile quand this.tags sera une instance
                  au lieu d'être un simple string

  **/
, onEachTagsLine(method){
    if ( 'string' = typeof method) {
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
    try {
      require(this.tags_path)
      .then(this.afterLoadTags)
    } catch (err) {
      // Vieille version
      console.error(err)
      this.tags = []
    }
  }
  afterLoadTags(){
    this.tags = this.tags.split(RC)
    // TODO Plus tard, vers des instances de tag
    console.log("tags =", this.tags)
    this.tagsLoaded = true
    this.checkIfReady()
  }

  // Chargement des options du fichier 'options.js'
  loadOptions(){
    console.log('-> loadOptions')
    try {
      require(this.options_path).then(this.afterLoadOptions)
    } catch (err) {
      console.error(err)
    }
  }
  afterLoadOptions(){
    // console.log("options = ", this.options)
    this.optionsLoaded = true
    this.checkIfReady()
  }

  pathof(relpath){
    return `${ANALYSES_FOLDER}/${this.name}/${relpath}`
  }

  get name(){return this._name}

  get tags_path(){
    return this._tagspath || (this._tagspath = this.pathof('tags.js'))
  }
  get options_path(){
    return this._optionspath || (this._optionspath = this.pathof('options.js'))
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
