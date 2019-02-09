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
});
testtag.case('Les modulations', function(){
  given('Des modulations définies avec "modulation" et "mod"');
  M.reset_for_tests();
  Tags = `
  modulation G x=10 y=20
  mod D x=30 y=40
  mod D/sous-dominante x=50 y=60
  modulation E_Maj. x=70 y=80 h=200
  `;
  return relaunch_and_test(function(){
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(4);
    mod1 = tags[0] ; mod2 = tags[1] ; mod3 = tags[2] ; mod4 = tags[3] ;
    assert_classes(tags, ['tag', 'modulation']);
    assert_position(mod1, {x: 10, y: 20});
    assert_position(mod2, {x: 30, y: 40});
    assert_position(mod3, {x: 50, y: 60});
    assert_position(mod4, {x: 70, y: 80});
    assert_text(mod1, 'G');
    assert_text(mod2, 'D');
    assert_text(mod3, 'D');
    assert_text(mod3, 'sous-dominante');
    assert_text(mod4, 'E Maj.');
    // La hauteur de mod4
    // console.log(mod4);
    var line = mod4.querySelector('svg line.vertline');
    var h = asNum(line.getAttribute('y2')) - asNum(line.getAttribute('y1'));
    assert(
      200 == h,
      'La quatrième modulation a bien une hauteur de 200 pixels',
      `La 4e modulation devrait avoir une hauteur de 200 pixels (elle fait ${h}px).`
    );
  });
});

testtag.case('Les cadences', function(){
  given("Des cadences définies avec 'cadence' et 'cad'");
  M.reset_for_tests();
  Tags=`
  cadence I type=parfaite x=10 y=20 w=200
  cad V type=demi x=30 y=40
  `;
  return relaunch_and_test(function(){
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(2);
    cad1 = tags[0] ; cad2 = tags[1] ;
    assert_classes(tags, ['tag', 'cadence']);
    assert_position(cad1, {x: 10, y: 20, w: 200});
    assert_position(cad2, {x: 30, y: 40});
    assert_text(cad1, 'I');
    assert_classes(cad1, ['parfaite']);
    assert_text(cad2, 'V');
    assert_classes(cad2, ['demi']);
  });
});

testtag.case('Les numéros de mesure', function(){
  given('Des numéros de mesures définis avec "measure", "mesure", "mes"');
  M.reset_for_tests();
  Tags=`
  measure 12 x=10 y=20
  mesure 13 x=30 y=40
  mes 14 x=50 y=60 w=100 fs=23px
  `;
  return relaunch_and_test(function(){
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(3);
    mes1 = tags[0] ; mes2 = tags[1] ; mes3 = tags[2] ;
    assert_classes(tags, ['tag', 'measure']);
    assert_position(mes1, {x: 10, y: 20});
    assert_position(mes2, {x: 30, y: 40});
    assert_position(mes3, {x: 50, y: 60, w: 100});
    assert_text(mes1, '12');
    assert_text(mes2, '13');
    assert_text(mes3, '14');
    assert(
      '23px' == $(mes3).css('font-size'),
      'La 3e mesure a la bonne taille de police (23px)',
      `La 3e mesure devrait avoir une taille de police de 23px (elle vaut ${$(mes3).css('font-size')})`
    );
    var ok = true ;
    for(var i=0;i<3;++i){
      if('1px solid rgb(51, 51, 51)' != $(tags[i]).css('border')){
        ok = false ;
        break;
      }
    }
    assert(ok,
      'Toutes les mesures ont une bordure visible',
      'Les mesures devraient avoir une bordure visible'
    );
  })
});
testtag.case('Les degrés', function(){
  given('des degrés définis avec "degre", "degree", ou "deg"');
  M.reset_for_tests();
  Tags=`
  degre 3 x=10 y=20
  degree 4# x=30 y=40
  deg 6 x=50 y=60 fs=23px
  `;
  return relaunch_and_test(function(){
    var tags = document.getElementsByClassName('tag');
    assert_nombre_tags(3);
    deg1 = tags[0] ; deg2 = tags[1] ; deg3 = tags[2] ;
    assert_classes(tags, ['tag', 'degree']);
    assert_position(deg1, {x: 10, y: 20});
    assert_position(deg2, {x: 30, y: 40});
    assert_position(deg3, {x: 50, y: 60});
    assert_text(deg1, '3');
    assert_text(deg2, '4#');
    assert_text(deg3, '6');
    assert(
      '23px' == $(deg3).css('font-size'),
      'Le 3e degré a la bonne taille de police (23px)',
      `Le 3e degré devrait avoir une taille de police de 23px (elle vaut ${$(deg3).css('font-size')})`
    );
    var ok = true ;
    for(var i=0;i<3;++i){
      if('1px solid rgb(51, 51, 51)' != $(tags[i]).css('border')){
        ok = false ;
        break;
      }
    }
    assert(ok,
      'Tous les degrés ont une bordure visible',
      'Les degrés devraient avoir une bordure visible'
    );
  })
});
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
