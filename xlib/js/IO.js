'use strict';
/** ---------------------------------------------------------------------
  *   Opération d'entrée/sortie (surtout de sortie pour le moment)
  *
  La principale fonction de ce module est de permettre l'enregistrement
  des tags dans le fichier de l'analyse
*** --------------------------------------------------------------------- */

class IO {

  /**
    Pour mettre en route ou arrêter la sauvegarde automatique
  **/
  static toggleSaveLoop(){
    if ( this.saveLooping ) {
      this.stopSavingLoop()
    } else {
      this.startSavingLoop()
    }
  }
  /**
    On met en route la boucle qui va checker s'il faut sauver le
    code
  **/
  static startSavingLoop(){
    this.saveLooping = true
    this.saveTimer = setInterval(this.saveIfModified.bind(this), 5000)
    UI.btnStopSave.innerHTML = "Stop Save Loop"
    console.log("Boucle de sauvegarde automatique démarrée")
  }

  /**
    On arrête la sauvegarde auto
  **/
  static stopSavingLoop(){
    if ( this.saveTimer ) {
      clearInterval(this.saveTimer)
      delete this.saveTimer
    }
    UI.btnStopSave.innerHTML = "Start Save Loop"
    this.saveLooping = false
    console.log("Boucle de sauvegarde automatique arrêtée")
  }

  static saveIfModified(){
    if ( M.modified ) {
      this.saving = true
      console.log('%c--- Modification du code => Enregistrement', 'color:green;')
      this.saveTags()
      M.modified = false
      this.saving = false
    } else {
      console.log('%c--- Pas de modification (pas d’enregistrement)', 'color:blue;')
    }
  }

  static saveTags(){
    const my = this
    Ajax.send({
        type:'POST'
      , data: {
            script: "save_current.rb"
          , args: {code: M.build_very_full_code(), lines: M.full_code_lines}
        }
      , success: my.onTagsSaved.bind(my)
    })

  }

  static saveOptions(){
    const my = this
    Ajax.send({
        type: 'POST'
      , data: {
            script: "save_options.rb"
          , args: {
                options: Options.OPTIONS
              , analyse: A.name
            }
        }
    })
  }

  /**
    Méthode retour de l'enregistrement des tags
  **/
  static onTagsSaved(retour, err){
    console.log('-> onTagsSaved')
    if ( retour.error ) {
      console.error(retour.error)
    } else {
      console.log(retour.success)
      // console.log("Retour : ", retour)
    }
    console.log('<- onTagsSaved')
  }


}
