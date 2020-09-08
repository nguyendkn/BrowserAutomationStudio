class BasResourcesDialog extends BasModalDialog {
  /**
   * Create an instance of `BasResourcesDialog` class.
   * @param {Object} element - target element object.
   * @constructor
   */
  constructor (element) {
    super({
      items: _ResourceCollection.toJSON(),
      history: BasModalDialog.store.recentResources,
      selector: element.attr('data-result-target'),
      handler: BasResourcesDialog.handler,
      itemColor: 'dark',
      itemTypes: {
        single: 'resource',
        many: 'resources'
      },
      options: [
        {
          checked: false,
          id: 'resourceDontDie',
          text: 'Don\'t end application if not exists',
          description: [
            'By default script will stop after resource is finished.',
            'You can use this option to complete not the entire script, but only the thread.'
          ].join(' ')
        },
        {
          checked: true,
          id: 'resourceReuse',
          text: 'Reuse Resource',
          description: [
            'If this setting is enabled, then every time you use resource, it will be replaced with same value.',
            'For example, if you are reading from file with \'Reuse Resource\' enabled, then same line will be used during all thread lifetime.',
            'You need to disable this setting to take new line.'
          ].join(' ')
        }
      ]
    });
  }

  static handler(name, data) {
    const el = $(data.selector), isNumber = $(`${data.selector}_number:visible`).length > 0; let res = name;
    if (data.options.resourceDontDie) res += '|onlyfail';
    if (!data.options.resourceReuse) res += '|notreuse';
    let insert = `{{${res}}}`;

    if (isNumber) {
      el.closest('.input-group').find('.selector').html('expression');
      el.closest('.input-group').find('.input_selector_number').hide();
      el.closest('.input-group').find('.input_selector_string').show();
      el.val(insert);
    } else {
      if (name.length) {
        if (el.is('[data-resource-constructor]')) {
          el.val(res);
        } else {
          if (el.is('[data-is-code-editor]')) {
            this.helper.insertTextToCodeEditor(el, insert);
          } else {
            this.helper.insertTextAtCursor(el, insert);
          }
        }
      }
    }

    this.helper.checkPathEdited(data.selector);
  }

  /**
   * Get the item template function for `BasFunctionsDialog` class instance.
   * @readonly
   */
  get itemContentTemplate() { return _.template(`<%= item.name %>`); }
}