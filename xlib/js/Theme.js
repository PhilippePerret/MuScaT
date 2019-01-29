/**
* Objet gérant les thèmes
**/
const Theme = {
    current: 'muscat' // thème courant par défaut (option('theme', '<valeur>'))
    // Le thème doit être défini dans `js/themes`
  , PROP_SHORTCUTS: {'ff': 'font-family', 'fw': 'font-weight', 's': 'font-size', 'fs': 'font-style', 'lm':'left', 'rm': 'right', 'mg':'left', 'md': 'right', 'ta':'text-align',
  'mh': 'top', 'tm': 'top',
'ls':'letter-spacing'}
  ,  style_commun: {}

  /**
   * Fonction permettant de charger le thème et de prévenir MuScaT que
   * c'est bon (ou pas…)
   */
  , load: function(){
      this.current = Options.get('theme') || 'muscat';
      var pth = `xlib/js/themes/${this.current}.js`;
      var nod = document.body.appendChild(document.createElement('script'));
      nod.src = pth
      $(nod)
        .on('load', function(){
          MuScaT.test_if_ready('theme');
        })
        .on('error', function(e){
          MuScaT.loading_error('theme');
          console.error(e);
        });
    }
  // === MÉTHODES SERVANT POUR LA PRODUCTION DU style DE LA BALISE ===

  // Retourne le code à ajouter à l'attribut `style` du tag concerné
  //
  // +style_id+ est une "adresse" composée de "<nature>.<type>"
  //
  // +jqObj+  Object jquery concerné, qui peut être envoyé pour obtenir
  //          certaines valeurs, à commencer par sa taille, lorsque l'alignement
  //          doit être centré.
  //          NON : l'objet n'existe pas encore quand on appelle cette fonction
  , get: function(style_id, jqObj){
      var dstyle = MTHEME[style_id];
      if(!dstyle){
        return '';
      } else {
        // Une définition existe
        var arr = new Array(), value;
        for(var ks in dstyle){
          if (dstyle[ks] == 'center'){
            value = `30%`; // sera ajusté plus tard
          } else {
            value = dstyle[ks];
          }
          arr.push(`${this.PROP_SHORTCUTS[ks]}:${value};`)
        }
      }
      console.log(arr.join(''))
      return arr.join('');
    }
  // === MÉTHODES SERVANT POUR LA DÉFINITION DES THÈMES ===
    // Définir les paramètres d'un thème. La méthode sert à utiliser
    // this.style_commun pour mettre des styles en commun, à commencer par
    // la police de caractère utilisée.
  , set: function(hstyle){
      return Object.assign({}, this.style_commun, hstyle) ;
    }
}
const Th = Theme ;
