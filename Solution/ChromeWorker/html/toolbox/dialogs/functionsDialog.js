class BasFunctionsDialog extends BasDialogsLib.BasModalDialog {
  /**
   * Create an instance of `BasFunctionsDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    super({
      options: BasDialogsLib.options.functionsOptions,
      recent: BasDialogsLib.store.recentFunctions,
      items: _FunctionCollection.toJSON(),
      metadata: {
        template: _.template(`<%= name %>`),
        pluralName: 'functions',
        singleName: 'function',
        color: 'dark'
      }
    });

    this.selector = element.attr('data-result-target');
  }

  /**
   * Handler function for the `close` event.
   * @param {String} name - selected item name.
   */
  onClose(name) {
    if (name.length) {
      BasDialogsLib.store.addFunction({ name });
      $(this.selector).val(name);
    }
    _MainView.funcchange(name);
  }

  /**
   * Handler function for the `add` event.
   */
  onAdd() {
    $(BasDialogsLib.templates.createFunction())
      .css('z-index', '9999999')
      .modal('show');
  }
}