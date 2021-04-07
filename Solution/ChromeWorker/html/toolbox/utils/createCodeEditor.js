(function (global) {
  const editors = [];

  global.createCodeEditor = function (element, options) {
    if ($(element).attr('data-installed') !== 'true') {
      const createEditorHandler = monaco.editor.onDidCreateEditor((editor) => {
        _MainView.trigger('monacoEditorCreated', editor);
        createEditorHandler.dispose();
      });

      const createModelHandler = monaco.editor.onDidCreateModel((model) => {
        _MainView.trigger('monacoModelCreated', model);
        createModelHandler.dispose();
      });

      const editor = monaco.editor.create(element, _.extend({
        scrollBeyondLastLine: false,
        language: 'javascript',
        automaticLayout: true,
        fontSize: 12
      }, options));

      editors.forEach((editor) => editor.dispose());
      $(element).attr('data-installed', 'true');
      editors.push(editor);
      return editor;
    }
  }
})(window);