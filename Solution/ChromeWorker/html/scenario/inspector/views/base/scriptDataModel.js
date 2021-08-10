(({ Scenario, Backbone }, $, _) => {
  const { Inspector, utils } = Scenario;

  const Model = Backbone.Model.extend({
    update: function (object) {
      const metadata = this.get('metadata');
      const updates = this.get('updates');
      const source = this.get('source');
      let cache = this.get('cache');

      const diff = $.each(jsonpatch.compare(source, object), (__, { path, op }) => {
        const time = performance.now();

        if (!_.has(metadata, path)) {
          metadata[path] = { count: 6, usages: 1, addedAt: time, modifiedAt: time };
        } else {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = time;
          metadata[path].usages += 1;
          metadata[path].count += 0;
        }

        cache = cache.concat(path).slice(-100);
      });

      this.set('updates', updates + !!diff.length);
      this.set('source', object);
      this.set('cache', cache);

      if (this.get('allowHighlight')) {
        const highlight = this.get('highlight');
        _.each(metadata, (item, path) => {
          if (highlight) {
            item.count = diff.some(v => v.path === path) ? 1 : (item.count + 1);
          }
          this.trigger('highlight', { ...item, path });
        });
        this.set('highlight', false);
      }
    },

    defaults: {
      sortType: 'alphabetically',
      allowHighlight: true,
      highlight: false,
      metadata: {},
      updates: 0,
      source: {},
      state: {},
      cache: [],
      visibility: {
        undefined: true,
        boolean: true,
        string: true,
        number: true,
        date: true,
        null: true,
      }
    }
  });

  Inspector.ScriptDataModel = Model;
})(window, jQuery, _);