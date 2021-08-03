(({ Scenario, Backbone }, $, _) => {
  const { Inspector, utils } = Scenario;

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

      const diff = jsonpatch.compare(source, data); diff.forEach(({ path, op }) => {
        const time = performance.now();
        if (!_.has(metadata, path)) {
          metadata[path] = { usage: 6, op, addedAt: time, modifiedAt: time };
        } else {
          if (op === 'remove') return (delete metadata[path]);
          metadata[path].modifiedAt = time;
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
      sortType: 'alphabetically',
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

  Inspector.ScriptDataModel = Model;
})(window, jQuery, _);