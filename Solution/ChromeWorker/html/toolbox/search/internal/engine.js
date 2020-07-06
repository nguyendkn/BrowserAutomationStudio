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
          name: 'suggestion',
          weight: 0.2
        },
        {
          name: 'module',
          weight: 0.5
        },
        {
          name: 'name',
          weight: 0.3
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
    if (_.has(this.cache, query)) return this.cache[query];

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
        const keywords = this.getKeywords(match);

        return {
          suggestionInfo: this.getSuggestionInfo(match),
          ...match.document,
          keywords
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
        suggestionInfo: {},
        keywords: [],
        ...document
      };
    });
  }

  getKeywords({ document, metadata, tokens, query }) {
    const keywords = [];

    Object.values(metadata).forEach((value) => {
      Object.entries(value).forEach(([key, data]) => {
        const [field, index] = key.split('_');

        const fieldLower = index
          ? document[field][index].toLowerCase()
          : document[field].toLowerCase();
        const queryLower = query.toLowerCase();

        if (!fieldLower.includes(queryLower)) {
          data.tokenOriginal.forEach((source) => {
            const token = (tokens.find((v) => source.includes(v)) || source);

            keywords.push({ comparator: token + field, match: token, field });
          });
        } else {
          keywords.push({ comparator: query + field, match: query, field });
        }
      });
    });

    return _.uniq(keywords, 'comparator');
  }

  getSuggestionInfo({ scores }) {
    const suggestion = scores.find((v) => v.field === 'suggestion');
    const module = scores.find((v) => v.field === 'module');
    const name = scores.find((v) => v.field === 'name');

    const score = suggestion.score * suggestion.weight;
    const gtModule = score > (module.score * module.weight);
    const gtName = score > (name.score * name.weight);
    const found = gtModule && gtName;

    return { index: found ? suggestion.index : null, found };
  }
}
