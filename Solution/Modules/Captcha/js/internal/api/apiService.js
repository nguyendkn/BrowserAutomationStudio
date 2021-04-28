(function (solver, _) {
  function CaptchaApi(type, options) {
    this.solveTask = _.bind(solveTask, this);
    this.options = options;
    this.type = type;
    this.options.taskWaitInterval = 2000;
    this.options.taskWaitDelay = 5000;
  };

  CaptchaApi.prototype.validateTask = function (task) {
    if (this.options.supportedTasks.indexOf(task.type) < 0) {
      if (_K === 'en') {
        die('Service `' + this.options.name + '` does not support `' + task.type + '`', true);
      } else {
        die('Сервис `' + this.options.name + '` не поддерживает `' + task.type + '`', true);
      }
    }
    return task;
  };

  CaptchaApi.prototype.update = function (options) {
    const current = this.options;

    Object.keys(options).forEach(function (key) {
      const value = options[key]; if (!value) return;

      if (key === 'apiUrl' && current.name !== 'CapMonster' && current.name !== 'XEvil') {
        if (value.slice(-1) === '/') {
          current.apiUrl = value.slice(0, value.length - 1);
        } else {
          current.apiUrl = value.slice(0, value.length - 0);
        }
      } else {
        current[key] = value;
      }
    });

    return this;
  };

  CaptchaApi.prototype.request = function () {
    const encoding = _function_argument('encoding') || 'UTF-8';
    const payload = _function_argument('payload');
    const content = _function_argument('content');
    const method = _function_argument('method');

    _switch_http_client_internal();
    http_client_post(payload.url, payload.data, {
      'content-type': content,
      'encoding': encoding,
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

  function solveTask() {
    const self = this, task = self.validateTask(_function_argument('task'));

    _call_function(self.makeRequest, self.getCreateTaskPayload(task.serialize()))!
    _call_function(_.sleep, { time: self.options.taskWaitDelay })!
    _.log('Task created, wait for response');

    _do_with_params({ task: task.setId(_result_function()), self: self }, function () {
      const task = _cycle_param('task');
      const self = _cycle_param('self');
      const _ = BASCaptchaSolver.utils;

      _.log('Waiting for response - "' + VAR_CYCLE_INDEX + '" iteration');
      _call_function(self.makeRequest, self.getTaskSolutionPayload(task))!
      const response = _result_function();
      _.log('Response from server: ' + JSON.stringify(response));

      if (response.status === 'ready' || response.status === 1) {
        _.log('Solution is ready - ' + task.getSolution(response));
        _set_result(task.getSolution(response));
        _break();
      }
      _call_function(_.sleep, { time: self.options.taskWaitInterval })!
    })!
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver, BASCaptchaSolver.utils);