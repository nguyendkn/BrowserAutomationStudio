(function (tasks, _) {
  const AntiCaptchaTask = _.inherit(tasks.BaseTask, function (config) {
    tasks.BaseTask.call(this, 'AntiCaptchaApi', config);
  });

  AntiCaptchaTask.prototype.applyProxy = function (proxy, cookies, ua) {
    if (proxy['password'] && proxy['name']) {
      this.data['proxyPassword'] = proxy.password;
      this.data['proxyLogin'] = proxy.name;
    }

    this.data['proxyType'] = proxy['IsHttp'] ? 'http' : 'socks5';
    this.data['proxyAddress'] = proxy['server'];
    this.data['proxyPort'] = proxy['Port'];
    if (cookies) this.data['cookies'] = cookies;
    if (ua) this.data['userAgent'] = ua;
  };

  tasks.AntiCaptchaTask = AntiCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.utils);