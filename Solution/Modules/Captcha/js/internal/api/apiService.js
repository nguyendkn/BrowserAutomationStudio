(function (solver) {
  function CaptchaApi(type, config) {
    this.supportedTasks = config.supportedTasks;
    this.apiUrl = config.apiUrl;
    this.name = config.name;
    this.type = type;

    this.pollingInterval = 2000;
    this.pollingDelay = 5000;
  };

  CaptchaApi.prototype.validateTask = function (name) {
    if (this.supportedTasks.indexOf(name) < 0) {
      if (_K === 'en') {
        die('Service `' + this.name + '` does not support `' + name + '`', true);
      } else {
        die('Сервис `' + this.name + '` не поддерживает `' + name + '`', true);
      }
    }
  };

  CaptchaApi.prototype.setPollingInterval = function (value) {
    if (value) this.pollingInterval = value;
    return this;
  };

  CaptchaApi.prototype.setPollingDelay = function (value) {
    if (value) this.pollingDelay = value;
    return this;
  };

  CaptchaApi.prototype.setApiKey = function (value) {
    if (value) this.apiKey = value;
    return this;
  };

  CaptchaApi.prototype.setApiUrl = function (value) {
    if (value && this.name !== 'CapMonster' && this.name !== 'XEvil') {
      if (value.slice(-1) === '/') {
        this.apiUrl = value.slice(0, value.length - 1);
      } else {
        this.apiUrl = value.slice(0, value.length - 0);
      }
    }
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
    _function_return(response);
  };

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver);