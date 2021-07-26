(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      sortingMethod: 'alphabetically',
      metadata: {},
      resources: {},
      highlight: false,
      supportHighlight: false,
    },

    getResource(path) {
      const source = this.get('resources');
      return jsonpatch.getValueByPointer(source, path);
    },

    update(resources) {
      if (!resources) return;
      const previous = this.get('resources');
      const metadata = this.get('metadata');
      this.set('resources', resources);

      if (this.get('supportHighlight')) {
        const diff = jsonpatch.compare(previous, resources), time = Date.now();

        diff.forEach(({ path, value, op }) => {
          if (!_.has(metadata, path)) {
            metadata[path] = { usage: 6, value, op, addedAt: time, changedAt: time };
          } else {
            if (op === 'remove') {
              return (delete metadata[path]);
            }
            metadata[path].changedAt = time;
          }
        });

        if (this.get('highlight')) _.each(metadata, (item, path) => {
          item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          this.trigger('highlight', { ...item, path });
        });

        this.set('highlight', true);
      }
    },
  });

  const View = Backbone.View.extend({
    template: global.Scenario.JST['inspector/resources'],

    initialize() {
      const model = new Model();

      if (model.get('supportHighlight')) {
        model.on('highlight:resources', ({ usage, path }) => {
          const $node = this.$(`[data-path="${path}"]`);

          if ($node.length) {
            const { type } = $node[0].dataset;
            if (['object', 'array'].includes(type)) return;

            const scale = chroma.scale(['red', JSONTree.colors[type]]).mode('rgb');
            $node.css('color', scale.colors(6, 'css')[Math.min(usage, 6) - 1]);
          }
        });
      }

      model.on('change:resources', (__, resources) => {
        const $data = this.$('#inspectorResourcesData');
        const isEmpty = _.isEmpty(resources);

        if (!isEmpty) this.tree.render(resources);
        $data.toggle(!isEmpty).prev().toggle(isEmpty);
      });

      model.on('change:sortingMethod', (__, method) => {
        this.sortTree(method);
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template({}));

        this.tree = new JSONTree(this.$('#inspectorResourcesData')[0], {
          onCollapse: BrowserAutomationStudio_PreserveInterfaceState,
          onExpand: BrowserAutomationStudio_PreserveInterfaceState,
          onRender: () => {
            this.sortTree(this.model.get('sortingMethod'));
            this.trigger('renderTree');
          },
        });
      }

      return this;
    },

    sortTree(type) {
      tinysort(this.el.querySelectorAll('.jst-root > ul > li'), {
        sortFunction: (a, b) => {
          const $el1 = $(a.elm).children('[data-path]');
          const $el2 = $(b.elm).children('[data-path]');
          const path1 = $el1[0].dataset.path;
          const path2 = $el2[0].dataset.path;
          const meta1 = this.model.get('metadata')[path1];
          const meta2 = this.model.get('metadata')[path2];

          if (type === 'alphabetically') {
            return Scenario.utils.sortByLocals(
              path1.split('/')[1],
              path2.split('/')[1],
            );
          } else if (type === 'byAddedTime') {
            return meta2.addedAt - meta1.addedAt;
          } else if (type === 'byChangedTime') {
            return meta2.changedAt - meta1.changedAt;
          }
        }
      });
    },

    events: {
      'input #inspectorResourcesFilter': _.debounce(function (e) {
        const query = e.target.value.trim().toLowerCase();

        this.$('.jst-root > ul > li').each((__, el) => {
          const $el = $(el);

          if (query.length) {
            const $label = $el.children('.jst-property');
            const text = $label.text().toLowerCase();
            return $el.toggle(text.includes(query));
          }

          $el.show();
        });
      }, 200),
    }
  });

  global.Scenario.Inspector.Resources = View;
})(window, jQuery, _);