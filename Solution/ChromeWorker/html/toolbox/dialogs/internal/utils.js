BasDialogsLib.utils = {
  /**
   * Check that selected html element is clickable.
   * @param {HTMLElement} element - html element.
   */
  isClickable: (element) => {
    return _.any([
      element.parentNode.dataset.clickable === 'true',
      element.dataset.clickable === 'true',
    ]);
  },

  /**
   * Show the list item header by toggling CSS classes.
   */
  showHeader: ($header) => {
    $header.addClass('modal-header-visible')
      .removeClass('modal-header-hidden');
  },

  /**
   * Hide the list item header by toggling CSS classes.
   */
  hideHeader: ($header) => {
    $header.addClass('modal-header-hidden')
      .removeClass('modal-header-visible');
  },

  /** 
   * Trim the selected string and convert to lowercase.
   */
  format: (string) => {
    return string.toLowerCase().trim();
  }
};
