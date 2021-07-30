(function (global, $, _) {
  const { Inspector } = global.Scenario;

  const Model = Inspector.ScriptDataModel.extend({
    defaults: _.extend(Inspector.ScriptDataModel.prototype.defaults, {
      supportHighlight: false,
    }),
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/resources'],

    initialize() {
      const model = new Model();

      if (model.get('supportHighlight')) {
        model.on('highlight', ({ usage, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const { type } = $node[0].dataset;
            if (['object', 'array'].includes(type)) return;

            const scale = chroma.scale(['red', JSONTree.colors[type]]).mode('rgb');
            $node.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
          }
        });
      }

      model.on('change:visibleTypes', (__, types) => {
        this.filterTree();
      });

      model.on('change:source', (__, source) => {
        const $data = this.$('#inspectorResourcesData');
        const isEmpty = _.isEmpty(source);

        if (!isEmpty) this.tree.render(source);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      model.on('change:sortingType', (__, method) => {
        this.sortTree(method);
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template({ ...this.model.toJSON() }));
        const preserveState = BrowserAutomationStudio_PreserveInterfaceState;

        this.tree = new JSONTree(this.$('#inspectorResourcesData')[0], {
          onRender: () => {
            this.sortTree(this.model.get('sortingType'));
            this.filterTree().loadState();
          },
          onCollapse: preserveState,
          onExpand: preserveState,
        });
      }

      return this;
    },

    filterTree() {
      const query = this.$('.inspector-filter-input').val().toLowerCase();

      this.$('.jst-root > ul > li').each((__, el) => {
        const $el = $(el);

        if (query.length) {
          const $label = $el.children('.jst-property');
          const text = $label.text().toLowerCase();
          return $el.toggle(text.includes(query));
        } else {
          const $node = $el.children('[data-path]');
          const type = $node[0].dataset.type;
          return $el.toggle(this.model.get('visibleTypes')[type]);
        }

        $el.show();
      });

      return this;
    },

    sortTree(type) {
      const metadata = this.model.get('metadata');

      tinysort(this.el.querySelectorAll('.jst-root > ul > li'), {
        sortFunction: (a, b) => {
          const [path1, path2] = [a, b].map(({ elm }) => {
            const node = elm.querySelector(':scope > [data-path]');
            return node.dataset.path;
          });

          if (type !== 'alphabetically') {
            const meta1 = metadata[path1], meta2 = metadata[path2];

            if (type === 'byAddedTime') {
              return meta2.addedAt - meta1.addedAt;
            } else if (type === 'byChangedTime') {
              return meta2.changedAt - meta1.changedAt;
            } else {

            }
          }
          return Scenario.utils.sortByLocals(path1.split('/')[1], path2.split('/')[1]);
        },
      });

      return this;
    },

    loadState(state = this.model.get('state')) {
      [state.objects, state.arrays].forEach((data) => {
        if (Array.isArray(data)) {
          data.forEach(({ path, folded }) => {
            const $el = this.$el.find(`[data-path="${path}"]`);
            if (folded && !$el.hasClass('jst-collapsed')) {
              $el.prev('.jst-collapse').click();
            }
          });
        }
      });

      this.model.set('state', state);
    },

    saveState() {
      this.model.set('state', {
        objects: _.map(this.$el.find('[data-type="object"]'), el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path,
        })),
        arrays: _.map(this.$el.find('[data-type="array"]'), el => ({
          folded: el.classList.contains('jst-collapsed'),
          path: el.dataset.path,
        })),
      });

      return this.model.get('state');
    },

    events: {
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

      'input .inspector-filter-input': _.debounce(function (e) {
        this.filterTree()
      }, 200),

      'keydown .inspector-filter-input': function (e) {
        if (e.key === ' ') e.preventDefault();
      },
    }
  });

  Inspector.Resources = View;
})(window, jQuery, _);