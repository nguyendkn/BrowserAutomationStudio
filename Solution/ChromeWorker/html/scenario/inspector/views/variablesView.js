(function ({ Scenario }, $, _) {
  const { Inspector, JST } = Scenario;
  const { ScriptDataModel, ScriptDataView } = Inspector;

  const Model = ScriptDataModel.extend({
    defaults: () => _.extend({}, ScriptDataModel.prototype.defaults, {
      supportHighlight: true,
      supportGroups: true,
    })
  });

  const View = ScriptDataView.extend({
    template: JST['inspector/variables'],

    model: new Model(),

    initialize() {
      ScriptDataView.prototype.initialize.apply(this);
    },

    render() {
      return ScriptDataView.prototype.render.apply(this);
    },

    events: {
      'dblclick #inspectorVariablesData [data-path]': function (e) {
        const { path } = e.target.dataset;
        const { type } = e.target.dataset;
        e.stopPropagation();
        if (!path) return;

        const modal = new Inspector.Modal({
          callback: ({ isChanged, value, cancel, type }) => {
            if (!cancel && isChanged) {
              Scenario.utils.updateVariable(value, path, type);
            }
          },
          value: this.model.getValue(path),
          type,
          path,
        });
        modal.render();
      },

      'change .inspector-filter-menu-item > input': function (e) {
        const $el = $(e.target), type = $el.val();

        this.model.set('visibleTypes', {
          ...this.model.get('visibleTypes'),
          [type]: $el.prop('checked')
        });
      },

      'click .inspector-filter-button': function (e) {
        e.preventDefault();
        const $menu = $(e.currentTarget).next('.inspector-filter-menu');
        $menu.toggle($menu.is(':hidden'));
      },

      'click .inspector-sort-button': function (e) {
        e.preventDefault();
        const $menu = $(e.currentTarget).next('.inspector-sort-menu');
        $menu.toggle($menu.is(':hidden'));
      },

      'input .inspector-filter-input': _.debounce(function (e) {
        this.filterTree()
      }, 200),

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      },
    }
  });

  Inspector.Variables = View;
})(window, jQuery, _);