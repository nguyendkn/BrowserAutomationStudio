(function (solver, _) {
  const AntiCaptchaTask = solver.tasks.AntiCaptchaTask;

  solver.AntiCaptchaApi.HCaptcha = _.inherit(AntiCaptchaTask, function (params) {
    AntiCaptchaTask.call(this, 'antiCaptcha', {
      name: 'HCaptchaTask' + (params.proxy ? '' : 'Proxyless'),
      configuration: [
        { name: 'websiteKey' },
        { name: 'websiteURL' },
      ],
      params: params
    });
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);