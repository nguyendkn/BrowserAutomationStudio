'use strict';

const getType = (() => {
  const toString = Object.prototype.toString;

  return value => {
    const type = toString.call(value);
    return type.slice(8, -1);
  };
})();
