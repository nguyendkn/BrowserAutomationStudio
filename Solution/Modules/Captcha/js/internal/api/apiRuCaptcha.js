(function (solver, _) {
  solver.RuCaptchaApi = _.inherit(solver.CaptchaApi, function (options) {
    solver.CaptchaApi.call(this, 'RuCaptchaApi', options);
    this.makeRequest = _.bind(makeRequest, this);
  });

  solver.RuCaptchaApi.prototype.getCreateTaskPayload = function (data) {
    return { method: 'in.php', data: data };
  };

  solver.RuCaptchaApi.prototype.getTaskSolutionPayload = function (task) {
    return { method: 'res.php', data: { action: 'get', id: task.id } };
  };

  function makeRequest() {
    const method = _function_argument('method') || '';
    const data = _function_argument('data') || {};
    data.key = this.options.apiKey;
    data.json = 1;

    _call_function(this.request, {
      content: 'urlencode',
      method: 'POST',
      payload: {
        query: method + '?' + _.urlEncode(data),
        data: [],
      }
    })!

    const response = _result_function();
    _function_return(response);
  }
})(BASCaptchaSolver, BASCaptchaSolver.utils);