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

  function solveTask() {
    const self = this, task = _function_argument('task').validate(self);
    task.waitInterval = _function_argument('taskWaitInterval') || 2000;
    task.waitDelay = _function_argument('taskWaitDelay') || 5000;
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);