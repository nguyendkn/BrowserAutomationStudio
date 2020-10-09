class BasVariablesDialog extends BasDialogsLib.BasModalDialog {
  /**
   * Utility methods for the dialog handler.
   */
  utils = BasDialogsLib.utils;

  /**
   * Create an instance of `BasVariablesDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    const globals = element.attr('disable_globals') !== 'true'
      ? _GlobalVariableCollection.toJSON().map((item) => ({ global: !false, ...item }))
      : [];

    const locals = element.attr('disable_locals') !== 'true'
      ? _VariableCollection.toJSON().map((item) => ({ global: false, ...item }))
      : [];

    const actions = BasDialogsLib.getActions();

    super({
      items: [...globals, ...locals].map((item) => {
        const action = actions.find(({ variables }) => variables.includes(item.name));

        if (!action) {
          let description;

          if (item.name === 'FOREACH_DATA') {
            description = tr('Current list element in foreach loop');
          }

          if (item.name === 'CYCLE_INDEX') {
            description = tr('Current loop repetition');
          }

          return { description, ...item };
        }

        return { description: action.description, ref: actions.name, ...item };
      }),
      recent: BasDialogsLib.store.recentVariables,
      metadata: {
        template: _.template(`<%= (global ? 'GLOBAL:' : '') + name %>`),
        pluralName: 'variables',
        singleName: 'variable',
        color: 'green'
      }
    });

    this.selector = element.attr('data-result-target');
  }

  handler(name, { global }) {
    const el = $(this.selector); const insert = `[[${global ? 'GLOBAL:' : ''}${name}]]`;

    if (name.length) {
      if ($(`${this.selector}_number:visible`).length) {
        this.utils.insertAsExpression(el, insert);
      } else {
        if (!el.is('[data-variable-constructor]')) {
          if (el.is('[data-is-code-editor]')) {
            this.utils.insertTextToEditor(el, insert);
          } else {
            this.utils.insertTextAtCursor(el, insert);
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

      BasDialogsLib.store.addVariable({ name }, global);
    }

    this.utils.checkPathEdited(this.selector);
  }
}