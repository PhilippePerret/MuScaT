# Manuel des manuels

cf. [Manuel PanDoc](https://pandoc.org/MANUAL.pdf)

Ce mode d'emploi explique comment produire un mode d'emploi (ou autre) à partir des fichiers Markdown.

## Markdown vers PDF

```
cd vers/le/dossier/du/fichier
FAFFIXE="Manuel_test";pandoc $FAFFIXE.md --from=markdown --to=latex --output=$FAFFIXE.pdf;open $FAFFIXE.pdf
```

## En cas de problème

Pour trouver précisément où peut se trouver un problème, on peut passer par
le document LaTex et le composer. Pour le produire :

```
pandoc -s Manuel_test.md --from=markdown --to=latex --output=Manuel_test.tex;open Manuel_test.tex
```

Essai pour passer de MD -> HTML -> PDF

## Fichier MD -> epub avec styles

```
FAFFIXE="Manuel_test";pandoc -s $FAFFIXE.md --metadata pagetitle="" --css $FAFFIXE.css -o epub3 --output=$FAFFIXE.epub; open $FAFFIXE.epub
```

C'est pour le moment le meilleur format que j'ai trouvé (à part en HTML) pour définir les styles, mais je ne peux pas encore atteindre tous les éléments (voir par exemple la table des matières — la mienne — qui n'est pas modifiée ; elle devrait être sans puce, entourée d'une bordure, etc.).


## Fichier en HTML et ouverture dans Firefox

```
FAFFIXE="Manuel_test";pandoc -s $FAFFIXE.md --metadata title="" --from=markdown --css $FAFFIXE.css --output=$FAFFIXE.html;open -a Firefox $FAFFIXE.html
```

> essayer aussi avec -css Manuel_test.css (en enlevant la balise <style>)
