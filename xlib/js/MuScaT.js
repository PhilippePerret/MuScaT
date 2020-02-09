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
      .then(ULTags.build.bind(ULTags))
      .then(this.setupInPostLoad.bind(this))
      .then(ok)
      .catch(Muscat.onError)
    })
  }

  static setupInPostLoad(){
    return new Promise((ok,ko) => {
      try {

        // Préparation de l'interface
        // C'est cette méthode, par exemple, qui va afficher ou masquer
        // les boutons de contrôle de l'animation si c'est une animation
        UI.setUI()

        // Chargement du module d'automation si l'analyse est
        // automatisée
        A.animated && requireModule('Automation')

        // Le nom de l'analyse en filigrane sur la table d'analyse
        // TODO Doit pouvoir être réglé (visible/masqué) par une option
        $('span#analyse_name').text(A.name);

        // TODO Voir si c'est encore utile :
        // Pour une raison pas encore expliquée, il arrive que les
        // éléments se bloquent et ne prenent plus leur position
        // absolute (bug dans le draggable de jQuery).
        // Donc, ici, on s'assure toujours que les éléments draggable
        // soit en bonne position
        // On fera la même chose, un peu plus bas, avec les lignes de
        // référence
        CTags.forEachTag(function(tg){tg.jqObj.css('position','absolute')});

        // Lignes de références
        if(Options.get('lines-of-reference')){
          Page.build_lines_of_reference();
          Page.assure_lines_draggable();
        }

        // Observation de la page
        Page.observe()

        // OK
        ok()
      } catch (err) { ko(err) }
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
    Appelée lorsque l'analyse est vraiment prête, c'est-à-dire qu'elle
    est chargée et construite sur la table
  **/
  static onReady(){
    // Si on est en train de tester, on lance les tests
    if(TESTING){
      Tests.run()
    } else {
      // hors tests
      IO.setSavingLoop()
    }

  }

  static onPreloadError(err){
    error(err)
  }

  static loadingError(when){
    let err ;
    switch(Muscat.lang){
      case 'en':
        err = `An error occured (${when}). Can’t launch Muscat, sorry.`;
        break;
      default:
        err = `Une erreur fatale est malheureusement survenue (${when}). Je ne peux pas lancer Muscat…`;
    }
    F.error(err);
  }

  /**
   * Méthode secours pour obtenir le code complet de l'analyse,
   * quand la copie dans le presse-papier ne fonctionne pas.
   */
  static codeCompletSecours(){
    var my = this;
    var o = $('textarea#code-complet-secours');
    o.val(my.veryFullCode());
    o.show().focus().select();
    UI.toggle_tools();
  }


  /**
    Retourne la langue courante
  **/
  static get lang(){
    return this._lang || (this._lang = Options.get('lang').toLowerCase())
  }

}

const M = Muscat;
