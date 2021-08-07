(({ Scenario, Backbone }, $, _) => {
  const Model = Backbone.Model.extend({
    defaults: function () {
      return {
        source: {},
        groups: {},
      };
    },

    renameGroup: function (group, name) {
      if (!this.hasGroup(group)) return;
      const groups = this.get('groups');
      this.set('groups', _.reduce(groups, (acc, v, k) => {
        acc[k === group ? name : k] = v;
        return acc;
      }, {}));
    },

    removeGroup: function (group) {
      if (!this.hasGroup(group)) return;
      const groups = this.get('groups');
      this.set('groups', _.reduce(groups, (acc, v, k) => {
        if (k === group) acc['Main'].push(...v);
        else acc[k] = v;
        return acc;
      }, {}));
    },

    addGroup: function (group) {
      if (this.hasGroup(group)) return;
      this.set('groups', { ...this.get('groups'), [group]: [] });
    },

    hasGroup: function (group) {
      const name = group.toLowerCase();
      return _.any(this.get('groups'), (_, key) => key.toLowerCase() === name);
    },

    update: function (source) {
      if (!this.get('groups')['Main']) {
        this.get('groups')['Main'] = _.keys(source);
      }
      this.set('source', source);
    },
  });

  const View = Backbone.View.extend({
    className: 'jst',

    tagName: 'div',

    initialize() {
      const model = new Model();

      model.on('change:source', () => {
        this.render();
        this.dragula.containers = [
          ...this.el.querySelectorAll('.jst-list[data-path=""]')
        ];
      });

      model.on('change:groups', () => {
        this.render();
        this.dragula.containers = [
          ...this.el.querySelectorAll('.jst-list[data-path=""]')
        ];
      });

      this.dragula = dragula([], {
        removeOnSpill: false,

        revertOnSpill: true,

        moves(el, source, handle, sibling) {
          if (!handle.classList.contains('jst-item')) return false;
          const node = handle.querySelector('[data-path]');
          return node.dataset.path.split('/').length === 2;
        }
      }).on('drop', (el, target, source) => {
        const name = el.querySelector('[data-path]').dataset.path.slice(1);
        const groups = this.model.get('groups');

        const oldName = source.closest('.jst-group').dataset.group;
        const oldList = _.without(groups[oldName], name);

        const newName = target.closest('.jst-group').dataset.group;
        const newList = _.concat(groups[newName], name);

        this.model.set('groups', {
          ...groups,
          [oldName]: _.uniq(oldList),
          [newName]: _.uniq(newList),
        }, { silent: true });
      });

      this.model = model;
    },

    render() {
      morphdom(this.el, this.renderRoot(), {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target),
        getNodeKey: (el) => {
          if (el.nodeType === 1 && el.classList.contains('jst-item')) {
            const { dataset } = el.querySelector('[data-path]');
            if (dataset.path) return dataset.path;
            if (dataset.ref) return dataset.ref;
          }
          return el.id;
        },
        childrenOnly: true,
      });

      return this.trigger('render');
    },

    renderRoot() {
      const source = this.model.get('source');
      const groups = this.model.get('groups');

      return (
        `<div class="jst">${_.map(groups, (keys, group) => (
          `<div class="jst-group" data-group="${group}">
              <div class="jst-group-head">
                <span class="jst-group-title">${group}</span>
                <i class="jst-group-toggle fa fa-chevron-up"></i>
              </div>
              <div class="jst-group-body">
                <ul class="jst-root">${jsNode('', Object.fromEntries(keys.map(k => ([k, source[k]]))), '', true)}</ul>
              </div>
            </div>`
        )).join('')
        }</div>`
      );
    },

    events: {
      'click .jst-item > .fa-minus-circle': function (e) {
        e.preventDefault();
        const $el = $(e.target), $node = $el.prev(), { path } = $node[0].dataset;

        const val = jsonpatch.getValueByPointer(this.source, path), len = val.length;
        $el.toggleClass('fa-minus-circle').toggleClass('fa-plus-circle');
        $node.text(`"${_.truncate(val, 100)}"`);
      },

      'click .jst-item > .fa-plus-circle': function (e) {
        e.preventDefault();
        const $el = $(e.target), $node = $el.prev(), { path } = $node[0].dataset;

        const val = jsonpatch.getValueByPointer(this.source, path), len = val.length;
        $el.toggleClass('fa-minus-circle').toggleClass('fa-plus-circle');
        $node.text(`"${_.truncate(val, len)}"`);
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
        const $el = $(e.target), $list = $el.next();
        $list.toggleClass('jst-collapsed').hide();
        $el.toggleClass('jst-collapse')
          .toggleClass('jst-expand');
        this.trigger('collapse');
      },

      'click .jst-expand': function (e) {
        e.preventDefault();
        const $el = $(e.target), $list = $el.next();
        $list.toggleClass('jst-collapsed').show();
        $el.toggleClass('jst-collapse')
          .toggleClass('jst-expand');
        this.trigger('expand');
      },

      'click .jst-icon': function (e) {
        // pin logic
      },
    }
  }, {
    colors: {
      undefined: '#808080',
      boolean: '#2525cc',
      string: '#2db669',
      number: '#d036d0',
      date: '#ce904a',
      null: '#808080',
    }
  });

  function jsIterable(value, path, type, brackets) {
    const content = Object.keys(value).map((key, idx, arr) => {
      return jsNode(key, value[key], key ? `${path}/${key}` : path, idx === arr.length - 1)
    }).join('')

    return [
      `<span class="jst-bracket">${brackets[0]}</span>`,
      content.length ? '<span class="jst-collapse"></span>' : '',
      `<ul class="jst-list" data-path="${path}" data-type="${type}">${content}</ul>`,
      `<span class="jst-bracket">${brackets[1]}</span>`
    ].join('');
  }

  function jsObject(value, path) {
    return jsIterable(value, path, 'object', ['{', '}']);
  }

  function jsArray(value, path) {
    return jsIterable(value, path, 'array', ['[', ']']);
  }

  function jsString(value, path) {
    const data = _.truncate(value, 100);
    const clip = data !== value ? `<i class="fa fa-plus-circle" aria-hidden="true"></i>` : '';
    return element(`"${_.escape(data)}"`, { path, type: 'string' }) + clip;
  }

  function jsUndefined(value, path) {
    return element(void 0, { path, type: 'undefined' });
  }

  function jsBoolean(value, path) {
    return element(value, { path, type: 'boolean' });
  }

  function jsNumber(value, path) {
    return element(value, { path, type: 'number' });
  }

  function jsDate(value, path) {
    return element(value, { path, type: 'date' });
  }

  function jsNull(value, path) {
    return element(value, { path, type: 'null' });
  }

  function jsNode(name, value, path, isLast) {
    const content = `<span class="jst-label">${_.escape(name)}</span><span class="jst-colon">:</span>` + (() => {
      switch (Object.prototype.toString.call(value).slice(8, -1)) {
        case 'Boolean':
          return jsBoolean(value, path);
        case 'Object':
          return jsObject(value, path);
        case 'Number':
          return jsNumber(value, path);
        case 'String':
          if (value.startsWith('__UNDEFINED__')) {
            return jsUndefined(value.slice(13), path);
          }
          if (value.startsWith('__DATE__')) {
            return jsDate(value.slice(8), path);
          }
          return jsString(value, path);
        case 'Array':
          return jsArray(value, path);
        case 'Null':
          return jsNull(value, path);
      }
    })();

    return `<li class="jst-item"><i class="jst-icon fa fa-chain"></i>${content}${!isLast ? '<span class="jst-comma">,</span>' : ''}</li>`;
  }

  function element(content, attrs) {
    attrs = Object.keys(attrs).map(key => `data-${key}="${attrs[key]}"`);
    return `<span class="jst-node" ${attrs.join(' ')}>${content}</span>`;
  }

  Scenario.JSONTree = View;
})(window, jQuery, _);