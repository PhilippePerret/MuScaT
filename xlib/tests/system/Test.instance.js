
const Test = function(test_name){
  // console.log(document.currentScript.src);
  this.name = test_name ;
  Tests.add_test(this);
  this.script = document.currentScript.src;
  // Liste des instances Case du test
  this.cases  = new Array();
}
/**
 * Quand on joue le test
 */
Test.prototype.run = function(){
  console.log(`=== TEST ${this.name} (${this.relative_path}) ===`);
  // TODO Mélanger les cas
  this.run_case(0);
};
Test.prototype.run_case = function(case_idx){
  var my = this;
  var cas = my.cases[case_idx];
  if(undefined == cas){
    Tests.next(); return;
  };
  // On joue le test et on passe au suivant
  cas.run().then(my.run_case(++case_idx));
};
/**
 * Définition d'un cas du test
 */
Test.prototype.case = function(intitule, fn_test){
  this.cases.push(new TCase(intitule, fn_test));
};
Object.defineProperties(Test.prototype,{
    relative_path:{
      get: function(){
        if(undefined == this._relative_path){
          var borne = 'xlib/tests/tests';
          var index = this.script.indexOf(borne) + borne.length + 1 ;
          this._relative_path = this.script.substring(index, this.script.length) ;
        };
        return this._relative_path ;
      }
    }
})

const TCase = function(intitule, fn_test){
  this.intitule = intitule;
  this.fn       = fn_test;
};
TCase.prototype.run = function(){
  var my = this ;
  return new Promise(function(ok,ko){
    console.log(`${RC}--- Cas : ${my.intitule} ---`)
    try{
      my.fn();
    } catch(err){
      Tests.add_sys_error(my, err);
    } finally {
      ok();
    }
  });
};
