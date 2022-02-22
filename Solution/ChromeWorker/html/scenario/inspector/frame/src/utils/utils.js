'use strict';

const post = (type, payload, callback) => {
  if (callback) {
    window.addEventListener('message', ({ data }) => {
      if (data.type === type) {
        callback(data.payload);
      }
    }, { once: true });
  }

  window.top.postMessage({ type, payload: payload || {} }, '*');
};

const parseJSON = (text, reviver) => {
  try {
    return JSON.parse(text, reviver);
  } catch {
    return {};
  }
};

const typeOf = (() => {
  const { toString } = Object.prototype;

  return value => {
    if (value === null) return 'null';
    if (value !== Object(value)) return typeof value;
    return toString.call(value).slice(8, -1).toLowerCase();
  };
})();

const hasOwn = (() => {
  const has = Object.prototype.hasOwnProperty;
  return (object, key) => has.call(object, key);
})();
