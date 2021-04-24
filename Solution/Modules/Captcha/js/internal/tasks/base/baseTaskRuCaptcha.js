(function (tasks, _) {
  const RuCaptchaTask = _.inherit(tasks.BaseTask, function (config) {
    tasks.BaseTask.call(this, 'RuCaptchaApi', config);
  });

  RuCaptchaTask.prototype.applyProxy = function (proxy, cookies, ua) {
    this.data['proxy'] = proxy['server'] + ':' + proxy['Port'];

    if (proxy['password'] && proxy['name']) {
      const credentials = proxy['name'] + ':' + proxy['password'];
      this.data['proxy'] = credentials + '@' + this.data['proxy'];
    }

    this.data['proxytype'] = proxy['IsHttp'] ? 'HTTP' : 'SOCKS5';
    if (cookies) this.data['cookies'] = cookies;
    if (ua) this.data['userAgent'] = ua;
  };

  tasks.RuCaptchaTask = RuCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.utils);