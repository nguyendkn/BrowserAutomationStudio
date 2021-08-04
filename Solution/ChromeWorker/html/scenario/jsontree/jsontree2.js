(({ Scenario, Backbone }, $, _) => {
  const { Inspector } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      data: {},
    }
  });

  const View = Backbone.View.extend({
    initialize() {
      this.model = (new Model()).on('change:data', (__, data) => {
        this.render();
      });
    },

    render() {
      morphdom(this.el.firstChild, /*html*/`<ul class="jst-root">${root}</ul>`, {
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

  Inspector.JSONTree = View;
})(window, jQuery, _);