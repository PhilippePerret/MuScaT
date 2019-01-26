/**
* Locales anglaises pour les messages
**/
if('undefined'==typeof(MSG)){MSG = {}};
Object.assign(MSG,{
    'pour':'virgule'
  , 'code-lines-added': "Code lines has been added (%{motif}). New code copied in the clipboard to be pasted in your `tags.js` file. Do it right now! ;-)"

  // TAGS
  , 'full-code-in-clipboard' : "The full code of your tagged analysis is copied in the clipboard.\n\nYou can paste it in your `tags.js` file (select the whole code and replace it)."


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

});
