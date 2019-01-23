/**
 * Assertions propres à la classe

 assert_error(<message>[, <type erreur>])
    Pour vérifier qu'une erreur a bien été produite.

 assert_nombre_tags(<nombre>[, <nombre sur table>])
    Pour vérifier le nombre de tags dans MuScaT.tags ET sur la table

assert_classes(<nodes>, <classes>) / inverse : assert_not_classes
    Pour vérifier que des éléments du DOM on la bonne classes

assert_position(<nodes>, <position>) / inverse : assert_not_position
    Pour vérifier que des éléments du DOM sont à la bonne position x et y

 */

window.assert_error = function(err_msg, err_type){
  assert(
    matchError(err_msg, err_type),
    `L'erreur « ${err_msg} » a bien été générée.`,
    `L'erreur « ${err_msg} » aurait dû être générée.`
  )
}
window.matchError = function(err_msg, err_type){
  var rg = new RegExp(err_msg, 'i')
  for(var imsg = 0, len = Errors.messages.length; imsg < len ; ++ imsg){
    dmsg = Errors.messages[imsg] ;
    if (dmsg.msg.match(rg)) {
      if(undefined == err_type || dmsg.type == err_type){return true};
    }
  };
  return false ;
}

window.assert_nombre_tags = function(nombre, nombre_sur_table){
 if(undefined==nombre_sur_table){nombre_sur_table = nombre};
 assert(
   M.tags.length == nombre,
   `Il y a bien ${nombre} tags dans MuScaT.tags`,
   `Il devrait y avoir ${nombre} tags dans MuScaT.tags, il y en a ${M.tags.length}`
 );
 var tags = document.getElementsByClassName('tag');
 assert(
   tags.length == nombre_sur_table,
   `Il y a bien ${nombre_sur_table} tags construits sur la table`,
   `Il devrait y avoir ${nombre_sur_table} tags constrits sur la table, il y en a ${tags.length}.`
 );
};
// Pour vérifier que des éléments DOM ont la bonne classe CSS
window.assert_classes = function(nodes, classes) {
 var i=0, icl=0, errs = new Array(), node, classe ;
 if(undefined == nodes[0]){nodes = [nodes]}
 for(i,len=nodes.length;i<len;++i){
   node = nodes[i];
   for(icl, lencl=classes.length;icl<lencl;++icl){
     classe = classes[icl];
     if($(node).hasClass(classe)){return};
     errs.push(`le nœud ${node.id} devrait posséder la classe "${classe}" (sa class: "${node.className}")`);
   };
   assert(
     errs.length == 0,
     `le nœud ${node.id} possède les classes attendues`,
     errs.join(', ')
   );
 };
};
// Inverse de la précédente
window.assert_not_classes = function(nodes, classes) {
 var i=0, icl=0, errs = new Array(), node, classe ;
 if(undefined == nodes[0]){nodes = [nodes]}
 for(i,len=nodes.length;i<len;++i){
   node = nodes[i];
   for(icl, lencl=classes.length;icl<lencl;++icl){
     classe = classes[icl];
     if($(node).hasClass(classe)){
       errs.push(`le nœud ${node.id} ne devrait pas posséder la classe "${classe}").`);
       break;
     };
   };
   assert(
     errs.length == 0,
     `le nœud ${node.id} ne possède pas les classes`,
     errs.join(', ')
   );
 };
};

// Pour vérifier que des éléments DOM sont bien positionnés
//
// +hposition+ doit contenir {x:, y: h:, w:} au choix
//
TEST_XPROP_TO_REAL_PROP = {
'x': 'left', 'y': 'top', 'h': 'height', 'w': 'width'
}
window.assert_position = function(nodes, hposition, tolerance){
if(undefined == tolerance){ tolerance = 0};
if(undefined == nodes[0]){nodes = [nodes]}
var i = 0, errs, valNode ;
var asserted = false ; // mis à true si effectivement on teste
for(i,len=nodes.length;i<len;++i){
  node = nodes[i];
  errs = new Array();
  for(var prop in hposition){
    expect  = hposition[prop];
    prop    = TEST_XPROP_TO_REAL_PROP[prop] || prop ;
    valNode = parseInt(node.style[prop].replace(/[a-z]/g,''));
    if(valNode >= (expect - tolerance) && valNode <= (expect + tolerance)){continue};
    errs.push(`le ${prop} de #${node.id} devrait être "${expect}", il vaut "${node.style[prop]}"`);
  }
  assert(
    errs.length == 0,
    `le node #${node.id} est bien positionné`,
    errs.join(', ')
  );
  asserted = true ;
}//fin de boucle sur les nodes
if (!asserted){
  console.error('LE TEST NE S’EST PAS FAIT : aucun node trouvé sans doute.');
  Tests.nombre_failures ++ ;
}
};
// Inverse de la précédente
window.assert_not_position = function(nodes, hposition, tolerance){
if(undefined == tolerance){ tolerance = 0};
if(undefined == nodes[0]){nodes = [nodes]};
var i = 0, errs, valNode ;
var asserted = false ; // mis à true si effectivement on teste
for(i,len=nodes.length;i<len;++i){
  node = nodes[i];
  errs = new Array();
  toutes_identiques = true ; // on suppose qu'il est à la position testée
  for(var prop in hposition){
    expect  = hposition[prop];
    prop    = TEST_XPROP_TO_REAL_PROP[prop] || prop ;
    valNode = parseInt(node.style[prop].replace(/[a-z]/g,''));
    if(valNode < (expect - tolerance) && valNode > (expect + tolerance)){
      toutes_identiques = false;
      break;
    };
  }
  if (toutes_identiques) {
    errs.push()
  }
  assert(
    toutes_identiques == false,
    `le node #${node.id} est bien positionné hors des coordonnées fournies`,
    `le node #${node.id} est situé dans les coordonnées transmises`
  );
  asserted = true ;
}//fin de boucle sur les nodes
if (!asserted){
  console.error('LE TEST NE S’EST PAS FAIT : aucun node trouvé sans doute.');
  Tests.nombre_failures ++ ;
}
};

window.assert_visible = function(domId){
assert(
  $(`${domId}`).is(':visible') == true,
  `Le champ ${domId} est bien visible`,
  `Le champ ${domId} devrait être visible`
);
};
window.assert_not_visible = function(domId){
assert(
  $(`${domId}`).is(':visible') == false,
  `Le champ ${domId} n’est pas visible`,
  `Le champ ${domId} ne devrait pas être visible`
);
};
