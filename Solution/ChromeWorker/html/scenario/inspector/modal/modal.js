(({ App, Backbone, $, _ }) => {
  const { Inspector, JST } = App;

  const Model = Backbone.Model.extend({
    defaults: () => ({
      value: null,
      type: null,
      path: null,
    })
  });

  Inspector.Modal = Backbone.View.extend({
    template: JST['inspector/modal'],

    attributes: { tabindex: '-1' },

    className: 'modal',

    events: {
      'input [data-input-type] textarea': function (e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'input [data-input-type] input': function (e) {
        if (e.target.type === 'radio' && !e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalSelect': function (e) {
        this.model.set('type', e.target.value);
      },

      'click #inspectorModalAccept': function (e) {
        this.trigger('submit');
      },

      'click #inspectorModalCancel': function (e) {
        this.trigger('cancel');
      },

      'hidden.bs.modal': function (e) {
        this.trigger('cancel');
      }
    },

    initialize({ callback, value, type, path }) {
      if (['object', 'array'].includes(type)) type = 'custom';
      value = type === 'custom' ? JSON.stringify(value) : String(value);

      const model = new Model({ value, type, path }).on('change:type', (__, type) => {
        const $inputs = this.$('[data-input-type]');
        $inputs.parent('form').trigger('reset');

        const $unused = $inputs.filter((__, el) => {
          return el.dataset.inputType !== type
        }).hide().find(':input').prop('required', false);

        const $target = $inputs.filter((__, el) => {
          return el.dataset.inputType === type
        }).show().find(':input').prop('required', true);

        $target.first().each((__, el) => {
          const $el = $(el), { type } = el;

          if (type === 'radio') {
            $el.prop('checked', true);
          } else if (type !== 'hidden') {
            $el.val(type === 'number' ? 0 : '');
          }

          $el.trigger('input');
        });
      });

      model.bind('change', () => {
        const disabled = _.isEqual({ value, type, path }, model.toJSON());
        this.$('#inspectorModalAccept').prop('disabled', disabled);
      });

      this.bind('submit', () => {
        const valid = this.el.querySelector('form').reportValidity();
        if (valid || model.get('type') === 'string') this.trigger('accept');
      });

      this.once('accept', () => {
        const json = this.close().model.toJSON();
        callback({ ...json, cancel: false });
      });

      this.once('cancel', () => {
        const json = this.close().model.toJSON();
        callback({ ...json, cancel: true });
      });

      this.model = model;
    },

    render() {
      if (this.$el.is(':empty')) {
        this.$el.html(this.template(this.model.toJSON()));
        this.$('#inspectorModalSelect').selectpicker();
        this.$el.modal({ backdrop: 'static' });
      }

      return this;
    },

    close() {
      this.$el.modal('hide');
      this.remove().off();
      return this;
    }
  });
})(window);