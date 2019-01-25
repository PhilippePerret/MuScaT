/**
 * Pour la gestion des messages affichés à l'écran
 *
 * Version 1.0.0
 * Date    jan. 2019
 * Author  Philippe Perret <philippe.perret@yahoo.fr>
 *
 * Alias : F
 */
const Flash = {
  built: false,

  onOK_method: null,      // la méthode à appeler quand OK est cliqué (if any)
  onCancel_method: null,  // idem pour Renoncer
  //////////////////////////////////////////////////////////////////////////
  //  Méthodes d'affichage

  // Affiche d'une simple notification
  notice: function(str){
    this.display(str, 'jqNotice');
  },
  // Affichage d'une erreur
  error: function(str){
    this.display(str, 'jqWarning');
  },
  ask: function(msg, args){
    this.onOK_method = args.onOK ;
    this.display(msg, 'jqAsk');
  },

  // L'affichage commun de n'importe quel type de texte
  display: function(msg, jqIn) {
    if(!this.built){this.build()};
    jqIn = this[jqIn];
    this.reset();
    jqIn.html(this.treat_message(msg)).show();
    this.open();
  },

  open: function(){
    this.old_onkeypress = window.onkeypress ;
    window.onkeypress = $.proxy(Flash,'onKeypress');
    this.show();
  },
  close: function(){
    window.onkeypress = this.old_onkeypress;
    this.hide();
  },

  show: function() {
    this.jqObj.show();
  },
  hide: function() {
    this.jqObj.hide();
  },

  reset: function() {
    this.jqObj.hide();
    this.jqNotice.html('').hide();
    this.jqWarning.html('').hide();
    this.jqAsk.html('').hide();
  },

  /////////////////////////////////////////////////////////////////
  // MÉTHODES ÉVÈNEMENTIELLES

  onOK: function(){
    this.close();
    if(this.onOK_method){
      this.onOK_method();
    }
    this.reset_all();
  },
  onCancel: function(){
    this.close();
    if(this.onCancel_method){
      this.this.onCancel_method();
    }
    this.reset_all();
  },

  reset_all: function(){
    this.onOK_method      = null ;
    this.onCancel_method  = null ;
    // Noter que les champs de texte sont vidés à l'appel
    // de l'affichage. ALors que cette méthode est appelée
    // en fin de cycle.
  },

  onKeypress:function(ev){
    if(ev.keyCode == 13){
      this.onOK();
      return stop(ev);
    } else if (ev.keyCode == 27) {
      // escape
      this.onCancel();
      return stop(ev);
    }
    // console.log(`which:${ev.which}, keyCode:${ev.keyCode}`);
  },
  /////////////////////////////////////////////////////////////////
  // MÉTHODES FONCTIONNELLES

  /**
   * Méthode de traitement cosmétique du message.
   */
  treat_message: function(msg){
    var rg = new RegExp(RC, 'g');
    msg = msg
            .replace(rg, '<br>')
            .replace(/^( +)/g, function(t,p){var l=p.length;r='';while(r.length<l){r+='&nbsp;'};return r;});

    return msg;
  },
  /////////////////////////////////////////////////////////////////
  // MÉTHODES DE CONSTRUCTION //

  build: function(){
    $('body').append(`
      ${this.css}
      <div id="flash" style="display:none;">
        <div id="flash-notice" class="msg" style="display:none;"></div>
        <div id="flash-warning" class="msg" style="display:none;"></div>
        <div id="flash-ask" class="msg" style="display:none;"></div>
        <section id="buttons">
          <button id="cancel-btn" class="btn" onclick="$.proxy(Flash,'onCancel')()">Annuler</button>
          <button id="ok-btn" class="btn" onclick="$.proxy(Flash,'onOK')()">OK</button>
        </section>
      </div>
    `);
    this.built = true ;
  },
};
Object.defineProperties(Flash,{
  jqObj:      {get: function(){return $('#flash')}},
  jqNotice:   {get: function(){return $('#flash #flash-notice')}},
  jqWarning:  {get: function(){return $('#flash #flash-warning')}},
  jqAsk:      {get: function(){return $('#flash #flash-ask')}},
  jqButtons:  {get: function(){return $('#flash #buttons')}},
  css: {get: function(){
    return `
      <style type="text/css">
      #flash {position:fixed; z-index:2000; top:100px; left: 35%; width:30%; border-radius:0.5em; shadow: background-color:grey;box-shadow: 10px 10px 10px grey;}
      #flash div.msg {padding:2em 4em; font-family: Avenir, Helvetica; font-size: 16pt;}
      #flash #flash-notice {color: blue; background-color:#CCCCFF;}
      #flash #flash-warning {color: red; background-color: #FFCCCC; border: 1px solid red;}
      #flash #flash-ask {color: green; background-color: #CCFFCC; border: 1px solid green;}
      #flash #buttons {text-align:right;padding-top:1em;background-color:white;padding:0.5em 1em;}
      #flash #buttons #cancel-btn {float: left;}
      #flash #buttons .btn {font-size: 16pt; padding: 8px;}
      </style>
    `
  }}
});
const F = Flash ;
