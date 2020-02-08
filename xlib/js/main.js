/*
  Script principal
*/
// Debug.level = 7;

$(document).ready(function(){

  if('undefined'==typeof(TESTING)){TESTING = false};
  // console.log(TESTING?'Oui, du test':'NON, pas de test');
  // MuScaT.analyse_name = TESTING?'Tests':ANALYSE ;// Modifiée si inexistante

  Muscat.preload()
  .then(Muscat.load.bind(Muscat))
  .then(Muscat.postload.bind(Muscat))
  .then(Muscat.onReady.bind(Muscat))
  .catch(Muscat.onError)

});
