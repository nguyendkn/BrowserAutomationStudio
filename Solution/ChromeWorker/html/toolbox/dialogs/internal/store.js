BasDialogsLib.store = {
  /**
   * Initialization state for global variables.
   */
  globalVariablesInit: false,

  /**
   * Initialization state for local variables.
   */
  localVariablesInit: false,

  /**
   * Initialization state for resources.
   */
  resourcesInit: false,

  /**
   * Initialization state for functions.
   */
  functionsInit: false,

  /**
   * Recent variables list.
   */
  recentVariables: [],

  /**
   * Recent functions list.
   */
  recentFunctions: [],

  /**
   * Recent resources list.
   */
  recentResources: [],

  /**
   * Add unique item from the target list to the source list.
   * @param {Object[]} collection - base collection.
   * @param {Object[]} source - source items list.
   * @param {Object[]} target - target items list.
   */
  add(target, source, collection) {
    const item = this.uniq(target, collection);

    if (item) {
      const index = source.findIndex((val) => _.eq(item, val));

      if (index >= 0) {
        source.splice(index, 1);
      }

      source.unshift({ ...item });
    }
  },

  /**
   * Add the variable object to the recent variables list.
   * @param {Boolean} global - add as global variable.
   * @param {Object} target - target variable object.
   */
  addVariable(target, global) {
    if (global) {
      if (!target) return;
      if (!this.globalVariablesInit) { this.globalVariablesInit = true; return; }
      this.add(target, this.recentVariables, _GlobalVariableCollection.toJSON());
    } else {
      if (!target) return;
      if (!this.localVariablesInit) { this.localVariablesInit = true; return; }
      this.add(target, this.recentVariables, _VariableCollection.toJSON());
    }
  },

  /**
   * Add the resource object to the recent resources list.
   * @param {Object} target - target resource object.
   */
  addResource(target) {
    if (!target) return;
    if (!this.resourcesInit) { this.resourcesInit = true; return; }
    this.add(target, this.recentResources, _ResourceCollection.toJSON());
  },

  /**
   * Add the function object to the recent functions list.
   * @param {Object} target - target function object.
   */
  addFunction(target) {
    if (!target) return;
    if (!this.functionsInit) { this.functionsInit = true; return; }
    this.add(target, this.recentFunctions, _FunctionCollection.toJSON());
  },

  /**
   * Get the unique item from the two arrays.
   * @param {Object[]} arr2 - second array.
   * @param {Object[]} arr1 - first array.
   * @returns {Object} unique item.
   */
  uniq(arr1, arr2) {
    if (!Array.isArray(arr1)) return arr1;
    return arr1.filter((a) => !arr2.some((b) => b.name === a.name)).pop();
  }
}