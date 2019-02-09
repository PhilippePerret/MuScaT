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

  , PLoad: function(){
      D.dfn('Theme#PLoad');
      return new Promise(function(ok,ko){
        var my = Theme ;
        my.current = Options.get('theme') || 'muscat';
        var nod = document.body.appendChild(document.createElement('link'));
        nod.setAttribute('rel', 'stylesheet');
        nod.setAttribute('media', 'screen, print');
        nod.href = `xlib/css/themes/${my.current}.css`;
        $(nod)
          .on('load', ok)
          .on('error', function(e){
            MuScaT.loading_error('theme');
            console.error(e);
          });
      })
  }
}
const Th = Theme ;
