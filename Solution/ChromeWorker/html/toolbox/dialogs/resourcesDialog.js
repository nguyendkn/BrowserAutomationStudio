class BasResourcesDialog extends BasDialogsLib.InsertionMixin(BasDialogsLib.BasModalDialog) {
  /**
   * Create an instance of `BasResourcesDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    super({
      options: BasDialogsLib.options.resourcesOptions,
      recent: BasDialogsLib.store.resources,
      items: _ResourceCollection.toJSON(),
      metadata: {
        findPredicate: BasDialogsLib.store.predicates.resources,
        template: BasDialogsLib.templates.resourcesContent,
        pluralName: 'resources',
        singleName: 'resource',
        color: 'dark'
      }
    });

    this.selector = element.attr('data-result-target');
  }

  /**
   * Handler function for the `close` event.
   * @param {String} name - selected item name.
   */
  onClose(name, { options }) {
    const el = $(this.selector); let resource = name;
    if (options.resourceDontDie) {
      resource += '|onlyfail';
    }
    if (!options.resourceReuse) {
      resource += '|notreuse';
    }
    const insert = `{{${resource}}}`;

    if (name.length) {
      if ($(`${this.selector}_number:visible`).length) {
        this.insertAsExpression(el, insert);
      } else {
        if (el.is('[data-resource-constructor]')) {
          el.val(resource);
        } else {
          if (el.is('[data-is-code-editor]')) {
            this.insertTextToEditor(el, insert);
          } else {
            this.insertTextAtCursor(el, insert);
          }
        }
      }

      BasDialogsLib.store.addResource({ name });
    }

    if (this.selector === '#selector-input') MainView.prototype.pathchanged();
  }

  /**
   * Handler function for the `add` event.
   */
  onAdd() {
    $(BasDialogsLib.templates.createResource())
      .on('hidden.bs.modal', function () {
        $(this).remove();
      })
      .css('z-index', '9999999')
      .modal('show');
  }
}