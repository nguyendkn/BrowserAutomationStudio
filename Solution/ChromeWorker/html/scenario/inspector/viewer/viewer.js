(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    renameGroup: function (group, name) {
      if (!this.hasGroup(group)) return;
      if (this.hasGroup(name)) return;

      this.set('groups', _.reduce(this.get('groups'), (acc, val, key) => {
        acc[key === group ? name : key] = val;
        return acc;
      }, {}));
    },

    removeGroup: function (group) {
      if (!this.hasGroup(group)) return;

      this.set('groups', _.reduce(this.get('groups'), (acc, val, key) => {
        if (key === group) acc['Main'].push(...val);
        else acc[key] = val;
        return acc;
      }, {}));
    },

    addGroup: function (group) {
      if (this.hasGroup(group)) return;
      this.set('groups', { ...this.get('groups'), [group]: [] });
    },

    hasGroup: function (group) {
      return _.any(this.get('groups'), (_, key) => key === group);
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
    },

    defaults: function () {
      return {
        source: {},
        groups: {},
      }
    }
  });

  const View = Backbone.View.extend({
    className: 'jst-viewer',

    initialize() {
      const model = new Model();

      model.on('change:source', () => {
        this.render();
        initNodesSortable([...this.el.querySelectorAll('.jst-root > li > ul')]);
        initGroupsSortable([...this.el.querySelectorAll('.jst-group')]);
      });

      model.on('change:groups', () => {
        this.render();
        initNodesSortable([...this.el.querySelectorAll('.jst-root > li > ul')]);
        initGroupsSortable([...this.el.querySelectorAll('.jst-group')]);
      });

      const initNodesSortable = nodes => {
        _.invoke(this.sortableNodes, 'destroy');

        this.sortableNodes = nodes.map(node => Sortable.create(node, {
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
          filter: '.pinned',
          group: 'nodes',
        }));
      }

      const initGroupsSortable = nodes => {
        _.invoke(this.sortableGroups, 'destroy');

        this.sortableGroups = nodes.map(node => Sortable.create(node, {
          onEnd: ({ item, from, to }) => {

          },
          group: 'groups',
          filter: null,
        }));
      }

      this.model = model;
    },

    render() {
      morphdom(this.el, this.renderRoot(), {
        onBeforeElUpdated: (from, to) => !from.isEqualNode(to),
        getNodeKey: node => {
          if (node.nodeType === Node.ELEMENT_NODE && node.classList.contains('jst-item')) {
            return node.dataset.path;
          }
          return node.id;
        },
        childrenOnly: true
      });

      return this.trigger('render');
    },

    renderRoot() {
      const source = this.model.get('source');
      const groups = this.model.get('groups');

      return (
        `<div class="${this.el.className}">${_.map(groups, (keys, name) => (
          `<div class="jst-group" data-name="${name}">
            <div class="jst-group-head">
              <i class="jst-group-options fa fa-caret-down"></i>
              <span class="jst-group-title">${name}</span>
              <i class="jst-group-toggle fa fa-chevron-up"></i>
            </div>
            <div class="jst-group-body">
              <ul class="jst-root">
                ${jsNode('', Object.fromEntries(keys.filter(k => _.has(source, k)).map(k => [k, source[k]])), '', true)}
              </ul>
            </div>
          </div>`
        )).join('')
        }</div>`
      );
    },

    events: {
      'click .jst-item > .fa-minus-circle': function (e) {
        e.preventDefault();
        const $el = $(e.target), { dataset } = $el[0].closest('li');
        const val = this.model.getValue(dataset.path), len = val.length;

        $el.toggleClass('fa-minus-circle').toggleClass('fa-plus-circle');
        $el.prev().text(`"${_.escape(_.truncate(val, 100))}"`);
      },

      'click .jst-item > .fa-plus-circle': function (e) {
        e.preventDefault();
        const $el = $(e.target), { dataset } = $el[0].closest('li');
        const val = this.model.getValue(dataset.path), len = val.length;

        $el.toggleClass('fa-minus-circle').toggleClass('fa-plus-circle');
        $el.prev().text(`"${_.escape(_.truncate(val, len))}"`);
      },

      'click .jst-group-toggle': function (e) {
        e.preventDefault();
        const $el = $(e.target), $group = $el.closest('.jst-group');
        $group.children('.jst-group-body').toggle();
        $el.toggleClass('fa-chevron-down');
        $el.toggleClass('fa-chevron-up');
      },

      'click .jst-collapse': function (e) {
        e.preventDefault();
        const $el = $(e.target);
        $el.toggleClass('jst-collapse').toggleClass('jst-expand');
        $el.next().toggleClass('jst-collapsed').hide();
        this.trigger('node:collapse');
      },

      'click .jst-expand': function (e) {
        e.preventDefault();
        const $el = $(e.target);
        $el.toggleClass('jst-collapse').toggleClass('jst-expand');
        $el.next().toggleClass('jst-collapsed').show();
        this.trigger('node:expand');
      }
    }
  });

  function jsObject(value, path) {
    return iterable(value, path, 'object', '{}');
  }

  function jsArray(value, path) {
    return iterable(value, path, 'array', '[]');
  }

  function jsString(value, path) {
    const data = _.truncate(value, 100);
    const clip = data !== value ? `<i class="fa fa-plus-circle"></i>` : '';
    return element(data, path, 'string') + clip;
  }

  function jsUndefined(value, path) {
    return element(value, path, 'undefined');
  }

  function jsBoolean(value, path) {
    return element(value, path, 'boolean');
  }

  function jsNumber(value, path) {
    return element(value, path, 'number');
  }

  function jsNull(value, path) {
    return element(value, path, 'null');
  }

  function jsDate(value, path) {
    const format = 'YYYY-MM-DD HH:mm:ss [UTC]Z';
    value = dayjs(value).format(format);
    return element(value, path, 'date');
  }

  function jsNode(label, value, path, isRoot) {
    const type = Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
    return (
      `<li class="jst-item" data-path="${path}" data-type="${type}">${[
        isRoot ? '': '<i class="jst-icon fa fa-chain"></i>',
        isRoot ? '' : `<span class="jst-label">${_.escape(label)}:</span>`,
        (() => {
          switch (type) {
            case 'undefined': return jsUndefined(value, path);
            case 'boolean': return jsBoolean(value, path);
            case 'object': return jsObject(value, path);
            case 'number': return jsNumber(value, path);
            case 'string': return jsString(value, path);
            case 'array': return jsArray(value, path);
            case 'null': return jsNull(value, path);
            case 'date': return jsDate(value, path);
          }
        })()
      ].join('')
      }</li>`
    );
  }

  function iterable(value, path, type, brackets) {
    const content = _.keys(value).map(key => {
      return jsNode(key, value[key], key ? `${path}/${key}` : path)
    }).join('')

    return [
      `<span class="jst-bracket">${brackets[0]}</span>`,
      content.length ? '<span class="jst-collapse"></span>' : '',
      `<ul class="jst-list">${content}</ul>`,
      `<span class="jst-bracket">${brackets[1]}</span>`
    ].join('');
  }

  function element(value, path, type) {
    return `<span class="jst-node">${(() => {
      return type === 'string' ? `"${_.escape(value)}"` : value;
    })()}</span>`;
  }

  Inspector.Viewer = View;
})(window);