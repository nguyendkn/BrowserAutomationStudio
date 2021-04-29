(function (global) {
  var debug = false;

  global.BASCaptchaSolver.utils = {
    disableDebug: function () { debug = false },

    enableDebug: function () { debug = true },

    inherit: function (parent, fn) {
      fn.prototype = Object.create(parent.prototype);
      fn.prototype.constructor = fn;
      return fn;
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
        return encodeURIComponent(key) + '=' + encodeURIComponent(data[key]);
      }).join('&');
    },

    sleep: function () {
      sleep(_function_argument('time'))!
    },
  };
})(this);