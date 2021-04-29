(function (tasks, _) {
  const RuCaptchaTask = _.inherit(tasks.BaseTask, function (type, params) {
    tasks.BaseTask.call(this, type, params);
    this.data['method'] = this.name;
  });

  RuCaptchaTask.prototype.applyProxy = function (proxy) {
    if (proxy.server && proxy.Port) {
      this.data['proxy'] = proxy.server + ':' + proxy.Port;
      if (proxy.password && proxy.name) {
        const credentials = proxy.name + ':' + proxy.password;
        this.data['proxy'] = credentials + '@' + this.data['proxy'];
      }
      this.data['proxytype'] = proxy['IsHttp'] ? 'HTTP' : 'SOCKS5';
    }
    return this.data;
  };

  RuCaptchaTask.prototype.getSolution = function (response) {
    return response.request;
  };

  AntiCaptchaTask.prototype.setId = function (response) {
    this.id = response['request'];
    return this;
  };

  tasks.RuCaptchaTask = RuCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.utils);