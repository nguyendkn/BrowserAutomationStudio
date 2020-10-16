BasDialogsLib.utils = {
  /**
   * Check that selected html element is clickable.
   * @param {HTMLElement} element - html element.
   */
  isClickable: (element) => {
    return _.any([
      element.parentNode.dataset.clickable === 'true',
      element.dataset.clickable === 'true'
    ]);
  }
}