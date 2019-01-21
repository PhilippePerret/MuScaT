/**
 * Class NoTag qui correspond aux commentaires et aux lignes vides
 * du code source.
 *
 * Cette classe est utilisée pour la liste MuScaT.tags afin de ne pas
 * être contraint de faire des tests.
 */
const TagNot = function(line, idx_line){
  this.line        = line.trim() ;
  this.index_line  = idx_line ;
  this.real        = false ; // pour indiquer que ce n'est pas un vrai tag
  // On prend l'identifiant dans la ligne ou on l'incrémente
  this.id = function(ln){
              var reg = ln.match(/#([0-9]+)#/);
              return reg ? Number.parseInt(reg[1],10) : ++window.last_tag_id ;
            }(this.line) ;
  // Dans tous les cas, on supprime l'éventuel identifiant
  this.line = this.line.replace(/#([0-9]+)#/,'').trim();
 };
 // Pour la correspondance avec la classe Tag
 TagNot.prototype.to_line = function(){
   return (this.line + ` #${this.id}#`).trim() ;
 };
Object.defineProperties(TagNot.prototype,{
  is_comment: {
    get: function(){return this.line.substring(0,2) == '//' ;}
  },
  is_empty_line: {
    get: function(){return this.line == ''}
  }
});
