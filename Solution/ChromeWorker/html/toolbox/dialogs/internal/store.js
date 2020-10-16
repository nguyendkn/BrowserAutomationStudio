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
    return [
      ...this.globalVariables,
      ...this.localVariables,
    ]
  },

  /**
   * Add unique item from the target list to the source list.
   * @param {Object[]} collection - base collection.
   * @param {Object[]} source - source items list.
   * @param {Object[]} target - target items list.
   */
  add(target, source, collection, predicate) {
    const item = Array.isArray(target)
      ? target.filter((a) => !collection.some(predicate(a))).pop()
      : target;

    if (item) {
      const index = source.findIndex(predicate(item));

      if (index >= 0) {
        source.splice(index, 1);
      }

      source.unshift({ ...item });
    }

    _.remove(source, (src) => !collection.some(predicate(src)));
  },

  /**
   * Add the variable object to the recent variables list.
   * @param {Boolean} global - add as global variable.
   * @param {Object} target - target variable object.
   */
  addVariable(target, global) {
    if (!target) return;

    if (global) {
      if (!this.globalVariables) { this.globalVariables = []; return; }
      const predicate = this.predicates.variables;
      this.add(target, this.globalVariables, _GlobalVariableCollection.toJSON(), predicate);
    } else {
      if (!this.localVariables) { this.localVariables = []; return; }
      const predicate = this.predicates.variables;
      this.add(target, this.localVariables, _VariableCollection.toJSON(), predicate);
    }
  },

  /**
   * Add the resource object to the recent resources list.
   * @param {Object} target - target resource object.
   */
  addResource(target) {
    if (!target) return;
    if (!this.resources) { this.resources = []; return; }
    const predicate = this.predicates.functions;
    this.add(target, this.resources, _ResourceCollection.toJSON(), predicate);
  },

  /**
   * Add the function object to the recent functions list.
   * @param {Object} target - target function object.
   */
  addFunction(target) {
    if (!target) return;
    if (!this.functions) { this.functions = []; return; }
    const predicate = this.predicates.resources;
    this.add(target, this.functions, _FunctionCollection.toJSON(), predicate);
  }
}