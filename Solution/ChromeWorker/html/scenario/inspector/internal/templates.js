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
      <div class="inspector-tab" data-tab-name="variables" style="display: block;">
        <div id="inspectorVariablesData"></div>
        <div id="inspectorNoVariables" style="font-size: smaller; margin-top: 10px; display: none;">
          <span><%= tr('No variables') %></span>
        </div>
      </div>
      <div class="inspector-tab" data-tab-name="resources" style="display: none;">
        <div id="inspectorResourcesData"></div>
        <div id="inspectorNoResources" style="font-size: smaller; margin-top: 10px; display: none;">
          <span><%= tr('No resources') %></span>
        </div>
      </div>
      <div class="inspector-tab" data-tab-name="callstack" style="display: none;">
        <div id="inspectorCallstackData"></div>
        <div id="inspectorNoCallstack" style="font-size: smaller; margin-top: 10px; display: none;">
          <span><%= tr('No callstack') %></span>
        </div>
      </div>
      <div id="inspectorNotice" style="display: none; position: absolute; background: #fafafa; margin-top: 32px; padding: 40px; height: 100%; width: 100%;">
        <div style="text-align: center; margin: 0 15px;"><%= tr("Data will be loaded at the next script pause") %></div>
      </div>
    </div>
  `)
})