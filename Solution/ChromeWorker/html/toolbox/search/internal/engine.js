class BasSearchEngine {
  /**
   * Create an instance of `BasSearchEngine` class.
   * @param {Object} config - search engine configuration object.
   * @param {Object[]} config.documents - documents array.
   * @param {Number} config.limit - limit number.
   * @constructor
   */
  constructor ({ documents, limit }) {
    this.engine = new SearchEngine(limit);

    this.engine.createIndex({
      fields: [
        {
          name: 'descriptions',
          weight: 0.125,
        },
        {
          name: 'suggestions',
          weight: 0.125,
        },
        {
          name: 'module',
          weight: 0.5,
        },
        {
          name: 'name',
          weight: 0.25,
        },
      ],
      ref: 'key',
      documents
    });

    this.cache = {};
  }

  /**
   * Check that the selected query string exists in the search cache.
   * @param {String} query - selected query string.
   */
  inCache(query) {
    return Object.prototype.hasOwnProperty.call(this.cache, query) === true;
  }

  /**
   * Perform an action search using the selected query.
   * @param {String} query - selected query string.
   * @returns {Object[]} search results array.
   */
  search(query) {
    if (this.inCache(query)) return this.cache[query];

    let results = [];

    if (!this.engine.canceled) {
      results = this.engine.search(query, false);
    }

    if (this.engine.canceled) {
      results = this.engine.search(query, true);
    }

    this.cache[query] = results
      .filter(({ document }) => {
        const ignored = [
          'httpclientgetcookiesforurl',
          'getcookiesforurl',
          'check',
        ];

        return !ignored.includes(document.key);
      })
      .map((match) => {
        const descInfo = this.getDescriptionInfo(match);
        const suggInfo = this.getSuggestionInfo(match);
        const infos = [descInfo, suggInfo];
        _.max(infos, 'score').max = true;
        const document = match.document;

        if (document.type === 'action') {
          const array = document.descriptions;
          const short = document.description;
          descInfo.skip = short.includes(array[descInfo.index]);
        }

        return {
          keywords: this.getKeywords(match),
          descriptionInfo: descInfo,
          suggestionInfo: suggInfo,
          ...document
        };
      });

    return this.cache[query];
  }

  /**
   * Perform an action search using the action history.
   * @returns {Object[]} search results array.
   */
  recent() {
    return ActionHistory.map((key) => ({
      ...this.engine.store.findByField('key', key),
      descriptionInfo: {},
      suggestionInfo: {},
      keywords: []
    }));
  }

  getKeywords({ document, metadata, tokens, query }) {
    const keywords = {};

    Object.values(metadata).forEach((found) => {
      Object.entries(found).forEach(([fieldName, fieldData]) => {
        const [field, index] = fieldName.split('_');
        if (!keywords[field]) keywords[field] = [];

        const fieldLower = index
          ? document[field][index].toLowerCase()
          : document[field].toLowerCase();

        if (!fieldLower.includes(query.toLowerCase())) {
          fieldData.tokenOriginal.forEach((source) => {
            const token = tokens.find((t) => source.includes(t)) || source;
            keywords[field].push({ comparator: token + field, match: token });
          });
        } else {
          keywords[field].push({ comparator: query + field, match: query });
        }
      });
    });

    return Object.entries(keywords).map(([field, collection]) => ({
      matches: _(collection)
        .uniq('comparator')
        .map(v => v.match)
        .value(),
      field
    }));
  }

  /**
   * Get the description info object using the selected scores array.
   * @param {Object} source - selected source object with scores.
   * @param {Object[]} source.scores - selected scores array.
   */
  getDescriptionInfo({ scores }) {
    return this.getFieldInfo('descriptions', scores);
  }

  /**
   * Get the suggestion info object using the selected scores array.
   * @param {Object} source - selected source object with scores.
   * @param {Object[]} source.scores - selected scores array.
   */
  getSuggestionInfo({ scores }) {
    return this.getFieldInfo('suggestions', scores);
  }

  /**
   * Get the field info object using the selected scores array.
   * @param {Object[]} scores - selected scores array.
   * @param {String} source - selected source string.
   */
  getFieldInfo(source, scores) {
    const additional = scores.find((v) => v.field === source);
    const module = scores.find((v) => v.field === 'module');
    const name = scores.find((v) => v.field === 'name');

    const score = additional.score * additional.weight;
    const gtModule = score > module.score * module.weight;
    const gtName = score > name.score * name.weight;
    const found = gtModule && gtName;

    return {
      index: found ? additional.index : null,
      skip: false,
      max: false,
      found,
      score
    };
  }
}
