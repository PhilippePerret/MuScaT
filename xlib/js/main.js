/*
  Script principal
*/
// Debug.level = 7;

$(document).ready(function(){
  if('undefined'==typeof(TESTING)){TESTING = false};
  // console.log(TESTING?'Oui, du test':'NON, pas de test');

  MuScaT.analyse_name = TESTING?'Tests':ANALYSE ;// Modifiée si inexistante
  MuScaT.preload()
    .then(MuScaT.start_and_run.bind(MuScaT))
    .then(function(){

      if(TESTING){Tests.run()}

      IO.startSavingLoop()
    });
});
