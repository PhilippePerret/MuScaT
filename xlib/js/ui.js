
function  write(str) {
  $('body').append('<div>' + str + '</div>')
}

class UI {
  static get TOP_FIRST_PAGE_END(){return 1150}
  static get HEIGTH_PRINTED_PAGE(){return 1230}

  static toggle_tools(){
    if (this.tools_are_opened()){
      this.hideTools();
    } else {
      this.showTools();
    }
  }

  static tools_are_opened() {
    return this.domTools.className == 'opened';
  }

  /**
   * Méthode appelée quand on ouvre la boite à outils
  **/
  static showTools(){

    this.domTools.className = 'opened';
    var plusieurs_selections = CTags.selections.length > 1 ;

    if(plusieurs_selections){
      // On affiche les outils multiselection
      $('.multisel').show();
      // Pour tous les champs/textes qui en ont besoin
      $('.selected_count').text(CTags.selections.length);
      // Pour le verbe grouper ou dégrouper, suivant que la sélection est
      // grouper ou non
      $('#verb-grouper').text(CTags.selections[0].group ? t('Ungroup') : t('Group'));
      $('#verb-repartir').text(t('Arrange'));
    } else {
      $('.multisel').hide();
    }
  }

  static hideTools(){
    this.domTools.className = 'closed';
  }

  /**
   * Méthode pour définir l'interface en fonction de la langue
   *
   * C'est aussi cette méthode qui dessine des lignes repères pour
   * les sauts de page.
  **/
  static setUI(){
    console.log('-> UI.setUI')
    this.tableAnalyse = $('#tags');
    this.ulTags = $('ul#ultags');
    this.divULTags = $('#div-ultags');

    // Le mieux, c'est la tournure ci-dessous, où l'on met "t-<id locale>"
    // dans la classe de l'élément, qui renvoie à "<id locale>"
    ['clipboard', 'source-code', 'selected-tags', 'Open', 'the-help', 'sur', 'operations'].forEach(function(tid){
      $(`.t-${tid}`).text(t(tid));
    });
    $('#fs-alignment-legend').text(t('alignment'));
    $('#Align-the').html(t('Align the'));
    $('.Align').html(t('Align'));
    $('.to-up').text(t('to-up'));
    $('.to-down').text(t('to-down'));
    $('.to-left').text(t('to-left'));
    $('.to-right').text(t('to-right'));
    $('.the').text(t('the'));
    // Pour pouvoir répartir les scores
    $('#verb-repartir').text(t('Arrange'));

    // Les deux lignes qui indiquent les marges gauche/droite
    for(var i = 0; i < 10 ; ++i){
      var top = this.TOP_FIRST_PAGE_END + Number.parseInt(this.HEIGTH_PRINTED_PAGE * i) ; // +10 pour la marge top
      $('body').append(`<div class="page-break" style="top:${top}px;"></div>`);
    };

    // Réglage du listing de code (ULTags/LITag)
    var with_code = true // toujours, maintenant Options.get('code');
    this.tagsList[with_code?'show':'hide']();

    // $('#fs_code')[with_code?'hide':'show']();
    if(Options.get('code')){
      // On met le bouton pour obtenir le code dans le div des boutons
      $('#div-ultags-buttons').append($('#btn-code-in-clipboard'));
    }

    // Réglage des boutons de contrôle de l'animation
    this.animationController.classList[A.animated?'remove':'add']('noDisplay')

    this.observe()
  }
  static get tagsList(){
    return this._tagslist || (this._tagslist = $('div#div-ultags'))
  }
  static observe(){
    console.log("-> observe")
    this.btnStopSave.addEventListener('click', IO.toggleSaveLoop.bind(IO))
    this.btnForceSave.addEventListener('click', IO.saveTags.bind(IO))
    const btnLock = document.querySelector('button#ultags-btn-lock')
    btnLock.addEventListener('click', ULTags.lockTag.bind(ULTags))

  }

  static get btnStopSave(){
    return this._btnstopsave || (this._btnstopsave = DGet('button#btn-stop-restart-saving'))
  }
  static get btnForceSave(){
    return this._btnforcesave || (this._btnforcesave = DGet('button#btn-force-save'))
  }
  static get domTools(){
    return document.getElementById('tools')
  }

  static get animationController(){
    return this._animationcont || (this._animationcont = DGet('#anim-buttons'))
  }
}

// Permet de stopper complètement n'importe quel évènement
// Préférer stopEvent ? (si se trouve dans Dom_utils…)
window.stop = function(ev){
  ev.stopPropagation();
  ev.preventDefault();
  return false
}

window.onresize = function(ev){
  ULTags.setULHeight();
}
