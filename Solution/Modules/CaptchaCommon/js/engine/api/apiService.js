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
    const self = this, task = _function_argument('task').validate(this);
    const interval = _function_argument('taskWaitInterval') || 2000;
    const delay = _function_argument('taskWaitDelay') || 5000;
    const data = task.serialize();

    const properties = Object.keys(data).reduce(function (acc, val) {
      acc.push(key, data[key]);
      return acc;
    }, []);
    properties.push('serverurl', this.options.apiUrl);
    properties.push('key', this.options.apiKey);
    _solve_captcha(this.method, '', properties, false)!
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);