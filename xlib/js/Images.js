'use strict'
/** ---------------------------------------------------------------------
  *   Pour le traitement des images
  *
*** --------------------------------------------------------------------- */
class Images {

  static loadAllImages(analyse){
    console.log("-> Images::loadAllImages (chargement des images de l'analyse '%s')", analyse.name)
    return new Promise((ok,ko) => {
      try {
        // On récupère toutes les images
        var imagesTags = []
        var imagesCount = 0
        analyse.forEachTag( tag => {
          if ( false ===  tag.isImage ) return ;
          imagesTags.push(tag)
          ++ imagesCount
        })

        var images = []
          , image
          , imageSrc
          ;
        imagesTags.forEach( tag => {
          imageSrc = `${analyse.imagesFolder}/${tag.src}`
          image = new Image()
          image.onload = (() => {
            -- imagesCount
            if ( imagesCount == 0 ) ok() // la dernière
          })
          image.onerror = Muscat.onError
          image.src = imageSrc
          tag.image = image
          tag.imageTag = `<img id="${tag.domId}" data-id="${tag.id}" class="__classes__" src="${imageSrc}" style="__css__" />`
        })
      } catch (err) { ko(err) }
    })
  }

  static treateImagesSeparationIfRequired(analyse){
    if ( analyse.hasSequenceImages ) return this.treateImagesSeparation()
    else return new Promise((ok,ko) => {ok()})
  }

  /**
    Méthode qui traite l'espacement entre les images lorsqu'une séquence
    a été trouvée.
  **/
  static treateImagesSeparation(analyse){
    console.log('-> Images::treateImagesSeparation')
    return new Promise((ok,ko) => {
      var voffset = asPixels(Opt.get('espacement-images')) ;
      var topImage ;
      analyse.forEachTag( tag => {
        if ( false == tag.isImage) return ;
        if ( undefined == topImage){
          // <= Première image (ne pas la bouger)
          topImage = Number.parseInt(tag.jqObj.offset().top,10) ;
        } else {
          tag.update('y', topImage)
          // Normalement, on n'a plus besoin de la suite :
          // tag.y = topImage ;
          // tag.jqObj.css('top', topImage + 'px');
        }
        // Pour la prochaine image
        topImage = topImage + tag.jqObj.height() + voffset;
      });
      ok();
    })
  }
  /**
    Méthode qui traite les séquences d'images dans les lignes de
    l'analyse.
    Fonctionnement général : on passe en revue toutes les lignes de code
    et dès qu'on trouve une séquence, on la traite.
  **/
  static treateSequences(analyse){
    // Pour mettre les nouvelles lignes
    this.newLines = []
    // Pour mettre le résultat du match de l'expression régulière
    var found ;
    analyse.lines.forEach(line => {
      if ( (found = this.isSequenceImage(line)) ) {
        // Pour indiquer qu'il faudra calculer la position des images
        analyse.hasSequenceImages = true ;
        this.treateSequence(found, line)
      } else {
        this.newLines.push(line)
      }
    })
    analyse.lines = this.newLines
  }

  /**
    Méthode qui traite la séquence d'image

    +Params+::
      +found+::[Array] Le résultat du match qui a checké la ligne positivement
      +line+::[String] La ligne initiale
  **/
  static treateSequence(found, line){
    const bef_name    = dreg[1]
        , from_indice = Number.parseInt(dreg[2], 10)
        , to_indice   = Number.parseInt(dreg[3], 10)
        , suffix      = dreg[4]
        , aft_name    = (dreg[5]||'')
        ;
    var src_name
      , i = Number(from_indice)
      , data_img    = CTags.parseLine(aft_name)
      , images_list = new Array()
      ;

    var left      = asPixels(Opt.get('marge-gauche') || DEFAULT_SCORE_LEFT_MARGIN) ;
    var top_first = asPixels(Opt.get('marge-haut') || DEFAULT_SCORE_TOP_MARGIN) ;
    var voffset   = asPixels(Opt.get('espacement-images')) ;

    // Il faut étudier aft_name pour voir si des données de position ou de
    // taille sont définies
    if (data_img.x) {
      // console.log('La marge-gauche est définie à ', data_img.x);
    } else {
      data_img.x = asPixels(left) ;
    }

    // Si une hauteur de départ est définie
    if (data_img.y) {
      top_first = asPixels(data_img.y) ;
    } else {
      data_img.y = top_first - voffset ; // -voffset pour éviter une condition ci-dessous
    }
    if (data_img.w) {
      // console.log("La largeur est définie à ", data_img.w);
    };
    // if (data_img.h){
    //   console.log("La hauteur est définie à ", data_img.h);
    // }
    for(i;i<=to_indice;++i){
      // Placement vertical provisoire. La vraie position sera recalculée dans
      // Page.treate_images_spaces
      data_img.y += voffset ;
      this.newLines.push(`${bef_name}${i}${suffix} ${CTags.compactLine(data_img)}`);
    };
  }

  /**
    Méthode qui vérifie si les lignes de l'analyse contiennent une
    définition de séquence d'images (avec crochets)
    +return+::[Boolean] TRUE si les lignes contiennent une
  **/
  static isSequenceImage(line){
    return line.match(this.REG_SEQUENCE)
  }

  static get REG_SEQUENCE(){
    if (undefined === this._regsequence){
      this._regsequence = /^([^\/].*)\[([0-9]+)\-([0-9]+)\]([^ ]+)( (.*))?$/
    } return this._regsequence ;
  }
}
