(function (solver, _) {
  const AntiCaptchaTask = solver.tasks.AntiCaptchaTask;

  solver.AntiCaptchaApi.RecaptchaV3 = _.inherit(AntiCaptchaTask, function (params) {
    AntiCaptchaTask.call(this, 'antiCaptcha', {
      name: 'RecaptchaV3Task' + (params.proxy ? '' : 'Proxyless'),
      configuration: [
        { name: 'isEnterprise', optional: true },
        { name: 'pageAction', optional: true },
        { name: 'websiteKey' },
        { name: 'websiteURL' },
        { name: 'minScore' },
      ],
      params: params
    });
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);