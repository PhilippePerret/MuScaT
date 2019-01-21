# Todo list

* [BUG] L'index des lignes s'affecte mal
* [BUG] Le cadenas n'est pas compris, en lecture du fichier tags.js (c'est peut-être à cause du nombre de caractères lus)
* [BUG] Quand on modifie la hauteur (h) d'une modulation, il faut qu'elle se corrige
* [BUG] Il semble y avoir encore des problèmes lorsque l'on copie des éléments
* Pouvoir grouper des éléments pour qu'ils réagissent ensemble aux déplacements
* Faire le traitement avec la version minimale des écritures (sans "x=" et "y=").
* Indiquer que toutes les natures (à part "partition") peuvent être désignées par leur trois premières lettres.
* Créer une ligne mobile pour aligner les éléments (options 'repère', 'repaire') (une verticale et une horizontale)
* Pouvoir supprimer un élément (avec la touche erase)
* Faire les différents styles
* Pouvoir sélectionner plusieurs objets par sélection rectangle à la souris
* Pouvoir annuler un déplacement (garder toujours une copie du code initial ou simplement du code qui vient d'être changé — garder l'historique, puisque c'est simple)
* Avec la sélection déplaçable avec les flèches, il faudrait pouvoir utiliser ALT pour faire une copie (et la déplacer). Donc ALT => Copie de l'élément (des éléments ?) sélectionnés puis déplacement

## Développements futurs

* Pouvoir rentrer des options avec des valeurs `option('<id option>', <valeur>)` mais bien voir que pour le moment, `<valeur>` serait interprété comme une autre option. Donc : si ce n'est pas un string ou si ce n'est pas une option, on considère que c'est la valeur de `<id option>`. Mais si `<id option>` ne peut pas être défini (seulement true/false) on génère une erreur d'option inconnue sur `<valeur>`.
  Cette formule permettra de définir beaucoup de choses de façon numérique, comme la largeur du champ de saisie, la taille (pourcentage) des images, la police et la taille utilisée pour les textes et tout autre réglage permettant d'afficher la partition exactement comme on le désire.
* Avant d'avoir la boite complète de création d'objet, on peut avoir une liste des objets possibles pour en créer un au dernier endroit cliqué (qu'il faudrait mettre en mémoire).
* Avec l'option 'aimant' (+ traduction anglaise) activée, il doit être possible de magnétiser les tags pour qu'ils s'aligent le long des lignes repère ('lines of reference') quand ils sont prochent.
* Pouvoir entrer le titre et d'autres informations pour la première page (ou même une image de première page). Si informations textuelles, créer cette première page avec un @media qui ne rendrait pas les éléments visibles par défaut sur la page, mais les imprimeraient.
* Plusieurs types de mesure (pas par thème, mais en l'indiquant dans la ligne, à commencer par la marque ronde ou la marque carrée)
* Pouvoir jouer le code progressivement (pour une sorte d'animation) : on définit où l'animation doit commencer (START) et à partir de là, les lignes s'exécutent l'une après l'autre (option('anim'|'animation')).
* Donner le code sous la forme d'un fichier zip à downloader
* Pouvoir double cliquer sur la page pour ajouter un élément quelconque (un formulaire s'ouvre, qui permet de définir l'élément)


## Question sur l'actualisation

On pourrait mettre l'ID de la ligne en début :

#12# acc G x=10 y=100
#20# sco mon_image.png x=120 y=130
...

Les problèmes :

* l'utilisateur pourrait modifier ces premiers numéros et foutre le bazar (même sans le vouloir)
* il suffirait que l'utilisateur supprime un croisillon pour foutre le bazar (même problème si on le met à la fin. Et si on utilise : `acc G x=10 y=100 id=12xx`)
* ça rend la ligne moins claire

Les avantage :

* Ça permet de ne pas tout refaire à chaque fois : une simple méthode de comparaison permettrait de savoir si l'objet a bouger
* Ça crée un lien fort entre la ligne est l'objet
