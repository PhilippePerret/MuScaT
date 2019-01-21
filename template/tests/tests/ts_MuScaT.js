

var test = new Test('Classe MuScaT') ;

test.run = function(){


  assert(
    'object' == typeof(M.tags),
    'MuScaT connait la propriété `tags`',
    'MuScaT devrait avoir une propriété `tags`'
  );

  given('Correspondance entre M.tags et M.lines');
  assert(
    M.lines.length > 2 && M.tags.length > 2,
    "Il existe plus de 2 tags",
    "Il devrait y avoir plus de 2 tags dans cette analyse (pour faire le test)"
  );

  assert(
    M.lines.length == M.tags.length,
    'M.lines et M.tags ont le même nombre de tags',
    `M.lines devraient avoir le même nombre de tags. Or M.lines a ${M.lines.length} tags et M.tags possède ${M.tags.length} tags.`
  );

  for(var i=0, len=M.tags.length; i<len; ++i){
    itag = M.tags[i]; // Tag ou NoTag
    line = M.lines[i];

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
    // La ligne doit être la bonne
    assert(
      itag.to_line() == M.lines[i],
      `La ligne du Tag dans M.lines correspond à la ligne du tag`,
      `La ligne du Tag dans M.lines devrait correspondre (attendu: "${itag.to_line()}", actuel: "${M.lines[i]}")`
    );
    assert(
      itag.real == true,
      'Le tag est un vrai tag',
      'Le tag devrait être un vrai tag…'
    )
  }

}
