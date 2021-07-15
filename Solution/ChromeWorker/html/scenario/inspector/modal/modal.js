(function (global, $, _) {
  const Model = Backbone.Model.extend({
    defaults: {
      value: '',
      type: '',
    },

    initialize({ value, type }) {
      this._value = value;
      this._type = type;
    },

    toJSON() {
      const valueChanged = this._value !== this.get('value');
      const typeChanged = this._type !== this.get('type');
      const isChanged = valueChanged || typeChanged;

      return { ..._.clone(this.attributes), isChanged };
    }
  });

  const View = Backbone.View.extend({
    template: Scenario.JST['inspector/modal'],

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

      'change #inspectorModalStringInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalNumberInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalDateInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalRawInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalSelect': function (e) {
        this.model.set('type', e.target.value);
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.trigger('accept');
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
      if (['object', 'array'].includes(type)) type = 'raw';
      value = type === 'raw' ? JSON.stringify(value) : String(value);
      value = value.indexOf('__DATE__') === 0 ? value.slice(8) : value;

      const model = (new Model({ value, type })).on('change:type', (__, type) => {
        let $input = this.$('#inspectorModalRawInput');

        if (type === 'boolean') {
          $input = this.$('#inspectorModalBoolean');
          const $radio = $input.find('input[type=radio]');
          $radio.first().prop('checked', true).trigger('change');
        } else if (type == 'null') {
          $input = this.$('#inspectorModalEmpty');
          const $radio = $input.find('input[type=radio]');
          $radio.first().prop('checked', true).trigger('change');
        } else {
          if (type === 'date') {
            $input = this.$('#inspectorModalDateInput');
          } else if (type === 'number') {
            $input = this.$('#inspectorModalNumberInput');
          } else if (type === 'string') {
            $input = this.$('#inspectorModalStringInput');
          }
          $input.val(type === 'number' ? 0 : '').trigger('change');
        }

        this.$('.inspector-modal-inputs').children().not($input.show()).hide();
      });

      this.once('accept', () => {
        this.close();
        callback({ ...this.model.toJSON(), cancel: false });
      });

      this.once('cancel', () => {
        this.close();
        callback({ ...this.model.toJSON(), cancel: true });
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

  global.Scenario.InspectorModal = View;
})(window, jQuery, _);