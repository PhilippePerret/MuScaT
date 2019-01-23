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
}
window.error = function(err_msg, err_type){
  Errors.show(err_msg, err_type);
}
const Errors = {
  messages: new Array(),
  show: function(err_msg, err_type = null){
    this.domObj.className = 'warning';
    this.domObj.innerHTML = err_msg;
    this.messages.push({msg: err_msg, type: err_type}) ;
  }
}
Object.defineProperties(Errors,{
  jqObj: {
    get: function(){return $(this.domObj);}
  },
  domObj:{
    get: function(){return document.getElementById('message');}
  }
})

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

$(document).ready(function(){MuScaT.start_and_run()});
