/**
 * Classe gérant les groupes de tags
 */
const TagsGroups = {
  last_group_id:  0,
  groups:         {},
}
const TagsGroup = function() {
  this.id   = ++ TagsGroups.last_group_id ;
  this.tags = new Array();
  // On rentre cette instance dans le groupe des groupes
  TagsGroups.groups[this.id] = this ;
}

// Pour faire tourner une méthode sur tous les tags d'un group
TagsGroup.prototype.forEachTag = function(method){
  var my = this ;
  for(var tg of my.tags){method(tg)};
}
// Pour retirer une tag du group
TagsGroup.prototype.remove_tag = function(tag){
  var my = this ;
  var newtags = new Array();
  for(var tg of my.tags){
    if(tg.id == tag.id){continue}
    else{newtags.push(tg)}
  }
  my.tags = newtags ;
};
/**
 * Pour dégrouper les éléments
 */
TagsGroup.prototype.ungroup = function(){
  var my = this, tag ;
  my.forEachTag(function(tag){tag.ungroup()});
  delete TagsGroups.groups[my.id];
};
