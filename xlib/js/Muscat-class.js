'use strict';
/** ---------------------------------------------------------------------
  *   Classe Muscat
  *   -------------
  *
  Elle est destinée à remplacer la constante MuScaT (déjà trop dure à
  écrire, et en constante)
*** --------------------------------------------------------------------- */
class Muscat {
  static get modified(){return this._modified || false}
  static set modified(v){
    this._modified = v
    // TODO Peut-être une marque pour indiquer que ce n'est pas sauvé
  }

  /**
    En cas d'erreur, utilisable par toutes les méthodes, par exemple dans
    le catch des promesses.
  **/
  static onError(err){
    console.error(err)
    error("Une erreur est survenue")
  }
  /**
    * @async
    * Nouvelle méthode utilisant les promises pour charger tous les
    * premiers éléments asynchrones.
  **/
  static preload(){
    return new Promise((ok, ko)=>{
      Cook.parse();
      A.loadOptions() // pour connaitre la langue et le thème (if any)
      .then(Locales.PLoad)
      .then(Theme.PLoad)
      .then(ok)
      .catch(this.onPreloadError.bind(this))
    })
  }

  /**
    Chargement, principalement, des tags de l'analyse
  **/
  static load(){
    console.log('-> load')
    this.resetAll();
    return new Promise((ok,ko)=>{
      A.loadTags()
      .then(A.prepareLines)
      .then(Images.loadAllImages.bind(Images,A))
      .then(ok)
    })
  }

  static postload(){
    console.log('-> postload')
    return new Promise((ok,ko) => {
      A.buildTags()
      .then(Images.treateImagesSeparationIfRequired.bind(Images,A))
      .then(ok)
      .catch(Muscat.onError)
    })
  }


  // ---------------------------------------------------------------------

  static resetAll(){
    var my = this ;
    my    .errors = new Array();
    my    .treate_images_spaces = false ;
    my    .motif_lines_added    = null ;
    CTags .last_tag_id = 0 ; // 1-start
    Page  .table_analyse[0].innerHTML = '' ;
  }

  /**
    Appelée lorsque l'analyse est vraiment prêt, c'est-à-dire qu'elle
    est chargée et construite sur la table
  **/
  static onReady(){
    // Si on est en train de tester, on lance les tests
    if(TESTING){Tests.run()}
    else {
      // hors tests
      Options.get('auto-save') && IO.startSavingLoop()
    }

  }


  static onPreloadError(err){
    error(err)
  }

}
