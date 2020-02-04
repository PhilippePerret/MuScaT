/**
 * Module contenant les méthodes pour cropper la partition. Appelée
 * seulement au besoin.
 */
Object.assign(MuScaT,{
  loaded: false
  /**
   * Méthode appelée aussitôt le chargement de ce module achevé
   */
  , prepare_crop_image: function(){
      var my = MuScaT ;
      itag = CTags[1];
      console.log(itag);
      itag.x = 0 ; itag.y = 0 ; itag.update();
      itag.build();
      console.log("src:", itag.domObj.src);
      itag.jqObj.css({'position': 'absolute', 'top': 0, 'left': 0});
      message(t('crop-image-ready'));
      this.set_observers_mode_crop();
      // Pour indicer chaque image
      my.indice_cropped_image = 0 ;
    }

  , cropper: function(){
      this._cropper = document.getElementById('cropper');
      if (this._cropper) {
        return this._cropper;
      } else {
        Page.table_analyse.append('<div id="cropper" style="position:absolute;border:1px dashed green;"></div>');
        return this.cropper();
      }
    }
  , onMouseDownModeCrop:function(ev){
      var   my = this
          , x = ev.pageX
          , y = ev.pageY ;
      my.cropStartX = x ;
      my.cropStartY = y ;
      var cropper = my.cropper();
      cropper.style.left = my.cropStartX + 'px' ;
      cropper.style.top = my.cropStartY + 'px' ;
      cropper.style.borderStyle = 'dashed';
      cropper.style.borderColor = 'green';
      my.scropping = true ;
      return stop(ev);
    }
  , onMouseUpModeCrop: function(ev){
      // Quand on passe par ici, c'est qu'on a fini de sélectionner
      // la zone de l'image que l'on veut découper.
      // La méthode donne le code à utiliser pour convert
      // console.log('-> onMouseUpModeCrop');
      var   my = this ;
      my.cropEndX = ev.pageX ;
      my.cropEndY = ev.pageY ;
      my.scropping = false ;
      var cropper = my.cropper();
      cropper.style.borderStyle = 'solid';
      cropper.style.borderColor = 'blue';

      // Calcul des valeurs
      var w = my.cropEndX - my.cropStartX ;
      var h = my.cropEndY - my.cropStartY ;
      var x = my.cropStartX ;
      var y = my.cropStartY ;
      // document.getElementById('tags').removeChild(my.cropper);
      var scoreTag = CTags[1] ;
      var codeConvert = '-crop ' + w + 'x' + h + '+' + x + '+' + y ;
      var indiceImg  = ++ my.indice_cropped_image ;
      var extensionImg = Options.get('images-PNG') ? 'png' : 'jpg' ;
      codeConvert = 'convert ' + scoreTag.src + ' ' + codeConvert + ' ' + scoreTag.src + '-'+indiceImg+'.'+extensionImg;
      navigator.clipboard.writeText(codeConvert);
      message(t('code-to-run', {code: codeConvert}));
      return stop(ev);
    }
  , onMouseMoveModeCrop: function(ev){
      var   my = this
          , w = ev.pageX - my.cropStartX
          , h = ev.pageY - my.cropStartY ;
      if(my.scropping){
        var cropper = my.cropper();
        cropper.style.width  = w + 'px';
        cropper.style.height = h + 'px';
      }
      // console.log(x + ' / ' + y);
      return stop(ev);
    }
  /**
     * Placement des observers pour le mode crop qui permet de découper une
     * image. Ou plus exactement, de définir les coordonnées de la découpe
     */
  , set_observers_mode_crop: function(){
      window.onmousedown = $.proxy(M,'onMouseDownModeCrop');
      window.onmouseup   = $.proxy(M,'onMouseUpModeCrop');
      window.onmousemove = $.proxy(M,'onMouseMoveModeCrop');

      // console.log('<- set_observers_mode_crop');
    }
});
