/**
 * Class Options
 * -------------
 * Pour la gestion des options
 */
 // Les options utilisables
 OPTIONS = {
     'animation speed':             {boolean: false, value: null, default: 50}
   , 'vitesse animation':           {aka: 'animation speed'}
   , 'code beside':                 {boolean: true, value: false}
   , 'code à côté':                 {aka: 'code beside'}
   , 'code':                        {aka: 'code beside'}
   , 'crop image':                  {boolean: true, value: false}
   , 'images PNG':                  {boolean: true, value: false} // true si on veut des noms de fichier ne png (pour convert par exemple)
   , 'découpe image':               {aka: 'crop image'}
   , 'coordonates':                 {boolean: true, value: false} // afficher les coordonnées lors des déplacementss
   , 'repères':                     {aka: 'lines of reference'}
   , 'reperes':                     {aka: 'lines of reference'}
   , 'guides':                      {aka: 'lines of reference'}
   , 'lang':                        {boolean: false, value: 'fr'}
   , 'langue':                      {aka: 'lang'}
   , 'language':                    {aka: 'lang'}
   , 'langage':                     {aka: 'lang'}
   , 'lines of reference':          {boolean: true, value: false} // si true, affiche les lignes de guide
   , 'espacement images':           {aka: 'space between scores'}
   , 'space between scores':        {boolean: false, value: null, default: 0}
   , 'top first score':             {boolean: false, value: null}
   , 'marge haut':                  {aka: 'top first score'}
   , 'left margin':                 {boolean: false, value: null}
   , 'marge gauche':                {aka: 'left margin'}
   , 'vertical line offset':        {boolean: false, value: null}
   , 'horizontal line offset':      {boolean: false, value: null}
   , 'position repère vertical':    {aka: 'vertical line offset'}
   , 'position repère horizontal':  {aka: 'horizontal line offset'}
 }

 // pour ajouter une option
 window.options = function(){
   Options.set(arguments);
 }
 window.option = window.options;

const Options = {
  /**
   * Retourne la valeur de l'option d'identifiant opt_id ou sa valeur
   * par défaut si elle est définie,
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
    return OPTIONS[opt_id].value || OPTIONS[opt_id].default ;
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

  // Construit et retourne le texte qui doit être inscrit dans le
  // code de tags.js
  to_tags_js: function(memo_guides){
    var   my = this
        , opts = new Array()
        , opt
        , val
        ;
    // Dans le cas spécial des repères, on demande s'il faut prendre
    // la nouvelle position ou garder l'ancienne
    if (undefined === memo_guides){
      opt_vline = OPTIONS['vertical line offset'].value ;
      opt_hline = OPTIONS['horizontal line offset'].value ;
      if (opt_vline || opt_hline){
        cur_vline = $('#refline_v').offset().top  ;
        cur_hline = $('#refline_h').offset().left ;
        req_vline = opt_vline && opt_vline != cur_vline ;
        req_hline = opt_hline && opt_hline != cur_hline ;
        if (req_vline || req_hline){
          dask = {
            onOK: $.proxy(my, 'to_tags_js', true),
            onCancel: $.proxy(my, 'to_tags_js', false)
          }
          F.ask(t('memo guides offsets'), dask);
          return ; // en attendant de revenir
        }
      }
    } else {
      if (memo_guides === true){
        OPTIONS['vertical line offset'].value = $('#refline_v').offset().top;
        OPTIONS['horizontal line offset'].value = $('#refline_h').offset().left;
      }
    }
    for(opt in OPTIONS){
      if(OPTIONS[opt].aka){continue};
      if(OPTIONS[opt].boolean){
        if (OPTIONS[opt].value) {opts.push("'" + opt + "'")};
      } else if (val = OPTIONS[opt].value) {
        if ('string' == typeof(val)){ val= "'"+val+"'"}
        opts.push("'" + opt + "', " + val);
      };
    };
    if (opts.length){
      opts = 'options(' + opts.join(', ') + ') ;' + RC + RC ;
    } else {
      opts = '' ;
    };
    M.build_very_full_code(opts); // ~asynchrone
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
