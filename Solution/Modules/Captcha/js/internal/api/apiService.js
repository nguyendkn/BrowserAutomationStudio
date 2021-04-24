(function (solver) {
  function CaptchaApi(type, config) {
    this.supportedTasks = config.supportedTasks;
    this.tasks = solver[config.name].tasks;
    this.apiUrl = config.apiUrl;
    this.name = config.name;
    this.type = type;
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

  CaptchaApi.prototype.setApiUrl = function (value) {
    return updateApiConfiguration(this, { apiUrl: value });
  };

  CaptchaApi.prototype.setApiKey = function (value) {
    return updateApiConfiguration(this, { apiKey: value });
  };

  function updateApiConfiguration(api, data) {
    if (data.apiUrl && api.name !== 'CapMonster' && api.name !== 'XEvil') {
      const url = data.apiUrl;

      if (url.slice(-1) === '/') {
        api.apiUrl = url.slice(0, url.length - 1);
      } else {
        api.apiUrl = url.slice(0, url.length - 0);
      }
    }
    return api;
  }

  solver.CaptchaApi = CaptchaApi;
})(BASCaptchaSolver);