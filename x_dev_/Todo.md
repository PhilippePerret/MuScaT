# Todo list

* Pouvoir obtenir le code du tag sélectionné seulement
* Pouvoir ajouter des pages-breaks (il faut que ce soit des tags aussi, qu'on peut déplacer de la même manière que les autres tags - en @media screen, ils affichent le texte "page break" et en @media print, ils ajoutent un saut de page)
* Traduire les textes de la boite à outils
* Traduire tous les textes des scripts utilitaires (il faut un système spécial comme i18n, mais sans passer par là)

## TEST

* Destruction d'un tag (et annulation de destruction)
* [TEST] Options : 'vertical line offset', 600, 'horizontal line offset', 100

## Développements futurs

* Animation : peut-être une mise en évidence de la nouvelle insertion (flash) (voir à l'usure, car ça peut être fatiguant => une option)
* Faire le script 'open' pour :
  * ouvrir le dossier de l'animation sur le bureau
  * ouvrir le tags.js dans un éditeur
  * ouvrir le aspect.css dans un éditeur ?
* Mémoriser les dernières analyses, mettre la dernière en courante, comme pour scriv
* Lignes : essayer de faire des flèches avec "->" et "<-" et "<->" (en notant qu'une flèche vers le haut ou le bas est comme celles-ci). Utiliser ensuite les h et les w pour jouer sur l'angle ou utiliser plutôt une autre propriété pour la rotation
* Pouvoir entrer le titre et d'autres informations pour la première page (ou même une image de première page). Si informations textuelles, créer cette première page avec un @media qui ne rendrait pas les éléments visibles par défaut sur la page, mais les imprimeraient.
* Pouvoir changer le nombre d'opérations mémorisées par l'historique ('historique', <nombre>)
* CTRL META UP et DOWN doit permettre de descendre et remonter la ligne d'un tag quand on est dans le champ de code
* Faire les différents styles (thèmes)
* Magnétiser les lignes repères si on se trouve à moins de x de leur position (note : s'assurer que l'option pour démagnéser — désaimanter — existe).
* Voir peut-être si on doit poser des sauts de page
* Pouvoir sélectionner plusieurs objets par sélection rectangle à la souris
* Avant d'avoir la boite complète de création d'objet, on peut avoir une liste des objets possibles pour en créer un au dernier endroit cliqué (qu'il faudrait mettre en mémoire).
* Avec l'option 'aimant' (+ traduction anglaise) activée, il doit être possible de magnétiser les tags pour qu'ils s'aligent le long des lignes repère ('lines of reference') quand ils sont prochent.
* Plusieurs types de mesure (pas par thème, mais en l'indiquant dans la ligne, à commencer par la marque ronde ou la marque carrée)
* Pouvoir jouer le code progressivement (pour une sorte d'animation) : on définit où l'animation doit commencer (START) et à partir de là, les lignes s'exécutent l'une après l'autre (option('anim'|'animation')).
* Donner le code sous la forme d'un fichier zip à downloader
* Pouvoir double cliquer sur la page pour ajouter un élément quelconque (un formulaire s'ouvre, qui permet de définir l'élément)
