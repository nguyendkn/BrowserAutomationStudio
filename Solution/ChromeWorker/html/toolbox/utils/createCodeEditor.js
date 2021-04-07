function createCodeEditor(element, options) {
  if ($(element).attr('data-installed') !== 'true') {
    const createEditorHandler = monaco.editor.onDidCreateEditor((editor) => {
      _MainView.trigger('monacoEditorCreated', editor);
      createEditorHandler.dispose();
    });

    const createModelHandler = monaco.editor.onDidCreateModel((model) => {
      _MainView.trigger('monacoModelCreated', model);
      createModelHandler.dispose();
    });

    monaco.editor.create(element, _.extend({
      scrollBeyondLastLine: false,
      language: 'javascript',
      automaticLayout: true,
      fontSize: 12
    }, options));

    $(element).attr('data-installed', 'true');
  }
}