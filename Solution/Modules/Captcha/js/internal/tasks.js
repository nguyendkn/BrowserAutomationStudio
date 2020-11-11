BASCaptchaSolver.FunCaptchaTask = function (service, config, proxy) {
  const task = {};

  if (service.apiType === 'antiCaptcha') {
    if (config.surl) task.funcaptchaApiJSSubdomain = config.surl
      .replace('https://', '')
      .replace('http://', '');
    task.websitePublicKey = config.pk;
    task.websiteURL = config.pageUrl;

    if (!(proxy && proxy.server)) {
      task.type = 'FunCaptchaTaskProxyless';
    } else {
      this.SetProxyAntiCaptcha(task, proxy);
      task.type = 'FunCaptchaTask';
    }
  } else {
    if (config.nojs) task.nojs = config.nojs;
    if (config.surl) task.surl = config.surl;
    task.pageurl = config.pageUrl;
    task.publickey = config.pk;
    task.method = 'funcaptcha';

    if (proxy && proxy.server) {
      this.SetProxyRuCaptcha(task, proxy);
    }
  }

  if (config.data) {
    if (typeof (config.data) === 'object') {
      task.data = JSON.stringify(config.data);
    } else {
      task.data = config.data;
    }
  }

  if (config.userAgent) {
    task.userAgent = config.userAgent;
  }

  return { task: task, name: 'FunCaptcha', response: 'token' };
}

BASCaptchaSolver.SetProxyAntiCaptcha = function (task, proxy) {
  if (proxy.password && proxy.name) {
    task.proxyPassword = proxy.password;
    task.proxyLogin = proxy.name;
  }

  task.proxyType = proxy.IsHttp ? 'http' : 'socks5';
  task.proxyAddress = proxy.server;
  task.proxyPort = proxy.Port;
}

BASCaptchaSolver.SetProxyRuCaptcha = function (task, proxy) {
  task.proxy = [proxy.server, proxy.Port].join(':');

  if (proxy.password && proxy.name) {
    const part1 = [proxy.name, proxy.password].join(':');
    const part2 = [proxy.server, proxy.Port].join(':');
    task.proxy = [part1, part2].join('@');
  }

  task.proxytype = proxy.IsHttp ? 'HTTP' : 'SOCKS5';
}