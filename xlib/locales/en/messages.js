/**
* Locales anglaises pour les messages
**/
if('undefined'==typeof(MSG)){MSG = {}};
Object.assign(MSG,{
  'pour':'virgule'

  // === DEMANDES ===

  , 'choose-litag': "Please choose the tag to %{operation} in the list."
  , 'should-destroy': 'Should I really destroy %{what}'

    // === INFORMATION ===
  , 'code-lines-added': "Code lines has been added (%{motif}). New code copied in the clipboard to be pasted in your `_tags_.js` file. Do it right now! ;-)"

  // TAGS
  , 'full-code-in-clipboard' : "The full code of your tagged analysis is copied in the clipboard.\n\nYou can paste it in your `_tags_.js` file (select the whole code and replace it)."
  , 'code-lines-in-clipboard': "Line code of selected tags put in clipboard. You can paste it in your _tags_.js file."


  // IMAGES
  , 'image-sequentielle': 'regular expression in score line'

  , 'crop-image-ready': "You can crop your image."

  , 'code-to-run': "Code to play in Terminal: %{code} (copied in the clipboard)"

  // OPTIONS
  , 'memo-guides-offsets': "Must I remember current position of the guide lines?"

  // ANIMATION
  , 'press-space-animation': "Press SPACE bar to continue animation."
  , 'fin-anim': 'The End'

  // ---------------------------------------------------------------------
  //  === ERRORS ===

  // TAGS

  , 'tags-undefined': 'You have to define TAGs and scores lines (in `tag.js` file)!'


  , 'no-w-pour-modulation': 'Width of a modulation can’t change. Use `h` to modify the height of its vertical line.'
  , 'no-h-pour-cadence':    "Height of cadence can’t change. Use `w` to modify the width of its horizontal line."

  , 'loading-module-failed': "Sorry, the loading of module « %{name} » failed…"

});
