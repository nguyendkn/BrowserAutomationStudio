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
  return (object, key) => has.call(object, key);
})();
