

const UI = {
  domTools: function(){
    return document.getElementById('tools');
  },
  toggle_tools: function(){
    if (this.domTools().className == 'displayed'){
      this.hide_tools();
    } else {
      this.show_tools();
    }
  },

  show_tools: function(){
    this.domTools().className = 'displayed';
  },

  hide_tools: function(){
    this.domTools().className = 'undisplayed';
  }

}
