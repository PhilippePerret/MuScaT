/**
  * Pour la gestion de la page
  */
const Page = {
  current_y: 0, // La position verticale courante
  current_x: 0, // La position horizontale courante
  prev_itag: null, // par exemple 'image'

  /**
   * Méthode appelée par le bouton "Actualiser" pour prendre le code dans
   * le champ de texte et le passer à la moulinette.
   * Raccourci : ALT+ENTRÉE
   */
  update: function(){
    message('Actualisation demandée…');
    Tags = MuScaT.codeField().value ;
    MuScaT.update();
    message(' ');
  },

  /**
   * Préparation de la fenêtre pour travailler avec le code
   * à côté de la partition.
   */
  set_code_beside: function(){
    $('section#rcolumn').show();
    // On place un observeur de touche sur le champ de code pour
    // avoir les raccourcis. Noter qu'il ne sera posé que la première fois.
    CodeField.observe();
    // TODO : régler la hauteur du textarea en fonction de la fenêtre
    // On met le code dans le champ
    MuScaT.update_code();
  },

  /**
   * Construit la ligne horizontale et la ligne verticale qui permettent
   * d'aligner des éléments.
   */
   build_lines_of_reference: function(){
     $('body').append('<div id="refline_h" class="refline"></div>');
     $('body').append('<div id="refline_v" class="refline"></div>');
     $('#refline_h').draggable({axis: 'x'});
     $('#refline_v').draggable({axis: 'y'});
   },


  /**
    * Ajoute un élément quelconque dans la page (image, cadence, accord, etc.)
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

    ITags[itag.domId] = itag ;

    // console.log(itag.domObj);
    my.prev_itag = itag ;
    my.current_x = 0 + itag.x ;
    my.current_y = 0 + itag.y ;
  },

  /**
    * Méthode appelée quand on clique sur la page, en dehors d'un tag
    * Ça permet notamment de :
    *   . fermer la boite d'outils si elle était ouvert
    *   . tout désélectionner
    *   . mettre les coordonnées dans le presse-papier
    */
  onClickOut: function(ev){
    // console.log(ev);
    if(UI.tools_are_opened()){UI.hide_tools()};
    CTags.desectionne_all();
    this.getCoordonates(ev);
  },

  // Fonction qui affiche et met dans le presse papier les coordonnées
  // au click de souris.
  // La méthode est utilisées aussi bien pour la page en dehors des tags
  // que pour une image cliquée
  getCoordonates: function(ev){
    console.log('-> getCoordonates');
    var x = ev.pageX ;
    var y = ev.pageY ;
    navigator.clipboard.writeText('x='+x+" y="+y);
    message("Coordonnées « x="+x+" y="+y+" » mises dans presse-papier");
  }
}
