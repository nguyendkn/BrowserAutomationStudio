(function (tasks, api, _) {
  const HCaptchaTask = _.inherit(tasks.RuCaptchaTask, function (params) {
    tasks.RuCaptchaTask.call(this, 'HCaptcha', {
      name: 'hcaptcha',
      rules: {
        siteKey: { name: 'sitekey' },
        pageUrl: { name: 'pageurl' },
      },
      params: params
    });
  });
  api.prototype.HCaptchaTask = HCaptchaTask;
})(BASCaptchaSolver.tasks, BASCaptchaSolver.RuCaptchaApi, BASCaptchaSolver.utils);