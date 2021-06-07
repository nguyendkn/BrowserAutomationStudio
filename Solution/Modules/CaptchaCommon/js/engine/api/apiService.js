(function (solver, _) {
  function CaptchaApi(name, options) {
    this.solveTask = _.bind(solveTask, this);
    this.options = options;
    this.name = name;
  };

  CaptchaApi.prototype.setApiUrl = function (url) {
    if (url && url.length) {
      this.options.apiUrl = _trim_right(url, '/\\ ');
    }
    return this;
  };

  CaptchaApi.prototype.setApiKey = function (key) {
    if (key && key.length) {
      this.options.apiKey = _trim_right(key, '/\\ ');
    }
    return this;
  };

  CaptchaApi.prototype.solve = function () {
    const self = this, task = _function_argument('task').validate(this);
    const interval = _function_argument('taskWaitInterval') || 2000;
    const delay = _function_argument('taskWaitDelay') || 5000;

    Object.keys(task).forEach(function (key) {
      solver_property(self.name, key, task[key]);
    });
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);