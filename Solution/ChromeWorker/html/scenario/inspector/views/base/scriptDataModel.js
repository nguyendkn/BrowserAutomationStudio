(function ({ Scenario, Backbone }, $, _) {
  const Model = Backbone.Model.extend({
    getValue(path) {
      const source = this.get('source');
      return jsonpatch.getValueByPointer(source, path);
    },

    update(data) {
      if (!data) return;
      const metadata = this.get('metadata');
      const source = this.get('source');
      this.set('source', data);

      const diff = jsonpatch.compare(source, data);

      diff.forEach(({ path, value, op }) => {
        if (!_.has(metadata, path)) {
          const time = performance.now();
          metadata[path] = { usage: 6, value, op, addedAt: time, modifiedAt: time };
        } else {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = performance.now();
        }
      });

      if (this.get('allowHighlight')) {
        const highlight = this.get('highlight');
        _.each(metadata, (item, path) => {
          if (highlight) {
            item.usage = diff.some(v => v.path === path) ? 1 : (item.usage + 1);
          }
          this.trigger('highlight', { ...item, path });
        });
        this.set('highlight', false);
      }
    },

    defaults: {
      sortingType: 'alphabetically',
      allowHighlight: true,
      allowGroups: false,
      highlight: false,
      metadata: {},
      source: {},
      state: {},
      visibleTypes: {
        undefined: true,
        boolean: true,
        string: true,
        number: true,
        date: true,
        null: true,
      }
    }
  });

  Scenario.Inspector.ScriptDataModel = Model;
})(window, jQuery, _);