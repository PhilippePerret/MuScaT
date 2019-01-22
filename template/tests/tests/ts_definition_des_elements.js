/**
 * Ce test permet de vérifier que tous les éléments (tags) peuvent
 * être créés conformément à leur définition.
 */
var tag = new Test('définition des types de TAG');

tag.run = function(){

   // === PARTITIONS ==
   this.check_partitions();

   // === PARTIE ===
   this.check_parties();

   // === ACCORD ===
   this.check_accords();

 }


tag.check_partitions = function(){
  given('Deux partitions définies avec `score` ou `partition`')

  Tags = `
  score tests/image-1.png x=122 y=100
  partition tests/image-2.png x=124 y=151
  `;
  MuScaT.load();
  // On prend les tags
  var tags = document.getElementsByClassName('tag');

  assert(
    tags.length == 2,
    'il y a deux éléments sur le tableau',
    `il devrait y avoir 2 tags (il y en a ${tags.length})`
  )

  img1 = tags[0] ; img2 = tags[1] ;

  // La classe css est bonne
  assert_classes(tags, ['tag', 'score']);
  assert_position(tags[0], {x: 122, y: 100});
  assert_position(tags[1], {x: 124, y: 151});

};

tag.check_parties = function(){
  given('Des parties définies avec `part`, `partie` et `par`');

  Tags = `
   partie Une_partie_partie x=100 y=200
   *part    Une_partie_part  x=150 y=200
   *par     Une_partie_par   x=200 y=200
  `;
  MuScaT.load();

  // On prend les tags
  var tags = document.getElementsByClassName('tag');


  diffs = [];
  assert(
    tags.length == 3,
    'les 3 parties sont inscrites',
    msg_failure('nombre de tags de partie', 3, tags.length)
  );
  // La classe css est bonne
  assert_classes(tags, ['tag', 'part']);

  diffs = new Array();
  var titles = ['Une partie partie', 'Une partie part', 'Une partie par'];
  for(i=0;i<3;++i){
    var actual = tags[i].innerHTML ;
    var expect = titles[i] ;
    if(actual != expect){push_failure(diffs,`le titre du tag ${i}`,expect, actual)}
  }
  assert(
    diffs.length == 0,
    'les 3 parties possèdent un nom correct',
    `les 3 parties devraient posséder leur titre correct (${diffs})`
  );

  // En plus les deux dernières parties devraient être lockées, pas la première
  diffs = new Array();
  if($(tags[0]).hasClass('locked')){push_failure(diffs, 'verrou du 1er titre','false','true')}
  if(!$(tags[1]).hasClass('locked')){push_failure(diffs, 'verrou du 2e titre','true','false')}
  if(!$(tags[2]).hasClass('locked')){push_failure(diffs, 'verrou du 3e titre','true','false')}
  assert(
    diffs.length == 0,
    'les 2 derniers titres de parties sont bien verrouillés',
    `les 2 derniers titres de parties devraient être verrouillés (${diffs})`
  );
  // Dans l'instance
  diffs = new Array();
  if(ITags['obj0'].locked){push_failure(diffs, 'locked de la 1ère instance', false, true)}
  if(!ITags['obj1'].locked){push_failure(diffs, 'locked de la 2e instance', true, false)}
  if(!ITags['obj2'].locked){push_failure(diffs, 'locked de la 3e instance', true, false)}
  assert(
    diffs.length == 0,
    'les instances ont leur bonne marque de verrou (locked)',
    `la propriété locked des instances est mal réglée (${diffs})`
  );
};

tag.check_accords = function(){
  var tags, dfs, i ;
  given('Des accords définis avec `accord`, `chord` ou `acc`');

  Tags = `
  // Un commentaire
  accord D x=100 y=120
  chord  SOL_min x=120 y=120
  // Un autre commentaire
  acc    DØ x=140 y=120
  `;
  MuScaT.load();
  var tags = document.getElementsByClassName('tag');

  assert(
    tags.length == 3,
    '3 tags ont été créés',
    msg_failure('le nombre de tags', 3, tags.length)
  );

  assert_classes(tags, ['tag', 'chord']);
  assert_position(tags, {y:120});
  assert_position(tags[0], {x: 100});
  assert_position(tags[1], {x: 120});
  assert_position(tags[2], {x: 140});

}

tag.check_harmony = function(){
  var tags, i ;
  given('Des chiffrages définis avec `harmony`, `harmonie` et `chiffrage`');

  Tags = `
  
  `;
}
