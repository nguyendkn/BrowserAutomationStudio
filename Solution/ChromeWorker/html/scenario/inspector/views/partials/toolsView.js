(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      filters: {
        undefined: true,
        boolean: true,
        number: true,
        groups: false,
        object: true,
        string: true,
        array: true,
        date: true,
        null: true
      },
      sorting: 'alphabetically',
      query: ''
    })
  });

  Inspector.ToolsView = Backbone.View.extend({
    template: JST['inspector/tools'],

    initialize() {
      this.model = new Model();
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
      }
      return this;
    },

    toggle() {
      const $icon = this.$('.inspector-tools-toggle > i');
      const $panel = this.$('.inspector-tools-panel');
      $icon.toggleClass('fa-chevron-down');
      $icon.toggleClass('fa-chevron-up');
      $panel.toggleClass('collapsed');
      return this;
    },

    events: {
      'change .inspector-filter-menu > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.model.set('query', e.target.value.toLowerCase());
      }, 200),

      'click .inspector-filter-menu > li': function (e) {
        e.stopPropagation();
      },

      'click .inspector-sort-menu > li': function (e) {
        e.preventDefault();
        const { sorting } = e.currentTarget.dataset;
        this.model.set('sorting', sorting);
      },

      'click .inspector-tools-toggle': 'toggle'
    }
  });
})(window);