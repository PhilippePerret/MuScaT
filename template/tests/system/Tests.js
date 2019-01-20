/**
 * La class Tests principale pour jouer les tests
 */
 const INDENT = '  ';

 const Tests = {
   sheets: new Array(),
   nombre_success: 0,
   nombre_failures: 0,
   run: function(files){
     // console.clear();
     console.log(RC+RC+RC+'============ DÉBUT DES TESTS ==============');
     this.nombre_success  = 0 ;
     this.nombre_failures = 0 ;
     for(var i = 0, len = this.sheets.length; i<len; ++i){
       console.log(`\n\n------- Test : ${this.sheets[i].name} ---`)
       this.sheets[i].run();
     }
     this.sumarize();
   },

   // Affiche le résultat des courses
   sumarize: function(){
    var color = this.nombre_failures > 0 ? 'red' : '#00BB00' ;
    var str = this.nombre_success + ' success, ' + this.nombre_failures + ' failures' ;
    console.log(RC+RC+RC+'%c' + str, `color:${color};font-weight:bold;`);
   },

   // Ajoute un test à la liste des tests à exécuter
   add_test: function(itest){
     this.sheets.push(itest);
   },

   assert:function(value, msg_success, msg_failure){
     if (value == true){
       this.nombre_success ++ ;
       console.log(INDENT + '%c… ' + msg_success, 'color:#00AA00;') ;
     } else {
       this.nombre_failures ++ ;
       console.log(INDENT + '%c… ' + msg_failure, 'color:red;') ;
     }
   },
   given:function(str){
     console.log(RC+'%c'+str+'…', 'font-size:1.1em;font-weight:bold;');
   }
 };

// Raccourci
window.assert = $.proxy(Tests,'assert') ;
window.given  = $.proxy(Tests,'given') ;
