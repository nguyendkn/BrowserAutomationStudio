class BasSearchEngine {
  /**
   * Create an instance of `BasSearchEngine` class.
   * @constructor
   */
  constructor () {
    this.engine = new SearchEngine();

    this.engine.createIndex({
      documents: [
        ...this._getActionItems(),
        ...this._getVideoItems(),
        ...this._getWikiItems()
      ],
      fields: ['name'],
      ref: 'key'
    });

    this.cache = {};
  }

  search(query) {
    if (_.has(this.cache, query)) return this.cache[query];

    const results = this.engine.search(query)
      .map((match) => {
        const { ref } = match;
        return this.engine.store.getDocumentByRef(ref);
      })
      .filter(({ key }) => {
        const ignoredItems = [
          'httpclientgetcookiesforurl',
          'getcookiesforurl',
          'check'
        ];

        return !ignoredItems.includes(key);
      });

    this.cache[query] = results;
    return this.cache[query];
  }

  recent() {
    return ActionHistory.map((key) => this.engine.store.getDocumentByField('key', key));
  }

  /**
   * Get all action items.
   * @private
   */
  _getActionItems() {
    const getTextContent = (el) => $('<div />').append(tr(el.html())).text();

    return _.map(_A, (value, key) => {
      let content = $('#' + key).text();

      let defaultDesc = $(content)
        .find('.tooltip-paragraph-first-fold');
      let shortDesc = $(content)
        .find('.short-description');
      let description = null;

      if (defaultDesc.length) {
        description = getTextContent(defaultDesc);
      }

      if (shortDesc.length) {
        description = getTextContent(shortDesc);
      }

      let action = { name: tr(value.name), type: 'action', description, key };

      if (value.class && value.class == 'browser') {
        action.description += tr(' This action works only with element inside browser.');
        action.module = tr('Browser > Element');
        action.icon = '../icons/element.png';
        action.popup = true;
      } else {
        let group = this._getActionGroup(key);
        action.module = group.description;
        action.icon = group.icon;
        action.popup = false;
      }

      return action;
    });
  }

  _getActionGroup(action) {
    const name = _A2G[action] || 'browser';
    const tasks = _TaskCollection.toJSON();
    return _.find(tasks, { type: 'group', name });
  }

  /**
   * Get link item for selected type.
   * @param {Object} item - item object. 
   * @param {*} type - item type.
   * @private
   */
  _getLinkItem(item, type) {
    return {
      icon: `../icons/${type}.png`,
      name: item.name,
      key: item.url,
      type: 'link'
    }
  }

  /**
   * Get all video items.
   * @private
   */
  _getVideoItems() {
    return _.filter(_VIDEO, (v) => _K == v.lang).map((v) => this._getLinkItem(v, 'youtube'));
  }

  /**
   * Get all wiki items.
   * @private
   */
  _getWikiItems() {
    return _.filter(_WIKI, (w) => _K == w.lang).map((w) => this._getLinkItem(w, 'wiki'));
  }
}