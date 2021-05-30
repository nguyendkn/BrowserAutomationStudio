(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (options) {
    solver.CaptchaApi.call(this, 'RuCaptcha', options);
  });

  solver.RuCaptchaApi.prototype.getCreateTaskPayload = function (data) {
    return { method: 'in.php', data: data };
  };

  solver.RuCaptchaApi.prototype.getTaskSolutionPayload = function (task) {
    return { method: 'res.php', data: { action: 'get', id: task.id } };
  };

  solver.RuCaptchaApi.prototype.setDefaultRequestParams = function (data) {
    data.key = this.options.apiKey;
    data.json = 1;
  };

  solver.RuCaptchaApi.prototype.getDefaultRequestOptions = function (data, method) {
    return {
      payload: { query: method + '?' + _.urlEncode(data), data: [] },
      content: 'urlencode',
      method: 'POST'
    }
  };
})(BASCaptchaSolver, BASCaptchaSolver.utils);