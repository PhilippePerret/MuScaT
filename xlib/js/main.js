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

// Mis dans un object pour pouvoir être réaffectées lors de l'update
// des tags sur la partition.
const DATA_DRAGGABLE = {
    delay: 300
  // 'classes.ui-draggable': 'dragged'
  , cursor: 'crosshair'
    // grid: [50, 50], // Fonctionne très mal => le faire en code
  , start: function(ev, ui){
      var my = this ;
      my._tag = ITags[ui.helper[0].id];
      my._tag.onStartMoving(ev, ui);
      if(my._tag.group){
        my._tag.group.onEachTag(function(tg){tg.startX=tg.x;tg.startY=tg.y});
      }
    }
  , stop: function(ev, ui){
      var my = this ;
      this._tag.onStopMoving(ev, ui);
      if(my._tag.group){
        my._tag.group.onEachTag(function(tg){
          if(tg.id == my._tag.id){return};
          tg.updateXY();
        });
      };
    }
  , drag: function(ev, ui){
      var my = this ;
      if(my._tag.group){
        // Si le tag courant est dans un group, il faut reproduire
        // sur chaque élément le déplacement
        var deltaX = my._tag.getX() - my._tag.startX ;
        var deltaY = my._tag.getY() - my._tag.startY ;
        my._tag.group.onEachTag(function(tg){
          if(tg.id == my._tag.id){return};
          tg.updateX(tg.startX + deltaX);tg.updateY(tg.startY + deltaY);
        })
      }
  }
}


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
