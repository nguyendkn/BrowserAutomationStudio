BasDialogsLib.insertHelper = {
  insertResource(selector, name, insert) {
    this.insert(selector, name, insert, 'resource');
  },

  insertVariable(selector, name, insert) {
    this.insert(selector, name, insert, 'variable');
  },

  insert(selector, name, text, type) {
    const $element = $(selector);

    if ($(`${selector}_number:visible`).length) {
      const $group = $element.closest('.input-group');
      $group.find('.input_selector_number').hide();
      $group.find('.input_selector_string').show();
      $group.find('.selector').html('expression');
      $element.val(text);
    } else {
      if (!$element.is(`[data-${type}-constructor]`)) {
        if ($element.is('[data-is-code-editor]')) {
          const editor = window[$element.attr('id')].Editor, line = editor.getPosition();

          editor.executeEdits('my-source', [{
            range: new monaco.Range(line.lineNumber, line.column, line.lineNumber, line.column),
            identifier: { major: 1, minor: 1 },
            forceMoveMarkers: true,
            text: text
          }]);
        } else {
          let start = 0;
          try {
            start = $element.val().length;
            start = cursorPosition($element[0]).start;
          } catch (e) { }
          let val = $element.val();
          val = val.slice(0, start) + text + val.slice(start);
          $element.val(val).trigger('change');
        }
      } else {
        $element.val((_, value) => {
          if (type === 'variable' && $element.is('[data-append-array]')) {
            if (value.length) {
              return [value, name].join(',');
            }
          }

          return name;
        });
      }
    }

    if (selector === '#selector-input') {
      MainView.prototype.pathchanged();
    }

    BasDialogsLib.utils.restoreCursor(selector);
  }
}