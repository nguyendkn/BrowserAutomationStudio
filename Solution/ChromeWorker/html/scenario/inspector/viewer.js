(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  Inspector.TreeView = Backbone.View.extend({
    initialize() {
      this.on('render', () => {
        // this.sortable = {
        //   nodes: [...this.el.querySelectorAll('.jst-root > li > ul')].map(el => Sortable.create(el, {
        //     onAdd({ item, from, to }) {
        //       const name = item.dataset.path.slice(1);
        //       const groups = model.get('groups');

        //       const fromName = from.closest('.jst-group').dataset.name;
        //       groups[fromName] = _.without(groups[fromName], name);

        //       const toName = to.closest('.jst-group').dataset.name;
        //       groups[toName] = _.concat(groups[toName], name);

        //       model.set('groups', groups, { silent: true });
        //     },
        //     dataIdAttr: 'data-path',
        //     filter: '.pinned',
        //     group: 'nodes'
        //   }))
        // }
      });

      this.getValue = function (path) {
        return jsonpatch.getValueByPointer(this.get('source'), path);
      }
    },

    render() {
      const source = this.model.get('source');
      const groups = this.model.get('groups');

      morphdom(this.el, (
        `<div class="jst-viewer">${_.map(groups, (keys, name) => (
          `<div class="jst-group" data-name="${name}" draggable="false">
            <div class="jst-group-body">
              <ul class="jst-root">${renderNode(_.pick(source, ...keys), 'root', '', true)}</ul>
            </div>
          </div>`
        )).join('')
        }</div>`
      ));

      return this;
    },

    events: {
      'click .jst-item > .fa-minus-circle': function (e) {
        const $el = $(e.target).toggleClass('fa-minus-circle fa-plus-circle');
        const { path } = e.target.closest('li').dataset;
        const text = this.getValue(path), len = text.length;

        $el.prev().text(`"${_.escape(_.truncate(text, 100))}"`);
      },

      'click .jst-item > .fa-plus-circle': function (e) {
        const $el = $(e.target).toggleClass('fa-minus-circle fa-plus-circle');
        const { path } = e.target.closest('li').dataset;
        const text = this.getValue(path), len = text.length;

        $el.prev().text(`"${_.escape(_.truncate(text, len))}"`);
      },

      'click .jst-collapse': function (e) {
        const el = e.target, $el = $(el);
        $el.toggleClass('jst-collapse jst-expand').next().toggleClass('collapsed');

        this.trigger('node:collapse', { ...el.closest('li').dataset });
      },

      'click .jst-expand': function (e) {
        const el = e.target, $el = $(el);
        $el.toggleClass('jst-collapse jst-expand').next().toggleClass('collapsed');

        this.trigger('node:expand', { ...el.closest('li').dataset });
      }
    }
  });

  function renderNode(value, label, path, isRoot = false) {
    const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();

    return (
      `<li class="jst-item" data-type="${type}" data-path="${path}">${[
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
              const data = _.truncate(value, 100);
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
    if (type === 'string') value = `"${_.escape(value)}"`;
    return `<span class="jst-node">${value}</span>`;
  }
})(window);