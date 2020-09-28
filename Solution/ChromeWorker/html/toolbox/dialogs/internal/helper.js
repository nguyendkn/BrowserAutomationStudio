class DialogsHelper {
  insertTextToCodeEditor(element, text) {
    const editor = window[element.attr('id')].Editor, line = editor.getPosition();

    editor.executeEdits('my-source', [{
      range: new monaco.Range(line.lineNumber, line.column, line.lineNumber, line.column),
      identifier: { major: 1, minor: 1 },
      forceMoveMarkers: true,
      text: text
    }]);
  }

  insertTextAtCursor(element, text) {
    let start = 0;
    try {
      start = element.val().length;
      start = cursorposition(element[0]).start;
    } catch (e) { }
    let val = element.val();
    val = val.slice(0, start) + text + val.slice(start);
    element.val(val).trigger('change');
  }

  checkPathEdited(selector) {
    if (selector === '#selector-input') {
      _MultiSelectManager.PathManualyEdited();
      BrowserAutomationStudio_TestPathInternal();
    }
  }
}