(function (solver, _) {
  const tasks = solver.tasks;

  const FunCaptchaTaskAntiCaptcha = _.inherit(tasks.AntiCaptchaTask, function (params) {
    tasks.AntiCaptchaTask.call(this, 'FunCaptcha', {
      name: 'FunCaptchaTask' + (params.proxy ? '' : 'Proxyless'),
      rules: {
        subdomainUrl: { optional: true, name: 'funcaptchaApiJSSubdomain' },
        publicKey: { name: 'websitePublicKey' },
        pageUrl: { name: 'websiteURL' },
        data: { optional: true },
      },
      params: params
    });
  });
  FunCaptchaTaskAntiCaptcha.prototype.getSolution = function (response) {
    return response.solution['token'];
  };
  solver.AntiCaptchaApi.prototype.FunCaptchaTask = FunCaptchaTaskAntiCaptcha;

  const FunCaptchaTaskRuCaptcha = _.inherit(tasks.RuCaptchaTask, function (params) {
    tasks.RuCaptchaTask.call(this, 'FunCaptcha', {
      name: 'funcaptcha',
      rules: {
        subdomainUrl: { optional: true, name: 'surl' },
        publicKey: { name: 'publickey' },
        pageUrl: { name: 'pageurl' },
        data: { optional: true },
      },
      params: params
    });
  });
  solver.RuCaptchaApi.prototype.FunCaptchaTask = FunCaptchaTaskRuCaptcha;

})(BASCaptchaSolver, BASCaptchaSolver.utils);