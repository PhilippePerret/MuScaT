## Déroulé

* Téléchargement de MuScaT (OK)
* On regarde ce qu'il y a dans le dossier
*
* On définit une taille pour les images (175mm est bien)
* On rectifie les images avec Aperçu et le rectangle



## À faire

* Montrer comment placer d'abord les images dans la page puis regarder l'aperçu
* [ANIMATION] Montrer qu'il suffit d'écarter le "S" du "T" dans "START" pour que l'animation ne démarre plus, pour pouvoir la travailler.
* Montrer comment grouper des tags
* Montrer les deux manières de placer l'analyse : 1. en dupliquant le dossier `template` ou 2. en mettant son fichier `_tags_.js` dans ce template à la place de l'autre (tellement moins gourmand en place que je me demande si ce n'est pas la formule définitive qu'il faut utiliser). Le seul problème de 2., c'est qu'il faut renommer son fichier (l'appelle `Analyse_de_Sonate_Haydn.js` pour le ranger et `_tags_.js` pour l'utiliser.) Ou alors faire un dossier s'appelant `analyses`, ou on place toutes les analyses et faire un script pour utiliser une de ces analyses : le script lit le contenu du dossier, propose la liste, l'utilisateur choisit le fichier, le script le met en _tags_.js dans template et ouvre le fichier.
Penser aussi qu'il y a les images
Procéder plutôt comme ça :
  * Faire un dossier portant le nom de l'analyse (par exemple 'analyse_Sonate_Haydn')
  * Dedans faire un dossier `analyse`
  * Dedans, faire un dossier `images` pour y mettre ses images
  * créer le fichier `_tags_.js` (ou le copier-coller) pour faire le code.
  * Il suffit ensuite de glisser ce dossier analyse en le renommant, dans le dossier `analyse_table` pour voir l'analyse
  TODO Faire un script pour

* L'autre avantage avec Aperçu, c'est qu'on peut déjà régler la taille des images, puisqu'elles seront de la taille qu'on voit
=> faire varier
* IMAGES
  * Numéroter les images simplement et utiliser la notation en `[from-to]` pour dire de quelle image on part jusqu'à laquelle
  * Utiliser l'option 'espacement images' pour modifier l'espacement calculé entre les images.
  * Montrer qu'on peut utiliser différentes unités, mais seulement pour la largeur (montre sans unité, avec unité cm et avec pourcentage)
* MODULATION
  * faire varier la hauteur de la ligne verticale.
* VERROUILLAGE
  * en verrouillant dans le code
  * en verrouillant dans le code une image multiple, toutes les images qui en résultent sont verrouillées elles aussi
  * le TAG verrouillé a un autre aspect
  * on peut quand même modifier les positions de l'image dans le code (en 'code beside')
  * on peut modifier aussi son contenu (verrouiller une modulation ou un accord et le montrer)
