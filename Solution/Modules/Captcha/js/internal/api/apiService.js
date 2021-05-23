(function (solver, _) {
  function CaptchaApi(type, options) {
    this.makeRequest = _.bind(makeRequest, this);
    this.httpRequest = _.bind(httpRequest, this);
    this.solveTask = _.bind(solveTask, this);
    this.options = options;
    this.type = type;
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

    _call_function(self.makeRequest, self.getCreateTaskPayload(task.serialize()))!
    _call_function(_.sleep, { time: task.waitDelay })!
    _.log('Task created, wait for response');

    _do_with_params({ task: task.setId(_result_function()), self: self }, function () {
      const task = _cycle_param('task');
      const self = _cycle_param('self');
      const _ = BASCaptchaSolver.utils;

      _.log('Waiting for response, iteration №' + _iterator());
      _call_function(self.makeRequest, self.getTaskSolutionPayload(task))!
      const response = _result_function();
      _.log('Response from server: ' + JSON.stringify(response));

      if (response.status === 'ready' || response.status === 1) {
        _.log('Solution is ready - ' + task.getSolution(response));
        _function_return(task.getSolution(response));
      }
      _call_function(_.sleep, { time: task.waitInterval })!
    })!
  };

  function makeRequest() {
    const method = _function_argument('method');
    const data = _function_argument('data');
    this.setDefaultRequestParams(data);

    _call_function(this.httpRequest, this.getDefaultRequestOptions(data, method))!
    _function_return(solver.CaptchaApi.checkForError(_result_function()));
  };

  function httpRequest() {
    const payload = _function_argument('payload');
    const content = _function_argument('content');
    const method = _function_argument('method');

    _switch_http_client_internal();
    http_client_post(this.options.apiUrl + '/' + payload.query, payload.data, {
      'content-type': content,
      'encoding': 'UTF-8',
      'method': method,
    })!
    const response = http_client_encoded_content('auto');
    _switch_http_client_main();

    try {
      _function_return(JSON.parse(response));
    } catch (e) {
      if (_K === 'ru') {
        fail('Невозможно обработать ответ от сервиса - невалидная JSON строка.');
      } else {
        fail('Unable to process service response - invalid JSON string.');
      }
    }
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver, BASCaptchaSolver.utils);