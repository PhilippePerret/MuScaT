
var test = new Test('Object Options');

test.run = function(){

  this.check_set_method();
  this.check_get_method();

};

test.define_test_options = function(){
  M.reset_for_tests();
  option(...arguments);
  var ret = this.options_states();
  // console.log(ret);
  return ret ;
}

test.check_set_method = function() {
  var opt, dopt, ret, val ;

  given("En ne donnant aucun argument avec option");
  M.reset_for_tests();
  option();
  // Vérification
  ret = this.options_states();
  assert(
    ret.actived.length == 0,
    "Aucune option n'est activée",
    `Aucune option ne devrait être activée (activée: ${ret.actived.join(', ')})`
  );

  given("En donnant un seul argument avec option()");
  ret = this.define_test_options('lines of reference');
  assert(
    ret.actived.length == 1 && ret.actived[0] == '"lines of reference"',
    "Seule l'option est activée",
    `L'option seule devrait être activée ('lines of reference'). Activées : ${ret.actived.join(', ')}`
  );

  given("En donnant l'option « aka » au lieu de l'option réelle");
  for (opt in OPTIONS){
    if(!OPTIONS[opt].aka){continue};
    dopt = OPTIONS[opt] ;
    if(OPTIONS[OPTIONS[opt].aka].boolean){args = [opt]}
    else{args = [opt, 12]}
    var ret = this.define_test_options(...args);
    assert(
      ret.actived[0] == `"${dopt.aka}"`,
      `C'est bien l'option réelle "${dopt.aka}" qui est activée quand on donne "${opt}".`,
      `C'est l'option réelle (${dopt.aka}) qui devrait être activée par ${opt}.`
    );
  };


  given("En donnant plusieurs options booléennes à la suite");
  ret = this.define_test_options('guides', 'code', 'coordonates');
  assert(
    ret.actived.length == 3 &&
    ret.actived.indexOf('"lines of reference"') >= 0 &&
    ret.actived.indexOf('"code beside"') >= 0 &&
    ret.actived.indexOf('"coordonates"') >= 0
    ,
    "Toutes les options sont activées (et seulement celles-là)",
    `Les options désignées devraient être activées (activées : ${ret.actived.join(', ')})`
  );

  given("En donnant les deux paramètres pour une option non booléenne");
  ret = this.define_test_options('espacement images', 120);
  val = OPTIONS['space between scores'].value
  assert(
    val == 120,
    "La valeur de l'option a bien été réglée",
    `La valeur de l'option aurait dû être réglée à 120, elle vaut ${val}.`
  );

  given("En oubliant le deuxième paramètre d'une option non booléenne (avec option unique)");
  ret = this.define_test_options('espacement images');
  val = OPTIONS['space between scores'].value;
  assert_error("il faut définir la valeur de l'option");
  assert(
    val == null,
    "La valeur de l'option est null",
    `La valeur de l'option devrait être null, elle vaut ${val}.`
  );

  given("En oubliant le deuxième paramètre d'une option non booléenne (avec plusieurs options)");
  ret = this.define_test_options('espacement images', 'guides');
  val = OPTIONS['space between scores'].value;
  assert_error("il faut définir la valeur de l'option");
  assert(
    val == null,
    "La valeur de l'option est null",
    `La valeur de l'option devrait être null, elle vaut ${val}.`
  );

  given("En donnant plusieurs options booléennes et non booléennes");
  ret = this.define_test_options('espacement images', 54, 'guides');
  var val_space = OPTIONS['space between scores'].value;
  assert(
    val_space == 54,
    "La valeur de l'option non booléenne a bien été réglée",
    `La valeur de l'option non booléenne n'a pas été réglée (attendue : 54, réelle : ${val_space})`
  );
  assert(
    OPTIONS['lines of reference'].value === true,
    "La valeur de l'option booléenne a bien été réglée",
    "La valeur de l'option booléenne aurait dû être mise à true."
  );
}

test.check_get_method = function() {

  given("La méthode Options#get");

  assert(
    'function' == typeof(Options.get),
    'Options répond à la méthode get',
    'Options devrait répondre à la méthode get'
  );

  given("Avec un mauvais argument");
  assert(
    Options.get('bad', {no_alert: true}) === undefined,
    "Options.get return undefined",
    `Options.get devrait retourner undefined, elle retourne ${Options.get('bad', {no_alert: true})}`
  );

  given("Avec un bon argument d'une option boolean");
  assert(
    'boolean' == typeof(Options.get('code')),
    "Options.get retourne une valeur booléenne",
    "Options.get devrait retourner une valeur booléenne"
  );

  given("Avec un bon argument d'une option à valeur");
  M.reset_for_tests();
  option('espacement images', 50);
  Tags = ``;
  assert(
    Options.get('espacement images') == 50,
    "Options.get retourne la valeur de cette option",
    `Options.get devrait retourner la valeur de cette option (50), elle retourne ${Options.get('espacement images')}`
  );

}

// ---------------------------------------------------------------------
// Méthodes fonctionnelles
// Pour faire l'état des lieux des méthodes
// Retourne un objet contenant :
//  actived:    Liste des options activées
//  not_actived:  Liste des options non activées
test.options_states = function(){
  var ret = {
    actived:      new Array(),
    not_actived:  new Array()
  }
  for(var opt in OPTIONS){
    var dopt = OPTIONS[opt];
    if (dopt.aka){continue};
    if(dopt.boolean && dopt.value == true ){
      ret.actived.push(`"${opt}"`);
    } else if (!dopt.boolean && dopt.value != null){
      ret.actived.push(`"${opt}"`);
    } else {
      ret.not_actived.push(`"${opt}"`);
    }
  }
  return ret ;
};
