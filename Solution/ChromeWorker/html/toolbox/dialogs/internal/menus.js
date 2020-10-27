BasDialogsLib.dropdowns = {
  initialize() {
    const self = this;

    $(document).off('show.bs.dropdown', '.input-group')
      .on('show.bs.dropdown', '.input-group', function () {
        const $parent = $(this), $dropdown = $parent.find('ul[data-toggle="dropdown"]');

        if ($dropdown.length) {
          self.registerHotkeys($dropdown);
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
        BasDialogsLib.utils.saveCursor(data.result);
        BasDialogsLib.insertHelper.insertResource(
          data.result,
          data.name,
          data.displayName
        );
      });

    $(document).off('mousedown', 'li.recent-variable > a')
      .on('mousedown', 'li.recent-variable > a', function (e) {
        e.preventDefault(); const data = $(this).data();
        BasDialogsLib.utils.saveCursor(data.result);
        BasDialogsLib.insertHelper.insertVariable(
          data.result,
          data.name,
          data.displayName
        );
      });
  },

  registerHotkeys($dropdown) {
    const $input = $dropdown.siblings('input:visible'),
      $edit = $dropdown.find('a.edit'),
      $res = $dropdown.find('a.res'),
      $var = $dropdown.find('a.var');

    if ($edit.length && $res.length && $var.length) {
      $input.off('keyup').on('keyup', (e) => {
        if (e.key === 'F6') {
          $edit.trigger('mousedown');
          $input.trigger('blur');
        }
        if (e.key === 'F7') {
          $res.trigger('mousedown');
          $input.trigger('blur');
        }
        if (e.key === 'F8') {
          $var.trigger('mousedown');
          $input.trigger('blur');
        }
      });
    }
  },

  renderResources($dropdown) {
    $dropdown.find('li.recent-resource').remove();
    if (!BasDialogsLib.store.resources.length) return;
    const $element = $dropdown.find('a.res');
    $element.parent().after(BasDialogsLib.templates.recentResourcesList({ $element }));
  },

  renderVariables($dropdown) {
    $dropdown.find('li.recent-variable').remove();
    if (!BasDialogsLib.store.variables.length) return;
    const $element = $dropdown.find('a.var');
    $element.parent().after(BasDialogsLib.templates.recentVariablesList({ $element }));
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