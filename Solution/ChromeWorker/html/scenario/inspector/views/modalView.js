(({ Scenario, Backbone }, $, _) => {
  const { Inspector, JST } = Scenario;

  const Model = Backbone.Model.extend({
    defaults: {
      value: '',
      type: '',
    },

    initialize({ value, type }) {
      this.value = value;
      this.type = type;
    },

    toJSON() {
      const valueChanged = this.value !== this.get('value');
      const typeChanged = this.type !== this.get('type');
      const isChanged = valueChanged || typeChanged;

      return { ..._.clone(this.attributes), isChanged };
    }
  });

  const View = Backbone.View.extend({
    template: JST['inspector/modal'],

    attributes: { tabindex: '-1' },

    className: 'modal',

    tagName: 'div',

    events: {
      'change input[type=radio][name=boolean]': function (e) {
        if (!e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change input[type=radio][name=empty]': function (e) {
        if (!e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalCustomInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalStringInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalNumberInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalDateInput': function (e) {
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
      },
    },

    initialize({ callback, value, type }) {
      if (['object', 'array'].includes(type)) type = 'custom';
      value = type === 'custom' ? JSON.stringify(value) : String(value);

      if (value.indexOf('__UNDEFINED__') === 0) {
        value = value.slice(13);
        type = 'null';
      }

      if (value.indexOf('__DATE__') === 0) {
        value = value.slice(8);
        type = 'date';
      }

      const model = (new Model({ value, type })).on('change:type', (__, type) => {
        const $inputs = this.$('[data-input-type]');
        $inputs.parent('form')trigget('reset');

        const $unused = $inputs.filter((__, el) => {
          return el.dataset.inputType !== type
        }).hide().find(':input').prop('required', false);

        const $target = $inputs.filter((__, el) => {
          return el.dataset.inputType === type
        }).show().find(':input').prop('required', true);

        $target.each((idx, el) => {
          if (idx === 0) {
            const $el = $(el), type = $el.attr('type');

            if (!(type === 'radio')) {
              $el.val(type === 'number' ? 0 : '');
            } else {
              $el.prop('checked', true);
            }

            $el.trigger('change');
          }
        });
      });

      this.once('accept', () => {
        this.close();
        callback({ ...this.model.toJSON(), cancel: false });
      });

      this.once('cancel', () => {
        this.close();
        callback({ ...this.model.toJSON(), cancel: true });
      });

      this.bind('submit', () => {
        if (this.$('form')[0].reportValidity() || this.model.get('type') === 'string') {
          this.trigger('accept');
        }
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
    },
  });

  Inspector.Modal = View;
})(window, jQuery, _);