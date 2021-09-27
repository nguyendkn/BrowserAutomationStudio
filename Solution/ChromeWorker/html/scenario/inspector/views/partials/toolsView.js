(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      sorting: 'alphabetically',
      filters: {},
      query: ''
    })
  });

  Inspector.ToolsView = Backbone.View.extend({
    template: JST['inspector/tools'],

    className: 'inspector-tools',

    initialize(options) {
      this.model = new Model(_.pick(options, [
        'filters',
        'sorting',
        'query'
      ]));
    },

    render() {
      if (this.$el.is(':empty')) {
        const json = this.model.toJSON();
        this.$el.html(this.template(json));
      }

      return this;
    },

    events: {
      'change .inspector-filter-menu > li > input': function (e) {
        const { checked, value } = e.target;
        this.model.set('filters', { ...this.model.get('filters'), [value]: checked });
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.model.set('query', _.toLower(e.target.value));
      }, 200),

      'click .inspector-filter-menu > li': function (e) {
        e.stopPropagation();
      },

      'click .inspector-sort-menu > li': function (e) {
        e.preventDefault();
        this.model.set('sorting', e.currentTarget.dataset.sorting);
      },

      'click .inspector-tools-toggle': function (e) {
        $(e.currentTarget).find('i').toggleClass('fa-chevron-down fa-chevron-up');
        this.$('.inspector-tools-panel').toggleClass('collapsed');
      }
    }
  });
})(window);