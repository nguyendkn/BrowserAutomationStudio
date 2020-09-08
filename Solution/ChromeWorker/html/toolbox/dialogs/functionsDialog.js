class BasFunctionsDialog extends BasModalDialog {
  /**
   * Create an instance of `BasFunctionsDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    super({
      items: _FunctionCollection.toJSON(),
      history: BasModalDialog.store.recentFunctions,
      selector: element.attr('data-result-target'),
      handler: BasFunctionsDialog.handler,
      selector: selector,
      itemColor: 'dark',
      itemTypes: {
        single: 'function',
        many: 'functions'
      },
      options: []
    });
  }

  static handler(name, data) {
    if (name.length) {
      $(data.selector).val(name);
    }
    _MainView.funcchange(name);
  }

  /**
   * Get the item template function for `BasFunctionsDialog` class instance.
   * @readonly
   */
  get itemContentTemplate() { return _.template(`<%= item.name %>`); }
}