(function (global) {
  class JSONTree {
    static colors = {
      undefined: '#808080',
      boolean: '#2525cc',
      string: '#2db669',
      number: '#d036d0',
      date: '#ce904a',
      null: '#808080',
    }

    constructor (elem, config = {}) {
      elem.innerHTML = (/*html*/`<ul class="jst-root"></ul>`);
      this.onCollapse = config.onCollapse || (() => { });
      this.onExpand = config.onExpand || (() => { });
      this.onRender = config.onRender || (() => { });
      this.elem = elem;
    }

    render(data) {
      const root = _jsNode('', data, '', true);

      if (!this.listenersAttached) {
        const $elem = $(this.elem);

        $elem.on('click', '.jst-item > .fa-minus-circle', (e) => {
          e.preventDefault();
          const $el = $(e.target), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node[0].dataset.value)}"`);
          $node[0].dataset.value = utf8_to_b64(text);
          $el.removeClass('fa-minus-circle').addClass('fa-plus-circle');
        });

        $elem.on('click', '.jst-item > .fa-plus-circle', (e) => {
          e.preventDefault();
          const $el = $(e.target), $node = $el.prev();
          const text = $node.text().slice(1, -1);

          $node.text(`"${b64_to_utf8($node[0].dataset.value)}"`);
          $node[0].dataset.value = utf8_to_b64(text);
          $el.removeClass('fa-plus-circle').addClass('fa-minus-circle');
        });

        $elem.on('click', '.jst-collapse', (e) => {
          e.preventDefault();
          const el = e.target, list = el.nextElementSibling;
          list.classList.toggle('jst-collapsed'),
            el.classList.toggle('jst-collapse'),
            el.classList.toggle('jst-expand'),
            list.style.display = 'none';
          this.onCollapse();
        });

        $elem.on('click', '.jst-expand', (e) => {
          e.preventDefault();
          const el = e.target, list = el.nextElementSibling;
          list.classList.toggle('jst-collapsed'),
            el.classList.toggle('jst-collapse'),
            el.classList.toggle('jst-expand'),
            list.style.display = '';
          this.onExpand();
        });

        this.listenersAttached = true;
      }

      morphdom(this.elem.firstChild, /*html*/`<ul class="jst-root">${root}</ul>`, {
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
      this.onRender();
    }
  }

  function _jsIterable(value, type, path, brackets) {
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
  }

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
    return _element(`"${_.escape(data)}"`, { class: 'jst-node', 'data-path': path, 'data-type': 'string', 'data-value': utf8_to_b64(value) }) + clip;
  }

  function _jsUndefined(name, value, path) {
    return _element(void 0, { class: 'jst-node', 'data-path': path, 'data-type': 'undefined' });
  }

  function _jsBoolean(name, value, path) {
    return _element(value, { class: 'jst-node', 'data-path': path, 'data-type': 'boolean' });
  }

  function _jsNumber(name, value, path) {
    return _element(value, { class: 'jst-node', 'data-path': path, 'data-type': 'number' });
  }

  function _jsDate(name, value, path) {
    return _element(value, { class: 'jst-node', 'data-path': path, 'data-type': 'date' });
  }

  function _jsNull(name, value, path) {
    return _element(null, { class: 'jst-node', 'data-path': path, 'data-type': 'null' });
  }

  function _jsNode(name, value, path, isLast) {
    const content = `<span class="jst-label">${_.escape(name)}</span>` + `<span class="jst-colon">:</span>` + (() => {
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
    attrs = Object.keys(attrs).map(key => `${key}="${attrs[key]}"`);
    return `<span ${attrs.join(' ')}>${content}</span>`;
  }

  global.JSONTree = JSONTree;
})(window);