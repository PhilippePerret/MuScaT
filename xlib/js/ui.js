
function  write(str) {
  $('body').append('<div>' + str + '</div>')
}

const UI = {
  toggle_tools: function(){
    if (this.tools_are_opened()){
      this.hide_tools();
    } else {
      this.show_tools();
    }
  },

  tools_are_opened: function(){
    return this.domTools.className == 'opened';
  },

  show_tools: function(){
    this.set_ui(); // pour les textes pas encore mis
    this.domTools.className = 'opened';
    if(CTags.selections.length > 1){
      // Pour tous les champs/textes qui en ont besoin
      $('.selected_count').text(CTags.selections.length);
      // Pour le verbe grouper ou dégrouper, suivant que la sélection est
      // grouper ou non
      $('#verbe_grouper').text(CTags.selections[0].group ? t('Ungroup') : t('Group'));
      // Pour 'l'alignement
      $('#fs_alignment').removeClass('undisplayed');
      // Pour le regroupement
      $('button#btn-grouper').removeClass('undisplayed');
    } else {
      $('#fs_alignment').addClass('undisplayed');
      $('button#btn-grouper').addClass('undisplayed');
    }
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
      // Le mieux, c'est la tournure ci-dessous, où l'on met "t-<id locale>"
      // dans la classe de l'élément, qui renvoie à "<id locale>"
      ['clipboard', 'source-code', 'selected-tags', 'Open', 'the-help'].forEach(function(tid){
        $(`.t-${tid}`).text(t(tid));
      });
      $('#btn-update-table').text(`${t('update-alt-enter')} (ALT ↩︎)`);
      $('#fs-alignment-legend').text(t('alignment'));
      $('#Align-the').html(t('Align the'));
      $('.Align').html(t('Align'));
      $('.to-up').text(t('to-up'));
      $('.to-down').text(t('to-down'));
      $('.to-left').text(t('to-left'));
      $('.to-right').text(t('to-right'));
      $('.the').text(t('the'));

      $('body').append(`<div class="page-break" style="top:29.7cm;">&nbsp;&nbsp;</div>`);
      $('body').append(`<div class="mark-margin" style="left:2cm;"></div>`);
      $('body').append(`<div class="mark-margin" style="left:19cm;"></div>`);
    }
};
Object.defineProperties(UI,{
  domTools: {
    get: function(){return document.getElementById('tools'); }
  }
})

// Permet de stopper complètement n'importe quel évènement
window.stop = function(ev){
  ev.stopPropagation();
  ev.preventDefault();
  return false
}
