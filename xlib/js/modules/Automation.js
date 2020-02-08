'use strict'
/**
 * Module permettant de jouer l'analyse comme une animation.
 */
class Automation {
  static get options(){
    return this._options || (this._options = {duration:400, exergue:true})
  }

  /**
    Méthode appelée pour lancer l'animation
  **/
  static start(){
    console.log("-> Automation::start")
    this.init();
    this.reset();
    this.searchStart();
    this.next();
    this.playing = true ;
    this.onStart();
    this.started = true ;
    console.log("<- Automation::start")
  }

  /**
    * Reset de l'animation
    * --------------------
    * Méthode utile par exemple à la reprise d'une animation (quand tous les
    * tags ont été affichés) pour repartir à zéro. Noter que c'est la méthode
    * `searchStart` qui remettra les tags affichés au départ.
    *
    * On désactive aussi les LItags qui ont été activées dans le bloc
    * de code.
   */
  static reset(){
    console.log("-> Automation::reset")
    this.current    = 0;
    const multi = (100 - Options.get('animation-speed')) || 10 // toujours au moins
    this.laps = multi * 40 ;
    this.lastIndex  = ULTags.jqObj.find('> li').length - 1 ;
    this.activateds = []
    // Code qui était avant dans le reset initial :
    var itag;
    CTags.forEachTag(function(itag){if(itag.real){itag.jqObj.hide()}});
    this.desactivateLiTags();
    return this; // chainage
  }

  static waitingLoop(){
    this.timer = setTimeout(this.next.bind(this), this.laps);
  }
    /**
     * Pour passer à l'image suivante.
     *
     * En fait, le problème est un peu plus complexe puisque :
     *  - il faut afficher les tags par groupe
     *  - il ne faut pas compter les lignes vides (ou alors, si, justement !)
     */
  static next(){
    this.reveal_nexts();
    // console.log(`-> next / this.current:${this.current}, this.lastIndex:${this.lastIndex}`);
    if( this.current <= this.lastIndex ){
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
  static reveal_nexts(){
    var litag ;
    this.desactivateLiTags();
    while((litag=ULTags.index(this.current++)) && litag.itag.real){
      litag.itag.reveal(this.options);
      litag.activate();
      this.activateds.push(litag);
    }
  }

    /**
     * On cherche le premier tag à afficher, celui qui contient "// START"
     */
  static searchStart(){
    var last_visible
      , litag
      ;
    while((litag=ULTags.index(this.current++)) && !litag.itag.is_anim_start){
      litag.itag.jqObj.show(); // quand on relance l'animation
      if(litag.itag.real){last_visible = litag.itag;}
    };
    if(last_visible){last_visible.domObj.scrollIntoView({behavior: 'smooth'})};
    if(this.current > 0){-- this.current};
    return true;
  }


  static desactivateLiTags(){
    this.activateds.forEach(function(litag){litag.desactivate()});
    this.activateds = [];
  }

  // ---------------------------------------------------------------------
  //  MÉTHODES ÉVÈNEMENTIELLES

  /**
    Méthode appelée pour lancer l'animation
  **/
  static onTogglePlay(){
    if(this.playing){
      // On doit s'arrêter
      this.stop();
    } else {
      // On doit reprendre. Mais c'est différent suivant qu'on doivent
      // lever la pause ou reprendre au début
      if ( this.started ) {
        this.onStart();
      } else {
        this.start()
      }
      this.stateButtons(false);
      this.next();
    }
    this.playing = !this.playing;
    this.onTogglePlayButton(false);
  }

  static onStart(){
    UI.divULTags.css({opacity:0})
    this.rerunSaveLoopAfter = Boolean(!!IO.saveLooping)
    IO.stopSavingLoop()
    this.reset()
  }

  static onStop(){
    this.playing = !this.playing;
    this.current = 0;
    clearTimeout(this.timer);
    this.stateButtons(true);
    this.onTogglePlayButton(true);
    this.reset().searchStart();
    UI.divULTags.css({opacity:1})
    if (this.rerunSaveLoopAfter) IO.startSavingLoop()
    CTags.forEachTag(function(itag){itag.real && itag.jqObj.show()});
    // On réaffiche la boite de code
    UI.tagsList.show()
    // On remet au zoom normal
    UI.tableAnalyse.css('zoom','100%')
  }

  static stateButtons(for_stop){
    var my = this
      , opacity_value = for_stop ? '0.3' : '1';
    ['stop','rewind'].forEach(function(suf){
      $(my[`btn_${suf}`]).css('opacity', opacity_value);
    })
  }
  static pause(){
    this.playing = !this.playing;
    clearTimeout(this.timer);
    this.onTogglePlayButton(true);
  }
  static onTogglePause(){
    if (this.playing){
      this.pause()
    } else {
      this.onTogglePlay();
    }
  }
  static onRewind(){
    var itag ;
    // On remonte jusqu'au premier tag visible
    do {
      this.current --;
      itag = ULTags.index(this.current).itag;
    } while(!itag.real);
    itag.jqObj.hide();
  }
  static onTogglePlayButton(for_stop){
    this.btn_play.src=`xlib/images/anim/btn-${for_stop ? 'play' : 'pause'}.jpg`;
  }
    /**
     * Initialisation.
     * Si le code est affiché, on met des boutons de navigation pour mettre
     * en pause, reprendre, rejouer, etc.
     * En fait, ils sont dans le code, on ne fait que les révéler
     */
  static init(){
    UI.tableAnalyse.css('zoom','200%')
    UI.tagsList.hide()
  }

  static observeController(){
    console.log('-> Automation::observeController')
    if (this.alreadyObserved) return
    this.btn_play.addEventListener('click', this.onTogglePause.bind(this))
    this.btn_stop.addEventListener('click', this.onStop.bind(this))
    this.btn_rewind.addEventListener('click', this.onRewind.bind(this))

    this.alreadyObserved = true // pour ne le faire qu'une seule fois
  }

  static get btn_play(){
    return this._btnplay || (this._btnplay = DGet('#anim-btn-play'))
  }
  static get btn_stop(){
    return this._btnstop || (this._btnstop = DGet('#anim-btn-stop'))
  }
  static get btn_rewind(){
    return this._btnrewind || (this._btnrewind = DGet('#anim-btn-rewind'))
  }
};
Automation.observeController.call(Automation)
console.log("<- module Automation")
