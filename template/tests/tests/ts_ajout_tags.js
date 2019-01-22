var t = new Test('Ajout de tags');
t.run = function(){

  // this.check_ligne_copied_pasted_without_same_id();

  // this.check_line_copied_pasted_after_new_empty_line();

  // this.check_new_line_at_the_end();

  // this.check_two_new_lines_at_the_end();

  this.check_line_at_the_end_and_empty_line_before();

};
t.check_ligne_copied_pasted_without_same_id = function(){
  given('Deux lignes qui ont le même ID (après un copié-collé par exemple)');

  M.reset_for_tests();
  option('code beside');
  Tags = `
acc G x=100 y=100
  `;
  M.relaunch_for_tests();

  assert(
    M.tags.length == 1,
    'Il y a un seul M.tag.',
    `Il ne devrait y avoir qu'un seul M.tag, il y en a ${M.tags.length}.`
  )

  var first_line = CF.line(1) ;
  CF.change_code_source(first_line, {update:true, add:true});

  assert(
    M.tags.length == 2,
    'Il y a deux tags (dans M.tags)',
    `Il devrait y avoir deux tags dans M.tags. Il y en a ${M.tags.length}.`
  );
  assert(
    M.tags[0].id == 0,
    'Le premier tag a l’identifiant #0',
    `Le premier tag devrait avoir l'identifiant #0, il a #${M.tags[0].id}`
  )
  assert(
    M.tags[1].id == 1,
    'Le second tag a l’identifiant #1',
    `Le second tag devrait avoir l'identifiant #1, il a #${M.tags[0].id}`
  )
}

t.check_line_copied_pasted_after_new_empty_line = function(){

  given('Une ligne copiée après une ligne vide');

  M.reset_for_tests();
  option('code beside');
  Tags = `
acc G id=0 x=100 y=100
acc G id=1 x=100 y=100
  `;
  M.relaunch_for_tests();

  assert_nombre_tags(2);

  // Note : le premier RC ci-dessous doit être gardé : il doit créer la
  // ligne vierge.
  CF.change_code_source(RC+'acc G id=0 x=100 y=100', {add:true, update:true});

  assert_nombre_tags(4, 3);

};

t.check_new_line_at_the_end = function(){

  given("Quand on ajoute un nouveau tag (copié) à la fin");
  M.reset_for_tests();
  option('code beside');
  Tags=`
acc G id=1 x=100 y=200
#3#
sco extrait-analyse/sonate-haydn-2.png id=2 x=38 y=127
#4#
`;
  M.relaunch_for_tests();
  assert_nombre_tags(4, 2);

  CF.change_code_source('acc G id=1 x=100 y=200', {add: true, update: true});

  assert_nombre_tags(5, 3);

  var newtag = M.tags[4];
  assert(
    newtag.id == 5,
    'Le nouveau tag a le bon ID (#5)',
    `Le nouveau tag devrait avoir l'ID #5, son ID est #${newtag.id}`
  );

};

t.check_two_new_lines_at_the_end = function(){

  given("Quand on ajoute deux nouveaux tags (copiés) à la fin");

  M.reset_for_tests();
  option('code beside');
  Tags=`
acc G id=1 x=100 y=200
#3#
sco extrait-analyse/sonate-haydn-2.png id=2 x=38 y=127
#4#
`;
  M.relaunch_for_tests();
  assert_nombre_tags(4, 2);

  var newcode = 'acc G id=1 x=100 y=300'+RC+'acc G id=1 x=100 y=400';
  CF.change_code_source(newcode, {add: true, update: true});

  assert_nombre_tags(6, 4);

  var newtag = M.tags[4];
  assert(
    newtag.id == 5,
    'Le premier nouveau tag a le bon ID (#5)',
    `Le premier nouveau tag devrait avoir l'ID #5, son ID est #${newtag.id}`
  );

  var newtag2 = M.tags[5];
  assert(
    newtag2.id == 6,
    'Le second nouveau tag a le bon ID (#6)',
    `Le second nouveau tag devrait avoir l'ID #6, son ID est #${newtag2.id}`
  );

};

t.check_line_at_the_end_and_empty_line_before = function(){
  given("Quand on ajoute un nouveau tag à la fin et une ligne vide un peu plus haut");

  // Préambule
  M.reset_for_tests();
  option('code beside');
  Tags=`
acc G id=1 x=100 y=200
#3#
sco extrait-analyse/sonate-haydn-2.png id=2 x=38 y=127
#4#
`;
  M.relaunch_for_tests();
  assert_nombre_tags(4, 2);

  // Le test
  new_code=`
acc G id=1 x=100 y=200

#3#
sco extrait-analyse/sonate-haydn-2.png id=2 x=38 y=127
#4#
acc G id=1 x=100 y=200
`;
  CF.change_code_source(new_code, {update: true})

  // La vérification
  assert_nombre_tags(6, 3);
  // Ce coup-ci, on vérifie vraiment chaque tag
  data_expected = {
    0: {real: true, id: 1},
    1: {real: false, id: 5},
    2: {real: false, id: 3},
    3: {real: true, id: 2},
    4: {real: false, id: 4},
    5: {real: true, id: 6},
  }
  var i = 0, len = 5, dexpect ;
  for(i;i<len;++i){
    ctag = M.tags[i];
    dexpect = data_expected[i];
    assert(
      ctag.id == dexpect.id,
      `L'identifiant du tag #${ctag.id} est bon`,
      `L'identifiant du tag #${ctag.id} devrait être ${dexpect.real}.`
    );
    assert(
      ctag.real == dexpect.real,
      `La valeur .real du tag #${ctag.id} est bonne (${ctag.real})`,
      `La valeur .real du tag #${ctag.id} devrait être ${dexpect.real}, elle est ${ctag.real}`
    );
  }

}
