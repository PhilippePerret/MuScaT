# Todo list

* [BUG] Le réglage de la hauteur des modulations ne fonctionne pas
* Remettre les tests en place (peut-être faire chaque fois une copie du dossier test à la racine pour ne pas avoir à la voir dans le dossier principal)
* [TEST] Options : 'vertical line offset', 600, 'horizontal line offset', 100
* Modifier les scripts pour tenir compte des modifications
* Mettre en place le dégroupement des tags
* Mettre en place le groupage par META-G
* Mettre en place les versions multilinguales
* Pouvoir annuler un déplacement (garder toujours une copie du code initial ou simplement du code qui vient d'être changé — garder l'historique, puisque c'est simple)
* Faire un script pour "updater" l'analyse courante, c'est-à-dire copier son fichier actuellement édité (sur la table d'analyse) dans son dossier d'analyse dans `_analyses_`.

## Développements futurs

* Pouvoir changer le nombre d'opérations mémorisées par l'historique ('historique', <nombre>)
* CTRL META UP et DOWN doit permettre de descendre et remonter la ligne d'un tag quand on est dans le champ de code
* Faire les différents styles
* Magnétiser les lignes repères si on se trouve à moins de x de leur position (note : s'assurer que l'option pour démagnéser — désaimanter — existe).
* Voir peut-être si on doit poser des sauts de page
* Pouvoir sélectionner plusieurs objets par sélection rectangle à la souris
* Avant d'avoir la boite complète de création d'objet, on peut avoir une liste des objets possibles pour en créer un au dernier endroit cliqué (qu'il faudrait mettre en mémoire).
* Avec l'option 'aimant' (+ traduction anglaise) activée, il doit être possible de magnétiser les tags pour qu'ils s'aligent le long des lignes repère ('lines of reference') quand ils sont prochent.
* Pouvoir entrer le titre et d'autres informations pour la première page (ou même une image de première page). Si informations textuelles, créer cette première page avec un @media qui ne rendrait pas les éléments visibles par défaut sur la page, mais les imprimeraient.
* Plusieurs types de mesure (pas par thème, mais en l'indiquant dans la ligne, à commencer par la marque ronde ou la marque carrée)
* Pouvoir jouer le code progressivement (pour une sorte d'animation) : on définit où l'animation doit commencer (START) et à partir de là, les lignes s'exécutent l'une après l'autre (option('anim'|'animation')).
* Donner le code sous la forme d'un fichier zip à downloader
* Pouvoir double cliquer sur la page pour ajouter un élément quelconque (un formulaire s'ouvre, qui permet de définir l'élément)
