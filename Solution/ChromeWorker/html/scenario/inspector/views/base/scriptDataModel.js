(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  Inspector.ScriptDataModel = Backbone.Model.extend({
    defaults: () => ({
      highlight: false,
      metadata: {},
      history: [],
      source: {},
      state: {},
    }),

    update: function (source) {
      const highlight = this.get('highlight');
      const metadata = this.get('metadata');

      const diff = jsonpatch.compare(this.get('source'), source); diff.forEach(({ path, op }) => {
        const now = performance.now();

        if (_.has(metadata, path)) {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = now;
          metadata[path].usages += 1;
          metadata[path].count += 0;
        } else {
          metadata[path] = { modifiedAt: now, createdAt: now, usages: 1, count: 5 };
        }
      });

      if (diff.length) {
        let history = [...this.get('history'), _.pluck(diff, 'path')];
        history = history.slice(-100);
        this.set('history', history);
        this.set('source', source);
      }

      {
        _.each(metadata, (item, path) => {
          if (highlight) {
            item.count = diff.some(v => v.path === path) ? 0 : Math.min(item.count + 1, 5);
          }
          this.trigger('highlight', { count: item.count, path });
        });

        this.set('highlight', false);
      }
    }
  });
})(window);