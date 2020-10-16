BasDialogsLib.store = {
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
  add(target, source, collection, props = ['name']) {
    const predicate = (a) => (b) => _.eq(_.pick(a, props), _.pick(b, props));
    const item = this.uniq(target, collection, predicate);

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
      this.add(target, this.globalVariables, _GlobalVariableCollection.toJSON(), ['global', 'name']);
    } else {
      if (!this.localVariables) { this.localVariables = []; return; }
      this.add(target, this.localVariables, _VariableCollection.toJSON(), ['global', 'name']);
    }
  },

  /**
   * Add the resource object to the recent resources list.
   * @param {Object} target - target resource object.
   */
  addResource(target) {
    if (!target) return;
    if (!this.resources) { this.resources = []; return; }
    this.add(target, this.resources, _ResourceCollection.toJSON());
  },

  /**
   * Add the function object to the recent functions list.
   * @param {Object} target - target function object.
   */
  addFunction(target) {
    if (!target) return;
    if (!this.functions) { this.functions = []; return; }
    this.add(target, this.functions, _FunctionCollection.toJSON());
  },

  /**
   * Get the unique item from the two arrays.
   * @param {Object[]} arr2 - second array.
   * @param {Object[]} arr1 - first array.
   * @returns {Object} unique item.
   */
  uniq(arr1, arr2, predicate) {
    return Array.isArray(arr1)
      ? arr1.filter((a) => !arr2.some(predicate(a))).pop()
      : arr1;
  }
}