
const Test = function(test_name){
  // console.log(document.currentScript.src);
  this.name = test_name ;
  Tests.add_test(this);
  this.script = document.currentScript.src;
}
Object.defineProperties(Test.prototype,{
    relative_path:{
      get: function(){
        if(undefined==this._relative_path){
          var borne = 'xlib/tests/tests';
          var index = this.script.indexOf(borne) + borne.length + 1;
          this._relative_path = this.script.substring(index, this.script.length);
        }
        return this._relative_path;
      }
    }
})
