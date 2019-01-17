
const NATURES = {
  'accord':     {aka:   'chord'},
  'cadence':    {desc:  'Pour la marque d’une cadence'},
  'chord' :     {desc:  'Pour la marque d’un accord'},
  'chiffrage':  {aka:   'harmony'},
  'degre':      {aka:   'degree'},
  'degree':     {desc:  'Pour marquer le degré d’une note dans sa gamme'},
  'harmonie':   {aka:   'harmony'},
  'harmony':    {desc:  'Pour la marque d’un chiffrage harmonique'},
  'image':      {aka:   'score'},
  'ligne':      {aka:   'line'},
  'line':       {desc:  'Pour faire des lignes de toute sorte'},
  'measure':    {desc:  'Pour la marque d’un numéro de mesure'},
  'mesure':     {aka:   'measure'},
  'part':       {desc:  'Pour la marque d’une partie'},
  'partie':     {aka:   'part'},
  'score':      {desc:  'Pour l’image ou les images de la partition (le mieux : une par système)'},
  'texte':      {aka:   'text'},
  'text':       {desc:  'Pour écrire un texte quelconque.'}
}

// Pour utiliser en nature des raccourcis qui permettent de définir
// une nature et un type, pour simplifier encore l'écriture de tag.js
NATURES_SHORTCUTS = {
  'measure':  {real: 'text', type: 'measure'},
  'mesure':   {real: 'text', type: 'measure'},
  'part':     {real: 'text', type: 'part'},
  'partie':   {real: 'text', type: 'part'}
}

// Définition d'un retour chariot
const RC = `
`


// Table de correspondance pour trouver la vraie valeur pour les
// types de texte (qui peuvent être donnés dans une autre langue ou
// un diminutif)
const TABLECOR_TYPES_TEXT = {
  'partie': 'part',
  'mesure': 'measure'
}

// La valeur (genre) de ligne peut être donné de différentes façons.
const TABLECOR_LIGNE_TYPE_GRAPH_TO_LETTER = {
  '|_|':  'U',
  '|-|':  'N',
  '|_':   'L',
  '|-':   'K',
  '_|':   'V',
  '-|':   '^'
}
// Table de correspondance entre le type de ligne indiquée et
// sa valeur réelle (souvent au niveau de la langue française)
const TABLECOR_TYPES_LINE = {

}
