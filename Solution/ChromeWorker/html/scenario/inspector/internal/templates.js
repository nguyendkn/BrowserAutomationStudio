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
              <% const style = (target) => type === target ? 'display: block;' : 'display: none;' %>
              <div style="<%- style('custom') %>" data-input-type="custom">
                <textarea id="inspectorModalCustomInput"><%- type === 'custom' ? value : '' %></textarea>
              </div>
              <div style="<%- style('string') %>" data-input-type="string">
                <textarea id="inspectorModalStringInput"><%- type === 'string' ? value : '' %></textarea>
              </div>
              <div style="<%- style('number') %>" data-input-type="number">
                <input id="inspectorModalNumberInput" type="number" value="<%- type === 'number' ? value : 0 %>">
              </div>
              <div style="<%- style('date') %>" data-input-type="date">
                <input id="inspectorModalDateInput" type="text" value="<%- type === 'date' ? value : '' %>">
              </div>
              <div style="<%- style('boolean') %>" data-input-type="boolean">
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
              <div style="<%- style('null') %>" data-input-type="null">
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
    <div id="inspectorContent" style="height: 100%; display: flex; flex-flow: column; position: relative;">
      <ul class="inspector-nav">
        <li id="inspectorShowVariables" class="inspector-nav-item"><%= tr('Variables') %></li>
        <li id="inspectorShowResources" class="inspector-nav-item"><%= tr('Resources') %></li>
        <li id="inspectorShowCallstack" class="inspector-nav-item"><%= tr('Callstack') %></li>
        <li id="inspectorClose" style="flex: 0; min-width: 36px;">
          <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%"></i>
        </li>
      </ul>
      <div class="inspector-tab" data-tab-name="variables" style="display: <%= tab === 'variables' ? 'flex' : 'none' %>"></div>
      <div class="inspector-tab" data-tab-name="resources" style="display: <%= tab === 'resources' ? 'flex' : 'none' %>"></div>
      <div class="inspector-tab" data-tab-name="callstack" style="display: <%= tab === 'callstack' ? 'flex' : 'none' %>"></div>
      <div id="inspectorNotice" style="display: none; position: absolute; background: #fafafa; margin-top: 32px; padding: 40px; height: 100%; width: 100%;">
        <div style="text-align: center; margin: 0 15px;"><%= tr("Data will be loaded at the next script pause") %></div>
      </div>
    </div>
  `),

  'inspector/variables': _.template(/*html*/`
    <div class="inspector-tools">
      <span style="width: 26px; padding: 0px 6px;">
        <i class="fa fa-search" style="vertical-align: -webkit-baseline-middle;"></i>
      </span>
      <input type="text" class="inspector-filter-input" placeholder="<%- tr('Filter by name...') %>">
      <button class="inspector-sort-button"><i class="fa fa-filter"></i></button>
      <ul class="inspector-sort-menu" style="display: none">
        <li class="inspector-sort-menu-item" data-sort-type="alphabetically"><%- tr('Alphabetically') %></li>
        <li class="inspector-sort-menu-item" data-sort-type="frequency"><%- tr('Frequency of use') %></li>
        <li class="inspector-sort-menu-item" data-sort-type="dateAdded"><%- tr('Date added') %></li>
        <li class="inspector-sort-menu-item" data-sort-type="dateModified"><%- tr('Date modified') %></li>
      </ul>
      <button class="inspector-filter-button"><i class="fa fa-cog"></i></button>
      <ul class="inspector-filter-menu" style="display: none">
        <% for (const type of ['Undefined', 'Boolean', 'String', 'Number', 'Date', 'Null']) { %>
          <% const lower = type.toLowerCase() %>
          <li class="inspector-filter-menu-item">
            <input type="checkbox" id="inspectorVariablesFilter<%= type %>" value="<%= lower %>" <%= visibleTypes[lower] ? 'checked' : '' %>>
            <label for="inspectorVariablesFilter<%= type %>"><%- type %></label>
          </li>
        <% } %>
      </ul>
    </div>
    <div class="inspector-panel">
      <div style="font-size: smaller; margin-top: 10px; display: none;">
        <span><%= tr('No variables') %></span>
      </div>
      <div id="inspectorVariablesData" class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/resources': _.template(/*html*/`
    <div class="inspector-tools">
      <span style="width: 26px; padding: 0px 6px;">
        <i class="fa fa-search" style="vertical-align: -webkit-baseline-middle;"></i>
      </span>
      <input type="text" class="inspector-filter-input" placeholder="<%- tr('Filter by name...') %>" style="flex: 1;">
      <button class="inspector-sort-button"><i class="fa fa-filter"></i></button>
      <ul class="inspector-sort-menu" style="display: none">
        <li class="inspector-sort-menu-item" data-sort-type="alphabetically"><%- tr('Alphabetically') %></li>
        <li class="inspector-sort-menu-item" data-sort-type="frequency"><%- tr('Frequency of use') %></li>
        <li class="inspector-sort-menu-item" data-sort-type="dateAdded"><%- tr('Date added') %></li>
        <li class="inspector-sort-menu-item" data-sort-type="dateModified"><%- tr('Date modified') %></li>
      </ul>
      <button class="inspector-filter-button"><i class="fa fa-cog"></i></button>
      <ul class="inspector-filter-menu" style="display: none">
        <% for (const type of ['Undefined', 'Boolean', 'String', 'Number', 'Date', 'Null']) { %>
          <% const lower = type.toLowerCase() %>
          <li class="inspector-filter-menu-item">
            <input type="checkbox" id="inspectorResourcesFilter<%= type %>" value="<%= lower %>" <%= visibleTypes[lower] ? 'checked' : '' %>>
            <label for="inspectorResourcesFilter<%= type %>"><%- type %></label>
          </li>
        <% } %>
      </ul>
    </div>
    <div class="inspector-panel">
      <div style="font-size: smaller; margin-top: 10px; display: none;">
        <span><%= tr('No resources') %></span>
      </div>
      <div id="inspectorResourcesData" class="inspector-panel-data"></div>
    </div>
  `),

  'inspector/callstack': _.template(/*html*/`
    <div id="inspectorCallstack">
      <div id="inspectorNoCallstack" style="font-size: smaller; margin-top: 10px; display: none;">
        <span><%= tr('No callstack') %></span>
      </div>
      <div id="inspectorCallstackData" class="inspector-panel-data"></div>
    </div>
  `),
})