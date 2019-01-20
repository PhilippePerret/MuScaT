/**
 * Assertions propres à la classe
 */

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
