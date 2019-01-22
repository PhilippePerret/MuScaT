/**
 * Class Options
 * -------------
 * Pour la gestion des options
 */
 // pour ajouter une option
 window.options = function(){
   Options.set(arguments);
 }
 window.option = window.options;

const Options = {
  /**
   * Retourne la valeur de l'option d'identifiant opt_id
   * Ou undefined si l'option n'existe pas
   */
  get: function(opt_id, options) {
    if (undefined == options){options = {}}
    if (undefined == OPTIONS[opt_id]){
      if(options.no_alert != true){
        alert(`L'option ${opt_id} est inconnue de nos services.`);
      }
      return undefined ;
    } else if (OPTIONS[opt_id].aka){
      opt_id = OPTIONS[opt_id].aka ;
    }
    return OPTIONS[opt_id].value ;
  },

  set: function(){
    var opt, opt_id ;
    try {
      // console.log('args: ', arguments);
      // var seq_options = arguments.entries();
      var seq_options = [];
      for(var arg of arguments[0]){
        seq_options.push(arg);
      };

      seq_options = seq_options.entries();
      while(dopt = seq_options.next().value){
        opt_id = dopt[1] ;
        if(undefined == OPTIONS[opt_id]){
          alert(`L'option ${opt_id} est inconnue de nos services !…`);
        } else if (OPTIONS[opt_id].aka) {
          opt_id = OPTIONS[opt_id].aka ;
        }
        doption = OPTIONS[opt_id] ;
        if (doption.boolean) {
          OPTIONS[opt_id].value = true ;
        } else {
          OPTIONS[opt_id].value = seq_options.next().value[1] ;
        }
      };
    } catch (err) {
      console.error(err);
    } finally {
      return true ;
    }
  },

  // Pour remettre toutes les options à false (utile pour les tests)
  reset: function(){
    for(var k in OPTIONS){
      if (OPTIONS[k].boolean){ OPTIONS[k].value = false;}
      else {OPTIONS[k].value = null };
    }
  }

}
