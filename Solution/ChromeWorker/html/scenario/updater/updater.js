(function (window) {
  window.Scenario.ActionsUpdater = new Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="">
        <select id="actionsUpdaterSelect" class="form-control">
          <option value="all"><%= tr('All actions in the project') %></option>
          <option value="current"><%= tr('All actions in the current function') %></option>
          <option value="selected"><%= tr('Only the selected actions') %></option>
        </select>
        <label for="actionsUpdaterSelect">0 <%= tr('actions') %></label>
      </div>
      <div class="actions-updater-footer">
        <button type="button" id="actionsUpdaterCancel" class="btn btn-default standartbutton tr">Cancel</button>
        <button type="button" id="actionsUpdaterAccept" class="btn btn-primary standartbutton tr">Ok</button>
      </div>
    `),

    className: 'actions-updater',

    updateTargetActions: function () {
      const target = this.$('#actionsUpdaterSelect').val();
    },

    initialize: function () {
      this.render();
    },

    render: function () {
      this.$el.html(this.template()).appendTo('body');
    },

    toggle: function () {
      this.$el.toggle();
    },

    show: function () {
      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    events: {
      'change #actionsUpdaterSelect': 'updateTargetActions'
    }
  })();
})(window);