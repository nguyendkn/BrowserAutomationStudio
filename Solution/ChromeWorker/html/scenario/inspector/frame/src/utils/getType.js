const getType = (() => {
  const toString = Object.prototype.toString;

  return value => toString.call(value).slice(8, -1);
})();
