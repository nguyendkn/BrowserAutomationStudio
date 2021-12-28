'use strict';

const scriptStorage = new (class ScriptStorage {
  #state = JSON.parse(_InterfaceJson || '{}');

  setItem(key, value) {
    this.#state[key] = value;
    const json = JSON.stringify({ ...this.#state });
    BrowserAutomationStudio_SaveInterfaceJson(json);
  }

  removeItem(key) {
    delete this.#state[key];
  }

  getItem(key) {
    return this.#state[key];
  }
})();
