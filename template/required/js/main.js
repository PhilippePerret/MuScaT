/*
  Script principal
*/
// Dans le cas où l'utilisateur n'aurait pas Firebug ou autre.
if ('undefined'==typeof(console)){
  console = {log:function(e){ } }
}

window.message = function(str){
  var dom = document.getElementById('message');
  dom.className = 'notice';
  dom.innerHTML = str;
}
window.error = function(msg){
  var dom = document.getElementById('message');
  dom.className = 'warning';
  dom.innerHTML = msg;
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

  // On doit construire les éléments d'après les définitions faites dans
  // le fichier tag.js
  MuScaT.load() ;

  // Quand on clique sur la partition, en dehors d'un élément,
  // ça déselectionne tout
  $('#tags').on('click', function(ev){CTags.desectionne_all()})

  // On rend tous les éléments sensibles au click
  $('.tag').on('click', function(ev){
    ITags[$(this)[0].id].onClick(ev);
    ev.stopPropagation();
    ev.preventDefault();
  });

  // On rend tous les éléments draggable
  $('.drag').draggable(DATA_DRAGGABLE)

})
