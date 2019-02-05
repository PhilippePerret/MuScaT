## Déroulé

La première chose à faire est de télécharger MUSCAT. Vous pouvez faire une recherche sur mon compte github avec les mots clés "Philippe Perret Github".
Vous cliquez sur le lien affiché par Google, vous rejoignez mes dépôts. Vous choisissez l'application MUSCAT.
Là vous trouvez un bouton "Clone or Download", vous le cliquez et vous choisissez le nouveau bouton « Download ZIP » qui va donc, comme son nom l'indique, télécharger une version compressée de l'application.

Pendant qu'elle télécharge — elle fait quand même plusieurs mégaoctets — vous pouvez créer un dossier « Analyses » dans votre dossier Musique.

Une fois l'application téléchargée, vous vous retrouvez avec un dossier "Muscat-master" dans votre dossier téléchargement — ou ailleurs si vous avez modifié vos paramètres par défaut.

On peut retirer le suffixe "master" — qui indique juste la branche de développement — et vous pouvez glisser ce dossier dans le dossier "Analyses" que nous venons de créer.

Ouvrons ce dossier "Muscat" pour voir ce qu'il contient…

D'abord, on trouve un dossier "_analyses_". C'est dans ce dossier que devront se trouver toutes vos analyses en chantier. Pour le moment, on n'en trouve que deux, ou plutôt une seule même, l'analyse d'une sonate de Haydn et un dossier "Template" qui est en fait un modèle à copier pour créer une nouvelle application.

> Nous verrons par la suite qu'il y a des moyens beaucoup plus pratique, pour créer une application, que de dupliquer ce dossier.

On trouve le fichier "_TABLE_DANALYSE_.html" qui est en quelque sorte le fichier principal. C'est votre table d'analyse, c'est sur elle que vous travaillez vos analyses de partition, dans votre navigateur. On y revient très rapidement.

En dessous, vous avez un fichier "analyse.js" qui ne contient que le nom de l'analyse courante, l'analyse qui s'ouvre sur la table d'analyse.

Vous voyez que l'analyse courante s'appelle "EssaiInPlace", mais elle n'existe pas dans le dossier des analyses donc on aurait un problème en ouvrant la table d'analyse.

Vous avez ensuite le dossier du manuel, un manuel très complet, en version PDF et HTML, qu'il faut consulter dès que vous avez une interrogation.

Les deux fichiers suivants n'ont pas d'importance, vous pouvez même les supprimer sans hésiter.

On trouve ensuite un dossier "utils" qui contient des scripts, des utilitaires, très pratiques. Mais pour pouvoir les utiliser, le langage Ruby doit être installé sur votre ordinateur. Si vous êtes sur mac, c'est fait par défaut.

Enfin, on trouve deux dossiers commençant par la lettre "x", dont le dossier "xlib" qu'il ne FAUT SURTOUT PAS DÉTRUIRE, c'est lui qui contient tout le code de l'application.

---

Nous allons donc créer notre première analyse.

Pour se faire,
* nous ouvrons le dossier "_analyses_"
* nous dupliquons le dossier "Template"
* et nous le renommons. Par exemple "Sonate Mozart". Notez que je ne mets pas d'espace dans les noms. Ce n'est pas obligatoire, mais si vous prenez l'habitude de le faire, ça vous évitera de nombreuses complications.

J'ouvre mon tout nouveau dossier d'analyse.

À l'intérieur, je trouve…

* un fichier "tag js". C'est le fichier principal de l'analyse, c'est lui qui définit tous les tags qu'on va poser sur la partition, c'est-à-dire les accords, les cadences, les modulations, les parties et beaucoup d'autres choses encore. Dans Muscat, on appelle tous ces éléments des "tags", comme on en voit sur les murs des villes.

* On a ensuite un fichier "analyse.js" — rappelez-vous, on avait le même dans le dossier principal de Muscat. Ce fichier doit définir le nom de l'analyse, c'est-à-dire le nom de son dossier.
Ici, vous voyez, c'est "Template", puisqu'on a fait une copie de ce dossier.
On va tout de suite remplacer ce nom par le nom correct.
* j'ouvre le fichier dans un éditeur, ici, c'est Atom,
* je copie le nom du fichier dans le Finder — ça m'évitera de faire des erreurs de typo,
* je colle ce nom à la place de "Template".

