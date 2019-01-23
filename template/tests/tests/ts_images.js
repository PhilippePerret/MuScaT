
var test = new Test('Création des images');

test.run = function() {
  // Préambule
  M.reset_for_tests();
  option('code', 'espacement images', 100);
  Tags=`
  sco tests/image-[1-3].png
  `;

  // Test
  M.relaunch_for_tests();
  // Il faut attendre que les images soient chargées et placées
  this.wait_to_check_images();
};
test.run_when_ready = function() {
  this.un_rang_dimages_est_cree_normalement();
}
test.wait_to_check_images = function(){
  var unloadeds = $('#tags img').length ;
  $('#tags img').on('load', function(){
    -- unloadeds ;
    if(!unloadeds){test.run_when_ready()};
  });
},

test.un_rang_dimages_est_cree_normalement = function(){

  given("Avec un code définissant un rang d'images");

  // Vérification
  var tags = assert_nombre_tags(3);

  assert(
    $('#tags img').length == 3,
    "Ce sont bien 3 images qui ont été créées",
    `3 images auraient dû être créées (il y en a ${$('#tags img').length})`
  );
  var pos = [];
  for(var i=0;i<3;++i){pos.push(tags[i].style.top)};
  assert(
    pos[0] == '100px' &&
    pos[1] == '419px' &&
    pos[2] == '738px'
    , "Les 3 images sont bien placées"
    , `Les 3 images ne sont pas bien placées (${pos.join(', ')} au lieu de 100, 419, 738)`
  );

  given("Avec une image-sequence définissant une taille sans unité");
  pending('À faire');

  given("Avec une image-séquence définissant une taille en pourcentage");
  pending('À faire');

  given("Avec une image-sequence définissant une position x et y");
  pending('À faire');
}
