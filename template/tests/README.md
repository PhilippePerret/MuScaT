# Test de l'application

* [Liste des assertions](#assertions)

J'ai mis en place un système très simple de test pour cette application entièrement en javascript.

## Assertions {#assertions}

### assert(evaluation, message_success, message_failure)

Assertion de base qui génère le message de succès `message_succes` quand `evaluation` est `true` et génère le message de failure `message_failure` dans le cas contraire.

```
assert(
  true,
  'Je suis vrai',
  'Je suis faux'
  )
```

```
assert(
  2 > 4,
  'Deux est bien inférieur à 4',
  'Deux ne devrait pas être supérieur à 4'
  )
```

Noter que pour les assertions négatives, il suffit d'utiliser `!evaluation`.

### assert_classes(jqDes, classes) / assert_not_classes()

Produit un succès si l'élément ou la liste d'éléments désignés par `jqDes` possèdent les classes (Array) désignées par `classes`. Produit une failure dans le cas contraire.

```
  var mesDivs = document.getElementsByClassName('divisors');
  assert_classes(mesDivs, ['good', 'one'])

```

### assert_position(jqDes, hposition[, tolerance]) / assert_not_position()

Produit un succès si l'élément désigné par `jqDes` se trouve dans les positions définies par `hpositions` avec une tolérance optionnelles de `tolerance`.

`hpositions` est une table définissant les valeurs (nombre de pixels, sans unité) de `x` ou `left`, `y` ou `top`, `w` ou `width`, `h` ou `height`.

```
  var monDiv = document.getElementById('monDiv');
  assert_position(monDiv, {x: 100, y: 200});

```

L'assertion ci-dessus génère un succès si le node `#monDiv` se trouve a un `left` de 100 pixels et un `top` de 200 pixels.

```
  var monDiv = document.getElementById('monDiv');
  assert_not_position(monDiv, {w: 100, h:30}, 10);

```

Le code ci-dessus génère une failure si l'objet `#monDiv` a une largeur comprise entre 90 et 110 et une hauteur comprise entre 20 et 40.

On peut transmettre une liste (Array) le nœuds à la méthode.


### assert_visible(jqDes) / assert_not_visible

Produit un succès si l'élément désigné par `jqDes` est visible, une failure dans le cas contraire.

```
  assert_visible('#monDiv');

  assert_not_visible('.mesDivs');

```
