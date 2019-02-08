/**
 * La class Tests principale pour jouer les tests
 */
 const INDENT = '  ';

 const Tests = {
   sheets: new Array(),
   nombre_success: 0,
   nombre_failures: 0,
   nombre_pendings: 0,

   stop: false,   // mis à true en cas d'erreur fatale, pour interrompre
   run: function(files){
     // console.clear();
     console.log(RC+RC+RC+'============ DÉBUT DES TESTS ==============');
     this.nombre_success  = 0 ;
     this.nombre_failures = 0 ;
     this.nombre_pendings = 0 ;
     this.current_isheet  = 0 ; // pour commencer à
     this.next() ;
   },

   /**
    * Pour les tests asynchrone, on appelle cette méthode
    */
   next: function(){
     var current_sheet = this.sheets[this.current_isheet++] ;
     if(!current_sheet){
       this.sumarize() ;
       return ;
     }
     console.log(`\n\n------- Test : ${current_sheet.name} (${current_sheet.relative_path}) ---`);
     if('function' == typeof(current_sheet.run_async)){
       current_sheet.run_async();
     } else {
       current_sheet.run();
       if(this.stop){
         console.error('Interruption des tests suite à une erreur fatale.');
         return;
       };
       this.next(); // pour passer à la suivante, pas en asynchrone
     }
   },

   // Affiche le résultat des courses
   sumarize: function(){
    var color = this.nombre_failures > 0 ? 'red' : (this.nombre_pendings > 0 ? 'orange' : '#00BB00') ;
    var str = `${this.nombre_success} success ${this.nombre_failures} failures ${this.nombre_pendings} pendings`
    $('#tags').html(`<div>${str}</div><div>Open the console to see the details.</div>`);
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
   },
   pending: function(str){
     this.nombre_pendings ++ ;
     console.log(RC+'%c'+(str||'TODO')+'…', 'color:orange;font-weight:bold;');
   }
 };

// Raccourci
window.assert   = $.proxy(Tests,'assert') ;
window.given    = $.proxy(Tests,'given') ;
window.pending  = $.proxy(Tests,'pending') ;

// Pour construire un message d'erreur de type :
//  La valeur de truc devrait être à machin, elle vaut bidule
//
window.msg_failure = function(sujet, expected, actual){
  if('string' == typeof(expected) && !expected.match(/^[0-9]+$/)){expected = `"${expected}"`}
  if('string' == typeof(actual) && !actual.match(/^[0-9]+$/)){actual = `"${actual}"`}
  var msg = `la valeur de ${sujet} devrait être ${expected}, elle vaut ${actual}`;
  msg = msg.replace(/de le/g, 'du').replace(/de les/g, 'des');
  return msg;
};
// Pour construire un message d'erreur avec la méthode ci-dessus, mais en
// le mettant dans la liste (Array) +in+
window.push_failure = function(arr, sujet, expected, actual){
  arr.push(msg_failure(sujet, expected, actual));
};
