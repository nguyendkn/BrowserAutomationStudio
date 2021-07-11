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

    className: 'modal',

    tagName: 'div',

    events: {
      'change #inspectorModalBooleanFalse': function (e) {
        if (!e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalBooleanTrue': function (e) {
        if (!e.target.checked) return;
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalNumberInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalDateInput': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalTextarea': function (e) {
        this.model.set('value', e.target.value);
      },

      'change #inspectorModalSelect': function (e) {
        this.changeInput(e.target.value);
      },

      'click #inspectorModalAccept': function (e) {
        e.preventDefault();
        this.trigger('accept');
      },

      'click #inspectorModalCancel': function (e) {
        e.preventDefault();
        this.trigger('cancel');
      },
    },

    initialize({ callback, value, type }) {
      value = type === 'raw' ? JSON.stringify(value) : String(value);
      value = value.indexOf('__DATE__') === 0 ? value.slice(8) : value;

      this.once('accept', () => {
        this.close();
        callback({ ...this.model.toJSON(), cancel: false });
      });

      this.once('cancel', () => {
        this.close();
        callback({ ...this.model.toJSON(), cancel: true });
      });

      this.model = new Model({ value, type });
    },

    changeInput(option) {
      let $input = this.$('#inspectorModalTextarea');
      const value = this.model.get('value');
      const type = this.model.get('type');

      if (option === 'boolean') {
        const $falseRadio = this.$('#inspectorModalBooleanFalse');
        const $trueRadio = this.$('#inspectorModalBooleanTrue');
        $input = this.$('#inspectorModalBoolean');

        if ($falseRadio.prop('checked')) {
          $falseRadio.trigger('change');
        }

        if ($trueRadio.prop('checked')) {
          $falseRadio.trigger('change');
        }
      } else {
        if (option === 'raw' || option === 'string') {
          
        } else if (option === 'number') {
          $input = this.$('#inspectorModalNumberInput');
        } else if (option === 'date') {
          $input = this.$('#inspectorModalDateInput');
        }

        $input.val(Scenario.utils.convert(value, option, type)).trigger('change');
      }

      this.$('.inspector-modal-inputs').children().not($input).hide();
      this.model.set('type', option);
      $input.show();
    },

    render() {
      this.$el.html(this.template(this.model.toJSON()));
      this.$('#inspectorModalSelect').trigger('change').selectpicker();
      this.$el.modal({ backdrop: 'static', show: false });
      return this.show();
    },

    close() {
      this.off();
      this.hide();
      this.remove();
      return this;
    },

    hide() {
      this.$el.modal('hide');
      return this;
    },

    show() {
      this.$el.modal('show');
      return this;
    },
  });

  global.Scenario.InspectorModal = View;
})(window, jQuery, _);