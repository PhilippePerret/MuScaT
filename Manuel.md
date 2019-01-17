# Manuel de l'application MusCaT

## Composition rapide d'un élément

Si vous avez déjà consulté ce manuel, vous pouvez trouver une aide rapide ici.

```
  Composition de :

  image         `image <source> x=... y=... z=...`
                Exemple : `image monScore.png z=50 x=100 y=100`
                - "z" désigne le zoom en pourcentage
                - l'image doit se trouver dans le dossier 'images'

  accord        `accord <nom> x=... y=...`
                Exemple : `accord Cm7 x=230 y=520`

  harmonie      `harmonie <degré accord et renversement> x=... y=...`
                Exemple : `harmonie II** x=200 y=230`

  cadence       `cadence <degré accord> type=<type cadence> x=... y=... w=...`
                Exemple : `cadence I type=italienne w=200 x=12 y=100`

  ligne         `ligne <type ligne> x=... y=... w=...`
                Exemples : `ligne U w=120 x=100 y=50`
                           `line |---| w=50 x=100 y=50`

  degré         `degre <indice> x=... y=...`
                Exemple : `degre 5 x=100 y=120`

  texte         `texte <contenu> x=... y=... type=...`
                Exemple : `texte Exposition x=100 y=50 type=partie`

```

## Composition d'un élément

```
  <nature>[ <type>|<contenu>]

```

Où `<nature>` peut être :

```
  Français    Anglais     Description                   Exemple
  -----------------------------------------------------------------
  image       score       Pour ajouter l'image d'une      mon.png
                          partition à tagger.
  accord      chord       Le nom d'un accord, placé       Dm7
                          au-dessus de la portée.
  harmonie    harmony     L'accord dans l'harmonie        I**
                          avec son renversement.
  cadence                 Marque la cadence.              I

  degre       degree      Marque le degré dans la gamme   4
                          d'une note.
  ligne       line

```

Le `<type>` est nécessaire pour caractériser l'élément suivant sa nature. Par exemple, pour une ligne, il faut connaitre son aspect. Pour une cadence

Quand l'élément n'a pas de type, il a un contenu (il peut avoir les deux, commes les cadences).

### Écrire des textes

Ce que l'on appelle les « textes », ici, ce sont tous les textes hors des accords, modulations, chiffrage, etc. Ce sont vraiment des textes qu'on peut placer n'importe où. À commencer pour définir les parties de l'ouvrage (« Introduction », « Coda », etc.).

Dans un texte, il est impérative de remplacer toutes les espaces par des traits plats (on les obtient, sur mac, à l'aide de Maj+tiret).

Par exemple, pour écrire sur la partition :

```

      Premier couplet

```

Il faut définir la ligne :

```

    ligne Premier_couplet type=partie y= 50 x=200

```

Note : ici, c'est le type `partie` qui fera que le texte s'écrit de travers, dans une boite.

#### Les types de texte

```

    type      anglais     Description
  ------------------------------------------------------------------
    partie    part        Titre de partie, comme Exposition ou Coda
    mesure    measure     Numéro de mesure, dans un carré.

```


### Dessiner des lignes

Les lignes se définissent par `line` ou `ligne`.

Le premier élément définit le `type` de la ligne. On trouve les types suivants.

```

    U ou |___|      Ligne inféfieure et trait vertical avant/après
    N ou |---|      Ligne supérieure et trait vertical avant/après
    L ou |___       Ligne inférieure et trait vertical avant
    K ou |---       Ligne supérieure et trait vertical avant
    V ou ___|       (Virgule) Trait inférieur et trait vertical après
    ^ ou ---|       (Virgule inversée) Trait supérieur et trait vertical après

```

On peut ensuite définir sa taille et sa position avec les lettres habituelles `x` (position horizontale), `y` (position verticale) et `w` (largeur en pixels).

### Écrire un texte

TODO
