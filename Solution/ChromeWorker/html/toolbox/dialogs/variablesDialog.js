class BasVariablesDialog extends BasDialogsLib.InsertionMixin(BasDialogsLib.BasModalDialog) {
  /**
   * Create an instance of `BasVariablesDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    const useGlobals = element.attr('disable_globals') !== 'true', globals = useGlobals
      ? _GlobalVariableCollection.toJSON()
      : [];

    const useLocals = element.attr('disable_locals') !== 'true', locals = useLocals
      ? _VariableCollection.toJSON()
      : [];

    const actions = BasDialogsLib.utils.getActions();

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

        return {
          description: action.description,
          popup: action.popup,
          name: action.name,
          ref: action.ref,
          ...item
        };
      }),
      options: BasDialogsLib.options.variablesOptions,
      recent: BasDialogsLib.store.variables,
      metadata: {
        findPredicate: BasDialogsLib.store.predicates.variables,
        template: BasDialogsLib.templates.variablesContent,
        pluralName: 'variables',
        singleName: 'variable',
        color: 'green'
      }
    });

    this.selector = element.attr('data-result-target');
    this.useGlobals = useGlobals;
    this.useLocals = useLocals;
  }

  /**
   * Handler function for the `close` event.
   * @param {String} name - selected item name.
   */
  onClose(name, { global }) {
    const el = $(this.selector); const insert = `[[${global ? 'GLOBAL:' : ''}${name}]]`;

    if (name.length) {
      if ($(`${this.selector}_number:visible`).length) {
        this.insertAsExpression(el, insert);
      } else {
        if (!el.is('[data-variable-constructor]')) {
          if (el.is('[data-is-code-editor]')) {
            this.insertTextToEditor(el, insert);
          } else {
            this.insertTextAtCursor(el, insert);
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

      BasDialogsLib.store.addVariable({ name, global }, global);
    }

    if (this.selector === '#selector-input') MainView.prototype.pathchanged();
  }

  /**
   * Handler function for the `add` event.
   */
  onAdd() {
    if (this.useLocals) {
      BrowserAutomationStudio_OpenAction('setvariable');
    } else {
      BrowserAutomationStudio_OpenAction('globalset');
    }

    this.closeDialog();
  }
}