Maintenant, je vais pouvoir faire de ma nouvelle analyse l'analyse courante, c'est-à-dire l'analyse qui va s'ouvrir sur la table d'analyse.
Pour ce faire, il suffit de je copie-colle mon fichier "analyse.js" — celui de mon dossier d'analyse — dans le dossier Muscat.
Il faut vraiment le dupliquer, plutôt que de le déplacer, comme ça vous gardez votre dossier analyse intact.
Là, sur mac, j'exécute l'opération en déplaçant le fichier tout en tenant la touche ALT appuyée.
L'ordinateur me demande si je veux remplacer le fichier, je confirme.
Cette fois, à la racine du dossier Muscat, c'est bien mon analyse qui est l'analyse courante.

Terminons de voir le contenu du dossier d'analyse avant de poursuivre.

On trouve un dossier images dans lequel, évidemment, on placera toutes les images.

Et on a enfin un fichier README qu'on peut jeter à la poubelle après l'avoir lu — ou pas.

---

Nous sommes prêt à commencer notre première analyse.

Cela consiste donc à ouvrir la table d'analyse dans Chrome ou un autre navigateur.

Notez qu'on l'ouvre dans un navigateur, mais que ça n'a rien à voir avec Internet. Il se trouve simplement que les navigateurs permettent de développer facilement des petites applications très pratiques, sans déployer de trop grands moyens.

J'ouvre donc le fichier "TABLE D'ANALYSE POINT HTML".

---

C'est un premier message d'erreur qui nous reçoit, nous indiquant qu'il ne connait pas une option. Cela devrait vous arriver plusieurs fois au début de votre utilisation de Muscat, je préférait que vous en soyez informés.

Nous corrigerons cette erreur plus tard — pour le moment, jouons un peu avec les tags qui sont déjà présents dans notre modèle.

Vous remarquez qu'on peut déplacer facilement les éléments à la souris sur notre table d'analyse — qui est en fait la page blanche du navigateur.

Nous pouvons redimensionner les éléments. Ici, j'utiliser la touche "w" avec ou sans "ALT".

Vous pouvez remarquer que lorsque je sélectionne un élément sur la table, il se sélectionne aussi dans la partie droite de la fenêtre, là où se trouve la définition des tags.
Nous allons y revenir en détail.

---

Ce code, on le trouve dans le fichier "tag point js" de notre dossier d'analyse. Attention, il ne faut surtout pas renommer ce fichier.  Comme la plupart des fichiers, d'ailleurs.

Je l'ouvre dans mon éditeur, ici Atom.

Vous pouvez l'ouvrir dans n'importe quel éditeur. Il faut juste comprendre un point essentiel : il faut toujours l'enregistre en texte simple. Donc si vous l'ouvrez dans LibreOffice ou Word, surtout, ne l'enregistrez pas en .odt ou .doc, ça ne fonctionnerait plus. Il faut préserver l'extension "poin js" et l'enregistrer en "Simple text".

ON repère tout de suite dans ce fichier l'option fautive, celle qui a généré l'erreur quand j'ai ouvert l'analyse sur la table d'analyse. Il manque simplement un "s".

---

Je vais supprimer l'intégralité du code, ou presque, pour y voir plus clair.

Allez, je vais même supprimer toutes les options !

Si je recharge la table d'analyse — ce qu'il faut faire dès que je change le code de mon fichier "tags point js" — je me retrouve avec une version d'analyse pour le moins minimaliste !

Je peux m'amuser à placer mon premier système là où je veux. Remarquez que si je déborde de la table, le contour de la boite devient rouge.

Je vais pouvoir ajouter mon premier tag.

Je commence par cliquer à l'endroit où je veux l'ajouter, sur la table d'analyse.

Ensuite, je retourne dans mon fichier "tags point js" et j'ajoute la ligne "accord" (puisque c'est un accord que je veux tagguer), j'indique son nom — Mi mineur — par la suite je noterai plutôt les accords en notation anglosaxonne, convention que j'aime bien utiliser : les accords en notation anglosaxone (avec des lettres) et notes en notation italienne, avec le nom des notes.

Ce sera donc un accord de MI mineur.

Et là, à la suite, je colle le contenu de mon presse-papier. Il contient tout simplement les coordonnées du point que j'ai cliqué sur la table d'analyse.

Je procède de la même manière pour les accords suivants, en allant cliquer à l'endroit où je veux qu'il apparaissent, puis j'écris leur code. Remarquez la simplicité de ce code.

Maintenant que j'ai mis mes trois accords, je peux enregistrer mon fichier tag point js et recharger la table d'analyse pour actualiser l'affichage — comme on le ferait avec un page internet normale.

Vous pouvez constater que nos accords ont été taggués. Il suffit de les mettre en place à l'endroit voulu.

