/**
 * Class Options (alias 'Opt')
 * -------------
 * Pour la gestion des options
 */
 // Les options utilisables
 const OPTIONS = {
   // Note : `user_name` permet de garder la trace du nom de l'option que l'user
   // a employée, en cas de "aka" pour lui redonner la même.
     'animation-speed':             {boolean: false, value: null, default: 50, user_name: null}
   , 'auto-save':                   {boolean: true, value: null, default: true}
   , 'code':                        {boolean: true, value: false, default: false}
   , 'code-no-option':              {boolean: true, value: null}
   , 'code-no-options':             {aka: 'code-no-option'}
   , 'code-sans-option':            {aka: 'code-no-option'}
   , 'code-sans-options':           {aka: 'code-no-option'}
   , 'crop-image':                  {boolean: true, value: false}
   , 'images-PNG':                  {boolean: true, value: false} // true si on veut des noms de fichier ne png (pour convert par exemple)
   , 'découpe-image':               {aka: 'crop-image'}
   , 'coordonates':                 {boolean: true, value: false} // afficher les coordonnées lors des déplacementss
   , 'repères':                     {aka: 'lines-of-reference'}
   , 'reperes':                     {aka: 'lines-of-reference'}
   , 'guides':                      {aka: 'lines-of-reference'}
   , 'lang':                        {boolean: false, value: null, default: 'fr'}
   , 'langue':                      {aka: 'lang'}
   , 'language':                    {aka: 'lang'}
   , 'langage':                     {aka: 'lang'}
   , 'lines-of-reference':          {boolean: true, value: false} // si true, affiche les lignes de guide
   , 'espacement-images':           {aka: 'space-between-scores'}
   , 'space-between-scores':        {boolean: false, value: null, default: DEFAULT_SCORES_SPACES}
   , 'top-first-score':             {boolean: false, value: null}
   , 'marge-haut':                  {aka: 'top-first-score'}
   , 'left-margin':                 {boolean: false, value: null}
   , 'marge-gauche':                {aka: 'left-margin'}
   , 'horizontal-line-offset':      {boolean: false, value: null, default: 46}
   , 'position-repère-vertical':    {aka: 'vertical-line-offset'}
   , 'position-repère-horizontal':  {aka: 'horizontal-line-offset'}
   , 'theme':                       {boolean: false, value: null}
   , 'visor':                       {boolean: true, value: null, default: false}
   , 'viseur':                      {aka: 'visor'}
   , 'vertical-line-offset':        {boolean: false, value: null, default: 42}
   // TOUTES LES DIMENSIONS
   , 'cadence-size':                {boolean: false, value: null}
   , 'chord-size':                  {boolean: false, value: null}
   , 'degree-size':                 {boolean: false, value: null}
   , 'degre-size':                  {aka: 'degree-size'}
   , 'harmony-size':                {boolean: false, value: null}
   , 'harmonie-size':               {aka: 'harmony-size'}
   , 'measure-size':                {boolean: false, value: null}
   , 'mesure-size':                 {aka:'measure-size'}
   , 'modulation-size':             {boolean: false, value: null}
   , 'rectangle-selection':         {boolean: true, value: null, default: false}
   , 'part-size':                   {boolean: false, value: null}
   , 'shuffle-tests':               {boolean: true, value: null, default: true}
   , 'text-size':                   {boolean: false, value: null}
 }

 // pour ajouter une option
 // OBSOLETE La définition doit se faire maintenant dans le fichier options.js
 window.options = function(){
   console.warn("La méthode 'options/option' est obsolète")
   Options.set(arguments);
 }
 window.option = window.options;

class Options {

    /**
     * Retourne la valeur de l'option d'identifiant opt_id ou sa valeur
     * par défaut si elle est définie,
     * Ou undefined si l'option n'existe pas
     */
  static get(opt_id, options) {
    if (undefined == options){options = {}}
    if (undefined == OPTIONS[opt_id]){
      if(options.no_alert != true){
        error(t('unknown-option', {option: opt_id}));
      }
      return undefined ;
    } else if (OPTIONS[opt_id].aka){
      opt_id = OPTIONS[opt_id].aka ;
    }
    let optVal = OPTIONS[opt_id].value
    if ( optVal === null ) {
      optVal = OPTIONS[opt_id].default
    }
    return optVal ;
  }

  static set(){
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
          // La clé d'option. Comme on peut la fournir avec des espaces
          // ou des traits plats, on transforme toujours pour obtenir des
          // tirets entre les mots
          opt_id = dopt[1].replace(/ /g,'-').replace(/_/g, '-') ;
          opt_id_init = `${opt_id}`;
          // console.log('Traitement de opt_id: ', opt_id);
          if(undefined == OPTIONS[opt_id]){
            error(t('unknown-option', {option: opt_id}));
            continue;
          }

          if (OPTIONS[opt_id].aka) {
            opt_id = OPTIONS[opt_id].aka ;
          }
          doption = OPTIONS[opt_id] ;
          doption.user_name = opt_id_init;
          if (doption.boolean) {
            OPTIONS[opt_id].value = true ;
          } else {
            err_msg = t('value-option-required', {option: opt_id});
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
    }

    /**
      Enregistre les options dans le fichier options.json
      de l'analyse.
     */
  static save(){
      IO.saveOptions()
    }

  // Pour remettre toutes les options à false (utile pour les tests)
  static reset(){
      for(var k in OPTIONS){
        if (OPTIONS[k].aka){continue}
        else {OPTIONS[k].value = null};
      }
    }
};

const Opt = Options ;
