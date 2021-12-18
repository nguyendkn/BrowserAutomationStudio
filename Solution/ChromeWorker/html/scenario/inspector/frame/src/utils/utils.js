'use strict';

const html = (raw, ...args) => String.raw({ raw }, args);

const code = (raw, ...args) => String.raw({ raw }, args);

const uniqueId = (() => {
  let counter = 0;

  return (prefix = '') => {
    const id = ++counter;
    return (prefix == null ? '' : prefix + '') + id;
  };
})();

const getType = (() => {
  const toString = Object.prototype.toString;

  return value => {
    if (value === null) return 'null';

    const type = typeof value;
    if (type !== 'object') return type;
    return toString.call(value).slice(8, -1).toLowerCase();
  };
})();
