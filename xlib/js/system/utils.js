
// Reçoit une valeur qui peut être un string ou un nombre et retourne une
// dimension (ajoute 'px' si aucune unité n'est précisée)
// Si ce n'est pas un nombre qui est fourni ou si l'unité est mauvaise,
// on génère une erreur fatale.
function asPixels(value){
  if('number'==typeof(value)){return value
  } else if (value.match(/^[0-9]+$/)) {
    return Number.parseInt(value,10);
  } else if (value.match(/^[0-9.]+$/)) {
    return Number.parseFloat(value,10);
  } else if (rg = value.match(/^([0-9]+)px$/)) {
    return Number.parseInt(rg[1],10)
  } else if (rg = value.match(/^([0-9.]+)px$/)) {
    return Number.parseFloat(rg[1],10);
  } else {
    throw(t('pixels-required', {value: value}));
  }
}

function isKnown(value){
  return 'undefined' != typeof(value); // est-ce que ça suffit ?
}
