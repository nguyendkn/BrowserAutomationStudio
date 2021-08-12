_.extend(Scenario.JST, {
  'inspector/modal': _.template(/*html*/`
    <div class="vertical-align-helper">
      <div class="modal-dialog vertical-align-center" role="document">
        <div class="inspector-modal-content">
          <div class="inspector-modal-header">
            <h4><%= tr("Change the variable value") %></h4>
          </div>
          <div class="inspector-modal-body">
            <form class="inspector-modal-form" action="javascript:void(0)">
              <% const style = target => type === target ? 'display: block' : 'display: none' %>
              <div style="<%= style('custom') %>" data-input-type="custom">
                <textarea id="inspectorModalCustomInput"><%- type === 'custom' ? value : '' %></textarea>
              </div>
              <div style="<%= style('string') %>" data-input-type="string">
                <textarea id="inspectorModalStringInput"><%- type === 'string' ? value : '' %></textarea>
              </div>
              <div style="<%= style('number') %>" data-input-type="number">
                <input id="inspectorModalNumberInput" type="number" value="<%- type === 'number' ? value : 0 %>">
              </div>
              <div style="<%= style('date') %>" data-input-type="date">
                <input id="inspectorModalDateInput" type="text" value="<%- type === 'date' ? value : '' %>">
              </div>
              <div style="<%= style('boolean') %>" data-input-type="boolean">
                <div class="input-radio">
                  <input id="inspectorModalBooleanFalse" type="radio" name="boolean" value="false"
                    <%= (value !== 'true' && type === 'boolean') || !false ? 'checked' : '' %>
                  >
                  <label for="inspectorModalBooleanFalse"><%= tr('False') %></label>
                </div>
                <div class="input-radio">
                  <input id="inspectorModalBooleanTrue" type="radio" name="boolean" value="true"
                    <%= (value === 'true' && type === 'boolean') ? 'checked' : '' %>
                  >
                  <label for="inspectorModalBooleanTrue"><%= tr('True') %></label>
                </div>
              </div>
              <div style="<%= style('null') %>" data-input-type="null">
                <div class="input-radio">
                  <input id="inspectorModalEmptyUndefined" type="radio" name="empty" value="undefined"
                    <%= (value !== 'null' && type === 'null') || !false ? 'checked' : '' %>
                  >
                  <label for="inspectorModalEmptyUndefined"><%= tr('Undefined') %></label>
                </div>
                <div class="input-radio">
                  <input id="inspectorModalEmptyNull" type="radio" name="empty" value="null"
                    <%= (value === 'null' && type === 'null') ? 'checked' : '' %>
                  >
                  <label for="inspectorModalEmptyNull"><%= tr('Null') %></label>
                </div>
              </div>
            </form>
            <select id="inspectorModalSelect" data-style="inspector-modal-select">
              <% _.each(['Boolean', 'Custom', 'String', 'Number', 'Date', 'Null'], (item) => { %>
                <option class="inspector-modal-select-option" value="<%= item.toLowerCase() %>" <%= item.toLowerCase() === type ? 'selected' : '' %>>
                  <%= tr(item) %>
                </option>
              <% }); %>
            </select>
          </div>
          <div class="inspector-modal-footer">
            <button type="button" id="inspectorModalAccept" class="btn-base btn-accept"><%= tr('Accept') %></button>
            <button type="button" id="inspectorModalCancel" class="btn-base btn-cancel"><%= tr('Cancel') %></button>
          </div>
        </div>
      </div>
    </div>
  `),

  'inspector/main': _.template(/*html*/`
    <div class="inspector-content">
      <ul class="inspector-nav" role="tablist">
        <li class="inspector-nav-item active" role="presentation">
          <a href="#variables" aria-controls="variables" role="tab" data-toggle="tab"><%= tr('Variables') %></a>
        </li>
        <li class="inspector-nav-item" role="presentation">
          <a href="#resources" aria-controls="resources" role="tab" data-toggle="tab"><%= tr('Resources') %></a>
        </li>
        <li class="inspector-nav-item" role="presentation">
          <a href="#callstack" aria-controls="callstack" role="tab" data-toggle="tab"><%= tr('Callstack') %></a>
        </li>
        <li id="inspectorClose" style="flex: 0; min-width: 36px; padding: 4px 0; text-align: center;">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%"></i>
        </li>
      </ul>
      <div class="inspector-tabs">
        <div class="inspector-tab active" id="variables" role="tabpanel"></div>
        <div class="inspector-tab" id="resources" role="tabpanel"></div>
        <div class="inspector-tab" id="callstack" role="tabpanel"></div>
      </div>
      <div class="inspector-notice" style="display: none;">
        <span style="text-align: center; user-select: none;"><%= tr("Data will be loaded at the next script pause") %></span>
      </div>
    </div>
  `),

  'inspector/variables': _.template(/*html*/`
    <%= Scenario.JST['inspector/tools']({ ...obj }) %>
    <div class="inspector-panel">
      <div class="inspector-panel-info" style="display: none">
        <span style="text-align: center"><%= tr('No variables') %></span>
      </div>
      <div class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/resources': _.template(/*html*/`
    <%= Scenario.JST['inspector/tools']({ ...obj }) %>
    <div class="inspector-panel">
      <div class="inspector-panel-info" style="display: none">
        <span style="text-align: center"><%= tr('No resources') %></span>
      </div>
      <div class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/callstack': _.template(/*html*/`
    <div class="inspector-panel">
      <div class="inspector-panel-infO" style="display: none">
        <span style="text-align: center"><%= tr('No callstack') %></span>
      </div>
      <div class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/tools': _.template(/*html*/`
    <div class="inspector-tools">
      <span style="width: 26px; padding: 0px 6px;">
        <i class="fa fa-search" style="vertical-align: -webkit-baseline-middle;"></i>
      </span>
      <input type="text" class="inspector-filter-input" placeholder="<%= tr('Filter by name...') %>">
      <div class="dropdown">
        <button class="inspector-sort-button" title="<%= tr('Sorting') %>" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-filter"></i>
        </button>
        <ul class="inspector-sort-menu dropdown-menu dropdown-menu-right">
          <li class="inspector-sort-menu-item" data-sort-type="alphabetically"><%= tr('Alphabetically') %></li>
          <li class="inspector-sort-menu-item" data-sort-type="frequency"><%= tr('By frequency of use') %></li>
          <li class="inspector-sort-menu-item" data-sort-type="dateModified"><%= tr('By date modified') %></li>
          <li class="inspector-sort-menu-item" data-sort-type="dateAdded"><%= tr('By date added') %></li>
        </ul>
      </div>
      <div class="dropdown">
        <button class="inspector-filter-button" title="<%= tr('Filters') %>" type="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
          <i class="fa fa-cog"></i>
        </button>
        <ul class="inspector-filter-menu dropdown-menu dropdown-menu-right">
          <% for (const type of ['Undefined', 'Boolean', 'Number', 'Groups', 'String', 'Date', 'Null']) { %>
            <li class="inspector-filter-menu-item">
              <% const id = _.uniqueId('inspectorFilter' + type), lower = type.toLowerCase() %>
              <input type="checkbox" id="<%= id %>" value="<%= lower %>" <%= visibility[lower] ? 'checked' : '' %>>
              <label for="<%= id %>"><%= type %></label>
            </li>
          <% } %>
        </ul>
      </div>
    </div>
  `),
})