(function (tasks, _) {
  const AntiCaptchaTask = _.inherit(tasks.BaseTask, function (type, params, config) {
    tasks.BaseTask.call(this, 'AntiCaptchaApi', type, params, config);
    this.data['type'] = this.name;
  });

  AntiCaptchaTask.prototype.applyProxy = function () {
    tasks.BaseTask.prototype.applyProxy.call(this);

    // if (proxy['password'] && proxy['name']) {
    //   this.data['proxyPassword'] = proxy.password;
    //   this.data['proxyLogin'] = proxy.name;
    // }

    // this.data['proxyType'] = proxy['IsHttp'] ? 'http' : 'socks5';
    // this.data['proxyAddress'] = proxy['server'];
    // this.data['proxyPort'] = proxy['Port'];
    return this.data;
  };

  tasks.AntiCaptchaTask = AntiCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.utils);