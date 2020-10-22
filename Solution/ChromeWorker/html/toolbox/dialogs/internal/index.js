window.BasDialogsLib = {
  initializeDropdowns: () => {
    $(document).on('show.bs.dropdown', '.input-group', function () {
      const $parent = $(this), $dropdown = $parent.find('ul[data-toggle="dropdown"]');

      if ($dropdown.length) {
        $dropdown.css('visibility', 'hidden');

        $parent.removeClass('dropup'); const heightTop = visibleHeight($dropdown);
        $parent.addClass('dropup'); const heightBot = visibleHeight($dropdown);
        if (heightTop >= heightBot) $parent.removeClass('dropup');

        $dropdown.css('visibility', 'visible');
      }
    });

    function visibleHeight($target) {
      const topScroll = $(window).scrollTop();
      const botScroll = topScroll + $(window).height();

      const topOffset = $target.offset().top;
      const botOffset = topOffset + $target.outerHeight();

      const topHeight = Math.max(topScroll, topOffset);
      const botHeight = Math.min(botScroll, botOffset);
      return botHeight - topHeight;
    }
  },

  templates: {},

  options: {},

  store: {},

  utils: {},
}