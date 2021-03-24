(function (window) {
  const ActionsUpdaterModel = Backbone.Model.extend({
    defaults: {
      isStarted: false,
      successCount: 0,
      errorsCount: 0,
    }
  });

  const ActionsUpdaterView = Backbone.View.extend({
    template: _.template(/*html*/`
      <div class="">
        <select id="actionsUpdaterSelect" class="form-control">
          <option value="all"><%= tr('All actions in the project') %></option>
          <option value="current"><%= tr('All actions in the current function') %></option>
          <option value="selected"><%= tr('Only the selected actions') %></option>
        </select>
        <label for="actionsUpdaterSelect" id="actionsUpdaterCounter">0 <%= tr('actions') %></label>
      </div>
      <div class="">
        <span><%= tr('successful') %>: <span id="actionsUpdaterSuccessCount">0</span></span>
        <span><%= tr('unsuccessful') %>: <span id="actionsUpdaterErrorsCount">0</span></span>
        <div class="actions-updater-progressbar"></div>
      </div>
      <div class="actions-updater-footer">
        <button type="button" id="actionsUpdaterCancel" class="btn btn-default standartbutton tr">Cancel</button>
        <button type="button" id="actionsUpdaterAccept" class="btn btn-primary standartbutton tr">Ok</button>
      </div>
    `),

    className: 'actions-updater',

    initialize: function () {
      this.model = new ActionsUpdaterModel();

      this.model.on('change:successCount', (_, successCount) => {
        this.$('#actionsUpdaterSuccessCount').text(successCount);
      });

      this.model.on('change:errorsCount', (_, errorsCount) => {
        this.$('#actionsUpdaterErrorsCount').text(errorsCount);
      });

      this.render();
    },

    render: function () {
      this.$el.html(this.template()).appendTo('body');
      this.hide();
    },

    toggle: function () {
      this.$el.toggle();
    },

    show: function () {
      this.$el.show();
    },

    hide: function () {
      this.$el.hide();
    },

    events: {
      'change #actionsUpdaterSelect': function () {
        const target = this.$('#actionsUpdaterSelect').val();

        const tasks = _.filter(_TaskCollection.toJSON(), (task, index) => {
          const id = Number(task['id']);

          if (id !== 0 && !IsFunctionNode(id)) {
            if (target === 'selected') return task['is_selected'];
            if (target === 'current') return GetFunctionData(id)['name'] === _GobalModel.get('function_name');
            return true;
          }

          return false;
        });

        this.$('#actionsUpdaterCounter').text(`${tasks.length} ${tr('actions')}`);
      },
      'click #actionsUpdaterAccept': function () {
        this.hide();
      },
      'click #actionsUpdaterCancel': function () {
        this.hide();
      }
    }
  });

  window.Scenario.ActionsUpdater = new ActionsUpdaterView();
})(window);