(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      highlight: false,
      metadata: {},
      history: [],
      source: {},
    }),

    update: function (source) {
      const diff = jsonpatch.compare(this.get('source'), source);
      const highlight = this.get('highlight');
      const metadata = this.get('metadata');

      if (diff.length) {
        let history = [...this.get('history'), _.pluck(diff, 'path')].slice(-100);

        _.each(diff, ({ path, op }) => {
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

        this.set('history', history);
        this.set('source', source);
      }

      _.each(metadata, (item, path) => {
        if (highlight) {
          item.count = diff.some(v => v.path === path) ? 0 : Math.min(item.count + 1, 5);
        }
        this.trigger('highlight', { count: item.count, path });
      });

      this.set('highlight', false);
    }
  })

  Inspector.JsonView = Backbone.View.extend({
    applySorting() {
      // const sorting = this.tools.model.get('sorting');
      // const metadata = this.model.get('metadata');
      // const history = this.model.get('history');
      // const cache = history.flat(), updates = history.length;

      // _.each(this.tree.sortable.nodes, nodes => {
      //   nodes.sort(nodes.toArray().sort((a, b) => {
      //     return (a.startsWith('/GLOBAL:') - b.startsWith('/GLOBAL:')) || (() => {
      //       switch (sorting) {
      //         case 'dateModified':
      //           return metadata[b].modifiedAt - metadata[a].modifiedAt;
      //         case 'dateCreated':
      //           return metadata[b].createdAt - metadata[a].createdAt;
      //         case 'frequency':
      //           const f2 = cache.filter(v => v === b).length + updates;
      //           const f1 = cache.filter(v => v === a).length + updates;
      //           return metadata[b].usages / f2 - metadata[a].usages / f1;
      //       }

      //       return a.localeCompare(b);
      //     })();
      //   }));
      // });
    }
  });

  function renderNode(value, label, path, isRoot = false) {
    const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

    return (
      `<li class="jst-item">${[
        '<i class="jst-icon fa fa-chain"></i>',
        isRoot ? '' : `<span class="jst-label">${_.escape(label)}:</span>`,
        (() => {
          switch (type) {
            case 'object': return iterable(value, path, type, '{}');
            case 'array': return iterable(value, path, type, '[]');
            case 'undefined': return element(value, path, type);
            case 'boolean': return element(value, path, type);
            case 'number': return element(value, path, type);
            case 'null': return element(value, path, type);
            case 'string':
              const data = value; // _.truncate(value, 100);
              const clip = data !== value ? `<i class="fa fa-plus-circle"></i>` : '';
              return element(data, path, type) + clip;
            case 'date':
              const format = 'YYYY-MM-DD HH:mm:ss [UTC]Z';
              value = dayjs(value).format(format);
              return element(value, path, type);
          }
        })()
      ].join('')
      }</li>`
    );
  }

  function iterable(value, path, type, brackets) {
    const nodes = _.map(value, (val, key) => renderNode(val, key, `${path}/${key}`));

    return [
      `<span class="jst-bracket">${brackets[0]}</span>`,
      nodes.length ? '<span class="jst-expand"></span>' : '',
      `<ul class="jst-list collapsed">${nodes.join('')}</ul>`,
      `<span class="jst-bracket">${brackets[1]}</span>`
    ].join('');
  }

  function element(value, path, type) {
    return `<span class="jst-node">${value}</span>`;
  }
})(window);