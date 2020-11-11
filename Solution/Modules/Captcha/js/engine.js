BASCaptchaSolver = {
  initialize: function (serverUrl, apiKey, service) {
    if (['anticaptcha', 'rucaptcha', '2captcha'].indexOf(service) < 0) {
      die(_K === 'ru' ? ('Сервиса ' + service + ' нет в списке доступных') : (service + ' service is not in the list of available'), true);
    }

    const services = {
      'anticaptcha': new BASCaptchaSolver.AntiCaptchaApi({
        supportedTasks: ['Image', 'RecaptchaV2', 'RecaptchaV3', 'hCaptcha', 'FunCaptcha'],
        apiUrl: 'https://api.anti-captcha.com',
        serverUrl: serverUrl,
        name: 'AntiCaptcha',
        apiKey: apiKey,
      }),
      'rucaptcha': new BASCaptchaSolver.RuCaptchaApi({
        supportedTasks: ['Image', 'RecaptchaV2', 'RecaptchaV3', 'hCaptcha', 'FunCaptcha'],
        apiUrl: 'https://rucaptcha.com',
        serverUrl: serverUrl,
        name: 'RuCaptcha',
        apiKey: apiKey,
      }),
      '2captcha': new BASCaptchaSolver.RuCaptchaApi({
        supportedTasks: ['Image', 'RecaptchaV2', 'RecaptchaV3', 'hCaptcha', 'FunCaptcha'],
        apiUrl: 'https://2captcha.com',
        serverUrl: serverUrl,
        name: '2Captcha',
        apiKey: apiKey,
      }),
    }

    BASCaptchaSolver.api = services[service];
  },

  solve: function () {
    const task = _arguments()['task'];
    const wait = _arguments()['wait'];
    const api = BASCaptchaSolver.api;

    if (api.supportedTasks.indexOf(task.name) < 0) {
      die(
        _K === "en"
          ? "Service " + api.name + " does not support " + task.name
          : "Сервис " + api.name + " не поддерживает " + task.name,
        true
      );
    }

    _call(api.solve, { task: task, wait: wait })!
  }
}

function BAS_SolveFunCaptcha() {
  BASCaptchaSolver.initialize(
    _arguments().serverUrl,
    _arguments().apiKey,
    _arguments().method
  );

  _call(BASCaptchaSolver.waiter, null)!
  BASCaptchaSolver.path().exist()!
  if (_result() !== 1) {
    _break();
  }

  const fcToken = get_element_selector(_SELECTOR).css('*[name="fc-token"]');
  // fcToken.exist()!
  // FUNCAPTCHA_FC_TOKEN_NOT_EXIST = _result() !== "1";
  fcToken.attr('value')!

  const fcValue = _result().split('|').map(function (e) {
    return e.split('=');
  });

  const surl = fcValue.filter(function (e) {
    return e[0] === 'surl';
  })[0][1];

  const pk = fcValue.filter(function (e) {
    return e[0] === 'pk';
  })[0][1];

  _call(BASCaptchaSolver.solve, {
    task: BASCaptchaSolver.FunCaptchaTask(BASCaptchaSolver.api, {
      pageUrl: _arguments().pageUrl,
      surl: surl,
      pk: pk,
    }),
    wait: 5000
  })!

  _call(BAS_SubmitFunCaptcha, { token: _result() })!
}

function BAS_SubmitFunCaptcha() {
  get_element_selector(_SELECTOR).css('*[name="verification-token"]').script('self.value = ' + JSON.stringify(_arguments()['token']))!
  get_element_selector(_SELECTOR).css('*[name="fc-token"]').script('self.value = ' + JSON.stringify(_arguments()['token']))!
  page().script("_BAS_HIDE(BrowserAutomationStudio_FunCaptchaSolved)()")!
}
