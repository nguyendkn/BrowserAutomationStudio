BASCaptchaSolver.BaseApi = function (config) {
  this.supportedTasks = config.supportedTasks;
  this.apiKey = config.apiKey;
  this.apiUrl = config.apiUrl;
  this.name = config.name;

  if (config.serverUrl && this.name !== 'CapMonster' && this.name !== 'XEvil') {
    const url = config.serverUrl;

    if (url.slice(-1) === '/') {
      this.apiUrl = url.slice(0, url.length - 1);
    } else {
      this.apiUrl = url.slice(0, url.length - 0);
    }
  }
};

BASCaptchaSolver.BaseApi.prototype.getPayload = function (data, method, content) {
  Object.keys(BASCaptchaSolver.api.params).forEach(function (param) {
    data[param] = BASCaptchaSolver.api.params[param];
  });

  switch (content) {
    case 'application/json':
      return { url: this.apiUrl + method, data: ['data', JSON.stringify(data)] };
    case 'urlencode':
      return {
        url: this.apiUrl + method + '?' + Object.keys(data).map(function (key) {
          return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
        }).join('&'),
        data: []
      };
    default:
      return {
        data: Object.keys(data).map(function (key) {
          return [key, data[key]];
        }),
        url: this.apiUrl + method,
      }
  }
};

BASCaptchaSolver.BaseApi.prototype.request = function () {
  const content = _arguments()['content'];
  const method = _arguments()['method'];
  const data = _arguments()['data'];
  const api = BASCaptchaSolver.api;
  _switch_http_client_internal();

  const payload = api.getPayload(data, method, content);

  http_client_post(payload.url, payload.data, {
    'content-type': content,
    'encoding': 'UTF-8',
    'method': 'POST'
  })!

  try {
    BASCaptchaSolver.api.response = JSON.parse(
      http_client_encoded_content('auto')
    );
  } catch (err) { fail(err.message) }

  BASCaptchaSolver.api.handleError();
  _switch_http_client_main();
};