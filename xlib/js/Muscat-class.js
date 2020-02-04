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
}
