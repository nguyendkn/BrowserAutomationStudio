class BasSearchEngine extends SearchLib.SearchEngine {
  /**
   * Create an instance of `BasSearchEngine` class.
   * @param {Object} config - search engine configuration object.
   * @param {Object[]} config.documents - documents array.
   * @param {Object[]} config.fields - fields array.
   * @param {Number} config.limit - limit number.
   * @param {String} config.ref - ref string.
   * @constructor
   */
  constructor ({ documents, fields, limit, ref }) {
    super(limit, (match, score) => {
      const document = match.document;

      if (document.site === 'youtube') {
        return score * 0.7;
      }

      if (document.site === 'wiki') {
        return score * 0.7;
      }

      return score;
    });

    this.createIndex({
      documents,
      fields,
      ref
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

    if (!this.canceled) {
      results = super.search(query, []);
    }

    if (this.canceled) {
      results = super.search(query, ['descriptions']);
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
        const desc = this.getDescriptionInfo(match);
        const sugg = this.getSuggestionInfo(match);
        const vars = this.getVariableInfo(match);
        const infos = [desc, sugg, vars];
        _.max(infos, 'score').max = true;
        const document = match.document;

        if (document.type === 'action') {
          const variable = document.variables[vars.index];
          const array = document.descriptions;
          const short = document.description;
          const item = array[desc.index];

          if (variable && this.isVariable(variable)) {
            vars.color = 'green';
          } else {
            vars.color = 'dark';
          }

          desc.skip = short.includes(item);
        }

        return {
          keywords: this.getKeywords(match),
          descInfo: desc,
          suggInfo: sugg,
          varsInfo: vars,
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
      ...this.store.findByRef(key),
      descInfo: {},
      suggInfo: {},
      varsInfo: {},
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
  getDescriptionInfo({ scores }) { return this.getFieldInfo('descriptions', scores); }

  /**
   * Get the suggestion info object using the selected scores array.
   * @param {Object} source - selected source object with scores.
   * @param {Object[]} source.scores - selected scores array.
   */
  getSuggestionInfo({ scores }) { return this.getFieldInfo('suggestions', scores); }

  /**
   * Get the variable info object using the selected scores array.
   * @param {Object} source - selected source object with scores.
   * @param {Object[]} source.scores - selected scores array.
   */
  getVariableInfo({ scores }) { return this.getFieldInfo('variables', scores); }

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
    const gtModule = score > (module.score * module.weight);
    const gtName = score > (name.score * name.weight);
    const found = gtModule && gtName;

    return {
      index: found ? additional.index : null,
      color: 'dark',
      skip: false,
      max: false,
      found,
      score
    };
  }

  /**
   * Check that the selected string is variable string.
   * @param {String} variable - selected string.
   */
  isVariable(variable) {
    return variable === variable.toUpperCase();
  }
}
