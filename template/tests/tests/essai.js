

var test = new Test('essai') ;

test.run = function(){

  // Test de l'existence d'un objet
  assert(
    'undefined' != typeof(MuScaT),
    'L’objet MuScaT existe.',
    'L’object MuScaT devrait exister…'
  )

  // Test d'une fonction
  assert(
    'function' == typeof (MuScaT.load),
    'MuScaT répond à la méthode `load`',
    'MuScaT devrait répondre à la méthode `load`'
  )


}
