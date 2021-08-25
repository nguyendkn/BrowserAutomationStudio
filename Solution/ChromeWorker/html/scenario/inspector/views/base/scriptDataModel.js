(({ App, Backbone }, $, _) => {
  const { Inspector, utils } = App;

  const Model = Backbone.Model.extend({
    update: function (source) {
      const metadata = this.get('metadata');
      const updates = this.get('updates');
      let cache = this.get('cache');

      const diff = jsonpatch.compare(this.get('source'), source); diff.forEach(item => {
        const { path, op } = item, time = performance.now();

        if (!_.has(metadata, path)) {
          metadata[path] = { count: 5, usages: 1, addedAt: time, modifiedAt: time };
        } else {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = time;
          metadata[path].usages += 1;
          metadata[path].count += 0;
        }

        cache = cache.concat(path).slice(-100);
      });

      this.set('updates', updates + !!diff.length);
      this.set('source', source);
      this.set('cache', cache);

      if (this.get('allowHighlight')) {
        const highlight = this.get('highlight');
        _.each(metadata, (item, path) => {
          if (highlight) {
            item.count = diff.some(v => v.path === path) ? 0 : Math.min(item.count + 1, 5);
          }
          this.trigger('highlight', { ...item, path });
        });
        this.set('highlight', false);
      }
    },

    defaults: {
      sorting: 'alphabetically',
      allowHighlight: true,
      highlight: false,
      metadata: {},
      updates: 0,
      source: {},
      state: {},
      cache: [],
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
    }
  });

  Inspector.ScriptDataModel = Model;
})(window, jQuery, _);