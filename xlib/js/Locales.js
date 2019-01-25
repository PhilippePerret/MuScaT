/**
 * Gestion des versions locales de l'application
 *
 * Usage:     t('<id msg dans MSG>'[, <table remplacement>])
 *
 * Dans les textes, les remplacements sont codés "%{<clé>}"
 *
 */
const Locales = {
  translate: function(msg_id, args){
    var msg, k, rg ;
    msg = MSG[msg_id];
    if(args){
      for(var k in args){
        rg = new RegExp(`%{${k}}`, 'gi');
        msg = msg.replace(rg,args[k]);
      }
    }
    return msg;
  },

  /**
   * Méthode qui charge les locales au lancement de la page
   */
  load: function(){
    var pth, nod ;
    ['messages','ui','things'].forEach(function(affixe){
      pth = `xlib/locales/${M.lang}/${affixe}.js`;
      nod = document.body.appendChild(document.createElement('script'));
      nod.src = pth;
      $(nod)
        .on('load',  function(){MuScaT.test_if_ready(affixe)})
        .on('error', function(){MuScaT.loading_error(affixe)});
    });
  }
};
// Méthode raccourci pratique
const t = Locales.translate ;
