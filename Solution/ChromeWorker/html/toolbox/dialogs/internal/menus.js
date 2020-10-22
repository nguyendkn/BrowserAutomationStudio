BasDialogsLib.dropdowns = {
  initialize() {
    const self = this;

    $(document).off('show.bs.dropdown', '.input-group')
      .on('show.bs.dropdown', '.input-group', function () {
        const $parent = $(this), $dropdown = $parent.find('ul[data-toggle="dropdown"]');

        if ($dropdown.length) {
          self.renderResources($dropdown);
          self.renderVariables($dropdown);
          $dropdown.css('visibility', 'hidden');

          $parent.removeClass('dropup'); const heightTop = self.getVisibleHeight($dropdown);
          $parent.addClass('dropup'); const heightBot = self.getVisibleHeight($dropdown);
          if (heightTop >= heightBot) $parent.removeClass('dropup');

          $dropdown.css('visibility', 'visible');
        }
      });

    $(document).off('mousedown', 'li.recent-resource > a')
      .on('mousedown', 'li.recent-resource > a', function (e) {
        e.preventDefault(); const data = $(this).data();
        BasDialogsLib.insertHelper.insertResource(
          data.result,
          data.name,
          data.displayName
        );
      });

    $(document).off('mousedown', 'li.recent-variable > a')
      .on('mousedown', 'li.recent-variable > a', function (e) {
        e.preventDefault(); const data = $(this).data();
        BasDialogsLib.insertHelper.insertVariable(
          data.result,
          data.name,
          data.displayName
        );
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

  getVisibleHeight($target) {
    const topScroll = $(window).scrollTop();
    const botScroll = topScroll + $(window).height();

    const topOffset = $target.offset().top;
    const botOffset = topOffset + $target.outerHeight();

    const topHeight = Math.max(topScroll, topOffset);
    const botHeight = Math.min(botScroll, botOffset);
    return botHeight - topHeight;
  }
};