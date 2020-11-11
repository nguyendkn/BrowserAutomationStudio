BASCaptchaSolver.AntiCaptchaApi = function (config) {
  BASCaptchaSolver.BaseApi.call(this, config);
  this.params = { clientKey: this.apiKey };
  this.apiType = 'antiCaptcha';
};
BASCaptchaSolver.AntiCaptchaApi.prototype = Object.create(BASCaptchaSolver.BaseApi.prototype);
BASCaptchaSolver.AntiCaptchaApi.prototype.constructor = BASCaptchaSolver.AntiCaptchaApi;

BASCaptchaSolver.AntiCaptchaApi.prototype.solve = function () {
  const wait = _arguments()['wait'];
  const task = _arguments()['task'];
  const api = BASCaptchaSolver.api;

  _call(api.request, { method: '/createTask', content: 'application/json', data: { task: task.task } })!

  _do_with_params({ taskId: api.response.taskId, task: task, wait: wait }, function () {
    const taskId = _cycle_param('taskId');
    const task = _cycle_param('task');
    const wait = _cycle_param('wait');
    const api = BASCaptchaSolver.api;

    _call(api.request, { method: '/getTaskResult', content: 'application/json', data: { taskId: taskId } })!

    if (api.response.status === 'ready') {
      _set_result(api.response.solution[task.response]);
      _break();
    }

    sleep(wait)!
  })!
};

BASCaptchaSolver.RuCaptchaApi.prototype.handleError = function () {
  const response = this.response;

  if (response.errorId && response.errorCode && response.errorDescription) {
    BASCaptchaSolver.ErrorHandler(response.errorCode, response.errorDescription);
  }
};