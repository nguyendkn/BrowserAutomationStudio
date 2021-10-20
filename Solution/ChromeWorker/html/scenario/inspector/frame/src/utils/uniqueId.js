globalThis.uniqueId = (() => {
  let counter = 0;

  return prefix => {
    const id = ++counter;
    return (prefix == null ? '' : prefix) + id;
  };
})();