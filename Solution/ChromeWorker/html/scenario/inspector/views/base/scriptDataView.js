(function (global, $, _) {
  _.extend(global.Scenario.Inspector, {
    ScriptDataView: Backbone.View.extend({
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
            const $label = $el.children('.jst-property');
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