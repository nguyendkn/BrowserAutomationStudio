(function (solver) {
  const services = {
    'anticaptcha': new solver.AntiCaptchaApi({
      supportedTasks: ['FunCaptcha'],
      apiUrl: 'https://api.anti-captcha.com',
      name: 'AntiCaptcha',
    }),
    'rucaptcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha'],
      apiUrl: 'https://rucaptcha.com',
      name: 'RuCaptcha',
    }),
    '2captcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha'],
      apiUrl: 'https://2captcha.com',
      name: '2Captcha',
    }),
  };

  solver.getServiceApi = function (options) {
    const service = services[options.service];

    if (!service) {
      if (_K === 'en') {
        die('Service "' + options.service + '" is unavailable', true);
      } else {
        die('Сервис "' + options.service + '" недоступен', true);
      }
    }

    return service.update(options);
  };
})(BASCaptchaSolver);