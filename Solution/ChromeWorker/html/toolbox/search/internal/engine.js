class BasSearchEngine extends SearchLib.SearchEngine {
  static weights = {
    descriptions: { youtube: 0.1, action: 0.1, wiki: 0.1 },
    suggestions: { youtube: 0.1, action: 0.1, wiki: 0.1 },
    timestamps: { youtube: 0.1, action: 0.1, wiki: 0.1 },
    variables: { youtube: 0.1, action: 0.1, wiki: 0.1 },
    module: { youtube: 0.5, action: 0.5, wiki: 0.5 },
    name: { youtube: 0.2, action: 0.2, wiki: 0.2 }
  };

  /**
   * Create an instance of `BasSearchEngine` class.
   * @param {Object} config - search engine configuration object.
   * @param {Object[]} config.documents - index documents array.
   * @param {Object[]} config.fields - index fields array.
   * @param {Number} config.distance - distance number.
   * @param {Number} config.limit - limit number.
   * @param {String} config.ref - ref string.
   * @constructor
   */
  constructor ({ documents, distance, fields, limit, ref }) {
    super({
      scoring: (score, { document }) => {
        const { site } = document;
        if (site === 'youtube') return score * 0.7;
        if (site === 'wiki') return score * 0.7;
        return score;
      },
      tokenizerOptions: {
        trimRightRegex: SearchLib.TextProcessor.trimRightRegex,
        trimLeftRegex: SearchLib.TextProcessor.trimLeftRegex,
        tokenizeRegex: SearchLib.TextProcessor.tokenizeRegex
      },
      distance,
      limit
    });

    this.createIndex({ documents, fields, ref }); this.cache = {};
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
    const trim = (str) => SearchLib.TextProcessor.trim(str); const keywords = {};

    Object.values(metadata).forEach((value) => {
      Object.entries(value).forEach(([fieldName, fieldData]) => {
        const [field, index] = fieldName.split('_');
        if (!keywords[field]) keywords[field] = [];

        const fieldLower = index
          ? document[field][index].toLowerCase()
          : document[field].toLowerCase();

        if (!fieldLower.includes(query.toLowerCase())) {
          fieldData.tokenOriginal.forEach((source) => {
            const token = tokens.find((str) => source.includes(str)) || source;
            keywords[field].push({ comparator: token + field, match: token });
          });
        } else {
          keywords[field].push({ comparator: trim(query) + field, match: trim(query) });
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

  getTimecode({ timestamps, timecodes }, { index }) {
    if (timestamps.length && index !== null) {
      const time = timecodes[timestamps[index]].split(':');

      if (time.length === 3) {
        return `?t=${time[0]}h${time[1]}m${time[2]}s`;
      }

      if (time.length === 2) {
        return `?t=${time[0]}m${time[1]}s`;
      }

      return null;
    }

    return null;
  }

  /**
   * Get the description info object using the selected scores array.
   * @param {{scores: Object[]}} source - selected source object with scores array.
   */
  getDescriptionInfo({ scores }) { return this.getFieldInfo('descriptions', scores); }

  /**
   * Get the suggestion info object using the selected scores array.
   * @param {{scores: Object[]}} source - selected source object with scores array.
   */
  getSuggestionInfo({ scores }) { return this.getFieldInfo('suggestions', scores); }

  /**
   * Get the timestamp info object using the selected scores array.
   * @param {{scores: Object[]}} source - selected source object with scores array.
   */
  getTimestampInfo({ scores }) { return this.getFieldInfo('timestamps', scores); }

  /**
   * Get the variable info object using the selected scores array.
   * @param {{scores: Object[]}} source - selected source object with scores array.
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

    const info = {
      index: found ? additional.index : null,
      color: "dark",
      found: found,
      score: score,
      skip: false,
      max: false,
      get best() {
        return info.found && info.max && !info.skip;
      },
    };

    return info;
  }
}
