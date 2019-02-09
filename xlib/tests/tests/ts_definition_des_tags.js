/**
 * Ce test permet de vérifier que tous les éléments (tags) peuvent
 * être créés conformément à leur définition.
 */
var testtag = new Test('définition de tous les types de TAG');

testtag.case('Les Partitions', function(){
  given('Des partitions définies avec `score`, `partition` et `sco`')
  M.reset_for_tests();
  Tags = `
  score image-1.png x=122 y=100
  partition image-2.png x=124 y=151
  sco image-3.png x=128 y=167
  `;
  return relaunch_and_test(function(){
    // On prend les tags
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(3);
    img1 = tags[0] ; img2 = tags[1] ; img3 = tags[2] ;

    // La classe css est bonne
    assert_classes(tags, ['tag', 'score']);
    assert_position(img1, {x: 122, y: 100});
    assert_position(img2, {x: 124, y: 151});
    assert_position(img3, {x: 128, y: 167});
  });
});

testtag.case('Les Accords', function(){
  given('Des accords définis avec "acc", "chord" ou "accord"');
  M.reset_for_tests();
  assert_nombre_tags(0);
  Tags=`
  chord C x=10 y=100
  accord Ré_Maj. x=20 y=200
  acc E_min x=30 y=300
  `;
  return relaunch_and_test(function(){
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(3);
    acc1 = tags[0] ; acc2 = tags[1] ; acc3 = tags[2] ;
    // La classe css est bonne
    assert_classes(tags, ['tag', 'chord']);
    assert_position(acc1, {x: 10, y: 100});
    assert_position(acc2, {x: 20, y: 200});
    assert_position(acc3, {x: 30, y: 300});
    assert_text(acc1, 'C');
    assert_text(acc2, 'Ré Maj.');
    assert_text(acc3, 'E min');
  });
})

testtag.case('Les chiffrages', function(){
  given('Des harmonies définies avec "chiffrage", "harmonie", "harmony", "har"');
  M.reset_for_tests();
  Tags=`
  chiffrage I* x=10 y=20
  harmonie II** x=30 y=40
  harmony V7 x=50 y=60
  har VIIØ x=70 y=80
  `;
  return relaunch_and_test(function(){
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(4);
    har1 = tags[0] ; har2 = tags[1] ; har3 = tags[2] ; har4 = tags[3] ;
    // La classe css est bonne
    assert_classes(tags, ['tag', 'harmony']);
    assert_position(har1, {x: 10, y: 20});
    assert_position(har2, {x: 30, y: 40});
    assert_position(har3, {x: 50, y: 60});
    assert_position(har4, {x: 70, y: 80});
    assert_text(har1, 'I*');
    assert_text(har2, 'II**');
    assert_text(har3, 'V7');
    assert_text(har4, 'VIIØ');
  });
})

//
// tag.check_parties = function(){
//   given('Des parties définies avec `part`, `partie` et `par`');
//
//   Tags = `
//    partie Une_partie_partie x=100 y=200
//    *part    Une_partie_part  x=150 y=200
//    *par     Une_partie_par   x=200 y=200
//   `;
//   MuScaT.load();
//
//   // On prend les tags
//   var tags = document.getElementsByClassName('tag');
//
//
//   diffs = [];
//   assert(
//     tags.length == 3,
//     'les 3 parties sont inscrites',
//     msg_failure('nombre de tags de partie', 3, tags.length)
//   );
//   // La classe css est bonne
//   assert_classes(tags, ['tag', 'part']);
//
//   diffs = new Array();
//   var titles = ['Une partie partie', 'Une partie part', 'Une partie par'];
//   for(i=0;i<3;++i){
//     var actual = tags[i].innerHTML ;
//     var expect = titles[i] ;
//     if(actual != expect){push_failure(diffs,`le titre du tag ${i}`,expect, actual)}
//   }
//   assert(
//     diffs.length == 0,
//     'les 3 parties possèdent un nom correct',
//     `les 3 parties devraient posséder leur titre correct (${diffs})`
//   );
//
//   // En plus les deux dernières parties devraient être lockées, pas la première
//   diffs = new Array();
//   if($(tags[0]).hasClass('locked')){push_failure(diffs, 'verrou du 1er titre','false','true')}
//   if(!$(tags[1]).hasClass('locked')){push_failure(diffs, 'verrou du 2e titre','true','false')}
//   if(!$(tags[2]).hasClass('locked')){push_failure(diffs, 'verrou du 3e titre','true','false')}
//   assert(
//     diffs.length == 0,
//     'les 2 derniers titres de parties sont bien verrouillés',
//     `les 2 derniers titres de parties devraient être verrouillés (${diffs})`
//   );
//
//   // Dans l'instance
//   diffs = new Array();
//   if(CTags[1].locked){push_failure(diffs, 'locked de la 1ère instance', false, true)}
//   if(!CTags[2].locked){push_failure(diffs, 'locked de la 2e instance', true, false)}
//   if(!CTags[3].locked){push_failure(diffs, 'locked de la 3e instance', true, false)}
//   assert(
//     diffs.length == 0,
//     'les instances ont leur bonne marque de verrou (locked)',
//     `la propriété locked des instances est mal réglée (${diffs})`
//   );
// };
//
// tag.check_accords = function(){
//   var tags, dfs, i ;
//   given('Des accords définis avec `accord`, `chord` ou `acc`');
//
//   var Tags = `
//   // Un commentaire
//   accord D x=100 y=120
//   chord  SOL_min x=120 y=120
//   // Un autre commentaire
//   acc    DØ x=140 y=120
//   `;
//   MuScaT.load();
//   var tags = document.getElementsByClassName('tag');
//
//   assert(
//     tags.length == 3,
//     '3 tags ont été créés',
//     msg_failure('le nombre de tags', 3, tags.length)
//   );
//
//   assert_classes(tags, ['tag', 'chord']);
//   assert_position(tags, {y:120});
//   assert_position(tags[0], {x: 100});
//   assert_position(tags[1], {x: 120});
//   assert_position(tags[2], {x: 140});
//
// }
//
// tag.check_harmony = function(){
//   var tags, i ;
//   given('Des chiffrages définis avec `harmony`, `harmonie` et `chiffrage`');
//
//   Tags = `
//
//   `;
// }
