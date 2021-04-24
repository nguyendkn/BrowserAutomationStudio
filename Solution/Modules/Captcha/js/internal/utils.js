BASCaptchaSolver.utils = {
  inherit: function (proto, fn) {
    fn.prototype = Object.create(proto.prototype);
    fn.prototype.constructor = fn;
    return fn;
  },

  json: function (data) {
    try {
      return JSON.parse(data);
    } catch (e) {
      if (_K === 'ru') {
        fail('Невалидная JSON строка.');
      } else {
        fail('Invalid JSON string.');
      }
    }
  },

  bind: function (fn, context) {
    const args = Array.prototype.slice.call(arguments, 1);

    return function () {
      return fn.apply(context, args.concat(Array.prototype.slice.call(arguments)));
    };
  },

  request: function () {
    const encoding = _function_argument('encoding') || 'UTF-8';
    const payload = _function_argument('payload');
    const content = _function_argument('content');
    const method = _function_argument('method');

    _switch_http_client_internal();
    http_client_post(payload.url, payload.data, {
      'content-type': content,
      'encoding': encoding,
      'method': method,
    })!
    const response = http_client_encoded_content('auto');

    _switch_http_client_main();
    _function_return(response);
  },

  urlEncode: function (data) {
    return Object.keys(data).map(function (key) {
      const encodedValue = encodeURIComponent(data[key]);
      const encodedKey = encodeURIComponent(key);
      return encodedKey + '=' + encodedValue;
    }).join('&')
  }
};