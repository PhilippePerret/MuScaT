/**
  * Pour la gestion de la page
  */
const Page = {
  current_y: 0, // La position verticale courante
  current_x: 0, // La position horizontale courante
  prev_itag: null, // par exemple 'image'

  /**
    * Ajoute un élément quelconque dans la page (image, cadence, accord, etc.)
    * Elle s'assure en plus que les éléments en soient pas tous les uns sur
    * les autres, en leur attribuant une hauteur et un décalage gauche
    * suffisant en fonction du context.
    *
    * +itag+ Instance Tag de l'élément à mettre dans la page
    */
  // Pour ajouter un tag à la page
  // +itag+ est une instance Tag
  add: function(itag) {
    var my = this;
    // Note : avant, on faisait des corrections pour les valeurs, pour que
    // la première fois des tags ne se retrouvent pas au même endroit. On ne
    // le fait plus, ça pose trop de problèmes.
    $('section#tags').append(itag.to_html()) ;
    // Définir les propriétés (comme domObj et jqObj) et poser les
    // observateurs.
    itag.set_dom_objet();
    // console.log(itag.domObj);
    my.prev_itag = itag ;
    my.current_x = 0 + itag.x ;
    my.current_y = 0 + itag.y ;
  },

}
