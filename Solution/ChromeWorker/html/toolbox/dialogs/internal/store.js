BasDialogsLib.store = {
  /**
   * Dictionary of predicates for different collection types.
   */
  predicates: {
    variables: (a) => (b) => a.name === b.name && a.global === b.global,
    resources: (a) => (b) => a.name === b.name,
    functions: (a) => (b) => a.name === b.name,
  },

  /**
   * Recent global variables list.
   */
  globalVariables: null,

  /**
   * Recent local variables list.
   */
  localVariables: null,

  /**
   * Recent functions list.
   */
  functions: null,

  /**
   * Recent resources list.
   */
  resources: null,

  /**
   * Recent variables list.
   */
  get variables() {
    return _.sortByOrder(
      [...this.globalVariables, ...this.localVariables],
      ['timestamp'],
      ['desc']
    );
  },

  /**
   * Add unique item from the target list to the source list.
   * @param {Object[]} collection - base collection.
   * @param {Object[]} source - source items list.
   * @param {Object[]} target - target items list.
   */
  add({ target, source, collection, predicate, sync = true }) {
    const item = Array.isArray(target)
      ? target.filter((a) => !collection.some(predicate(a))).pop()
      : target;

    if (item) {
      const index = source.findIndex(predicate(item));

      if (index >= 0) {
        source.splice(index, 1);
      }

      source.unshift({ ...item, timestamp: (+new Date()) });
    }

    if (sync) _.remove(source, (src) => !collection.some(predicate(src)));
  },

  /**
   * Add the variable object to the recent variables list.
   * @param {Boolean} global - add as global variable.
   * @param {Object} target - target variable object.
   */
  addVariable(target, global, sync = true) {
    if (!target) return;

    if (global) {
      if (!this.globalVariables) { this.globalVariables = []; return; }
    } else {
      if (!this.localVariables) { this.localVariables = []; return; }
    }

    this.add({
      collection: (global ? _GlobalVariableCollection : _VariableCollection).toJSON(),
      source: (global ? this.globalVariables : this.localVariables),
      predicate: this.predicates.variables,
      target,
      sync,
    });
  },

  /**
   * Add the resource object to the recent resources list.
   * @param {Object} target - target resource object.
   */
  addResource(target, sync = true) {
    if (!target) return;
    if (!this.resources) { this.resources = []; return; }

    this.add({
      collection: _ResourceCollection.toJSON(),
      predicate: this.predicates.resources,
      source: this.resources,
      target,
      sync,
    });
  },

  /**
   * Add the function object to the recent functions list.
   * @param {Object} target - target function object.
   */
  addFunction(target, sync = true) {
    if (!target) return;
    if (!this.functions) { this.functions = []; return; }

    this.add({
      collection: _FunctionCollection.toJSON(),
      predicate: this.predicates.functions,
      source: this.functions,
      target,
      sync,
    });
  },

  addElements(source) {
    source.forEach((item) => {
      if (item.type === 'var') {
        this.addVariable({ name: item.data, global: false }, false, false);
      }
    });
  }
}