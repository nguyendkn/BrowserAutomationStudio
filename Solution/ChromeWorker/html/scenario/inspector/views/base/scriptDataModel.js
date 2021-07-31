(function (global, $, _) {
  _.extend(global.Scenario.Inspector, {
    ScriptDataModel: Backbone.Model.extend({
      getValue(path) {
        const source = this.get('source');
        return jsonpatch.getValueByPointer(source, path);
      },

      update(data) {
        if (!data) return;
        const metadata = this.get('metadata');
        const source = this.get('source');
        this.set('source', data);

        const diff = jsonpatch.compare(source, data), time = Date.now();

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

        if (this.get('supportHighlight')) {
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
        supportHighlight: true,
        supportGroups: false,
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
        },
      }
    })
  })
})(window, jQuery, _);