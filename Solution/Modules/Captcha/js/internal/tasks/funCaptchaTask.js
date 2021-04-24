(function (solver, _) {
  const AntiCaptchaTask = solver.tasks.AntiCaptchaTask;

  solver.AntiCaptchaApi.FunCaptchaTask = _.inherit(AntiCaptchaTask, function (params) {
    AntiCaptchaTask.call(this, 'antiCaptcha', {
      name: 'FunCaptchaTask' + (params.proxy ? '' : 'Proxyless'),
      configuration: [
        { name: 'funcaptchaApiJSSubdomain', optional: true },
        { name: 'data', optional: true },
        { name: 'websitePublicKey' },
        { name: 'websiteURL' },
      ],
      params: params
    });
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);