Certains outils facilitent grandement le travail, comme l'alignement des tags par exemple. Si je veux que mes accords soient parfaitement alignés,
* je les sélectionne — en premier, celui qui doit servir de repère,
* je joue l'outil d'alignement, — ici, j'aligne en bas
* et je clique sur le bouton

Aussitôt, mes tags s'alignent parfaitement.

Quand je suis satisfait du résultat, je peux demander le nouveau code de cette analyse, avec les nouveaux emplacements, notamment.

Pour ce faire, je joue le bouton "code source vers presse-papier" dans la boite à outils.

Il me suffit de coller ce code dans mon fichier "tags point js".

Je pourrais tout à fait remplacer l'intégralité du code, mais je préfère garder des versions de mon analyse. Pas seulement pour le souvenir, mais pour pouvoir revenir en arrière si je rencontre un grand problème.

Ici, je précise donc que c'est une version 2 et je colle le code.

Vous pouvez noter que ce sont les valeurs "x" et "y" qui ont été modifiées, la position des tags sur la table d'analyse, donc.

Pour être sûr d'avoir copié-collé correctement mon code, j'enregistre le fichier "tags point js" et je recharge aussisôt la page. Si rien ne bouge, c'est que le code est bon.

---

Passer chaque fois du navigateur à mon éditeur ne me parait somme toute pas la méthode idéale…

Je vais donc utiliser l'option 'code' qui va me permettre d'avoir le code juste à côté de ma table d'analyse.

Quand je recharge la page dans Chrome, le code est affiché.
Vous pouvez même noter que le bouton pour copier-coller le code se trouve juste sous ce code.
On trouve également un bouton "plus" et un bouton "moins" qui, comme on s'en doute, vont permettre d'ajouter ou de supprimer des tags.

---

Je peux créer ces tags de la même manière :

* je clique à l'endroit où je veux qu'il apparaisse…
* je clique le bouton "plus" — un nouveau tag se créé
* j'écris sa nature — ici une cadence — et je colle les coordonnées que j'ai récupérées simplement en cliquant à l'endroit voulu sur la table d'analyse.
* je joue la touche ENTRÉE, le tag se crée.

Je peux bien sûr modifier les données du tag dans le code. Ici, je précise qu'il s'agit plutôt d'un accord de dominante, V, et d'une demi cadence.
Je la place où je veux avec la souris.

Notez que lorsqu'on sélectionne un tag sur la table d'analyse, il se sélectionne aussi dans la code. Si je joue TAB (la touche tabulation), je peux même basculer du tag sur la table à son code.
C'est très pratique lorsque l'on veut gagner du temps et utiliser intensivement le clavier.

Pour déplacer les tags dans le code, il suffit de jouer les flèches en pressant la touche MÉTA, c'est-à-dire la touche COMMAND sur Mac et la touche CTRL sur PC. Là, je le fais par exemple avec une ligne vide, lorsque je veux en créer une tout en haut du code.

Pour créer un nouveau tag, je peux aussi le déplacer en tenant la touche ALT.
Ici, je crée un nouveau chiffrage (un tag de nature "harmonie")
Il me suffit de le prendre et de le glisser à un autre endroit avec la touche ALT, et ça le copie.
Ensuite je le sélectionne, ce qui sélectionne aussi sa ligne de code, pour pouvoir le modifier.
De cette manière il est possible de créer très rapidement l'analyse complète.

Comme autres tags, je peux ajouter des lignes, par exemple ici pour indiquer que le chiffrage I dure sur trois mesures.
Pour cette ligne, je vais caler sa position et sa longueur avec seulement les touches.
La touche "x" permet de déplacer l'objet sélectionné horizontalement
La touche "y" permet de le déplacer verticalement.
Avec la touche ALT vous inverser le mouvement
Avec la touche MAJuscule, vous augmenter les pas
et avec la touche CTRL, vous pouvez affiner l'affichage au pixel près.

Vous noterez que le code se modifie en même temps qu'on modifie les dimensions et les positions du tag.

---

Pour dupliquer un tag, on peut aussi copier-coller son code sur une autre ligne. Je peux le faire avec une image, par exemple, pour créer un deuxième système.
Je rectifie grossièrement les positions dans le code…
… je fait TAB pour sélectionner le tag sur la table d'analyse
… je me sers de x et y pour placer le tag à l'endroit voulu.

Et enfin, il me suffit de copier le code dans le presse-papier pour le coller dans mon fichier "tag point js". Ce sera ma version 3.

Il ne faut surtout pas oublier de copier-coller le code, sinon il serait définitivement perdu, il ne s'enregistre pas automatiquement dans le fichier, ce qui demanderait d'autres moyens.

