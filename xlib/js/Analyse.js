'use strict'
/** ---------------------------------------------------------------------
  *   Class Analyse
  *   -------------
  *   Gestion de l'analyse courante

  La constante A [Analyse] est l'analyse courante
*** --------------------------------------------------------------------- */
class Analyse {
  static init(){

  }
  static get current(){ return this._current }
  static set current(v){this._current = v}

  constructor(name /*i.e. le nom du dossier*/){
    this._name = name
  }

  load_tags(){
    console.log('-> load_tags')
    try {
      this.tags = require(this.tags_path)
    } catch (err) {
      // Vieille version
      console.error(err)
      this.tags = []
    }
  }
  load_options(){
    console.log('-> load_options')
    try {
      Options.OPTIONS = require(this.options_path)
    } catch (err) {
      console.error(err)
    }
  }

  pathof(relpath){
    return `${ANALYSES_FOLDER}/${this.name}/${relpath}`
  }

  get name(){return this._name}

  get tags_path(){
    return this._tagspath || (this._tagspath = this.pathof('tags.json'))
  }
  get options_path(){
    return this._optionspath || (this._optionspath = this.pathof('options.json'))
  }
}
Analyse.init()

// L'analyse courante
const A = (function(){
  return Analyse.current
})()
