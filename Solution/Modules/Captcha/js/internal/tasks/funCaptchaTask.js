(function (solver, _) {
  const tasks = solver.tasks;

  const FunCaptchaTaskAntiCaptcha = _.inherit(tasks.AntiCaptchaTask, function (params) {
    tasks.AntiCaptchaTask.call(this, 'FunCaptcha', {
      name: 'FunCaptchaTask' + (params.proxy ? '' : 'Proxyless'),
      rules: {
        'surl': { optional: true, name: 'funcaptchaApiJSSubdomain' },
        'data': { optional: true },
        'pageurl': { name: 'websiteURL' },
        'pk': { name: 'websitePublicKey' },
      },
      params: params
    });
  });
  FunCaptchaTaskAntiCaptcha.prototype.getSolution = function (response) {
    return response.solution[token];
  };
  solver.AntiCaptchaApi.prototype.FunCaptchaTask = FunCaptchaTaskAntiCaptcha;

  const FunCaptchaTaskRuCaptcha = _.inherit(tasks.RuCaptchaTask, function (params) {
    tasks.RuCaptchaTask.call(this, 'FunCaptcha', {
      name: 'funcaptcha',
      rules: {
        'surl': { optional: true },
        'data': { optional: true },
        'pageurl': {},
        'pk': {},
      },
      params: params
    });
  });
  FunCaptchaTaskRuCaptcha.prototype.getSolution = function (response) {
    return response.request;
  };
  solver.RuCaptchaApi.prototype.FunCaptchaTask = FunCaptchaTaskRuCaptcha;

})(BASCaptchaSolver, BASCaptchaSolver.utils);