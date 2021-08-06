((global, $, _) => {
  global.JSONTree = Backbone.View.extend({
    className: 'jst-root',

    tagName: 'ul',

    render(data) {
      const root = jsNode('', data, '', true);

      morphdom(this.el, /*html*/`<ul class="jst-root">${root}</ul>`, {
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
    const needCut = value.length > 100;
    const data = needCut ? `${value.slice(0, 97)}...` : value;
    const clip = needCut ? `<i class="fa fa-plus-circle" aria-hidden="true"></i>` : '';
    return element(`"${_.escape(data)}"`, { path, type: 'string', 'data-value': utf8_to_b64(value) }) + clip;
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
      throw new Error(`Failed to resolve value type`);
    })();

    return `<li class="jst-item"><i class="jst-icon fa fa-chain"></i>${content}${!isLast ? '<span class="jst-comma">,</span>' : ''}</li>`
  }

  function element(content, attrs) {
    attrs = Object.keys(attrs).map(key => `data-${key}="${attrs[key]}"`);
    return `<span class="jst-node" ${attrs.join(' ')}>${content}</span>`;
  }
})(window, jQuery, _);