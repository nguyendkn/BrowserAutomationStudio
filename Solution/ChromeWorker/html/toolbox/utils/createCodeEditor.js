function createCodeEditor(element, options) {
  if (!$(element).attr('data-installed') === 'true') {
    monaco.editor.create(element, {
      scrollBeyondLastLine: false,
      language: 'javascript',
      automaticLayout: true,
      value: options.value,
      fontSize: 12
    });

    const createEditorHandler = monaco.onDidCreateEditor(() => {
      _MainView.trigger('monacoEditorCreated');
      createEditorHandler.dispose();
    });

    const createModelHandler = monaco.onDidCreateModel(() => {
      _MainView.trigger('monacoModelCreated');
      createModelHandler.dispose();
    });

    $(element).attr('data-installed', 'true');
  }
}