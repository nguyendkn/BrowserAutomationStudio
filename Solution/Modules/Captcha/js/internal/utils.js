(function (global) {
  var debug = false;

  global.BASCaptchaSolver.utils = {
    inherit: function (proto, fn) {
      fn.prototype = Object.create(proto.prototype);
      fn.prototype.constructor = fn;
      return fn;
    },

    disableDebug: function () {
      debug = false;
    },

    enableDebug: function () {
      debug = true;
    },

    log: function (message) {
      if (debug) {
        log('[CaptchaSolver]: ' + message);
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
})(this);