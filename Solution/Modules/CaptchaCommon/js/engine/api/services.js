(function (solver) {
  const services = {
    'AntiCaptcha': new solver.AntiCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://api.anti-captcha.com',
      name: 'AntiCaptcha',
    }),
    'RuCaptcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://rucaptcha.com',
      name: 'RuCaptcha',
    }),
    '2Captcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://2captcha.com',
      name: '2Captcha',
    }),
  };

  solver.getService = function (options) {
    const service = services[options.serviceName];

    if (!service) {
      if (_K === 'en') {
        fail('Service "' + options.serviceName + '" is unavailable');
      } else {
        fail('Сервис "' + options.serviceName + '" недоступен');
      }
    }

    return service.setApiKey(options.serviceKey).setApiUrl(options.serviceUrl);
  };
})(BASCaptchaSolver);