# Todo list

* Quand on sélectionne un élément, il doit se sélectionner aussi dans le code
* [BUG] Quand met une mauvaise nature, ça coince alors qu'il ne devrait y avoir qu'un message d'erreur.
* Indiquer que toutes les natures (à part "partition") peuvent être désignées par leur trois premières lettres.
* [BUG] Il faut pouvoir utiliser les flèches dans le champ de code.
* Créer une ligne mobile pour aligner les éléments (options 'repère', 'repaire') (une verticale et une horizontale)
* Pouvoir mettre un commentaire en jouant `CMD Maj /`
* Pouvoir supprimer un élément (avec la touche erase)
* Faire les différents styles
* Pouvoir sélectionner plusieurs objets par sélection rectangle à la souris
* Pouvoir annuler un déplacement (garder toujours une copie du code initial ou simplement du code qui vient d'être changé — garder l'historique, puisque c'est simple)
* Avec la sélection déplaçable avec les flèches, il faudrait pouvoir utiliser ALT pour faire une copie (et la déplacer). Donc ALT => Copie de l'élément (des éléments ?) sélectionnés puis déplacement
* Pouvoir grouper des éléments pour qu'ils réagissent ensemble aux déplacements
* Parler des différents moyens de traiter une partition
  * PDF -> JPG/PNG avec `convert -antialias -quality 92 source.pdf destination.png`
  * L'ouvrir dans Aperçu et sélectionner avec CMD MAJ 4
  * L'ouvrir dans Aperçu, sélectionner avec le rectangle (Outils > Sélection Rectangle), CMD N pour créer l'image à partir de cette sélection, Enregistrer
  * L'ouvrir dans Gimp et la découper
  * Utiliser MuScaT pour générer le code convert à utiliser


## Développements futurs

* Pouvoir jouer le code progressivement (pour une sorte d'animation) : on définit où l'animation doit commencer (START) et à partir de là, les lignes s'exécutent l'une après l'autre (option('anim'|'animation')).
* Donner le code sous la forme d'un fichier zip à downloader
* Pouvoir double cliquer sur la page pour ajouter un élément quelconque (un formulaire s'ouvre, qui permet de définir l'élément)
