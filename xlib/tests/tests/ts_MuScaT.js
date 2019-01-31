// AJOUTER AUX TESTS :
// Deux lignes avec le même id (quand l'user fait un copié-collé) => Il
// faut créer un nouvel objet (et même le déplacer si nécessaire)

var test = new Test('Classe MuScaT') ;

test.run = function(){

  MuScaT.reset_for_tests();

  option('code beside');
  Tags = `
tex Test_pour_classe_MuScaT x=100 y=200
mod C_Maj x=100 y=300
acc G x=200 y= 300
  `;

  M.relaunch_for_tests();

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

  assert(
    'object' == typeof(M.tags),
    'MuScaT connait la propriété `tags`',
    'MuScaT devrait avoir une propriété `tags`'
  );

  for(var i=0, len=M.tags.length; i<len; ++i){
    itag = M.tags[i]; // Tag ou NoTag

    // console.log(itag);

    assert(
      'object' == typeof(itag),
      `Le tag ${i} est bien un object`,
      `Le tag ${i} devrait être un objet`
    );
    // L'index ligne doit correspondre à son rang dans la liste
    assert(
      itag.index_line == i,
      `L'index ligne du tag ${i} correspond à son rang dans tags`,
      `L'index ligne du tag ${i} devrait correspondre à son rang dans tags (actuel: ${itag.index_line})`
    );
    assert(
      itag.real == true,
      'Le tag est un vrai tag',
      'Le tag devrait être un vrai tag…'
    )
  }

}
