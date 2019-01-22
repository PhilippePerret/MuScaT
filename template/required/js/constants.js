
const NATURES = {
  'acc':        {aka:   'chord'},
  'accord':     {aka:   'chord'},
  'cad':        {aka:   'cadence'},
  'cadence':    {desc:  'Pour la marque d’une cadence'},
  'chord' :     {desc:  'Pour la marque d’un accord'},
  'chi':        {aka:   'harmony'},
  'chiffrage':  {aka:   'harmony'},
  'deg':        {aka:   'degree'},
  'degre':      {aka:   'degree'},
  'degree':     {desc:  'Pour marquer le degré d’une note dans sa gamme'},
  'har':        {aka:   'harmony'},
  'harmonie':   {aka:   'harmony'},
  'harmony':    {desc:  'Pour la marque d’un chiffrage harmonique'},
  'ima':        {aka:   'score'},
  'image':      {aka:   'score'},
  'lig':        {aka:   'line'},
  'ligne':      {aka:   'line'},
  'line':       {desc:  'Pour faire des lignes de toute sorte'},
  'measure':    {desc:  'Pour la marque d’un numéro de mesure'},
  'mes':        {aka:   'measure'},
  'mesure':     {aka:   'measure'},
  'mod':        {aka:   'modulation'},
  'modulation': {desc:  'Pour la marque d’une modulation dans le texte'},
  'par':        {aka:   'part'},
  'part':       {desc:  'Pour la marque d’une partie'},
  'partie':     {aka:   'part'},
  'partition':  {aka:   'score'},
  'sco':        {aka:   'score'},
  'score':      {desc:  'Pour l’image ou les images de la partition (le mieux : une par système)'},
  'tex':        {aka:   'text'},
  'texte':      {aka:   'text'},
  'text':       {desc:  'Pour écrire un texte quelconque.'}
}

// Pour utiliser en nature des raccourcis qui permettent de définir
// une nature et un type, pour simplifier encore l'écriture de tag.js
NATURES_SHORTCUTS = {
  'measure':    {real: 'text', type: 'measure'},
  'mesure':     {real: 'text', type: 'measure'},
  'part':       {real: 'text', type: 'part'},
  'partie':     {real: 'text', type: 'part'},
  'modulation': {real: 'text', type: 'modulation'}
}

// Les options utilisable
OPTIONS = {
  'code beside':        {boolean: true, value: false},
  'code à côté':        {aka: 'code beside'},
  'crop image':         {boolean: true, value: false},
  'images PNG':         {boolean: true, value: false}, // true si on veut des noms de fichier ne png (pour convert par exemple)
  'découpe image':      {aka: 'crop image'},
  'coordonates':        {boolean: true, value: false}, // afficher les coordonnées lors des déplacementss
  'repères':            {aka: 'lines of reference'},
  'reperes':            {aka: 'lines of reference'},
  'lines of reference': {boolean: true, value: false}  // si true, affiche les lignes de guide
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

// Table de hashage qui contient toutes les instances Tag.
const ITags = {} ;
