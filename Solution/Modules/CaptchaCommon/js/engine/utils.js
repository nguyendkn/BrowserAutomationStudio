(function (solver) {
  solver.utils = {
    inherit: function (parent, fn) {
      fn.prototype = Object.create(parent.prototype);
      fn.prototype.constructor = fn;
      return fn;
    },

    log: function (message) {
      if (solver.debug) {
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

    script: function () {
      const script = _function_argument('script');
      _function_argument('element').script(script)!
      _function_return(_result());
    },

    attr: function () {
      const attr = _function_argument('attr');
      _function_argument('element').attr(attr)!
      _function_return(_result());
    },

    length: function () {
      _function_argument('element').length()!
      _function_return(_result());
    },

    exist: function () {
      _function_argument('element').exist()!
      _function_return(_result());
    },

    sleep: function () {
      sleep(_function_argument('time'))!
    },
  };
})(BASCaptchaSolver);