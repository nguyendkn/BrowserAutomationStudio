(function (solver, _) {
  function BaseTask(type, options) {
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
    Object.keys(this.rules).forEach(_.bind(function (key) {
      const param = this.params[key];
      const rule = this.rules[key];

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

      this.data[rule.name || key] = param;
    }, this));

    return this.applyProxy(this.params.proxy);
  };

  solver.tasks.BaseTask = BaseTask;
})(BASCaptchaSolver, BASCaptchaSolver.utils);