var t = new Test('Option Repères');

t.run = function(){

  t.les_lignes_reperes_existent();

  t.on_peut_bouger_les_lignes_reperes();

}
t.les_lignes_reperes_existent = function(){

  given("Sans l'option 'repère'");
  M.reset_for_tests();
  Tags=`
  acc G x=100 y=100
  `;
  M.relaunch_for_tests();

  assert(
    $('#refline_h.refline').length == 0,
    'Aucune ligne repère horizontale n’existe.',
    'La ligne repère horizontale ne devrait pas exister.'
  );
  assert(
    $('#refline_v.refline').length == 0,
    'Aucune ligne repère verticale n’existe.',
    'La ligne repère verticale ne devrait pas exister.'
  );

  given("Avec l'option 'repères'")
  M.reset_for_tests();
  option('repères');
  Tags=`
  acc G x=100 y=100
  `;
  M.relaunch_for_tests();

  assert(
    $('#refline_h.refline').length == 1,
    'Une ligne repère horizontale existe.',
    'Une ligne repère horizontale devrait exister.'
  );
  assert(
    $('#refline_v.refline').length == 1,
    'Une ligne repère verticale existe.',
    'Une ligne repère verticale devrait exister.'
  );
};

t.mouveMouse = function(){
  t.y ++ ;
  var e = $.Event('mousemove');
  e.pageY = t.y ;
  $(document).trigger(e);
  if(t.y > 200){
    console.log('-> fin déplacement');
    clearInterval(t.timer);
  }
}
t.on_peut_bouger_les_lignes_reperes = function() {

  // Je ne sais pas encore faire ça…
  return ;
  given("Avec l'option 'repères'")
  M.reset_for_tests();
  option('repères');
  Tags=`
  acc G x=100 y=100
  `;
  M.relaunch_for_tests();

  var lineh = $('#refline_h') ;
  lineh.trigger({type:'mousedown'});
  try {
    // t.y = lineh.position().top ;
    // t.timer = setInterval(t.mouveMouse, 10);
  } catch (err) {
    console.error(err);
  } finally {
    $('#refline_h').trigger({type:'mouseup'});
  }

}
