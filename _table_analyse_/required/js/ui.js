
function  write(str) {
  $('body').append('<div>' + str + '</div>')
}

const UI = {
  toggle_tools: function(){
    if (this.tools_are_opened()){
      this.hide_tools();
    } else {
      this.show_tools();
    }
  },

  tools_are_opened: function(){
    return this.domTools.className == 'opened';
  },

  show_tools: function(){
    this.domTools.className = 'opened';
    if(CTags.selections.length > 1){
      // Pour tous les champs/textes qui en ont besoin
      $('.selected_count').text(CTags.selections.length);
      // Pour 'l'alignement
      $('#fs_alignment').removeClass('undisplayed');
      // Pour le regroupement
      $('button#btn-grouper').removeClass('undisplayed');
    } else {
      $('#fs_alignment').addClass('undisplayed');
      $('button#btn-grouper').addClass('undisplayed');
    }
    // $('#selecteds_count').innerHTML = CTags.selections.length;
  },

  hide_tools: function(){
    this.domTools.className = 'closed';
  }

};
Object.defineProperties(UI,{
  domTools: {
    get: function(){return document.getElementById('tools'); }
  }
})

// Permet de stopper complètement n'importe quel évènement
window.stop = function(ev){
  ev.stopPropagation();
  ev.preventDefault();
  return false
}
