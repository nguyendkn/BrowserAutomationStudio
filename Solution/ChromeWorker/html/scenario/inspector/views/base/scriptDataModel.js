(({ Scenario, Backbone }, $, _) => {
  const { Inspector, utils } = Scenario;

  const Model = Backbone.Model.extend({
    getValue(path) {
      const source = this.get('source');
      return jsonpatch.getValueByPointer(source, path);
    },

    update(value) {
      if (!value) return;
      const metadata = this.get('metadata');
      const updates = this.get('updates');
      const source = this.get('source');
      this.set('source', value);

      const diff = $.each(jsonpatch.compare(source, value), (__, { path, op }) => {
        const time = performance.now();
        if (!_.has(metadata, path)) {
          metadata[path] = { count: 6, usages: 1, addedAt: time, modifiedAt: time };
        } else {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = time;
          metadata[path].usages += 1;
          metadata[path].count += 0;
        }

        const history = this.get('history');
        if (history.length > 100) history.shift();
        this.set('history', history.concat(path));
      });
      this.set('updates', updates + !!diff.length);

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
      allowGroups: false,
      highlight: false,
      metadata: {},
      history: [],
      updates: 0,
      source: {},
      state: {},
      typesVisibility: {
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