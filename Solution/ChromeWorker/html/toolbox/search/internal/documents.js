class DocumentsStore {
  /**
   * Create an instance of `DocumentsStore` class.
   * @constructor
   */
  constructor () {
    this.tasks = _TaskCollection.toJSON();
    this.collection = _A2G;
    this.actions = _A;
    this.groups = _G;

    this.video = _VIDEO;
    this.wiki = _WIKI;
    this.lang = _K;
  }

  /**
   * Get an array of all action items.
   */
  getActionItems() {
    const getDescription = (el) => $('<div />').append(tr(el.html())).text();

    return _.map(this.actions, (action, key) => {
      const actionTemplate = $(`#${key}`).text();

      const defaultDesc = $(actionTemplate).find('.tooltip-paragraph-first-fold');
      const shortDesc = $(actionTemplate).find('.short-description');
      let description = null;

      if (defaultDesc.length) {
        description = getDescription(defaultDesc);
      }

      if (shortDesc.length) {
        description = getDescription(shortDesc);
      }

      const item = {
        popup: action.class && action.class === "browser",
        suggestion: this.getActionSuggestion(action),
        name: tr(action.name),
        type: 'action',
        description,
        key,
      };

      if (item.popup) {
        item.description += tr(' This action works only with element inside browser.');
        item.module = tr('Browser > Element');
        item.icon = '../icons/element.png';
      } else {
        const group = this.getActionGroup(key);
        item.module = group.description;
        item.group = group.name;
        item.icon = group.icon;
      }

      return item;
    });
  }

  /**
   * Get action suggestion array using the selected action object
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
   * Get action group object using the selected action name.
   * @param {String} action - selected action name.
   */
  getActionGroup(action) {
    const name = _.get(this.collection, action, 'browser');

    return _.find(this.tasks, {
      type: 'group',
      name: name,
    });
  }

  /**
   * Get an array of all video items.
   */
  getVideoItems() { return this._getLinkItems(this.video, 'youtube'); }

  /**
   * Get an array of all wiki items.
   */
  getWikiItems() { return this._getLinkItems(this.wiki, 'wiki'); }

  /**
   * Get an array of all link items for the selected type.
   * @param {Object[]} items - selected items array.
   * @param {String} type - selected items type.
   * @private
   */
  _getLinkItems(items, type) {
    return items
      .filter((item) => this.lang === item.lang)
      .map((item) => ({
        suggestion: this.getLinkSuggestion(item),
        icon: `../icons/${type}.png`,
        name: item.name,
        key: item.url,
        type: 'link',
      }));
  }
}
