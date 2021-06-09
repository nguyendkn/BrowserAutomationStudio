(function (solver, _) {
  function CaptchaApi(name, method, options) {
    this.solve = _.bind(solve, this);
    this.options = options;
    this.method = method;
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

  function solve() {
    const self = this, task = _function_argument('task').validate(self);
    const interval = _function_argument('taskWaitInterval') || 5000;
    const delay = _function_argument('taskWaitDelay') || 5000;
    const data = task.serialize();

    const properties = Object.keys(data).reduce(function (acc, key) {
      return acc.concat([key, data[key]]);
    }, []);
    properties.push('is_json_interface', self.options.isJsonInterface);
    properties.push('serverurl', self.options.apiUrl + '/');
    properties.push('key', self.options.apiKey);

    _solve_captcha(self.method, '', properties, false, function () {
      _function_return(_function_argument('task').getSolution(_result()));
    });
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver, BASCaptchaSolver.utils);