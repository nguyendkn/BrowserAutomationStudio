class DialogsStore {
  /**
   * Create an instance of `DialogsStore` class.
   * @constructor
   */
  constructor () {
    this.globalVariablesInit = false;
    this.localVariablesInit = false;
    this.resourcesInit = false;
    this.functionsInit = false;

    this.recentVariables = [];
    this.recentFunctions = [];
    this.recentResources = [];
  }

  /**
   * Add the variable object to the recent variables list.
   * @param {Boolean} global - add as global variable.
   * @param {Object} target - target variable object.
   */
  addVariable(target, global) {
    if (global) {
      if (!target) return;
      if (!this.globalVariablesInit) { this.globalVariablesInit = true; return; }
      this.add(this.uniq(target, _GlobalVariableCollection.toJSON()), this.recentVariables);
    } else {
      if (!target) return;
      if (!this.localVariablesInit) { this.localVariablesInit = true; return; }
      this.add(this.uniq(target, _VariableCollection.toJSON()), this.recentVariables);
    }
  }

  /**
   * Add the resource object to the recent resources list.
   * @param {Object} target - target resource object.
   */
  addResource(target) {
    if (!target) return;
    if (!this.resourcesInit) { this.resourcesInit = true; return; }
    this.add(this.uniq(target, _ResourceCollection.toJSON()), this.recentResources);
  }

  /**
   * Add the function object to the recent functions list.
   * @param {Object} target - target function object.
   */
  addFunction(target) {
    if (!target) return;
    if (!this.functionsInit) { this.functionsInit = true; return; }
    this.add(this.uniq(target, _FunctionCollection.toJSON()), this.recentFunctions);
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
    if (!Array.isArray(arr1)) return arr1;
    return arr1.filter((a) => !arr2.some((b) => b.name === a.name)).pop();
  }
}