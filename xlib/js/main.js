/*
  Script principal
*/
// Debug.level = 7;
$(document).ready(function(){
  if('undefined'==typeof(TESTING)){TESTING = false};
  console.log(TESTING?'Oui, du test':'NON, pas de test');

  MuScaT.analyse_name = TESTING?'Tests':ANALYSE ;// Modifiée si inexistante
  MuScaT.preload()
    .then(MuScaT.start_and_run.bind(MuScaT))
    .then(function(){

      if(TESTING){Tests.run()}

      console.log("Je vais essayer d'envoyer une requête Ajax")
      $.ajax({
          url: 'xlib/ajax/ajax.rb'
        , type: 'POST'
        // , dataType: 'JSON'
        , data: {
              // REQUIS : le nom du script à jouer (chemin relatif)
              script: "script/a/jouer.rb"
              // REQUIS : arguments à transmettre au script
            , args: JSON.stringify({code: "Le code qui devra être utilisé par le script transmis.", reponse_attendue:'OK'})
            , message: "Marion aime le chocolat"
          }
        , success: function(code, err){
            console.log("Succès", code, err)
          }
        , error:function(res, state, err){
            console.error("Échec: (res)", err, res)
          }
        , complete:function(resultat, statut){
            console.log("Complete, resultat=, statut=", resultat, statut)
          }
      })
    });
});
