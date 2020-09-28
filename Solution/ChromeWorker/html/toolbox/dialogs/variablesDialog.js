class BasVariablesDialog extends BasModalDialog {
  /**
   * Create an instance of `BasVariablesDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    const globalVariables = (element.attr('disable_globals') != 'true'
      ? _GlobalVariableCollection.toJSON().map((v) => ({ isGlobal: !false, ...v }))
      : []);

    const localVariables = (element.attr('disable_locals') != 'true'
      ? _VariableCollection.toJSON().map((v) => ({ isGlobal: false, ...v }))
      : []);

    super({
      template: _.template(`<%= (isGlobal ? 'GLOBAL:' : '') + name %>`),
      items: [...globalVariables, ...localVariables],
      history: BasModalDialog.store.recentVariables,
      selector: element.attr('data-result-target'),
      handler: BasVariablesDialog.handler,
      itemColor: 'green',
      itemNames: {
        single: 'variable',
        many: 'variables'
      },
      options: []
    });
  }

  static handler(name, data) {
    const el = $(data.selector); let insert = `[[${data.isGlobal ? 'GLOBAL:' : ''}${name}]]`;

    if ($(`${data.selector}_number:visible`).length) {
      el.closest('.input-group').find('.selector').html('expression');
      el.closest('.input-group').find('.input_selector_number').hide();
      el.closest('.input-group').find('.input_selector_string').show();
      el.val(insert);
    } else {
      if (name.length) {
        if (!el.is('[data-variable-constructor]')) {
          if (el.is('[data-is-code-editor]')) {
            this.helper.insertTextToCodeEditor(el, insert);
          } else {
            this.helper.insertTextAtCursor(el, insert);
          }
        } else {
          if (el.is('[data-append-array]')) {
            if (el.val().length === 0) {
              el.val(name);
            } else {
              el.val(el.val() + ',' + name);
            }
          } else {
            el.val(name);
          }
        }
      }
    }

    if (name.length) {
      if (!data.isGlobal) {
        BasModalDialog.store.addVariable({ name }, false);
      } else {
        BasModalDialog.store.addVariable({ name }, true);
      }
    }

    this.helper.checkPathEdited(data.selector);
  }
}