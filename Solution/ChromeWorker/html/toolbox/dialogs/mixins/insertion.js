BasDialogsLib.InsertionMixin = (superclass) => class extends superclass {
  insertAsExpression($element, text) {
    const group = $element.closest('.input-group');
    group.find('.input_selector_number').hide();
    group.find('.input_selector_string').show();
    group.find('.selector').html('expression');
    $element.val(text);
  }

  insertTextToEditor($element, text) {
    const editor = window[$element.attr('id')].Editor, line = editor.getPosition();

    editor.executeEdits('my-source', [{
      range: new monaco.Range(line.lineNumber, line.column, line.lineNumber, line.column),
      identifier: { major: 1, minor: 1 },
      forceMoveMarkers: true,
      text: text
    }]);
  }

  insertTextAtCursor($element, text) {
    let start = 0;
    try {
      start = $element.val().length;
      start = cursorposition($element[0]).start;
    } catch (e) { }
    let val = $element.val();
    val = val.slice(0, start) + text + val.slice(start);
    $element.val(val).trigger('change');
  }
}