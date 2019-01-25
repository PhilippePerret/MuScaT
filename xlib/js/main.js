/*
  Script principal
*/
console.log(document.cookie);

// Dans le cas où l'utilisateur n'aurait pas Firebug ou autre.
if ('undefined'==typeof(console)){
  console = {log:function(e){},error:function(e){}}
}

window.message = function(str){
  var dom = document.getElementById('message');
  dom.className = 'notice';
  dom.innerHTML = str;
}
// Mis dans un object pour pouvoir être réaffectées lors de l'update
// des tags sur la partition.
const DATA_DRAGGABLE = {
  delay: 300,
  // 'classes.ui-draggable': 'dragged'
  cursor: 'crosshair',
  // grid: [50, 50], // Fonctionne très mal => le faire en code
  start: function(ev, ui){
    ITags[ui.helper[0].id].onStartMoving(ev, ui);
  },
  stop: function(ev, ui){
    ITags[ui.helper[0].id].onStopMoving(ev, ui);
  }
}

$(document).ready(function(){

  // On charge les éléments de l'analyse courante
  var nodecss = document.body.appendChild(document.createElement('link'));
  nodecss.href = `_analyses_/${ANALYSE}/aspect.css`;
  var nodetags = document.body.appendChild(document.createElement('script'));
  nodetags.src = `_analyses_/${ANALYSE}/tags.js`;

  Cook.parse();

  $(nodetags)
    .on('load', function(){
      // console.log('Fichier tags.js chargé !')
      // Fichier tags.js chargé, on peut commencer les hostilités
      MuScaT.start_and_run();
    })
    .on('error',function(e){
      F.error(`Impossible de charger le fichier des tags. Vous avez dû commettre une erreur sur le nom du dossier de l'analyse<br><br><span class="smaller">(dans "MuScaT/_analyses_/${ANALYSE}/tags.js", le "${ANALYSE}" doit être erroné)</span>.`);
      console.error(e);
    });
});
