/**
 * Class NoTag qui correspond aux commentaires et aux lignes vides
 * du code source.
 *
 * Cette classe est utilisée pour la liste MuScaT.tags afin de ne pas
 * être contraint de faire des tests.
 */
 const NoTag = function(line, idx_line){
   this.line        = line.trim() ;
   this.index_line  = idx_line ;
   this.real        = false ; // pour indiquer que ce n'est pas un vrai tag
 };
 // Pour la correspondance avec la classe Tag
 NoTag.prototype.to_line = function(){
   return this.line ;
 };
Object.defineProperties(NoTag.prototype,{
  is_comment: {
    get: function(){return this.line.substring(0,2) == '//' ;}
  },
  is_empty_line: {
    get: function(){return this.line == ''}
  }
});
