# Todo list

* [BUG] On ne peut pas rentrer les w et h sans les unités
* [BUG?] Les textes de côté ne s'affichent pas de côté à l'impression/PDF
* [BUG] Si on clique sur ENTRÉE pour valider un changement et qu'on fait FLÈCHE BAS, ça va deux plus bas au lieu d'un.


## TEST

* Revoir tous les tests
* L'application des thèmes
* Destruction d'un tag (et annulation de destruction)
* Options : 'vertical line offset', 600, 'horizontal line offset', 100

## Développements versions suivantes

* Voir comment mettre des marques, comme des respirations (virgule) ou des crescendos. Est-ce qu'il suffit de faire des textes plus gros. Utiliser le paramètres 'r' pour 'rotation'/'rotate' pour faire tourner l'élément en degré.
* Quand on développera l'enregistrement des groupes, etc., on pourra simplement enregistrer l'index des lignes, dans le fichier _tags_.js (puisqu'on ne mémorise plus les IDs)
* THÈMES
  * Documenter la fabrication d'un thème (programme ou utilisateur confirmé)
  * Faire des thèmes différents et les présenter dans les options du manuel (ci-possible, une image de chaque thème)
  * faire un script permettant de relever leurs noms ? (peut-être juste pour le manuel)
* Animation : peut-être une mise en évidence de la nouvelle insertion (flash) (voir à l'usure, car ça peut être fatiguant => une option)
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


NOUVELLE RÉFLEXION SUR LA GESTION DU CODE À DROITE

L'actualisation doit se faire dans les deux sens :
* On modifie l'aspect sur la table et ça modifie le code (p.e. déplacement de tag)
* On modifie le code et ça modifie l'aspect sur la table (p.e. suppression d'un élément)

M.tags contient tous les tags créé, dans l'ordre du code

Il faut garder les lignes vides vides.
Une ligne vide => un tag vide, sans ID (contrairement à maintenant). On fait quand même un tag pour simplifier.
Si on supprime une ligne vide :

Une autre solution serait de faire une fausse liste composée qui serait un UL avec des LI, modifiables, qui aurait l'apparence d'une vraie liste de code. Il faudrait gérer le comportement pour que tout semble comme une liste :
* les flèches permettent de passer d'un élément à un autre
* la touche entrée crée un élément en dessous
* la touche erase supprime l'élément vide
Les avantages :
* la touche tabulation permet de passer de tag en tag
* on contrôle élément par élément
* On peut déplacer les éléments avec les flèches (CMD + flèche)
* On peut mettre en exergue le tag plus facilement
* Plus besoin de mettre l'identifiant dans la ligne
Les désavantages :
* on ne peut plus copier tout le code, il faut utiliser le bouton "-> clipboard"
