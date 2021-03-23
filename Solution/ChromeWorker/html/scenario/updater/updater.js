(function (window) {
  window.Scenario.ActionsUpdater = new Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="">
        <h1>Updater</h1>
      </div>
      <div class="actions-updater-footer">
        <button type="button" id="actionsUpdaterCancel" class="btn btn-default standartbutton tr">Cancel</button>
        <button type="button" id="actionsUpdaterAccept" class="btn btn-primary standartbutton tr">Ok</button>
      </div>
    `),

    className: 'actions-updater',

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
    }
  })();
})(window);