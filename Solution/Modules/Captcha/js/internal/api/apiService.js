(function (solver) {
  function CaptchaApi(type, config) {
    this.supportedTasks = config.supportedTasks;
    this.apiUrl = config.apiUrl;
    this.name = config.name;
    this.type = type;

    this.pollingInterval = 2000;
    this.pollingDelay = 5000;
  };
  CaptchaApi.tasks = {};

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

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver);