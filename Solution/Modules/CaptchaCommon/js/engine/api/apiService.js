(function (solver, _) {
  function CaptchaApi(method, options) {
    this.solve = _.bind(solve, this);
    this.options = options;
    this.method = method;
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
    const timeout = _function_argument('taskWaitTimeout') || 5000;
    const delay = _function_argument('taskWaitDelay') || 5000;
    const data = task.serialize();

    const params = Object.keys(data).reduce(function (acc, key) {
      return acc.concat([key, data[key]]);
    }, []);
    params.push('is_json_interface', self.options.isJsonInterface);
    params.push('serverurl', self.options.apiUrl + '/');
    params.push('key', self.options.apiKey);
    params.push('timeout', timeout);
    params.push('delay', delay);

    _solve_captcha(self.method, '', params, false, function () {
      _function_return(_function_argument('task').getSolution(_result()));
    });
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver, BASCaptchaSolver.utils);