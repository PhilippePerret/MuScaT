/**
 * Class Options
 * -------------
 * Pour la gestion des options
 */
const Options = {

  // Pour remettre toutes les options à false (utile pour les tests)
  reset: function(){
    for(var k in OPTIONS){
      if (OPTIONS[k].boolean){ OPTIONS[k].value = false;}
      else {OPTIONS[k].value = null };
    }
  }

}
