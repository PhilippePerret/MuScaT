/**
 * Classe LineCode pour traiter les lignes de code
 *
 * Cette classe sert d'intermédiaire entre le code brut d'une
 * ligne et l'instance Tag qui sera créé. Elle permet, notamment de
 * tester la validité du code et/ou de créer les lignes exactes lorsque,
 * par exemple, c'est une expression régulière qui désigne les images.
 *
 */

window.LineCode = function(strline){
  this.raw_code = strline ;
  this.raw_data = null ; // Array des données épurées
  // // L'index réel de la ligne dans le fichier code initial, en comptant
  // // tout, même les lignes vides et les commentaires.
  // this.index = null ;
  // La nature (premier mot) telle qu'elle est décrite dans le fichier
  this.nature_init = null ;
  // La nature réelle, simplifiée (anglaise)
  this.nature = null ;

  this.id = function(ln){
    var reg ;
    if (reg = ln.match(/#([0-9]+)#/) ){
      return Number.parseInt(reg[1],10);
    } else if (reg = ln.match(/ id=([0-9]+) /)) {
      return Number.parseInt(reg[1],10);
    } else { return null }
  }(this.raw_code);

  // Dans tous les cas, on supprime l'éventuel identifiant pour composer
  // la propriété `line` qui servira pour voir s'il s'agit d'un commentaire,
  // d'une ligne vide ou d'un vrai tab
  this.line = this.raw_code.replace(/#([0-9]+)#/,'').trim();

}
LineCode.prototype.treate = function(){
  var   my = this
      , line = my.raw_code ;

  // Épuration de la ligne et découpage
  var ret = M.epure_and_split_raw_line(line) ;
  my.raw_data = ret.data ;
  var locked_line = ret.locked ;

  // console.log(my.raw_data);
  // console.log(my.nature_init);
  // console.log(my.nature);
  // Le premier mot doit être connu, sinon on génère une erreur
  if (my.first_word_is_known) {
    // console.log('ma nature est : ' + my.nature)
    // console.log('is image est ' + my.is_image);
    if ( my.is_image && my.src_is_regular_expression) {
      my.treate_as_image_with_reg_expression(locked_line) ;
    } else {
      tag = new Tag(my.raw_data, my.index) ;
      tag.locked = locked_line ;
      M.tags.push(tag) ;
    }
  } else {
    error(`Impossible de créer la ligne « ${my.raw_code} » (${my.index}e). La nature « ${my.nature_init} » est inconnue.`)
  }
}

// Pour traiter la ligne d'image comme une suite régulière d'images
LineCode.prototype.treate_as_image_with_reg_expression = function(locked_line){
  var my = this ;
  var dreg = this.designation.match(/^(.*)\[([0-9]+)\-([0-9]+)\](.*)$/) ;
  var bef_name    = dreg[1];
  var from_indice = Number.parseInt(dreg[2], 10);
  var to_indice   = Number.parseInt(dreg[3], 10);
  var aft_name    = dreg[4];
  var src_name, itag ;
  var dline = my.raw_data.slice() ;
  // console.log('dline = ');console.log(dline);
  for(var i = from_indice; i <= to_indice ; ++i) {
    src_name = bef_name + i + aft_name ;
    dline[1] = src_name ;
    itag = new Tag(dline.slice());
    itag.locked = locked_line ;
    M.tags.push(itag);
  }
  M.motif_lines_added = 'images fournies par expression régulière';
}


Object.defineProperties(LineCode.prototype,{
  nature_init: {
    get: function(){ return this.raw_data[0] }
  },
  nature: {
    get: function(){
      if(undefined == NATURES[this.nature_init]){
        return null;
      }
      return NATURES[this.nature_init].aka || this.nature_init
    }
  },
  designation: {
    get:function(){ return this.raw_data[1]}
  },
  first_word_is_known: {
    get: function(){
      return null != this.nature }
  },
  is_image: {
    get: function(){ return this.nature == 'score' }
  },
  src_is_regular_expression: {
    get: function() { return !!this.designation.match(/\[([0-9]+)\-([0-9]+)\]/) }
  },

  is_comment_line: {
    get: function(){return this.line.substring(0,2) == '//' ;}
  },
  is_empty_line: {
    get: function(){return this.line == ''}
  }
})
