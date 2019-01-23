/**
 * Class Options
 * -------------
 * Pour la gestion des options
 */
 // Les options utilisables
 OPTIONS = {
     'code beside':           {boolean: true, value: false}
   , 'code à côté':           {aka: 'code beside'}
   , 'code':                  {aka: 'code beside'}
   , 'crop image':            {boolean: true, value: false}
   , 'images PNG':            {boolean: true, value: false} // true si on veut des noms de fichier ne png (pour convert par exemple)
   , 'découpe image':         {aka: 'crop image'}
   , 'coordonates':           {boolean: true, value: false} // afficher les coordonnées lors des déplacementss
   , 'repères':               {aka: 'lines of reference'}
   , 'reperes':               {aka: 'lines of reference'}
   , 'guides':                {aka: 'lines of reference'}
   , 'lines of reference':    {boolean: true, value: false} // si true, affiche les lignes de guide
   , 'espacement images':     {aka: 'space between scores'}
   , 'space between scores':  {boolean: false, value: null}
   , 'top first score':       {boolean: false, value: null}
   , 'marge haut':            {aka: 'top first score'}
   , 'left margin':           {boolean: false, valeu: null}
   , 'marge gauche':          {aka: 'left margin'}
 }

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
        // console.log('Traitement de opt_id: ', opt_id);
        if(undefined == OPTIONS[opt_id]){
          alert(`L'option ${opt_id} est inconnue de nos services !…`);
          continue;
        } else if (OPTIONS[opt_id].aka) {
          opt_id = OPTIONS[opt_id].aka ;
        }
        doption = OPTIONS[opt_id] ;
        if (doption.boolean) {
          OPTIONS[opt_id].value = true ;
        } else {
          err_msg = `Dans tags.js, il faut définir la valeur de l'option non booléenne '${opt_id}'.` ;
          var nextopt = seq_options.next() ;
          if (nextopt.value){
            var valopt = nextopt.value[1] ;
            if(undefined == OPTIONS[valopt]){
              // C'est une vraie valeur
              OPTIONS[opt_id].value = valopt ;
            } else {
              // Puisque la valeur est un id d'option, c'est un oubli
              error(err_msg);
            }
          } else {
            // La valeur a été oubliée
            error(err_msg);
          }
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
      if (OPTIONS[k].aka){continue}
      else if (OPTIONS[k].boolean){ OPTIONS[k].value = false;}
      else {OPTIONS[k].value = null };
    }
  }

}
