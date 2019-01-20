/**
 * Extension de l'objet MuScaT pour les tests
 *
 *  Note : la const M permet de ne pas avoir à taper MuScaT à chaque fois
 */


if('undefined'==typeof(MuScaT)) { MuScat = {} }
Object.assign(MuScaT,{

  // C'est un simple alias de `start_and_run` qui permettra peut-être de
  // faire quelques ajustement avant les tests.
  //
  // Il faut appeler la méthode `reset_for_tests` avant de régler des
  // options et d'appeler cette méthode. L'ordre normal est :
  //
  //      MuScaT.reset_for_test();
  //      option('...', '...')
  //      MuS
  // Pour relancer l'application comme si c'était au rechargement
  // Tout est initialisé et la méthode 'start_and_run' (appelée normalement
  // par le document.ready) est joué.
  relaunch:function(){
    // MuScaT.reset_for_tests();
    MuScaT.start_and_run();
  },

  // Initialisation de tout, même la fenêtre, avant les tests (mais doit
  // être appelée)
  reset_for_tests: function(){
    this.reset_options() ;
    this.reset_all() ;
    Tags = "// Juste un commentaire" ;
    $('#rcolumn').hide();
  },

  // Pour modifier le code source (dans le champ "à côté")
  //
  // Si +update_required+ est true, on actualise comme si on jouait
  // ALT ENTRÉE.
  change_code_source(new_code, update_required){
    var nodeSrc = $('#codeSource') ;
    nodeSrc.focus(); // doit permettre d'avoir le bon gestionnaire d'events
    nodeSrc.val(new_code);
    if (update_required){
      nodeSrc.trigger({type: 'keypress', keyCode: 13, altKey: true});
    }
  }
})

const M = MuScaT ;
