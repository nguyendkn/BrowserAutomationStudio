(function (solver) {
  const BaseTask = function (type, options) {
    this.params = options.params;
    this.rules = options.rules;
    this.name = options.name;
    this.type = type;
    this.data = {};
  };

  BaseTask.prototype.validate = function (api) {
    const options = api.options;

    if (options.supportedTasks.indexOf(this.type) < 0) {
      if (_K === 'en') {
        die('Service `' + options.name + '` does not support `' + this.type + '`', true);
      } else {
        die('Сервис `' + options.name + '` не поддерживает `' + this.type + '`', true);
      }
    }

    return this;
  };

  BaseTask.prototype.serialize = function () {
    const self = this;

    Object.keys(self.rules).forEach(function (key) {
      const param = self.params[key];
      const rule = self.rules[key];

      if (typeof (param) === 'undefined') {
        if (!rule.optional) {
          if (_K === 'en') {
            fail('Parameter "' + key + '" is not specified');
          } else {
            fail('Параметр "' + key + '" не указан');
          }
        }
        return;
      }

      self.data[rule.name || key] = param;
    });

    return this.applyProxy(self.params.proxy || {});
  };

  solver.tasks.BaseTask = BaseTask;
})(BASCaptchaSolver);