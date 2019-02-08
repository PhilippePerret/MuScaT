Ces modules ne sont pas chargés par défaut. Ils sont chargés à la demande avec :

Si `callback` existe au moment de l'implémentation
```javascript
M.loadModule('<module name>').then(callback) ;
```
La fonction `callback` est appelée en cas de chargement correct.

Sinon:

```javascript
M.loadModule('<module name>').then(function(){callback()}) ;
```
