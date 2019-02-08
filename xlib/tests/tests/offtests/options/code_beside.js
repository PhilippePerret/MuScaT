/**
 * Pour tester l'option 'code_besine'
 */
 var test = new Test('Test de l’option "code beside');

test.run = function(){

  // Ce test vérifie que le champ contenant le code source soit bien
  // visible ou invisible suivant les options demandées ('code beside')
  this.check_presence_codeField();

  // Une modification dans le champ peut modifier l'analyse
  this.changement_in_codeField_change_analyse();

};

test.check_presence_codeField = function(){

  console.log('Tags = ', Tags);

  given("Sans l'option 'code beside'");
  MuScaT.reset_for_tests();
  MuScaT.relaunch_for_tests();
  assert_not_visible('#rcolumn');

  given("Avec option 'code beside'");
  MuScaT.reset_for_tests();
  option('code beside');
  MuScaT.relaunch_for_tests();
  assert_visible('#rcolumn');

};

test.changement_in_codeField_change_analyse = function(){

  given("En ajoutant du code, dans le champ");

  given("Avec option 'code beside'");
  MuScaT.reset_for_tests();
  option('code beside');
  MuScaT.relaunch_for_tests();

  var tags = document.getElementsByClassName('tag');

  assert(
    tags.length == 0,
    'Aucun élément n’est construit au départ',
    'Aucun tag ne devrait se trouver sur la table'
  );

  // === check ===
  var tags = document.getElementsByClassName('tag');
  // L'élément a bien été fabriqué sur la table de l'analyse
  assert(
    tags.length == 1,
    'Un élément a bien été construit sur la table',
    'Un tag aurait dû être construit sur la table d’analyse'
  );
  var tag = tags[0];
  assert_position(tag, {x: 300, y: 300});
  var expect = 'Un tag ajouté dans le champ';
  assert(
    tag.innerHTML == expect,
    'le nouveau tag a le bon texte',
    `le nouveau tag n’a pas le bon texte (attendu: "${expect}", actuel: "${tag.innerHTML}")`
  );

};
