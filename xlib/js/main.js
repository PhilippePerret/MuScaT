/*
  Script principal
*/

// Dans le cas où l'utilisateur n'aurait pas Firebug ou autre.
if ('undefined'==typeof(console)){
  console = {log:function(e){},error:function(e){}}
}

window.message = function(str){
  var dom = document.getElementById('message');
  dom.className = 'notice';
  dom.innerHTML = str;
};

// Pour mettre dans le presse-papier
function clip(str){
  navigator.clipboard.writeText(str) ;
};

$(document).ready(function(){

  // On charge les éléments de l'analyse courante
  var nodecss = document.body.appendChild(document.createElement('link'));
  nodecss.href = `_analyses_/${ANALYSE}/aspect.css`;
  var nodetags = document.body.appendChild(document.createElement('script'));
  nodetags.src = `_analyses_/${ANALYSE}/_tags_.js`;

  Cook.parse();

  $(nodetags)
    .on('load', function(){
      // Fichier _tags_.js chargé, on peut commencer les hostilités
      MuScaT.test_if_ready('analyse');
    })
    .on('error',function(e){
      MuScaT.loading_error('analyse');
      console.error(e);
    });
});
