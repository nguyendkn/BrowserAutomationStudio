class BasFunctionsDialog extends BasModalDialog {
  /**
   * Create an instance of `BasFunctionsDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    super({
      history: BasModalDialog.store.recentFunctions,
      selector: element.attr('data-result-target'),
      template: _.template(`<%= name %>`),
      items: _FunctionCollection.toJSON(),
      handler: (name, data) => {
        if (name.length) {
          BasModalDialog.store.addFunction({ name });
          $(data.selector).val(name);
        }
        _MainView.funcchange(name);
      },
      itemColor: 'dark',
      itemNames: {
        single: 'function',
        many: 'functions'
      },
      options: []
    });
  }
}