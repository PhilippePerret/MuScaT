/**
* Objet gérant les thèmes
**/
const Theme = {
    current: 'muscat' // thème courant par défaut (option('theme', '<valeur>'))
    // Le thème doit être défini dans `js/themes`
  , PROP_SHORTCUTS: {
      'dim': 'real-css-property'
    , 'ff': 'font-family', 'fw': 'font-weight', 's': 'font-size'
    , 'fs': 'font-style', 'fv': 'font-variant'
    , 'lm':'left', 'rm': 'right', 'mg':'left', 'md': 'right'
    , 'tm': 'top'
    , 'h': 'height', 'mh': 'min-height', 'w': 'width', 'mw': 'min-width'
    , 'ta':'text-align'
    , 'br': 'border', 'pd': 'padding', 'ra': 'border-radius'
    , 'ls':'letter-spacing'
    , 'tr':'transform', 'tro': 'transform-origin'
    , 'z': 'z-index'
  }
  ,  style_commun: {}

  /**
   * Fonction permettant de charger le thème et de prévenir MuScaT que
   * c'est bon (ou pas…)
   */
  , load: function(){
      this.current = Options.get('theme') || 'muscat';
      var nod = document.body.appendChild(document.createElement('link'));
      nod.setAttribute('rel', 'stylesheet');
      nod.setAttribute('media', 'screen, print');
      nod.href = `xlib/css/themes/${this.current}.css`;
      $(nod)
        .on('load', function(){
          MuScaT.test_if_ready('theme');
        })
        .on('error', function(e){
          MuScaT.loading_error('theme');
          console.error(e);
        });
    }
}
const Th = Theme ;