Je recharge la table d'analyse dans le navigateur pour m'assurer que le code a bien été copié.

---

Je peux poursuivre de cette manière avec un troisième système qui va nous permettre d'aborder d'autres outils très utiles.

Là, on voit que mes systèmes ne sont pas bien alignés.

Malheureusement, je ne peux pas me servir de l'outil d'alignement ici puisque je ne sais pas comment ont été découpés les images.

---

Pour le faire, je vais utiliser l'options "reperes", rappelez-vous c'était celle qui était mal écrite au tout départ.

En ajoutant cette option et en rechargeant la page, je me retrouve avec deux lignes vertes, mes lignes repères, que je peux déplacer à ma guise à la souris.

Je vais donc me servir du repère vertical pour aligner un peu mieux mes systèmes. Ce n'est pas obligatoire, mais c'est plus joli.

Bien évidemment, il aurait été plus intelligent de le faire avant de poser les premiers tags, que nous serons obligés de replacer, ici.

Heureusement, je vais pouvoir grouper plus tags et les déplacer en même temps. Je les sélectionne en tenant la touche MAJUSCULE appuyée… puis je clique sur le bouton "GROUPER" dans la boite d'outils.
Maintenant, les tags sont solidaires et se déplacent en même temps.

J'aurais pu le programmer simplement avec la sélection, mais je préfère que les opérations multiples soient bien contrôlées, pour éviter les résultats inattendus.

---

Bien entendu, vous avez remarqué que maintenant que le code est assez long, la page scrolle pour toujours afficher les tags sélectionnés. On peut de cette manière passer très rapidement d'une partie à l'autre même dans une partition très longue.

---

 Ajoutons pour terminer cette première approche les informations sur l'œuvre et celui qui l'analyse. On peut le faire à l'aide du tag "titre", du tag "compositeur"…
… Ici, j'indique évidemment n'importe quoi puisqu'il s'agit en vérité d'une sonate de mi mineur de Haydn.
… avec le tag "analyste", je peux mettre l'auteur de l'analyse (avec ou sans "e" — il y a toujours deux manières d'entrer les données, en français ou en angalis). Et enfin le tag "date analyse" permet de préciser quand l'analyse a été menée.

Je peux copier coller tout ce code pour faire la version 4 de mon analyse.

---

Quand mes versions se multiplient, je peux supprimer les premières, évidemment, pour ne pas trop alourdir mon fichier "tags point js", qui est chaque fois chargé dans le navigateur.

Je voudrais retirer les lignes repères, mais lorsque j'essaie de le faire, rien ne se passe…
En fait, c'est tout simplement parce qu'un réglage des options précédent interfère avec mon choix courant.
Il faut donc que je retire cette définition des options.
Et cette fois, ça marche ! les lignes repères ont bien disparu.

---

Et je peux pour terminer imprimer cette analyse. En fait, je vais faire un fichier PDF.
Je lance l'impression dans Google, je vérifie les réglages pour avoir des marges minimum, un affichage de 100%, pas d'entête ou de pied de page.
Je peux enfin demander l'enregistrement du fichier au format PDF… et le visualiser dans Aperçu ou autre application de visualisation des documents.

Et voilà !


================================================================================================

* MISE EN PLACE DES SYSTÈMES POUR L'ANALYSE MUSICALE
  * [OK] On présente l'espace trop petit
  * [OK] On lance le terminal pour lancer le script de dossier de capture
  * [OK] On met le dossier visible pour voir les captures se mettre dedans au fur et à mesure
  * [OK] On procède au découpage.
    [OK] * On conseille de faire les images plus grande pour une meilleure qualité.
    [OK] * On découpe mal volontairement certaines images pour pouvoir les redécouper.
  * [OK] On remet le dossier de captures au bureau (aucun argument)
  * [OK] On lance le script de renommage de fichiers
  * [OK] On montre comment rectifier une image mal découpée
  * [OK] On montre la ligne unique qu'il suffit d'utiliser pour injecter tous les systèmes
  * [OK] On ajoute les titres pour savoir à quelle hauteur commencer
  * [OK] On définit l'espacement entre les systèmes
  * [OK] On définit une taille pour les systèmes.
  * [OK] On vérifie la position en regardant l'impression, on rectifie pour obtenir des pages.
    * [OK] Bien insister sur ce point : une bonne répartition dès le départ n'obligera pas à tout déplacer ensuite.
  * [OK] On peut verrouiller les partitions une fois qu'elles sont bien placées
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