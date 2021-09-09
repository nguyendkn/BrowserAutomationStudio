(({ App, Backbone, _ }) => {
  const { Inspector } = App;

  Inspector.ScriptDataModel = Backbone.Model.extend({
    defaults: () => ({
      sorting: 'alphabetically',
      highlight: false,
      metadata: {},
      history: [],
      updates: 0,
      source: {},
      state: {},
      filters: {
        undefined: true,
        boolean: true,
        groups: false,
        object: true,
        string: true,
        number: true,
        array: true,
        date: true,
        null: true
      }
    }),

    update: function (source) {
      const highlight = this.get('highlight');
      const metadata = this.get('metadata');
      let updates = this.get('updates');
      let history = this.get('history');

      const diff = jsonpatch.compare(this.get('source'), source); diff.forEach(item => {
        const { path, op } = item, now = performance.now();

        if (_.has(metadata, path)) {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = now;
          metadata[path].usages += 1;
          metadata[path].count += 0;
        } else {
          metadata[path] = { modifiedAt: now, addedAt: now, usages: 1, count: 5 };
        }

        history = history.concat(path).slice(-100);
      });

      updates += diff.length !== 0;
      this.set('updates', updates);
      this.set('history', history);
      this.set('source', source);
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