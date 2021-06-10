(function (solver, _) {
  function CaptchaApi(method, options) {
    this.solve = _.bind(solve, this);
    this.options = options;
    this.method = method;
  };

  CaptchaApi.prototype.setApiUrl = function (url) {
    if (url && url.length) {
      this.options.apiUrl = url.trim();
    }
    return this;
  };

  CaptchaApi.prototype.setApiKey = function (key) {
    if (key && key.length) {
      this.options.apiKey = key.trim();
    }
    return this;
  };

  function solve() {
    const self = this, task = _function_argument('task').validate(self);
    const waitTimeout = _function_argument('waitTimeout') || 5000;
    const waitDelay = _function_argument('waitDelay') || 5000;
    const data = task.serialize();

    const params = Object.keys(data).reduce(function (acc, key) {
      return acc.concat(key, data[key]);
    }, []);
    params.push('is_json_interface', self.options.isJsonApi);
    params.push('service_url', self.options.apiUrl);
    params.push('service_key', self.options.apiKey);
    params.push('timeout', waitTimeout);
    params.push('delay', waitDelay);

    _solve_captcha(self.method, '', params, false, function () {
      const result = _result();
      if (result.indexOf('CAPTCHA_FAIL') >= 0) fail(result);
      _function_return(_function_argument('task').getSolution(result));
    });
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver, BASCaptchaSolver.utils);