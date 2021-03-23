(function (window) {
  const ActionsUpdater = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="">
        <h1>Updater</h1>
      </div>
    `),

    className: 'actions-updater',

    id: 'actionsUpdater',

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
  });

  window.Scenario.ActionsUpdater = new ActionsUpdater();
})(window);