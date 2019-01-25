/**
 *  Objet Historique et class Histo
 *  --------------------------------
 *  Gestion de l'historique des opérations
 */

const Historique = {
  items: new Array(),
  max_items: 100, // nombre maximum d'opérations (pourra être changé par options)

  /**
   * Méthode pour ajouter un élément
   */
  add: function(hdata){
    this.items.push(new Histo(hdata));
  },

  /**
   * Revenir en arrière
   */
  backward: function(){

  },

  /**
   * Afficher l'historique
   */
  display: function(){

  },

  /**
   * Supprimer une opération de l'historique
   * Supprime la ligne d'historique d'index +idx+, c'est-à-dire
   * défait l'opération, remet l'état précédent.
   */
  undo: function(idx){

  },
};

const Histo = function(hdata){
  this.data = hdata ;
  this.subject = hdata.subject ; // p.e. 'tag' pour un TAG
  this.subj_id = hdata.subj_id ; // id du sujet, p.e. l'id du TAG
  this.props   = hdata.props ; // liste des propriétés modifiées (HistoProp)
  /*
  prop = {
    name:   nom de la propriété p.e. 'x'
    prev_value:   valeur avant
    next_value:   valeur actuelle
  }
   */
};

const HistoProp = function() {
  this.name       = null ; // nom de la propriété, p.e. 'x', ou 'locked'
  this.prev_state = null ; // la valeur avant l'opération, p.e. 120 ou false
  this.next_state = null ; // La valeur après l'opération, p.e. 130 ou true
};

const H = Historique ;
