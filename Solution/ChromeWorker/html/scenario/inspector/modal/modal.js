(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: {
      value: '',
      type: ''
    }
  });

  const View = Backbone.View.extend({
    template: JST['inspector/modal'],

    attributes: { tabindex: '-1' },

    className: 'modal',

    tagName: 'div',

    events: {
      'change [data-input-type] textarea': function (e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change [data-input-type] input': function (e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalSelect': function (e) {
        this.model.set('type', e.target.value);
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.trigger('submit');
      },

      'click #inspectorModalCancel': function (e) {
        e.preventDefault();
        this.trigger('cancel');
      },

      'hidden.bs.modal': function (e) {
        this.trigger('cancel');
      }
    },

    initialize({ callback, value, type }) {
      if (['object', 'array'].includes(type)) type = 'custom';
      value = type === 'custom' ? JSON.stringify(value) : String(value);

      if (type === 'undefined') {
        type = 'null';
      }

      const model = (new Model({ value, type })).on('change:type', (__, type) => {
        const $inputs = this.$('[data-input-type]');
        $inputs.parent('form').trigger('reset');

        const $unused = $inputs.filter((__, el) => {
          return el.dataset.inputType !== type
        }).hide().find(':input').prop('required', false);

        const $target = $inputs.filter((__, el) => {
          return el.dataset.inputType === type
        }).show().find(':input').prop('required', true);

        $target.each((idx, el) => {
          if (idx === 0) {
            const $el = $(el), type = $el.attr('type');

            if (type !== 'radio') {
              $el.val(type === 'number' ? 0 : '');
            } else {
              $el.prop('checked', true);
            }

            $el.trigger('change');
          }
        });
      });

      this.bind('submit', () => {
        const valid = this.el.querySelector('form').reportValidity();
        if (valid || model.get('type') === 'string') this.trigger('accept');
      });

      this.once('accept', () => {
        this.close();
        const changed = value !== model.get('value') || type !== model.get('type');
        callback({ ...model.toJSON(), changed, cancel: false });
      });

      this.once('cancel', () => {
        this.close();
        const changed = value !== model.get('value') || type !== model.get('type');
        callback({ ...model.toJSON(), changed, cancel: true });
      });

      this.model = model;
    },

    render() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$('#inspectorModalSelect').selectpicker();
      this.$el.modal({});
      return this;
    },

    close() {
      this.$el.modal('hide');
      this.unbind();
      this.remove();
      return this;
    }
  });

  Inspector.Modal = View;
})(window);