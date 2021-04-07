function createCodeEditor(element, options) {
  if ($(element).attr('data-installed') !== 'true') {
    monaco.editor.create(element, {
      scrollBeyondLastLine: false,
      language: 'javascript',
      automaticLayout: true,
      value: options.value,
      fontSize: 12
    });

    const createEditorHandler = monaco.editor.onDidCreateEditor((editor) => {
      _MainView.trigger('monacoEditorCreated', editor);
      createEditorHandler.dispose();
    });

    const createModelHandler = monaco.editor.onDidCreateModel((model) => {
      _MainView.trigger('monacoModelCreated', model);
      createModelHandler.dispose();
    });

    $(element).attr('data-installed', 'true');
  }
}