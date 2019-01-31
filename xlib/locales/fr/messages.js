/**
* Locales française pour les messages
**/
if('undefined'==typeof(MSG)){MSG = {}};
Object.assign(MSG,{
  'pour':'virgule'

  // === DEMANDES ===

  , 'choose-litag': "Vous devez choisir le tag à %{operation} dans la liste."
  , 'should-destroy': 'Dois-je vraiment détruire %{what}'

  // === INFORMATION ===
  , 'code-lines-added': "Des lignes de code ont été ajoutées (%{motif}), le nouveau code a été copié dans le presse-papier pour pouvoir être collé dans votre fichier _tags_.js."

  // TAGS
  , 'full-code-in-clipboard' : "Le code complet de votre partition tagguée est copié dans le presse-papier.\n\nIl vous suffit de le coller dans votre fichier _tags_.js en remplaçant tout le code (p.e. sélectionnez tout l'ancien code avant de coller le nouveau)."
  , 'code-lines-in-clipboard': "Le code des lignes des tags sélectionnés a été mis dans le presse-papier pour un collé."

  // IMAGES
  , 'image-sequentielle': 'expression régulière dans l’image de la partition'

  , 'crop-image-ready': "La découpe de l'image est prête."

  , 'code-to-run': "Code à jouer en console : %{code} (copié dans le presse-papier)"

  // OPTIONS
  , 'memo-guides-offsets': "Dois-je mémoriser la position courante des repères ?"

  // ANIMATION
  , 'press-space-animation': "Presser la barre espace pour poursuivre l'animation"
  , 'fin-anim': 'Fin de l’animation'

  // ---------------------------------------------------------------------
  //  === ERRORS ===

  // TAGS

  , 'tags-undefined': 'Il faut définir les images et les « TAGs » à poser (dans le fichier `tag.js`)'

  , 'no-w-pour-modulation': 'La largeur d’une modulation ne se modifie pas. Utiliser `h` pour modifier la hauteur de sa ligne verticale.'
  , 'no-h-pour-cadence':    "La hauteur d'une cadence ne se modifie pas. Utiliser `w` pour modifier la longueur de son trait."

  , 'loading-module-failed': "Navré, mais le chargement du module « %{name} » a échoué…"
});
