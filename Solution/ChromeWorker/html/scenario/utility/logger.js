window.log = (() => {
  const logger = { enabled: true };

  ['debug', 'error', 'warn', 'info'].forEach(level => {
    logger[level] = (message, ...args) => {
      if (logger.enabled) {
        console[level](`[${level}] ${message}`, ...args);
      }
    };
  });

  return logger;
})();
