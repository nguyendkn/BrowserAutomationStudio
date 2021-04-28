(function (solver) {
  const BaseTask = function (type, options) {
    this.params = options.params;
    this.rules = options.rules;
    this.name = options.name;
    this.type = type;
    this.data = {};
  };

  BaseTask.prototype.serialize = function () {
    const self = this;

    Object.keys(self.rules).forEach(function (key) {
      const param = self.params[key];
      const rule = self.rules[key];

      if (!param && !rule.optional) {
        if (_K === 'en') {
          fail('Parameter "' + key + '" is not specified');
        } else {
          fail('Параметр "' + key + '" не указан');
        }
      }

      self.data[rule.name || key] = param;
    });

    return this.applyProxy();
  };

  BaseTask.prototype.applyProxy = function () {
    if (this.params.cookies) this.data['cookies'] = this.params.cookies;
    if (this.params.ua) this.data['userAgent'] = this.params.ua;
    return this;
  };

  solver.tasks.BaseTask = BaseTask;
})(BASCaptchaSolver);