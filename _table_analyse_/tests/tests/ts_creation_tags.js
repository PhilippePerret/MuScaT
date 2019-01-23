/**
 * Pour tester la fabrication simple d'une analyse
 */

var t = new Test('Création du tag');

t.run = function(){

   this.check_definition_forme_normale();

   this.check_definition_forme_raccourcie();

};

t.check_definition_forme_normale = function(){
  given('Avec un code ne définissant qu’un simple texte dans sa forme normale');

  M.reset_for_tests();
  Tags = `
   text Un_simple_texte x=100 y=200
  `
  M.relaunch_for_tests();

  // On prend les tags
  var tags = document.getElementsByClassName('tag');

  assert(
    tags.length == 1,
    'Il y a un seul tag dans l’analyse',
    'Il devrait n’y avoir qu’un seul tag, il y en a ' + tags.length
  )

  var letag = tags[0] ;

  assert(
    letag.id == 'obj1',
    'le tag possède un ID de #obj1',
    `le tag devrait avoir l’ID #obj1 (il vaut ${letag.id})`
  );
  assert(
    $(letag).hasClass('drag') && $(letag).hasClass('text'),
    'le tag possède la classe tag et text',
    `le tag devrait posséder la classe tag et text (sa class: ${letag.className})`
  );
  var left = letag.style.left ;
  var top  = letag.style.top ;
  var coor = `left: ${left}; top: ${top};`
  assert(
    left == '100px' && top == '200px',
    'le positionnement du tag est bon',
    `le tag devrait être à top:200 et left:100 (il est à ${coor})`
  );
};


t.check_definition_forme_raccourcie = function(){

  given("Avec un code définissant le tag de façon raccourcie");
  M.reset_for_tests();
  option('code beside')
  Tags = `
        tex Mon_texte 200 100
  `;
  M.relaunch_for_tests();

  var tags = document.getElementsByClassName('tag');

  assert_nombre_tags(1);
  var premier = tags[0];
  var tag = M.tags[0];
  assert(
    tag.id == 1,
    "L'identifiant du premier tag est 1",
    `L'identifiant du premier tag devrait être 1, c'est ${tag.id}`
  );
  assert(
    tag.x == 100,
    "La position horizontale du tag est 100",
    `La position horizontale du tag devrait être 100, c'est ${tag.x}`
  );
  assert(
    tag.y == 200,
    "La position verticale du tag est 200",
    `La position verticale du tag devrait être 200, c'est ${tag.x}`
  );

  assert(
    premier.id == 'obj1',
    "L'identifiant du tag est bien #obj1",
    `L'identifiant du tag devrait être #obj1, c'est ${premier.id}`
  );
  assert_position(premier, {x: 100, y: 200});
  assert(
    premier.innerHTML == 'Mon texte',
    "Le texte est bien « Mon texte »",
    `Le texte du tag devrait être « Mon texte», c'est « ${premier.innerHTML} »`
  );
}