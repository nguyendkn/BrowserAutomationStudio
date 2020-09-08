class DialogsStore {
  /**
   * Create an instance of `DialogsStore` class.
   * @constructor
   */
  constructor () {
    this.variablesInit = { global: false, local: false };
    this.resourcesInit = false;
    this.functionsInit = false;

    this.recentVariables = [];
    this.recentFunctions = [];
    this.recentResources = [];
  }

  /**
   * Add the variable object to the recent variables list.
   * @param {Boolean} global - add as global variable.
   * @param {Object} source - target variable object.
   */
  addVariable(source, global) {
    if (global) {
      if (!this.variablesInit.global) { this.variablesInit.global = true; return; }
      this.add(this.uniq(source, _GlobalVariableCollection.toJSON()), this.recentVariables);
    } else {
      if (!this.variablesInit.local) { this.variablesInit.local = true; return; }
      this.add(this.uniq(source, _VariableCollection.toJSON()), this.recentVariables);
    }
  }

  /**
   * Add the resource object to the recent resources list.
   * @param {Object} source - target resource object.
   */
  addResource(source) {
    if (!this.resourcesInit) { this.resourcesInit = true; return; }
    this.add(this.uniq(source, _ResourceCollection.toJSON()), this.recentResources);
  }

  /**
   * Add the function object to the recent functions list.
   * @param {Object} source - target function object.
   */
  addFunction(source) {
    if (!this.functionsInit) { this.functionsInit = true; return; }
    this.add(this.uniq(source, _FunctionCollection.toJSON()), this.recentFunctions);
  }

  /**
   * Add the item object to the selected list.
   * @param {Object[]} list - selected list.
   * @param {Object} item - selected item.
   */
  add(item, list) {
    if (item) {
      const index = list.findIndex((v) => v.name === item.name);

      if (index >= 0) {
        list.splice(index, 1);
      }

      list.unshift(item);
    }
  }

  /**
   * Get the unique item from the two arrays.
   * @param {Object[]} arr2 - second array.
   * @param {Object[]} arr1 - first array.
   * @returns {Object} unique item.
   */
  uniq(arr1, arr2) {
    return arr1.filter((a) => !arr2.some((b) => b.name === a.name)).pop();
  }
}