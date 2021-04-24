(function (solver, _) {
  const AntiCaptchaTask = solver.tasks.AntiCaptchaTask;

  solver.AntiCaptchaApi.RecaptchaV2Task = _.inherit(AntiCaptchaTask, function (params) {
    AntiCaptchaTask.call(this, 'antiCaptcha', {
      name: 'RecaptchaV2Task' + (params.proxy ? '' : 'Proxyless'),
      configuration: [
        { name: 'recaptchaDataSValue', optional: true },
        { name: 'websiteSToken', optional: true },
        { name: 'isInvisible', optional: true },
        { name: 'websiteKey' },
        { name: 'websiteURL' },
      ],
      params: params
    });
  });
})(BASCaptchaSolver, BASCaptchaSolver.utils);