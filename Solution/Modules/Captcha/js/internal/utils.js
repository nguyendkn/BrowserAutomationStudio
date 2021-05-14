(function (solver) {
  solver.utils = {
    getProxy: function (sendProxy, source, login, password, type) {
      if (typeof (sendProxy) === 'boolean') return sendProxy ? _PROXY : {};
      const hash = proxy_parse(source);

      if (password.length && login.length) {
        hash["password"] = password;
        hash["name"] = login;
      }

      if (type !== 'auto') {
        hash['IsHttp'] = type === 'http';
      }

      return hash;
    },

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

    sleep: function () {
      sleep(_function_argument('time'))!
    },
  };
})(BASCaptchaSolver);