/*
  Script principal
*/


$(document).ready(function(){
  Cook.parse();

  MuScaT.analyse_name = ANALYSE ;// Modifiée si inexistante
  MuScaT.preload()
    .then(MuScaT.start_and_run.bind(MuScaT));

});
