/**
* Locales française pour les messages
**/
if('undefined'==typeof(MSG)){MSG = {}};
Object.assign(MSG,{
  'pour':'virgule'
  , 'code lines added': "Des lignes de code ont été ajoutées (%{motif}), le nouveau code a été copié dans le presse-papier pour pouvoir être collé dans votre fichier tags.js."

  // TAGS
  , 'full code in clipboard' : "Le code complet de votre partition tagguée est copié dans le presse-papier.\n\nIl vous suffit de le coller dans votre fichier tags.js en remplaçant tout le code (p.e. sélectionnez tout l'ancien code avant de coller le nouveau)."

  // IMAGES
  , 'image-sequentielle': 'expression régulière dans l’image de la partition'

  , 'crop image ready': "La découpe de l'image est prête."

  , 'code to run': "Code à jouer en console : %{code} (copié dans le presse-papier)"

  // OPTIONS
  , 'memo guides offsets': "Dois-je mémoriser la position courante des repères ?"

  // ---------------------------------------------------------------------
  //  === ERRORS ===

  // TAGS

  , 'tags undefined': 'Il faut définir les images et les « TAGs » à poser (dans le fichier `tag.js`)'

});
