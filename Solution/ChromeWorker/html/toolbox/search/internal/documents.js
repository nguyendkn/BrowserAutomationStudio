class DocumentsStore {
  /**
   * Create an instance of `DocumentsStore` class.
   * @constructor
   */
  constructor () {
    this.collection = _TaskCollection.toJSON();
    this.actions = _A;
    this.groups = _G;
    this.map = _A2G;

    this.video = _VIDEO;
    this.wiki = _WIKI;
    this.lang = _K;
  }

  /**
   * Get an array of all action items.
   */
  getActionItems() {
    return Object.entries(this.actions).map(([name, action]) => {
      const source = $(`#${name}`);
      const descriptions = this.getActionDescriptions(source.text());
      const variables = this.getActionVariables(source.html());

      const item = {
        popup: (!action.group && action.class && action.class === 'browser'),
        suggestions: this.getActionSuggestion(action),
        descriptions: descriptions.array,
        description: descriptions.short,
        name: tr(action.name),
        variables: variables,
        type: 'action',
        timestamps: [],
        timecodes: {},
        key: name,
      };

      if (item.popup) {
        item.description += tr(' This action works only with element inside browser.');
        item.module = tr('Browser > Element');
        item.icon = '../icons/element.png';
      } else {
        const group = this.getActionGroup(name);
        item.module = group.description;
        item.group = group.name;
        item.icon = group.icon;
      }

      return item;
    });
  }

  /**
   * Get action descriptions object using the selected action source.
   * @param {String} source - selected action source.
   */
  getActionDescriptions(source) {
    const getTextContent = (el) => {
      const data = $(el).html();
      const node = $('<div />');
      node.append(data);

      if (this.lang === 'en') node.find('.tr-ru').remove();

      if (this.lang === 'ru') node.find('.tr-en').remove();

      node.find('.tr').each(function () {
        $(this).html((_, html) => tr(html));
      });

      return $('<div />').append(tr(node.html())).text();
    };

    const array = _.map(
      $(source).find('[class*="tooltip-paragraph"]'),
      getTextContent
    );

    const short = _.map(
      $(source).find('[class*="short-description"]'),
      getTextContent
    );

    return {
      short: short.length ? short[0] : array[0],
      array: array.length ? array : short
    };
  }

  /**
   * Get action variables array using the selected action source.
   * @param {String} source - selected action source.
   */
  getActionVariables(source) {
    const template = _.template(source)({ function_params: [], selector: {}, model: {} });

    return _.uniq([
      ...$.map(
        $(template).find('input[data-variable-constructor=true]'),
        (e) => e.value
      ),
      ...$.map(
        $(template).find('.input_selector_string'),
        (e) => e.placeholder
      ),
      ...$.map(
        $(template).find('.input_selector_number'),
        (e) => e.placeholder
      )
    ]);
  }

  /**
   * Get action suggestion array using the selected action object.
   * @param {Object} action - selected action object.
   */
  getActionSuggestion(action) {
    const source = action.suggestion;
    return source ? this.getSuggestion(source[this.lang]) : [];
  }

  /**
   * Get link suggestion array using the selected link object.
   * @param {Object} link - selected link object.
   */
  getLinkSuggestion(link) {
    const source = link.suggestion;
    return source ? this.getSuggestion(source) : [];
  }

  /**
   * Get suggestion array from the selected suggestion string.
   * @param {String} suggestion - selected suggestion string.
   */
  getSuggestion(suggestion) {
    return suggestion.split(',')
      .map((str) => str.trim())
      .filter((s) => s !== ' ')
      .filter((s) => s !== '');
  }

  /**
   * Get an array of all video items.
   */
  getVideoItems() { return this.getLinkItems(this.video, 'youtube'); }

  /**
   * Get an array of all wiki items.
   */
  getWikiItems() { return this.getLinkItems(this.wiki, 'wiki'); }

  /**
   * Get an array of all link items for the selected type.
   * @param {Object[]} items - selected items array.
   * @param {String} type - selected items type.
   * @private
   */
  getLinkItems(items, type) {
    return items
      .filter((item) => this.lang === item.lang)
      .map((item) => {
        return {
          timestamps: _.values(item.timestamps || {}),
          timecodes: _.invert(item.timestamps || {}),
          suggestions: this.getLinkSuggestion(item),
          descriptions: [item.description],
          description: item.description,
          icon: `../icons/${type}.png`,
          name: item.name,
          key: item.url,
          type: type
        };
      });
  }

  /**
   * Get action group object using the selected action name.
   * @param {String} action - selected action name.
   */
  getActionGroup(action) {
    const name = _.get(this.map, action, 'browser');

    return _.find(this.collection, {
      type: 'group',
      name: name
    });
  }
}
