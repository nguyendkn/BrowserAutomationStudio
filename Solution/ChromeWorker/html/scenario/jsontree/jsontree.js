((global, $, _) => {
  global.JSONTree = Backbone.View.extend({
    className: 'jst',

    tagName: 'div',

    initialize() {
      this.groups = {};
      this.source = {};
    },

    render(data) {
      morphdom(this.el, this.renderRoot(data), {
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

    renderRoot(data) {
      this.ensureGroups(this.source = data);

      return (
        `<div class="jst">${_.map(this.groups, (keys, group) => (
          `<div class="jst-group" data-group="${group}">
              <div class="jst-group-head">
                <span class="jst-group-title">${group}</span>
                <i class="jst-group-toggle fa fa-chevron-down"></i>
              </div>
              <div class="jst-group-body">
                <ul class="jst-root">${jsNode('', Object.fromEntries(keys.map(k => ([k, data[k]]))), '', true)}</ul>
              </div>
            </div>`
        )).join('')
        }</div>`
      );
    },

    ensureGroups(data) {
      if (!this.groups['Main']) {
        this.groups['Main'] = _.keys(data);
      }
      return this;
    },

    renameGroup(name) {
      if (!hasGroup(name)) return;
      // TODO
      return this;
    },

    removeGroup(name) {
      if (!hasGroup(name)) return;
      // TODO
      return this;
    },

    addGroup(name) {
      if (hasGroup(name)) return;
      this.groups[name] = [];
      return this;
    },

    hasGroup(name) {
      const lower = name.toLowerCase();
      return _.any(this.groups, (_, k) => k === lower);
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
        $el.toggleClass('fa-plus-circle').toggleClass('fa-minus-circle');
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
        $el.toggleClass('jst-collapse');
        $el.toggleClass('jst-expand');
        this.trigger('collapse');
      },

      'click .jst-expand': function (e) {
        e.preventDefault();
        const $el = $(e.target), $list = $el.next();
        $list.toggleClass('jst-collapsed').show();
        $el.toggleClass('jst-collapse');
        $el.toggleClass('jst-expand');
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
    const opening = `<span class="jst-bracket">${brackets[0]}</span>`;
    const closing = `<span class="jst-bracket">${brackets[1]}</span>`;
    const keys = Object.keys(value);

    if (keys.length) {
      const content = keys.map((key, idx) => {
        return jsNode(key, value[key], key ? `${path}/${key}` : path, idx === keys.length - 1)
      }).join('');

      const element = `<ul class="jst-list" data-path="${path}" data-type="${type}">${content}</ul>`;
      return opening + `<span class="jst-collapse"></span>` + element + closing;
    }

    return opening + closing;
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

    return `<li class="jst-item"><i class="jst-icon fa fa-chain"></i>${content}${!isLast ? '<span class="jst-comma">,</span>' : ''}</li>`
  }

  function element(content, attrs) {
    attrs = Object.keys(attrs).map(key => `data-${key}="${attrs[key]}"`);
    return `<span class="jst-node" ${attrs.join(' ')}>${content}</span>`;
  }
})(window, jQuery, _);