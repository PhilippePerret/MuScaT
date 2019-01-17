
const UI = {
  domTools: function(){
    return document.getElementById('tools');
  },
  toggle_tools: function(){
    if (this.tools_are_opened()){
      this.hide_tools();
    } else {
      this.show_tools();
    }
  },

  tools_are_opened: function(){
    return this.domTools().className == 'opened';
  },

  show_tools: function(){
    this.domTools().className = 'opened';
    if(CTags.selections.length > 1){
      $('#fs_alignment').removeClass('undisplayed');
      $('#selecteds_count').text(CTags.selections.length);
    } else {
      $('#fs_alignment').addClass('undisplayed');
    }
    // $('#selecteds_count').innerHTML = CTags.selections.length;
  },

  hide_tools: function(){
    this.domTools().className = 'closed';
  }

}
