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
      const path = param.name || param.path;
      if (!params[path]) {
        return param.optional && fail('No param specified');
      }
      this.data[param] = params[path];
    });

    this.applyProxy(this, params.proxy, params.cookies, params.ua);
    return this.data;
  };

  solver.tasks.BaseTask = BaseTask;
})(BASCaptchaSolver);