(function (tasks, _) {
  const RuCaptchaTask = _.inherit(tasks.BaseTask, function (type, params, config) {
    tasks.BaseTask.call(this, 'RuCaptchaApi', type, params, config);
    this.data['method'] = this.name;
  });

  RuCaptchaTask.prototype.applyProxy = function () {
    tasks.BaseTask.prototype.applyProxy.call(this);
    // this.data['proxy'] = proxy['server'] + ':' + proxy['Port'];

    // if (proxy['password'] && proxy['name']) {
    //   const credentials = proxy['name'] + ':' + proxy['password'];
    //   this.data['proxy'] = credentials + '@' + this.data['proxy'];
    // }

    // this.data['proxytype'] = proxy['IsHttp'] ? 'HTTP' : 'SOCKS5';
    return this.data;
  };

  tasks.RuCaptchaTask = RuCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.utils);