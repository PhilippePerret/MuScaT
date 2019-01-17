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

OPTIONS = {
  'code beside': false,
  'coordonates': false, // afficher les coordonnées lors des déplacementss
}
// pour ajouter une option
window.options = function(options){
  for(var i in arguments){
    var option = arguments[i] ;
    if (undefined == OPTIONS[option]){
      alert('L’option « '+option+' » est inconnue de nos services.');
    } else {
      OPTIONS[option] = true ;
    }
  }
}
window.option = window.options;
window.get_option = function(opt){
  return OPTIONS[opt] ;
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
  // $('#tags').on('click', function(ev){CTags.desectionne_all()})
  $('#tags').on('click', $.proxy(Page, 'onClickOut'))

  // Si l'option 'code beside' a été activée, il faut préparer la
  // page
  if (get_option('code beside')){
    Page.set_code_beside();
  }

})
