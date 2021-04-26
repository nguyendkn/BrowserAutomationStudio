(function (solver, _) {
  const AntiCaptchaTask = solver.tasks.AntiCaptchaTask;
  solver.AntiCaptchaApi.prototype.FunCaptchaTask = _.inherit(AntiCaptchaTask, function (params) {
    AntiCaptchaTask.call(this, 'FunCaptcha', params, {
      name: 'FunCaptchaTask' + (params.proxy ? '' : 'Proxyless'),
      rules: {
        'surl': { optional: true, name: 'funcaptchaApiJSSubdomain' },
        'data': { optional: true },
        'pageurl': { name: 'websiteURL' },
        'pk': { name: 'websitePublicKey' },
      }
    });
  });

  const RuCaptchaTask = solver.tasks.RuCaptchaTask;
  solver.RuCaptchaApi.prototype.FunCaptchaTask = _.inherit(RuCaptchaTask, function (params) {
    RuCaptchaTask.call(this, 'FunCaptcha', params, {
      name: 'funcaptcha',
      rules: {
        'surl': { optional: true },
        'data': { optional: true },
        'pageurl': {},
        'pk': {},
      }
    });
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);