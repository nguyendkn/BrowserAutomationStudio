'use strict';

const bas = {
  saveInterface(data) {
    const json = (_InterfaceJson = JSON.stringify(data));
    BrowserAutomationStudio_SaveInterfaceJson(json);
  },

  get interface() {
    return _InterfaceJson || '{}';
  },

  get lang() {
    return _K || 'en';
  },

  get zoom() {
    return _Z || 100;
  },
};

const scriptStorage = new (class ScriptStorage {
  #state = {};

  constructor() {
    try {
      this.#state = JSON.parse(bas.interface);
    } catch {}
  }

  setItem(key, value) {
    this.#state[key] = value;
    bas.saveInterface({ ...this.#state });
  }

  removeItem(key) {
    delete this.#state[key];
  }

  getItem(key) {
    return this.#state[key];
  }
})();
