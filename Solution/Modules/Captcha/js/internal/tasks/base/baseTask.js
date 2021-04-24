(function (solver) {
  const BaseTask = function (type, options) {
    this.configuration = options.configuration;
    this.params = options.params;
    this.name = options.name;

    this.type = type;
    this.data = {};
  };

  BaseTask.prototype.serialize = function () {
    const params = this.params;

    this.configuration.forEach(function (param) {
      const value = params[param.name || param.path];
      if (!value && !param.optional) {
        fail('No param specified');
      }
      this.data[param] = value;
    });

    this.applyProxy(this, params.proxy, params.cookies, params.ua);
    return this.data;
  };

  solver.tasks.BaseTask = BaseTask;
})(BASCaptchaSolver);