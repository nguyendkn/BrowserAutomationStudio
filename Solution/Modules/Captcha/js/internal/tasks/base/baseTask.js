(function (solver) {
  const BaseTask = function (options) {
    this.params = options.params;
    this.rules = options.rules;
    this.name = options.name;
    this.data = {};
  };

  BaseTask.prototype.serialize = function () {
    const self = this;

    Object.keys(rules).forEach(function (key) {
      const param = self.params[key];
      const rule = self.rules[key];

      if (!param && !rule.optional) {
        fail('No param specified');
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