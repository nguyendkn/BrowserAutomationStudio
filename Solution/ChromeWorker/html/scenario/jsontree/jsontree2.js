(({ Scenario, Backbone }, $, _) => {
  const { Inspector } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      data: {},
    }
  });

  const View = Backbone.View.extend({
    className: 'jst-root',

    tagName: 'ul',

    initialize() {
      this.model = (new Model()).on('change:data', (__, data) => {
        this.render(data);
      });
    },

    render(data) {
      const root = _jsNode('', data, '', true);

      morphdom(this.el, /*html*/`<ul class="jst-root">${root}</ul>`, {
        onBeforeElUpdated: (el, target) => !el.isEqualNode(target),
        getNodeKey: (el) => {
          if (el.nodeType === 1 && el.classList.contains('jst-item')) {
            const { dataset } = el.querySelector('[data-path]');

            const path = dataset.path;
            if (path) return path;

            const id = dataset.id;
            if (id) return id;
          }
          return el.id;
        },
        childrenOnly: true,
      });

      return this.trigger('render');
    },

    events: {
      'click .jst-item > .fa-minus-circle': function (e) {
        e.preventDefault();
        const $el = $(e.target), $node = $el.prev();
        const text = $node.text().slice(1, -1);

        $node.text(`"${b64_to_utf8($node[0].dataset.value)}"`);
        $node[0].dataset.value = utf8_to_b64(text);
        $el.removeClass('fa-minus-circle').addClass('fa-plus-circle');
      },

      'click .jst-item > .fa-plus-circle': function (e) {
        e.preventDefault();
        const $el = $(e.target), $node = $el.prev();
        const text = $node.text().slice(1, -1);

        $node.text(`"${b64_to_utf8($node[0].dataset.value)}"`);
        $node[0].dataset.value = utf8_to_b64(text);
        $el.removeClass('fa-plus-circle').addClass('fa-minus-circle');
      },

      'click .jst-collapse': function (e) {
        e.preventDefault();
        const el = e.target, list = el.nextElementSibling;
        list.classList.toggle('jst-collapsed'),
          el.classList.toggle('jst-collapse'),
          el.classList.toggle('jst-expand'),
          list.style.display = 'none';
        this.trigger('collapse');
      },

      'click .jst-expand': function (e) {
        e.preventDefault();
        const el = e.target, list = el.nextElementSibling;
        list.classList.toggle('jst-collapsed'),
          el.classList.toggle('jst-collapse'),
          el.classList.toggle('jst-expand'),
          list.style.display = '';
        this.trigger('expand');
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

  function _jsObject(name, value, path) {
    return _jsIterable(value, 'object', path, ['{', '}']);
  }

  function _jsArray(name, value, path) {
    return _jsIterable(value, 'array', path, ['[', ']']);
  }

  function _jsString(name, value, path) {
    const needCut = value.length > 100;
    const data = needCut ? `${value.slice(0, 97)}...` : value;
    const clip = needCut ? `<i class="fa fa-plus-circle" aria-hidden="true"></i>` : '';
    return _element(`"${_.escape(data)}"`, { path, type: 'string', 'data-value': utf8_to_b64(value) }) + clip;
  }

  function _jsUndefined(name, value, path) {
    return _element(void 0, { path, type: 'undefined' });
  }

  function _jsBoolean(name, value, path) {
    return _element(value, { path, type: 'boolean' });
  }

  function _jsNumber(name, value, path) {
    return _element(value, { path, type: 'number' });
  }

  function _jsDate(name, value, path) {
    return _element(value, { path, type: 'date' });
  }

  function _jsNull(name, value, path) {
    return _element(null, { path, type: 'null' });
  }

  function _jsNode(name, value, path, isLast) {
    const content = `<span class="jst-label">${_.escape(name)}</span><span class="jst-colon">:</span>` + (() => {
      switch (Object.prototype.toString.call(value).slice(8, -1).toLowerCase()) {
        case 'boolean':
          return _jsBoolean(name, value, path);
        case 'object':
          return _jsObject(name, value, path);
        case 'number':
          return _jsNumber(name, value, path);
        case 'string':
          if (value.indexOf('__UNDEFINED__') === 0) {
            return _jsUndefined(name, value.slice(13), path);
          }
          if (value.indexOf('__DATE__') === 0) {
            return _jsDate(name, value.slice(8), path);
          }
          return _jsString(name, value, path);
        case 'array':
          return _jsArray(name, value, path);
        case 'null':
          return _jsNull(name, value, path);
      }

      throw new Error(`Failed to resolve value type`);
    })();

    return `<li class="jst-item">${content}${!isLast ? '<span class="jst-comma">,</span>' : ''}</li>`
  }

  function _element(content, attrs) {
    attrs = Object.keys(attrs).map(key => `data-${key}="${attrs[key]}"`);
    return `<span class="jst-node" ${attrs.join(' ')}>${content}</span>`;
  }

  const JSIterable = Backbone.View.extend({
    template: (type, name, value, brackets) => {
      const opening = `<span class="jst-bracket">${brackets[0]}</span>`;
      const closing = `<span class="jst-bracket">${brackets[1]}</span>`;
      const keys = Object.keys(value);

      if (keys.length) {
        const content = keys.map((key, idx) => {
          return _jsNode(key, value[key], key ? `${path}/${key}` : path, idx === keys.length - 1)
        }).join('');

        const element = `<ul class="jst-list" data-path="${path}" data-type="${type}">${content}</ul>`;
        return opening + `<span class="jst-collapse"></span>` + element + closing;
      }

      return opening + closing;
    },

    render() {

    }
  });

  const JSObject = JSIterable.extend({
    render() {
      return this;
    }
  });

  const JSArray = JSIterable.extend({
    render() {
      return this;
    }
  });

  Inspector.JSONTree = View;
})(window, jQuery, _);