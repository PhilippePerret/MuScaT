/**
 * Tests de l'ouverture d'une analyse
 */

var test = new Test("Ouverture d'une analyse");

test.run = function(){
  assert_function('load_analyse_data', MuScaT);
  assert(
    true,
    "L'analyse doit être ouverte.",
    "L'analyse aurait dû être ouverte"
  )
  return true;
};
