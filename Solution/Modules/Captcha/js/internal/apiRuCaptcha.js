BASCaptchaSolver.RuCaptchaApi = function (config) {
  BASCaptchaSolver.BaseApi.call(this, config);
  this.params = { key: this.apiKey, json: 1 };
  this.apiType = 'ruCaptcha';
};
BASCaptchaSolver.RuCaptchaApi.prototype = Object.create(BASCaptchaSolver.BaseApi.prototype);
BASCaptchaSolver.RuCaptchaApi.prototype.constructor = BASCaptchaSolver.RuCaptchaApi;

BASCaptchaSolver.RuCaptchaApi.prototype.solve = function () {
  const wait = _arguments()['wait'];
  const task = _arguments()['task'];
  const api = BASCaptchaSolver.api;

  _if_else(task.name === 'Image', function () {
    _call(api.request, { method: '/in.php', content: 'multipart', data: task.task })!
  }, function () {
    _call(api.request, { method: '/in.php', content: 'urlencode', data: task.task })!
  })!

  _do_with_params({ taskId: api.response.request, task: task, wait: wait }, function () {
    const taskId = _cycle_param('taskId');
    const task = _cycle_param('task');
    const wait = _cycle_param('wait');
    const api = BASCaptchaSolver.api;

    _call(api.request, { method: '/res.php', content: 'urlencode', data: { action: 'get', id: taskId } })!

    if (api.response.status === 1) {
      _set_result(api.response.request);
      _break();
    }

    sleep(wait)!
  })!
};

BASCaptchaSolver.RuCaptchaApi.prototype.handleError = function () {
  const response = this.response;

  if (!response.status && response.request !== 'CAPCHA_NOT_READY') {
    BASCaptchaSolver.ErrorHandler(response['request'], response['error_text']);
  }
};