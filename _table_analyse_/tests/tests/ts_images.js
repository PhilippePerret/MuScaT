
var test = new Test('Création des images');
test.current_itest = 0 ;

test.suite_tests = [
    'un_rang_dimages_est_cree_normalement'
  , 'avec_taille_sans_unite'
  , 'avec_taille_et_unite'
  , 'avec_taille_en_pourcentage'
];

test.run_async = function() {
  var tname = this.suite_tests[this.current_itest++];
  if(tname){
    // On joue le test
    test[`before_${tname}`]();
  } else {
    // On finit
    Tests.next();
  }
};

// Méthode qui attend, pour lancer le test +fn+, que les images
// soient toutes chargées
test.wait_for_images = function(fn){
  var unloadeds = $('#tags img').length ;
  $('#tags img').on('load', function(){
    -- unloadeds ;
    if(!unloadeds){fn()};
  });
};

test.before_un_rang_dimages_est_cree_normalement = function() {
  // Préambule
  M.reset_for_tests();
  option('code', 'espacement images', 100);
  Tags=`
  sco tests/image-[1-3].png
  `;
  // Test
  M.relaunch_for_tests();
  // Il faut attendre que les images soient chargées et placées
  this.wait_for_images(test.un_rang_dimages_est_cree_normalement);
};
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
  test.run_async();
};

test.before_avec_taille_sans_unite = function(){
  given("Avec une image-sequence définissant une taille sans unité");
  M.reset_for_tests();
  option('code', 'espacement images', 50);
  Tags=`
  sco tests/image-[1-2].png w=200
  `;
  M.relaunch_for_tests();
  this.wait_for_images(test.avec_taille_sans_unite);
};
test.avec_taille_sans_unite = function(){
  var tags = assert_nombre_tags(2)
  var widths = [];
  for(var i=0;i<2;++i){widths.push(M.tags[i].jqObj.width())};
  // var widths_par_dom = [];
  // for(var i=0;i<2;++i){widths_par_dom.push(tags[i].style.width)};
  // console.log("widths_par_dom:", widths_par_dom);
  // console.log("widths par jquery:", widths);
  assert(
    widths[0] == 200 && widths[1] == 200
    , "La taille des images a bien été mise à 200px"
    , `La taille des images aurait dû être mise à 200px, elle est de ${widths.join(', ')}`
  );
  test.run_async();
};

test.before_avec_taille_et_unite = function(){
  given("Avec une image-séquence définissant une taille avec unité");
  M.reset_for_tests();
  option('code', 'espacement images', 50);
  Tags=`
  sco tests/image-[1-3].png w=20cm
  `;
  M.relaunch_for_tests();
  this.wait_for_images(test.avec_taille_et_unite);
};
test.avec_taille_et_unite = function(){
  var tags = assert_nombre_tags(3);
  var widths = [];
  for(var i=0;i<2;++i){widths.push(M.tags[i].domObj.style.width)};
  assert(
    widths[0] == '20cm' && widths[1] == '20cm'
    , "La taille des images a bien été mise à '20cm'"
    , `La taille des images aurait dû être mise à '20cm', elle est de ${widths.join(', ')}`
  );
  test.run_async();
};

test.before_avec_taille_en_pourcentage = function(){
  given("Avec une image-séquence définissant une taille en pourcentage");
  M.reset_for_tests();
  option('code', 'espacement images', 50);
  Tags=`
  sco tests/image-[1-2].png w=40%
  `;
  M.relaunch_for_tests();
  this.wait_for_images(test.avec_taille_en_pourcentage);
};
test.avec_taille_en_pourcentage = function(){
  var tags = assert_nombre_tags(2);
  var widths = [];
  for(var i=0;i<2;++i){widths.push(M.tags[i].domObj.style.width)};
  assert(
    widths[0] == '40%' && widths[1] == '40%'
    , "La taille des images a bien été mise à '40%'"
    , `La taille des images aurait dû être mise à '40%', elle est de ${widths.join(', ')}`
  );
  test.run_async();
};

// given("Avec une image-sequence définissant une position x et y");
// pending('À faire');
//
