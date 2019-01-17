/**
  * Pour la gestion de la page
  */
const CodeField = {
  // Méthode appelée quand on écrit dans le champ de code
  onKey: function(ev){
    if(ev.keyCode == 13){
      // console.log('Touche entrée');
      if (ev.altKey) {
        Page.update();
      }
    }
    if(ev.metaKey){
      console.log("Avec métakey : keyCode: " + ev.keyCode + " / charCode: " + ev.charCode);
    }
  }
}
const Page = {
  current_y: 0, // La position verticale courante
  current_x: 0, // La position horizontale courante
  prev_itag: null, // par exemple 'image'

  /**
   * Préparation de la fenêtre pour travailler avec le code
   * à côté de la partition.
   */
  set_code_beside: function(){
    $('section#rcolumn').show();
    // On place un observeur de touche sur le champ de code pour
    // avoir les raccourcis
    $('section#rcolumn textarea#codeSource').on('keyup', CodeField.onKey)
    // TODO : régler la hauteur du textarea en fonction de la fenêtre
    // On met le code dans le champ
    MuScaT.update_code();
  },

  /**
   * Méthode appelée par le bouton "Actualiser" pour prendre le code dans
   * le champ de texte et le passer à la moulinette.
   * Raccourci : ALT+ENTRÉE
   */
  update: function(){
    message('Actualisation demandée…');
    eval(MuScaT.codeField().value);
    MuScaT.load();
    message(' ');
  },

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

  /**
    * Méthode appelée quand on clique sur la page, en dehors d'un tag
    * Ça permet notamment de :
    *   . fermer la boite d'outils si elle était ouvert
    *   . tout désélectionner
    *   . mettre les coordonnées dans le presse-papier
    */
  onClickOut: function(ev){
    // console.log(ev);
    if(UI.tools_are_opened()){UI.hide_tools()}
    CTags.desectionne_all();
    this.getCoordonates(ev);
  },

  // Fonction qui affiche et met dans le presse papier les coordonnées
  // au click de souris.
  // La méthode est utilisées aussi bien pour la page en dehors des tags
  // que pour une image cliquée
  getCoordonates: function(ev){
    var x = ev.pageX ;
    var y = ev.pageY ;
    navigator.clipboard.writeText('x='+x+" y="+y);
    message("Coordonnées « x="+x+" y="+y+" » mises dans presse-papier");
  }
}
