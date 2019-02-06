/**
 * Module permettant de jouer l'analyse comme une animation.
 */
const Anim = {
    laps:       2000
  , current:    0
  , last_index: null
  , playing:    false   // Mis à true quand l'animation joue
  , activateds: new Array() // pour mettre les litags activées
  // Options pour le fadein (le "reveal" en général)
  , options: {
        duration: 400   // durée du fadeIn (fondu) pour révéler le tag
      , exergue:  true  // si true la révélation est mise en exergue en rouge
    }

  , start: function(){
      this.init();
      this.current    = 0;
      this.laps       = (100 - Options.get('animation speed')) * 40 ;
      this.last_index = ULTags.jqObj.find('> li').length - 1 ;
      this.search_start();
      this.next();
      this.playing = true ;
    }
  , waitingLoop: function(){
      this.timer = setTimeout(this.next.bind(this), this.laps);
    }
    /**
     * Pour passer à l'image suivante.
     *
     * En fait, le problème est un peu plus complexe puisque :
     *  - il faut afficher les tags par groupe
     *  - il ne faut pas compter les lignes vides (ou alors, si, justement !)
     */
  , next: function(){
      this.reveal_nexts();
      // console.log(`-> next / this.current:${this.current}, this.last_index:${this.last_index}`);
      if( this.current < this.last_index ){
        this.waitingLoop();
      } else {
        // FIN
        message(t('anim-ending'));
        setTimeout(this.onStop.bind(this), 5000);
      }
    }
    /**
     * On révèle le groupe des tags suivants
     */
  , reveal_nexts: function(){
      this.desactivateLiTags();
      while((litag=ULTags.index(this.current++)) && litag.itag.real){
        // console.log('# item ', this.current);
        litag.itag.reveal(this.options);
        litag.activate();
        this.activateds.push(litag);
      }
    }

    /**
     * On cherche le premier tag à afficher, celui qui contient "// START"
     */
  , search_start: function(){
      var last_visible ;
      this.current = 0;
      while((litag=ULTags.index(this.current++)) && !litag.itag.is_anim_start){
        litag.itag.jqObj.show(); // quand on relance l'animation
        if(litag.itag.real){last_visible = litag.itag;}
      };
      if(last_visible){last_visible.domObj.scrollIntoView({behavior: 'smooth'})};
      if(this.current > 0){-- this.current};
      return true;
    }
    /**
      * Méthode utile par exemple à la reprise d'une animation (quand tous les
      * tags ont été affichés) pour repartir à zéro. Noter que c'est la méthode
      * `search_start` qui remettra les tags affichés au départ.
      *
      * On désactive aussi les LItags qui ont été activées dans le bloc
      * de code.
     */
  , reset: function(){
      var itag;
      CTags.onEachTag(function(itag){if(itag.real){itag.jqObj.hide()}});
      this.desactivateLiTags();
      return this; // chainage
    }

  , desactivateLiTags: function(){
      this.activateds.forEach(function(litag){litag.desactivate()});
      this.activateds = new Array();
    }
  // ---------------------------------------------------------------------
  //  MÉTHODES ÉVÈNEMENTIELLES
  , onTogglePlay: function(){
      if(this.playing){
        // On doit s'arrêter
        this.stop();
      } else {
        // On doit reprendre. Mais c'est différent suivant qu'on doivent
        // lever la pause ou reprendre au début
        this.stateButtons(false);
        this.next();
      }
      this.playing = !this.playing;
      this.onTogglePlayButton(false);
    }

  , onStop: function(){
      this.playing = !this.playing;
      this.current = 0;
      clearTimeout(this.timer);
      this.stateButtons(true);
      this.onTogglePlayButton(true);
      this.reset().search_start();
    }
  , stateButtons: function(for_stop){
      var my = this
        , opacity_value = for_stop ? '0.3' : '1';
      ['stop','rewind'].forEach(function(suf){
        my[`btn_${suf}`].css('opacity', opacity_value);
      })
    }
  , pause: function(){
      this.playing = !this.playing;
      clearTimeout(this.timer);
      this.onTogglePlayButton(true);
    }
  , onTogglePause: function(){
      if (this.playing){
        this.pause()
      } else {
        this.onTogglePlay();
      }
    }
  , onRewind: function(){
      var itag ;
      // On remonte jusqu'au premier tag visible
      do {
        this.current --;
        itag = ULTags.index(this.current).itag;
      } while(!itag.real);
      itag.jqObj.hide();
    }
  , onTogglePlayButton: function(for_stop){
      this.btn_play[0].src=`xlib/images/anim/btn-${for_stop ? 'play' : 'pause'}.jpg`;
    }
    /**
     * Initialisation.
     * Si le code est affiché, on met des boutons de navigation pour mettre
     * en pause, reprendre, rejouer, etc.
     * En fait, ils sont dans le code, on ne fait que les révéler
     */
  , init: function(){
      $('#anim-buttons').show();
    }
};

/**
À RÉ-INTRODUIRE : POUR GÉRER LES PAUSES
        if (itag.is_comment_line && (itag.text||'').match(/PAUSE/)){
         // On s'arrête là en attendant une touche
         MEvents.onSpaceBar = method_next ;
         message(t('press-space-animation'));
       } else {
         // On marque une pause et on reprend
         my.timer = setTimeout(method_next, 40 * (100 - my.animation_speed));
       };

 */
Object.defineProperties(Anim,{
    btn_play: {
      get: function(){return $('#anim-btn-play')}
    }
  , btn_stop: {
      get: function(){return $('#anim-btn-stop')}
    }
  , btn_rewind: {
      get: function(){return $('#anim-btn-rewind')}
    }
})
