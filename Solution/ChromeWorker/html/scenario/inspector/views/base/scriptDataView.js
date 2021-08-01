(function (global, $, _) {
  _.extend(global.Scenario.Inspector, {
    ScriptDataView: Backbone.View.extend({
      initialize() {
        const model = this.model;

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
          const $data = this.$('.inspector-panel-data');
          const isEmpty = _.isEmpty(source);

          if (!isEmpty) this.tree.render(source);
          $data.toggle(!isEmpty).prev().toggle(isEmpty);
        });

        model.on('change:sortingType', (__, method) => {
          this.sortTree(method);
        });
      },

      render() {
        if (this.$el.is(':empty')) {
          this.$el.html(this.template({ ...this.model.toJSON() }));
          const preserveState = BrowserAutomationStudio_PreserveInterfaceState;

          this.tree = new JSONTree(this.$('.inspector-panel-data')[0], {
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

      filterTree() {
        const query = this.$('.inspector-filter-input').val().toLowerCase();

        this.$('.jst-root > ul > li').each((__, el) => {
          const $el = $(el);

          if (query.length) {
            const $label = $el.children('.jst-label');
            const text = $label.text().toLowerCase();
            return $el.toggle(text.includes(query));
          } else {
            const { dataset } = $el.children('[data-path]')[0];
            const types = this.model.get('visibleTypes');

            if (_.has(types, dataset.type)) {
              return $el.toggle(types[dataset.type]);
            }
          }

          $el.show();
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
    })
  })
})(window, jQuery, _);