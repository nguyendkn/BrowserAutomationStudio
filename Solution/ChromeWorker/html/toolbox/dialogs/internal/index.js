window.BasDialogsLib = {
  initializeDropdowns: () => {
    $(document).on('show.bs.dropdown', '.input-group', function () {
      const $parent = $(this), $dropdown = $parent.find('ul[data-toggle="dropdown"]');

      if ($dropdown.length) {
        $dropdown.css('visibility', 'hidden');
        $dropdown.css('display', 'block');
        $parent.removeClass('dropup');

        if ($dropdown.offset().top + $dropdown.outerHeight() > $(window).innerHeight() + $(window).scrollTop()) {
          $parent.addClass('dropup');
        }

        $dropdown.removeAttr('style');
      }
    });
  },

  templates: {},

  options: {},

  store: {},

  utils: {},
}