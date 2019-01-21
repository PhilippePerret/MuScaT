/**
  * La class TagProv est utilisé lorsque l'update de la page, quand le
  * code a été modifié dans le champ de code. Elle permet de voir ce
  * qu'est la ligne et si elle a été modifiée.
  *
  * Noter qu'ici, contrairement à la classe `Tag`, n'importe quoi peut
  * être envoyé, même une ligne vide.
  **/

const TagProv = function(line, idx) {
  this.id             = null ; // "calculé" plus bas
  this.line           = line ;
  this.data_line      = line.split(' ');
  this.index_line     = idx ;

  // Caractéristique (note : on multiplie les définitions pour se simplifier le
  // code et l'éclaircir)
  this.is_empty_line  = false ; // par défaut : pas une ligne vide
  this.is_notagline   = false ; // par défaut : c'est un vrai tag, pas vide ou coms
  this.is_real_tag    = null ;  // sera renseigné plus bas, à partir de is_notaglien
  this.is_known       = true ; // par défaut : ce tag est connu
  this.is_comments    = false ; // par défaut, pas un commentaire

  console.log('Traitement de ligne : ', line);

  if (this.line == '' ){
    // => ligne vide + NOUVELLE LIGNE
    this.is_empty_line  = true ;
    this.is_known       = false ;
    this.is_notagline   = true ;
    console.log('-> Nouvelle ligne vide');
  } else if (this.line.match(/^#([0-9]+)#$/)){
    // => ligne vide avec identifiant
    this.is_empty_line  = true ;
    // this.is_known       = true ; // <= défaut
    console.log('-> Ligne vide connu #', this.id);
  } else if (this.line.substring(0,2) == '//'){
    this.is_notagline = true ;
    this.is_comments  = true ;
    // Commentaire connu ou non ?
    if(this.is_notagline_known){
      console.log('-> ligne de commentaire connue');
    }else{
      console.log('-> Ligne de commentaire inconnue');
    }
  } else {
    // C'est une définition de tag
    console.log('-> Un vrai tag');
    this.decompose();
    this.is_known = !!this.id ;
  }

  // Je peux le mettre ici, car c'est utilisé seulement ailleurs, après
  // l'instanciation de ce TagProv
  this.is_real_tag = !this.is_notagline ;

  // Si l'identifiant n'est pas défini, on le cherche (c'est valable seulement
  // pour les nouveaux tags et les lignes notag)
  if (!this.id){this.get_id()};

  console.log('ID de cette ligne : ', this.id);
}

// Le même que pour Tag
TagProv.prototype.decompose = Tag.prototype.decompose ;

TagProv.prototype.get_id = function(){
  if(this.is_notagline){
    // => on recherche le texte '#<id>#' et on prend l'ID
    this.id = function(ln){
                var reg = ln.match(/#([0-9]+)#/);
                return reg ? Number.parseInt(reg[1],10) : null ;
              }(this.line);
  } else {
    // Pour un vrai tag
    // Normalement, on a rien à faire, c'est défini lors de la décomposition,
    // ou c'est qu'il n'existe pas
  }

}

Object.defineProperties(TagProv.prototype,{
  is_notagline_known: {
    get: function(){ return this.line.match(/#([0-9]+)#/)}
  }
})
