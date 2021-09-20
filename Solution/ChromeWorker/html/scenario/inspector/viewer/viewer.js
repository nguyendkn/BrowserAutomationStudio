(({ App, Backbone, $, _ }) => {
  const { Inspector } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      source: {},
      groups: {},
    }),

    renameGroup: function (group, name) {
      if (_.any(this.get('groups'), (_, key) => key === name)) return;

      this.set('groups', _.reduce(this.get('groups'), (acc, val, key) => {
        acc[key === group ? name : key] = val;
        return acc;
      }, {}));
    },

    removeGroup: function (group) {
      this.set('groups', _.reduce(this.get('groups'), (acc, val, key) => {
        if (key === group) acc['Main'].push(...val);
        else acc[key] = val;
        return acc;
      }, {}));
    },

    addGroup: function () {
      const groups = this.get('groups');
      this.set('groups', { ...groups, [`Group${_.size(groups)}`]: [] });
    },

    update: function (source) {
      const groups = this.get('groups');

      if (!groups['Main'] || _.size(groups) === 1) {
        groups['Main'] = _.keys(source);
      }

      this.set('source', source);
    },

    getValue: function (path) {
      return jsonpatch.getValueByPointer(this.get('source'), path);
    }
  });

  Inspector.Viewer = Backbone.View.extend({
    className: 'jst-viewer',

    initialize() {
      this.model = new Model().on('change', this.render, this);

      this.on('render', () => {
        _.each(this.sortable, list => _.invoke(list, 'destroy'));

        this.sortable = {
          groups: [this.el].map(node => Sortable.create(node, {
            onEnd: ({ item, from, to }) => {

            },
            dataIdAttr: 'data-name',
            filter: '.pinned',
            group: 'groups'
          })),
          nodes: [...this.el.querySelectorAll('.jst-root > li > ul')].map(node => Sortable.create(node, {
            onEnd: ({ item, from, to }) => {
              const groups = this.model.get('groups');
              const name = item.dataset.path.slice(1);

              const fromName = from.closest('.jst-group').dataset.name;
              const fromList = _.without(groups[fromName], name);

              const toName = to.closest('.jst-group').dataset.name;
              const toList = _.concat(groups[toName], name);

              this.model.set('groups', {
                ...groups,
                [fromName]: _.uniq(fromList),
                [toName]: _.uniq(toList),
              }, { silent: true });
            },
            dataIdAttr: 'data-path',
            filter: '.pinned',
            group: 'nodes'
          }))
        }
      });

      this.$el.contextMenu({
        callback: (key, { $trigger }) => {
          const { name } = $trigger[0].closest('.jst-group').dataset;

          switch (key) {
            case 'add':
              return this.model.addGroup();
            case 'rename':
              return // this.model.renameGroup(name);
            case 'delete':
              return this.model.removeGroup(name);
          }
        },
        items: {
          add: { name: tr('Add') },
          rename: { name: tr('Rename') },
          delete: { name: tr('Delete') },
        },
        selector: '.jst-group-options',
        trigger: 'left'
      });

      this.sortable = {};
    },

    render() {
      const source = this.model.get('source');
      const groups = this.model.get('groups');

      morphdom(this.el, (
        `<div class="${this.el.className}">${_.map(groups, (keys, name) => (
          `<div class="jst-group" data-name="${name}" draggable="false">
            <div class="jst-group-head">
              <i class="jst-group-options fa fa-caret-down"></i>
              <span class="jst-group-title">${name}</span>
              <i class="jst-group-toggle fa fa-chevron-up"></i>
            </div>
            <div class="jst-group-body">
              <ul class="jst-root">${renderNode('root', _.pick(source, ...keys), '', true)}</ul>
            </div>
          </div>`
        )).join('')
        }</div>`
      ), {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        getNodeKey({ classList, dataset, id }) {
          if (classList) {
            if (classList.contains('jst-group')) {
              return dataset.name;
            }
            if (classList.contains('jst-item')) {
              return dataset.path;
            }
          }
          return id;
        },
        childrenOnly: true
      });

      return this.trigger('render');
    },

    events: {
      'click .jst-item > .fa-minus-circle': function (e) {
        const $el = $(e.target).toggleClass('fa-minus-circle fa-plus-circle');
        const { path } = e.target.closest('li').dataset;

        const text = this.model.getValue(path), len = text.length;
        $el.prev().text(`"${_.escape(_.truncate(text, 100))}"`);
      },

      'click .jst-item > .fa-plus-circle': function (e) {
        const $el = $(e.target).toggleClass('fa-minus-circle fa-plus-circle');
        const { path } = e.target.closest('li').dataset;

        const text = this.model.getValue(path), len = text.length;
        $el.prev().text(`"${_.escape(_.truncate(text, len))}"`);
      },

      'click .jst-group-toggle': function (e) {
        const $el = $(e.target), $group = $el.closest('.jst-group');
        $group.children('.jst-group-body').toggle();
        $el.toggleClass('fa-chevron-down');
        $el.toggleClass('fa-chevron-up');
      },

      'click .jst-collapse': function (e) {
        const el = e.target, $el = $(el);
        $el.toggleClass('jst-collapse jst-expand');
        $el.next().toggleClass('collapsed');
        this.trigger('node:collapse', { ...el.closest('li').dataset });
      },

      'click .jst-expand': function (e) {
        const el = e.target, $el = $(el);
        $el.toggleClass('jst-collapse jst-expand');
        $el.next().toggleClass('collapsed');
        this.trigger('node:expand', { ...el.closest('li').dataset });
      }
    }
  });

  function renderNode(label, value, path, isRoot) {
    const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    return (
      `<li class="jst-item" data-path="${path}" data-type="${type}">${[
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
    const content = _.keys(value).map(key => {
      return renderNode(key, value[key], key ? `${path}/${key}` : path)
    });
    return [
      `<span class="jst-bracket">${brackets[0]}</span>`,
      content.length ? '<span class="jst-collapse"></span>' : '',
      `<ul class="jst-list">${content.join('')}</ul>`,
      `<span class="jst-bracket">${brackets[1]}</span>`
    ].join('');
  }

  function element(value, path, type) {
    if (type === 'string') value = `"${_.escape(value)}"`;
    return `<span class="jst-node">${value}</span>`;
  }
})(window);