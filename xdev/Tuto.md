## Déroulé


* MISE EN PLACE DES SYSTÈMES POUR L'ANALYSE MUSICALE
  * On présente l'espace trop petit
  * On lance le terminal pour lancer le script de dossier de capture
  * On met le dossier visible pour voir les captures se mettre dedans au fur et à mesure
  * On procède au découpage.
    * On conseille de faire les images plus grande pour une meilleure qualité.
    * On découpe mal volontairement certaines images pour pouvoir les redécouper.
  * On remet le dossier de captures au bureau (aucun argument)
  * On lance le script de renommage de fichiers
  * On montre comment rectifier une image mal découpée
  * On montre la ligne unique qu'il suffit d'utiliser pour injecter tous les systèmes
  * On ajoute les titres pour savoir à quelle hauteur commencer
  * On définit l'espacement entre les systèmes + la hauteur du premier système avec les options.
  * On définit une taille pour les systèmes.
  * On vérifie la position en regardant l'impression, on rectifie pour obtenir des pages.
    * Bien insister sur ce point : une bonne répartition dès le départ n'obligera pas à tout déplacer ensuite.
  * On peut verrouiller les partitions une fois qu'elles sont bien placées
      Pour ça, montrer comment faire dans un éditeur (sélectionner 'sco', faire autant de CMD D que nécessaire, venir au début et ajouter un '\*' — sans IDE : rechercher "RETURNsco" et remplacer par "RETURN* sco")
  * On peut commencer l'analyse.

* Réalisation de l'analyse
  * Conseiller, une fois certaines parties réalisées, de les "ex-commenter" pour alléger le travail de l'application et aussi se concentrer sur une partie en particulier
  * Conseiller de verrouiller les images (et les autres éléments graphiques)
  * Mettre les numéros de mesures
  * Mettre en place les parties
  * Utiliser des boites pour masquer certains éléments.
  * Mettre les accords et les chiffrages
  * Mettre les cadences
  * Mettre des passages en exergue

* Montrer comment installer l'alias 'mus'
  * Jouer `mus help` ou `mus -h` pour obtenir l'aide
  * Jouer `mus open manuel` pour ouvrir le mode d'emploi
  * `mus create`
    * Jouer `mus create -h` pour l'aide
    * Montrer la section de l'aide dans le manuel
    * Jouer `mus create "MonAnalyse"` pour créer une analyse
      * Montrer que tout a été réglé
  * Jouer `mus analyse "MonAn"` pour lancer l'analyse. Fermer l'analyse.
  * Jouer `mus analyse` pour afficher la liste des analyses
  * `mus change_folder_captures "path/to/folder"` pour définir le dossier de capture
    * Faire les captures
    * Jouer `mus change_folder_captures` pour remettre le dossier
    * Jouer `mus rename_images "path/to/folder" "affixe"` pour renommer les images
  * `mus set`
    * `mus set -h` pour obtenir de l'aide
    * `mus set lang=en` pour changer de langue
    * `mus set editor=Atom` pour changer d'éditeur
      * Jouer `mus analyse -t` pour ouvrir l'analyse + le fichier tags.js dans l'éditeur choisi

* Montrer comment créer une analyse avec le script
* [OK dans prise en main] Montrer comment déplacer les LITags avec CMD + flèche haut/bas
* [OK DANS prise en main] La touche TAB fait passer du tag sur la table d'analyse à la ligne de code (quand option 'code')


## À faire

* [OK — Prise en main] Garder les différentes versions de l'analyse simplement en gardant le code (en mettant au bout de _tags_.js)
* [OK - Prise en main + découpage des images] Montrer comment placer d'abord les images dans la page puis regarder l'aperçu
* [ANIMATION] Montrer qu'il suffit d'écarter le "S" du "T" dans "START" pour que l'animation ne démarre plus, pour pouvoir la travailler.
* [OK - Prise en main] Montrer comment grouper des tags

* L'autre avantage avec Aperçu, c'est qu'on peut déjà régler la taille des images, puisqu'elles seront de la taille qu'on voit (mais conseiller de les faire plus grande, pour une meilleure qualité)
=> faire varier
* IMAGES
  Montrer qu'on peut utiliser différentes unités.
* MODULATION
  * faire varier la hauteur de la ligne verticale.
* VERROUILLAGE
  * en verrouillant dans le code (tag.js)
  * en verrouillant dans le code une image multiple, toutes les images qui en résultent sont verrouillées elles aussi
  * le TAG verrouillé a un autre aspect (mais à l'impression/PDF il sort normalement)
  * on peut quand même modifier les positions de l'image dans le code (en 'code beside')
  * on peut modifier aussi son contenu (verrouiller une modulation ou un accord et le montrer)
