'use strict';

const bas = {
  saveInterface(data) {
    const json = (_InterfaceJson = JSON.stringify(data));
    BrowserAutomationStudio_SaveInterfaceJson(json);
  },

  get interface() {
    try {
      return JSON.parse(_InterfaceJson || '{}');
    } catch {
      return {};
    }
  },

  get lang() {
    return _K;
  },

  get zoom() {
    return _Z;
  },
};

const scriptStorage = new (class ScriptStorage {
  #state = bas.interface;

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
