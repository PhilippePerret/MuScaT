# Todo list

* [BUG] Quand on supprime un élément dans le code et qu'on update, il revient…
* Pouvoir grouper des éléments pour qu'ils réagissent ensemble aux déplacements
* Faire le traitement avec la version minimale des écritures (sans "x=" et "y=", ou on aurait '<nature> <contenu> <x> <y>'). Noter que ça ne fonctionne que pour une nouvelle ligne, après, il y a un identifiant.
* Indiquer que toutes les natures (à part "partition") peuvent être désignées par leur trois premières lettres.
* Pouvoir supprimer un élément (avec la touche erase)
* Faire les différents styles
* Pouvoir sélectionner plusieurs objets par sélection rectangle à la souris
* Pouvoir annuler un déplacement (garder toujours une copie du code initial ou simplement du code qui vient d'être changé — garder l'historique, puisque c'est simple)
* Avec la sélection déplaçable avec les flèches, il faudrait pouvoir utiliser ALT pour faire une copie (et la déplacer). Donc ALT => Copie de l'élément (des éléments ?) sélectionnés puis déplacement

## Développements futurs

* Avant d'avoir la boite complète de création d'objet, on peut avoir une liste des objets possibles pour en créer un au dernier endroit cliqué (qu'il faudrait mettre en mémoire).
* Avec l'option 'aimant' (+ traduction anglaise) activée, il doit être possible de magnétiser les tags pour qu'ils s'aligent le long des lignes repère ('lines of reference') quand ils sont prochent.
* Pouvoir entrer le titre et d'autres informations pour la première page (ou même une image de première page). Si informations textuelles, créer cette première page avec un @media qui ne rendrait pas les éléments visibles par défaut sur la page, mais les imprimeraient.
* Plusieurs types de mesure (pas par thème, mais en l'indiquant dans la ligne, à commencer par la marque ronde ou la marque carrée)
* Pouvoir jouer le code progressivement (pour une sorte d'animation) : on définit où l'animation doit commencer (START) et à partir de là, les lignes s'exécutent l'une après l'autre (option('anim'|'animation')).
* Donner le code sous la forme d'un fichier zip à downloader
* Pouvoir double cliquer sur la page pour ajouter un élément quelconque (un formulaire s'ouvre, qui permet de définir l'élément)


## Question sur l'actualisation

Nouvelle façon d'actualiser, en partant du principe que :

* Les tags ne peuvent avoir que trois natures : inchangé (id connu, pas de modification), (id connu des modifications), (pas d'id, une nouvelle ligne), (id connu, mais n'est plus dans la liste de lignes)

On pourrait donc passer en revue les nouvelles lignes pour créer une nouvelle table provisoire newTags qui instancierait toutes les lignes actuelles (rappel : ça ne pose plus de problème maintenant que l'instanciation n'ajoute pas obligatoire de tags dans ITags). On compare ensuite M.tags avec newTags.
