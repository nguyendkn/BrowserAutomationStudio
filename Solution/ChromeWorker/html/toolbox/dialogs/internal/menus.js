BasDialogsLib.dropdowns = {
  initialize() {
    $(document).on('show.bs.dropdown', '.input-group', function () {
      const $parent = $(this), $dropdown = $parent.find('ul[data-toggle="dropdown"]');

      if ($dropdown.length) {
        this.renderResources($dropdown);
        this.renderVariables($dropdown);
        $dropdown.css('visibility', 'hidden');

        $parent.removeClass('dropup'); const heightTop = this.visibleHeight($dropdown);
        $parent.addClass('dropup'); const heightBot = this.visibleHeight($dropdown);
        if (heightTop >= heightBot) $parent.removeClass('dropup');

        $dropdown.css('visibility', 'visible');
      }
    });

    $(document).on('click', 'li.recent-resource > a', function (e) {
      e.preventDefault(); const selector = $(this).data('result');
      const $element = $(selector);
    });

    $(document).on('click', 'li.recent-variable > a', function (e) {
      e.preventDefault(); const selector = $(this).data('result');
      const $element = $(selector);
    });
  },

  renderResources($dropdown) {
    $dropdown.find('li.recent-resource').remove();
    if (!BasDialogsLib.store.resources.length) return;

    const $resourceItem = $dropdown.find('a.res');
    $resourceItem.parent().after(BasDialogsLib.templates.recentResourcesList({
      id: $resourceItem.data('result-target')
    }));
  },

  renderVariables($dropdown) {
    $dropdown.find('li.recent-variable').remove();
    if (!BasDialogsLib.store.variables.length) return;

    const $variableItem = $dropdown.find('a.var');
    $variableItem.parent().after(BasDialogsLib.templates.recentVariablesList({
      id: $variableItem.data('result-target')
    }));
  },

  visibleHeight($target) {
    const topScroll = $(window).scrollTop();
    const botScroll = topScroll + $(window).height();

    const topOffset = $target.offset().top;
    const botOffset = topOffset + $target.outerHeight();

    const topHeight = Math.max(topScroll, topOffset);
    const botHeight = Math.min(botScroll, botOffset);
    return botHeight - topHeight;
  }
};