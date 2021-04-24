(function (solver) {
  const services = {
    'anticaptcha': new solver.AntiCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://api.anti-captcha.com',
      name: 'AntiCaptcha',
    }),
    'rucaptcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://rucaptcha.com',
      name: 'RuCaptcha',
    }),
    '2captcha': new solver.RuCaptchaApi({
      supportedTasks: ['FunCaptcha', 'HCaptcha'],
      apiUrl: 'https://2captcha.com',
      name: '2Captcha',
    })
  };

  solver.getServiceApi = function (options) {
    const service = services[options.name];

    if (!service) {
      if (_K === 'en') {
        die('Service "' + service + '" is unavailable', true);
      } else {
        die('Сервис "' + service + '" недоступен', true);
      }
    }

    if (options.pollingInterval) {
      service.setPollingInterval(options.pollingInterval);
    }

    if (options.pollingDelay) {
      service.setPollingDelay(options.pollingDelay);
    }

    return service.setApiUrl(options.apiUrl).setApiKey(options.apiKey);
  };
})(BASCaptchaSolver);