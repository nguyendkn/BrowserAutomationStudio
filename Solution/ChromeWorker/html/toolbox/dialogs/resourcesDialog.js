class BasResourcesDialog extends BasDialogsLib.BasModalDialog {
  /**
   * Utility methods for the dialog handler.
   */
  utils = BasDialogsLib.utils;

  /**
   * Create an instance of `BasResourcesDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    super({
      recent: BasDialogsLib.store.recentResources,
      items: _ResourceCollection.toJSON(),
      options: [
        {
          checked: false,
          id: 'resourceDontDie',
          text: tr('Don\'t end application if not exists'),
          description: tr([
            'By default script will stop after resource is finished.',
            'You can use this option to complete not the entire script, but only the thread.'
          ].join(' '))
        },
        {
          checked: true,
          id: 'resourceReuse',
          text: tr('Reuse Resource'),
          description: tr([
            'If this setting is enabled, then every time you use resource, it will be replaced with same value.',
            'For example, if you are reading from file with \'Reuse Resource\' enabled, then same line will be used during all thread lifetime.',
            'You need to disable this setting to take new line.'
          ].join(' '))
        }
      ],
      metadata: {
        template: _.template(`<%= name %>`),
        pluralName: 'resources',
        singleName: 'resource',
        color: 'dark'
      }
    });

    this.selector = element.attr('data-result-target');
  }

  handler(name, data) {
    const el = $(this.selector); let resource = name;
    if (data.options.resourceDontDie) {
      resource += '|onlyfail';
    }
    if (!data.options.resourceReuse) {
      resource += '|notreuse';
    }
    const insert = `{{${resource}}}`;

    if (name.length) {
      if ($(`${this.selector}_number:visible`).length) {
        this.utils.insertAsExpression(el, insert);
      } else {
        if (el.is('[data-resource-constructor]')) {
          el.val(resource);
        } else {
          if (el.is('[data-is-code-editor]')) {
            this.utils.insertTextToEditor(el, insert);
          } else {
            this.utils.insertTextAtCursor(el, insert);
          }
        }
      }

      BasDialogsLib.store.addResource({ name });
    }

    this.utils.checkPathEdited(this.selector);
  }
}