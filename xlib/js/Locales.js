/**
 * Gestion des versions locales de l'application
 *
 * Usage:     t('<id-msg-dans-MSG>'[, <table remplacement>])
 *
 *  On peut mettre plusieurs <ids> dans le texte, séparés par des
 * espaces, pour produire une phrase. Pe:
 *    t('the help'); où 'the' et 'help' sont chacun des id de locales.
 *
 * Dans les textes, les remplacements sont codés "%{<clé>}"
 *
 */
const Locales = {
  translate: function(msg_ids, args){
    var msg, k, rg, arr = new Array() ;
    // msg_ids peut être composé de plusieurs mots
    msg_ids.split(' ').forEach(function(msg_id){
      if('undefined' == typeof(MSG)){
        switch(msg_id){
          case 'value-option-required':
            msg = `Value of option '${args['option']}' is required.${RC}(la valeur de l'option '${args['option']}' est requise).`;
            break;
          case 'unknown-option':
            msg = `The '${args['option']}' option is unknown.${RC}(l'option '${args['option']}' est inconnue de nos services…).`;
            break;
          default:
            msg = `No translation for '${msg_id}'`;
        }
      } else {
        msg = MSG[msg_id];
        if(args){
          for(var k in args){
            rg = new RegExp(`%{${k}}`, 'gi');
            msg = msg.replace(rg,args[k]);
          }
        }
      }
      arr.push(msg);
    });
    return arr.join(' ');
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
