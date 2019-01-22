
var test = new Test('Object Options');

test.run = function(){

  this.get_method();


};

test.get_method = function() {

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
