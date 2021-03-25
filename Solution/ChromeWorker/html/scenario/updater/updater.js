(function (window) {
  const ActionsUpdaterModel = Backbone.Model.extend({
    defaults: {
      isStarted: false,
      successCount: 0,
      errorsCount: 0,
      actions: [],
      log: []
    },
    updateTasks(type = 'all') {
      if (this.get('isStarted')) return;

      this.set('actions', _.filter(_TaskCollection.toJSON(), (task) => {
        const id = Number(task['id']);

        if (id !== 0 && !IsFunctionNode(id)) {
          if (type === 'selected') return task['is_selected'];
          if (type === 'current') return GetFunctionData(id)['name'] === _GobalModel.get('function_name');
          return true;
        }

        return false;
      }));
    },
    async startUpdate() {
      this.set('isStarted', true);

      for (const action of this.get('actions')) {
        const task = _TaskCollection.get(action.id), dat = task.dat();

        if (!(dat && dat['role'] && dat['role'] === 'slave')) {
          const match = task.get('code').match(/\/\*Dat\:([^\*]+)\*\//);

          if (match) {
            BrowserAutomationStudio_EditStart(match[1]);

            await new Promise((resolve) => {
              this.on('toolbox.editStarted', () => {
                this.off('toolbox.editStarted');
                resolve();
              });
            });

            const successPromise = new Promise((resolve) => {
              this.on('toolbox.editSuccess', () => {
                this.off('toolbox.editSuccess');
                resolve();
              });
            });

            const failPromise = new Promise((resolve) => {
              this.on('toolbox.editFail', (e) => {
                this.off('toolbox.editFail');
                resolve(e);
              });
            });

            BrowserAutomationStudio_EditEnd();

            await Promise.race([successPromise, failPromise]);
          }
        }

        if (!this.get('isStarted')) break;
      }

      this.set('isStarted', false);
    },
    stopUpdate() {
      this.set('isStarted', false);
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

      this.model.on('change:isStarted', (_, isStarted) => {
        this.$('#actionsUpdaterSelect').prop('disabled', isStarted);
      });

      this.model.on('change:actions', (_, actions) => {
        this.$('#actionsUpdaterCounter').text(`${actions.length} ${tr('actions')}`);
      });

      _TaskCollection.bind('all', () => {
        this.model.updateTasks();
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
        this.model.updateTasks(this.$('#actionsUpdaterSelect').val());
      },
      'click #actionsUpdaterAccept': function () {
        if (!this.model.get('isStarted')) {
          return this.model.startUpdate();
        }
        this.hide();
      },
      'click #actionsUpdaterCancel': function () {
        if (this.model.get('isStarted')) {
          return this.model.stopUpdate();
        }
        this.hide();
      }
    }
  });

  window.Scenario.ActionsUpdater = ActionsUpdaterView;
})(window);