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

  urlEncode: function (data) {
    return Object.keys(data).map(function (key) {
      const encodedValue = encodeURIComponent(data[key]);
      const encodedKey = encodeURIComponent(key);
      return encodedKey + '=' + encodedValue;
    }).join('&')
  }
};