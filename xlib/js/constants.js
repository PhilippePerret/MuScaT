
const NATURES = {
    'marque':     'Description'
  // -------------------------------------------------------
  // Quand `:aka` est défini, le mot est un alias du mot principal donné
  // par cet aka.
  // L'indication :no_coor indique que le tag de ce type peut ne pas avoir
  // de x ou de y, que sa position est définie par les styles (c'est le cas
  // notamment pour les titres, compositeur, etc.)
  , 'acc':        {aka:   'chord'}
  , 'accord':     {aka:   'chord'}
  , 'ana':        {aka:   'analyst'}
  , 'analyst':    {desc:  'Auteur de l’analyse', no_coor: true}
  , 'analyste':   {aka:   'analyst'}
  , 'analysis_date':  {desc: 'Date de l’analyse', no_coor: true}
  , 'cad':        {aka:   'cadence'}
  , 'cadence':    {desc:  'Pour la marque d’une cadence'}
  , 'chord' :     {desc:  'Pour la marque d’un accord'}
  , 'chi':        {aka:   'harmony'}
  , 'chiffrage':  {aka:   'harmony'}
  , 'com':        {aka:   'composer'}
  , 'compositeur':  {aka: 'composer'}
  , 'composer':   {desc:  'Nom du compositeur', no_coor: true}
  , 'dat':        {aka:   'date'}
  , 'date':       {desc:  'Date de la composition', no_coor: true}
  , 'date_analyse': {aka: 'analysis_date'}
  , 'deg':        {aka:   'degree'}
  , 'degre':      {aka:   'degree'}
  , 'degree':     {desc:  'Pour marquer le degré d’une note dans sa gamme'}
  , 'har':        {aka:   'harmony'}
  , 'harmonie':   {aka:   'harmony'}
  , 'harmony':    {desc:  'Pour la marque d’un chiffrage harmonique'}
  , 'ima':        {aka:   'score'}
  , 'image':      {aka:   'score'}
  , 'lig':        {aka:   'line'}
  , 'ligne':      {aka:   'line'}
  , 'line':       {desc:  'Pour faire des lignes de toute sorte'}
  , 'measure':    {desc:  'Pour la marque d’un numéro de mesure'}
  , 'mes':        {aka:   'measure'}
  , 'mesure':     {aka:   'measure'}
  , 'mod':        {aka:   'modulation'}
  , 'modulation': {desc:  'Pour la marque d’une modulation dans le texte'}
  , 'opu':        {aka:   'opus'}
  , 'opus':       {desc:  'Pour indiquer l’opus', no_coor: true}
  , 'par':        {aka:   'part'}
  , 'part':       {desc:  'Pour la marque d’une partie'}
  , 'partie':     {aka:   'part'}
  , 'partition':  {aka:   'score'}
  , 'sco':        {aka:   'score'}
  , 'score':      {desc:  'Pour l’image ou les images de la partition (le mieux : une par système)'}
  , 'tex':        {aka:   'text'}
  , 'texte':      {aka:   'text'}
  , 'text':       {desc:  'Pour écrire un texte quelconque.'}
  , 'titre':      {aka:   'title'}
  , 'title':      {desc:  'Marque du titre (stylisé)', no_coor: true}
}

// Pour utiliser en nature des raccourcis qui permettent de définir
// une nature et un type, pour simplifier encore l'écriture de tag.js
NATURES_SHORTCUTS = {
    'shortcut':   'description réelle'
    // ----------------------------------------------
  , 'analysis_date':  {real: 'text', type: 'analysis_date'}
  , 'analyst':        {real: 'text', type: 'analyst'}
  , 'composer':       {real: 'text', type: 'composer'}
  , 'date':           {real: 'text', type: 'date'}
  , 'measure':        {real: 'text', type: 'measure'}
  , 'opus':           {real: 'text', type: 'opus'}
  , 'part':           {real: 'text', type: 'part'}
  , 'modulation':     {real: 'text', type: 'modulation'}
  , 'title':          {real: 'text', type: 'title'}
}

// Les options utilisables,
// cf. Options.js

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

/**
 * Valeurs par défaut pour les images
 */
const DEFAULT_SCORE_LEFT_MARGIN = 50  ;
const DEFAULT_SCORE_TOP_MARGIN  = 100 ;
const DEFAULT_SCORES_SPACES     = 0 ; // espace entre les images de système

// Dossier (dynamique) des images de l'analyse courante
const IMAGES_FOLDER = `_analyses_/${ANALYSE}/images`;
