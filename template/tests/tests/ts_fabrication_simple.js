/**
 * Pour tester la fabrication simple d'une analyse
 */

 new Test('fabrication_simple').run = function(){

   given('Avec un code ne définissant qu’un seul texte');

   Tags = `
    text Un_simple_texte x=100 y=200
   `
   MuScaT.load();

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

 }
