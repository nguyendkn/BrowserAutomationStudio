(function (tasks, _) {
  const AntiCaptchaTask = _.inherit(tasks.BaseTask, function (type, params) {
    tasks.BaseTask.call(this, type, params);
    this.data['type'] = this.name;
  });

  AntiCaptchaTask.prototype.applyProxy = function (proxy) {
    if (proxy.server && proxy.Port) {
      if (proxy.password && proxy.name) {
        this.data['proxyPassword'] = proxy.password;
        this.data['proxyLogin'] = proxy.name;
      }
      this.data['proxyType'] = proxy['IsHttp'] ? 'http' : 'socks5';
      this.data['proxyAddress'] = proxy.server;
      this.data['proxyPort'] = proxy.Port;
    }
    return this.data;
  };

  AntiCaptchaTask.prototype.getSolution = function (response) {
    return response.solution;
  };

  AntiCaptchaTask.prototype.setId = function (response) {
    this.id = response['taskId'];
    return this;
  };

  tasks.AntiCaptchaTask = AntiCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.utils);