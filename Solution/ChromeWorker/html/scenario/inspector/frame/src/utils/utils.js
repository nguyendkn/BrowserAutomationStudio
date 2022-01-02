'use strict';

const typeOf = (() => {
  const toString = Object.prototype.toString;

  return value => {
    if (value === null) return 'null';
    if (value !== Object(value)) return typeof value;
    const type = toString.call(value).slice(8, -1).toLowerCase();
    return type.includes('function') ? 'function' : type;
  };
})();

const hasOwn = (() => {
  const has = Object.prototype.hasOwnProperty;

  return (value, key) => {
    if (value == null) {
      throw new TypeError('Cannot convert undefined or null to object');
    }
    return has.call(Object(value), key);
  };
})();
