(function (window) {
  const ActionsUpdaterModel = Backbone.Model.extend({
    defaults: {
      isStarted: false,
      successCount: 0,
      errorsCount: 0,
      tasks: []
    },

    updateTasks(type = 'all') {
      if (this.get('isStarted')) return;

      this.set('tasks', _.filter(_TaskCollection.toJSON().map((task, index) => ({ ...task, index })), (task) => {
        const id = Number(task['id']);

        if (id !== 0 && !IsFunctionNode(id)) {
          if (type === 'current') return GetFunctionData(id)['name'] === _GobalModel.get('function_name');
          return type === 'selected' ? task['is_selected'] : true;
        }

        return false;
      }).map(({ index }) => index));
    },

    async startUpdate() {
      this.set('isStarted', true);
      this.set('successCount', 0);
      this.set('errorsCount', 0);

      for (const id of this.get('tasks')) {
        const task = _TaskCollection.at(id), dat = task.dat();

        if (!(dat && dat['role'] && dat['role'] === 'slave')) {
          const match = task.get('code').match(/\/\*Dat\:([^\*]+)\*\//);

          if (match) {
            _MainView.currentTargetId = id;
            _MainView.isEdit = true;

            const error = await new Promise((resolve) => {
              this.on('toolbox.editStarted', () => {
                this.off('toolbox.editStarted');

                this.on('toolbox.editSuccess', () => {
                  this.off('toolbox.editSuccess');
                  resolve(null);
                });

                this.on('toolbox.editFail', (err) => {
                  this.off('toolbox.editFail');
                  resolve(err);
                });

                BrowserAutomationStudio_EditSaveStart();
              });

              BrowserAutomationStudio_EditStart(match[1]);
            });

            if (!error) {
              this.set('successCount', this.get('successCount') + 1);
            } else {
              this.set('errorsCount', this.get('errorsCount') + 1);
            }

            if (error) this.trigger('log', error);
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
        <select id="actionsUpdaterSelect">
          <option class="actions-updater-select-option" value="all" selected="selected"><%= tr('All actions in the project') %></option>
          <option class="actions-updater-select-option" value="current"><%= tr('All actions in the current function') %></option>
          <option class="actions-updater-select-option" value="selected"><%= tr('Only the selected actions') %></option>
        </select>
        <div class="actions-updater-log"></div>
        <div class="actions-updater-stats">
          <span class="actions-updater-stats-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path opacity="0.5" fill-rule="evenodd" clip-rule="evenodd" d="M0 7C0 3.13401 3.13401 0 7 0C10.866 0 14 3.13401 14 7C14 10.866 10.866 14 7 14C3.13401 14 0 10.866 0 7ZM7.5215 4.9525L7.2275 8.897H6.48025L6.223 4.9525V2.625H7.5215V4.9525ZM7.60725 9.88925V11.347H6.125V9.88925H7.60725Z" fill="white" />
            </svg>          
            <span><%= tr('Total actions:') %> <span id="actionsUpdaterCounter">0</span></span>
          </span>
          <span class="actions-updater-stats-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M7 0C3.13473 0 0 3.13473 0 7C0 10.8653 3.13473 14 7 14C10.8653 14 14 10.8653 14 7C14 3.13473 10.8653 0 7 0ZM6.04545 9.86364L3.18182 7L4.13636 6.04545L6.04545 7.95455L9.83564 4.16436L10.7902 5.06355L6.04545 9.86364Z" fill="#669FC2"/>
            </svg>          
            <span><span id="actionsUpdaterSuccessCount">0</span> <%= tr('Completed') %></span>
          </span>
          <span class="actions-updater-stats-item">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M2.05004 2.05004C4.78365 -0.683571 9.21637 -0.683121 11.9495 2.05004C13.3148 3.41533 13.9982 5.2047 13.9996 6.99454C14.0008 8.56382 13.4776 10.1334 12.43 11.4179C12.2806 11.6012 12.1204 11.7787 11.9495 11.9495C9.21592 14.6831 4.7832 14.6827 2.05004 11.9495C-0.683572 9.21592 -0.683121 4.7832 2.05004 2.05004ZM6.99979 7.89974L8.79969 9.69965L9.69965 8.79969L7.89974 6.99979L9.69965 5.19988L8.7997 4.29992L6.99979 6.09983L5.19988 4.29992L4.29992 5.19988L6.09983 6.99979L4.29992 8.79969L5.19988 9.69965L6.99979 7.89974Z" fill="#D8695F"/>
            </svg>          
            <span><span id="actionsUpdaterErrorsCount">0</span> <%= tr('Errors') %></span>
          </span>
        </div>
        <button class="actions-updater-copy-btn">
          <svg width="13" height="15" viewBox="0 0 13 15" fill="none">
            <path d="M10 3V0H0V12H4V15H13V3H10ZM4 11H1V1H9V3H4V11ZM12 14H5V4H12V14Z" fill="white"/>
          </svg>
          <span style="margin-left: 13px"><%= tr('Copy log to clipboard') %></span>
        </button>
      </div>
      <div class="actions-updater-footer">
        <button type="button" id="actionsUpdaterAccept" class="btn-base btn-accept"><%= tr('OK') %></button>
        <button type="button" id="actionsUpdaterCancel" class="btn-base btn-cancel"><%= tr('Cancel') %></button>
      </div>
    `),

    className: 'actions-updater',

    initialize: function () {
      this.model = new ActionsUpdaterModel()
        .on('change:isStarted', (_, isStarted) => this.$('#actionsUpdaterSelect').prop('disabled', isStarted))
        .on('change:successCount', (_, success) => this.$('#actionsUpdaterSuccessCount').text(success))
        .on('change:errorsCount', (_, errors) => this.$('#actionsUpdaterErrorsCount').text(errors))
        .on('change:tasks', (_, { length }) => this.$('#actionsUpdaterCounter').text(length));
      _TaskCollection.bind('all', () => this.$('#actionsUpdaterSelect').trigger('change'));
    },

    render: function () {
      if (this.rendered) return this;
      this.$el.html(this.template()).appendTo('body');
      this.$('#actionsUpdaterSelect').selectpicker({
        style: 'actions-updater-select',
        template: { caret: '' },
        container: false,
        width: false
      });
      return this;
    },

    show: function () {
      this.render().$el.show();
      return this;
    },

    hide: function () {
      this.render().$el.hide();
      return this;
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