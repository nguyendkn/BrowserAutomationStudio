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
            await new Promise((resolve) => {
              this.on('toolbox.editStarted', () => {
                this.off('toolbox.editStarted');
                resolve();
              });
              BrowserAutomationStudio_EditStart(match[1]);
            });
            const result = await new Promise((resolve) => {
              this.on('toolbox.editSuccess', () => {
                this.off('toolbox.editSuccess');
                resolve('');
              });

              this.on('toolbox.editFail', (e) => {
                this.off('toolbox.editFail');
                resolve(e);
              });

              BrowserAutomationStudio_EditSaveStart();
            });

            if (!result) {
              this.set('successCount', this.get('successCount') + 1);
            } else {
              this.set('errorsCount', this.get('errorsCount') + 1);
            }
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
      <div class="actions-updater-header">
        <h1><%= tr('Auto-update actions') %></h1>
        <h2><%= tr('Brief description of the section') %></h2>
      </div>
      <div class="actions-updater-panel">
        <div class="actions-updater-progressbar"></div>
        <select class="form-control" id="actionsUpdaterSelect">
          <option value="all"><%= tr('All actions in the project') %></option>
          <option value="current"><%= tr('All actions in the current function') %></option>
          <option value="selected"><%= tr('Only the selected actions') %></option>
        </select>
        <div class="actions-updater-log"></div>
        <div class="actions-updater-stats">
          <span class="actions-updater-stats-item">
            <%= tr('Total actions:') %> <span id="actionsUpdaterCounter">0</span>
          </span>
          <span class="actions-updater-stats-item">
            <span id="actionsUpdaterSuccessCount">0</span> <%= tr('Completed') %>
          </span>
          <span class="actions-updater-stats-item">
            <span id="actionsUpdaterErrorsCount">0</span> <%= tr('Errors') %>
          </span>
        </div>
        <button class="actions-updater-copy"><%= tr('Copy log to clipboard') %></button>
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
        this.$('#actionsUpdaterCounter').text(actions.length);
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