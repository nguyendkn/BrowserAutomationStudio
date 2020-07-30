SearchLib.TextProcessor = {
  /**
   * Tokenizer for splitting a string into sentences.
   */
  sentenceTokenizer: new SearchLib.SentenceTokenizer(),

  /**
   * Regex pattern for default tokenization.
   */
  tokenizeRegex: /[^\wА-Яа-яЁё0-9_.]+/,

  /**
   * Regex pattern for trimming (right).
   */
  trimRightRegex: /[^\wА-Яа-яЁё]+$/,

  /**
   * Regex pattern for trimming (left).
   */
  trimLeftRegex: /^[^\wА-Яа-яЁё]+/,

  /**
   * Max chars limit for truncating.
   */
  truncateLimit: 200,

  /**
   * Truncate the source text using an array of highlighted keywords and the most relevant sentence.
   * @param {String[]} keywords - selected highlighted keywords array.
   * @param {String} string - selected source text string.
   * @returns {String} truncated text string.
   */
  truncate(string, keywords) {
    let { sentence } = this.getSentence(string, keywords);
    let truncStart = false;
    let truncEnd = false;
    let next = 'start';

    while (sentence.length > this.truncateLimit) {
      sentence = this.trim(sentence);
      const tokens = this.tokenize(sentence);
      const head = tokens.shift();
      const last = tokens.pop();

      const skipHead = keywords.includes(head);
      const skipLast = keywords.includes(last);

      const truncate = (defaultNext) => {
        next = defaultNext || next;

        if (next === 'start') {
          sentence = sentence.slice(head.length, sentence.length);
          if (!truncStart) truncStart = true;
          next = 'end';
        }

        if (next === 'end') {
          sentence = sentence.slice(0, sentence.length - last.length - 1);
          if (!truncEnd) truncEnd = true;
          next = 'start';
        }
      };

      if (!skipHead && !skipLast) truncate();
      else if (skipLast) truncate('start');
      else if (skipHead) truncate('end');
      else truncate();
    }

    if (truncStart) sentence = '... ' + sentence;
    if (truncEnd) sentence = sentence + ' ...';
    return sentence;
  },

  /**
   * Get the sentence string from the source text that has the maximum number of highlighted keywords.
   * @param {String[]} keywords - selected highlighted keywords array.
   * @param {String} string - selected source text string.
   * @returns {{sentence: String}} object with sentence.
   */
  getSentence(string, keywords) {
    const sentences = this.sentenceTokenizer.tokenize(string).map((sentence) => {
      const filtered = keywords.filter((k) => sentence.includes(k));

      return {
        filtered: filtered,
        sentence: sentence
      }
    });

    return _.max(sentences, (v) => v.filtered.length);
  },

  /**
   * Trim the selected text by removing non-word characters from the right end of the string.
   * @param {String} string - selected text string.
   * @returns {String} processed text string.
   */
  trimRight(string) {
    return string.replace(this.trimRightRegex, '');
  },

  /**
   * Trim the selected text by removing non-word characters from the left end of the string.
   * @param {String} string - selected text string.
   * @returns {String} processed text string.
   */
  trimLeft(string) {
    return string.replace(this.trimLeftRegex, '');
  },

  /**
   * Tokenize the selected text by splitting string with pattern.
   * @param {String} string - selected text string.
   * @returns {String[]} array of tokens.
   */
  tokenize(string) {
    return string.split(this.tokenizeRegex).map((token) => this.trim(token));
  },

  /**
   * Trim the selected text by removing non-word characters.
   * @param {String} string - selected text string.
   * @returns {String} processed text string.
   */
  trim(string) {
    let result = string.slice();
    result = this.trimRight(result);
    result = this.trimLeft(result);
    return result;
  }
}