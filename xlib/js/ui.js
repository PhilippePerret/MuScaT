
function  write(str) {
  $('body').append('<div>' + str + '</div>')
}

const UI = {
    first: 'virgule'
  , TOP_FIRST_PAGE_END: 1150
  , HEIGTH_PRINTED_PAGE: 1230

  , codeField: null           // {jQuery} le champ de code
  , tableAnalyse: null        // {jQuery} La section #tags

  , toggle_tools: function(){
      if (this.tools_are_opened()){
        this.hide_tools();
      } else {
        this.show_tools();
      }
    }

    /**
     * Méthode appelée par la touche tabulation, qui passe le focus
     * du champ de code (s'il est ouvert) à la table d'analyse.
     *
     */
  , tab_focus: function(){
      if (!this.codeField_is_opened){return};
      var cFieldFocused = this.codeField.is(':focus') ;
      this.codeField[cFieldFocused?'blur':'focus']();
      this.tableAnalyse[cFieldFocused?'focus':'blur']();
    }
  , tools_are_opened: function(){
      return this.domTools.className == 'opened';
    }

  , show_tools: function(){
      this.set_ui(); // pour les textes pas encore mis
      this.domTools.className = 'opened';
      var group_vis = ['#fs_alignment','#btn-grouper','#btn-repartir'];
      var plusieurs_selections = CTags.selections.length > 1 ;
      if(plusieurs_selections){
        // Pour tous les champs/textes qui en ont besoin
        $('.selected_count').text(CTags.selections.length);
        // Pour le verbe grouper ou dégrouper, suivant que la sélection est
        // grouper ou non
        $('#verb-grouper').text(CTags.selections[0].group ? t('Ungroup') : t('Group'));
        $('#verb-repartir').text(t('Arrange'));

      };
      var method = plusieurs_selections ? 'removeClass' : 'addClass' ;
      group_vis.forEach(function(o){$(o)[method]('undisplayed')});
      // $('#selecteds_count').innerHTML = CTags.selections.length;
    }

  , hide_tools: function(){
      this.domTools.className = 'closed';
    }

    /**
     * Méthode pour définir l'interface en fonction de la langue
     *
     * C'est aussi cette méthode qui dessine des lignes repères pour
     * les sauts de page.
     */
  , set_ui: function(){
      this.codeField    = $('#codeSource');
      this.tableAnalyse = $('#tags');
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
    }
};
Object.defineProperties(UI,{
    domTools: {
      get: function(){return document.getElementById('tools'); }
    }
  , codeField_is_opened: {
    get: function(){return !!$('#codeSource').length;}
  }
})

// Permet de stopper complètement n'importe quel évènement
window.stop = function(ev){
  ev.stopPropagation();
  ev.preventDefault();
  return false
}
