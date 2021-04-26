(function (solver) {
  function CaptchaApi(type, options) {
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
        fail('Невалидная JSON строка.');
      } else {
        fail('Invalid JSON string.');
      }
    }
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver);