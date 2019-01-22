
var test = new Test('Création des images');

test.run = function() {

  this.un_rang_dimages_est_cree_normalement();

};

test.un_rang_dimages_est_cree_normalement = function(){

  given("Avec un code définissant un rang d'images");

  // Préambule
  M.reset_for_tests();
  option('code');
  Tags=`
  sco tests/image-[1-3].png
  `;

  // Test
  M.relaunch_for_tests();

  // Vérification
  var tags = document.getElementsByClassName('tag');

  assert_nombre_tags(3);

  assert(
    $('#tags img').length == 3,
    "Ce sont bien 3 images qui ont été créées",
    `3 images auraient dû être créées (il y en a ${$('#tags img').length})`
  );

}
