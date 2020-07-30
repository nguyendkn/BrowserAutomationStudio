SearchLib.TextProcessor = {
  sentenceTokenizer: new SearchLib.SentenceTokenizer(),

  tokenizeRegex: /[^\wА-Яа-яЁё0-9_.]+/,

  trimRightRegex: /[^\wА-Яа-яЁё]+$/,

  trimLeftRegex: /^[^\wА-Яа-яЁё]+/,

  truncateLimit: 200,

  truncate(line, { matches }) {
    let { sentence } = this.getSentence(line, matches);
    let truncStart = false;
    let truncEnd = false;
    let next = 'start';

    while (sentence.length > this.truncateLimit) {
      sentence = this.trim(sentence);
      const tokens = this.tokenize(sentence);
      const head = tokens.shift();
      const last = tokens.pop();

      const skipHead = matches.includes(head);
      const skipLast = matches.includes(last);

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

  getSentence(line, matches) {
    const sentences = this.sentenceTokenizer.tokenize(line).map((sentence) => {
      return {
        filtered: matches.filter((m) => sentence.includes(m)),
        sentence: sentence
      }
    });

    return _.max(sentences, (v) => v.filtered.length);
  },

  tokenize(string) {
    return string.split(this.tokenizeRegex).map((token) => this.trim(token));
  },

  trimRight(string) {
    return string.replace(this.trimRightRegex, '');
  },

  trimLeft(string) {
    return string.replace(this.trimLeftRegex, '');
  },

  trim(string) {
    let result = string.slice();
    result = this.trimRight(result);
    result = this.trimLeft(result);
    return result;
  }
}