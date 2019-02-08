/**
 * Essai d'un test avec la nouvelle forme (promesses)
 */

var test = new Test("Essai avec promesse");

test.run = function(){
  this.un_simple_assert();
  this.une_redefinition_des_tags_avec_rechargement();
};
test.un_simple_assert = function(){
  assert(
    true,
    'Je suis bien passé par là.',
    "J'aurais dû passer par là."
  );
};

test.une_redefinition_des_tags_avec_rechargement = function(){
  console.log('-> une_redefinition_des_tags_avec_rechargement');
  M.reset_for_tests();
  option('code');
  Tags = `
  acc C_maj x=100 y=100
  `;
  M.relaunch_for_tests()
    .then(function(){
      console.log("Je teste la suite");
      assert_nombre_tags(1);
    });
  console.log('<- une_redefinition_des_tags_avec_rechargement');
};
