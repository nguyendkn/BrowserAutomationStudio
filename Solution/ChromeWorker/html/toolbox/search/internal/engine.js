class BasSearchEngine {
  /**
   * Create an instance of `BasSearchEngine` class.
   * @param {Object[]} documents - documents array.
   * @constructor
   */
  constructor (documents) {
    this.engine = new SearchEngine();

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
   * Perform an action search using the selected query.
   * @param {String} query - selected query string.
   * @returns {Object[]} search results array.
   */
  search(query) {
    if (Object.prototype.hasOwnProperty.call(this.cache, query)) {
      return this.cache[query];
    }

    this.cache[query] = this.engine
      .search(query)
      .filter(({ document }) => {
        const ignored = [
          'httpclientgetcookiesforurl',
          'getcookiesforurl',
          'check',
        ];

        return !ignored.includes(document.key);
      })
      .map((match) => {
        const description = this.getDescriptionInfo(match);
        const suggestion = this.getSuggestionInfo(match);
        const infos = [description, suggestion];
        _.max(infos, 'score').max = true;

        return {
          keywords: this.getKeywords(match),
          descriptionInfo: description,
          suggestionInfo: suggestion,
          ...match.document
        };
      });

    return this.cache[query];
  }

  /**
   * Perform an action search using the action history.
   * @returns {Object[]} search results array.
   */
  recent() {
    return ActionHistory.map((key) => {
      const document = this.engine.store.findByField('key', key);

      return {
        descriptionInfo: {},
        suggestionInfo: {},
        keywords: [],
        ...document
      };
    });
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
        const queryLower = query.toLowerCase();

        if (!fieldLower.includes(queryLower)) {
          fieldData.tokenOriginal.forEach((source) => {
            const token = tokens.find((v) => source.includes(v)) || source;

            keywords[field].push({ comparator: token + field, match: token });
          });
        } else {
          keywords[field].push({ comparator: query + field, match: query });
        }
      });
    });

    return Object.entries(keywords).map(([field, array]) => {
      const matches = _(array)
        .uniq('comparator')
        .map((v) => v.match)
        .value();
      return { field, matches };
    });
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

    return { index: found ? additional.index : null, found, score };
  }
}
