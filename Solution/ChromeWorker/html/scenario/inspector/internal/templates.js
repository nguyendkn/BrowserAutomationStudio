_.extend(Scenario.JST, {
  'inspector/modal': _.template(/*html*/`
    <div class="vertical-align-helper">
      <div class="modal-dialog vertical-align-center" role="document">
        <div class="inspector-modal-content">
          <div class="inspector-modal-header">
            <h4><%= tr("Change the variable value") %></h4>
          </div>
          <div class="inspector-modal-body">
            <div class="inspector-modal-inputs">
              <textarea id="inspectorModalTextarea" style="resize: vertical; display: none;"></textarea>
              <input id="inspectorModalNumberInput" type="number" style="display: none;">
              <input id="inspectorModalTextInput" type="text" style="display: none;">
              <div id="inspectorModalBoolean" class="inspector-modal-boolean" style="display: none;">
                <div class="input-radio">
                  <input id="inspectorModalBooleanFalse" type="radio" name="boolean" value="false">
                  <label for="inspectorModalBooleanFalse"><%= tr('False') %></label>
                </div>
                <div class="input-radio">
                  <input id="inspectorModalBooleanTrue" type="radio" name="boolean" value="true">
                  <label for="inspectorModalBooleanTrue"><%= tr('True') %></label>
                </div>
              </div>
            </div>
            <select id="inspectorModalSelect" data-style="inspector-modal-select">
              <% _.each(['Boolean', 'String', 'Number', 'Date', 'Raw'], (item) => { %>
                <option class="inspector-modal-select-option" value="<%= item.toLowerCase() %>" <%= item.toLowerCase() === type ? 'selected' : '' %>>
                  <%= tr(item) %>
                </option>
              <% }); %>
            </select>
          </div>
          <div class="inspector-modal-footer">
            <button type="button" id="inspectorModalAccept" class="btn-base btn-accept" data-dismiss="modal"><%= tr('Accept') %></button>
            <button type="button" id="inspectorModalCancel" class="btn-base btn-cancel" data-dismiss="modal"><%= tr('Cancel') %></button>
          </div>
        </div>
      </div>
    </div>
  `),

  'inspector/main': _.template(/*html*/`
    <div style="position: absolute; top: 9px; right: 30px;">
      <a href="#" id="inspectorClose" class="text-danger">
        <i class="fa fa-times-circle-o" aria-hidden="true" style="font-size: 150%; background-color: #fafafa; padding: 5px;"></i>
      </a>
    </div>
    <div id="inspectorNotice" style="display: none">
      <span><%= tr("Variables will be loaded on next script pause") %></span>
    </div>
    <div id="inspectorContent" style="display: block">
      <ul class="inspector-navigation" style="display: none">
        <li id="inspectorShowVariables"><%= tr('Variables') %></li>
        <li id="inspectorShowResources"><%= tr('Resources') %></li>
        <li id="inspectorShowCallStack"><%= tr('Call stack') %></li>
      </ul>
      <div class="inspector-data-tab">
        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Variables:') %></span>
        </div>
        <div id="inspectorVariablesData"></div>
        <div id="inspectorNoVariables" style="font-size: smaller; margin-top: 10px; display: none;"><%= tr('No variables') %></div>
      </div>
      <div class="inspector-data-tab">
        <div class="inspector-label-container">
          <span class="inspector-label"><%= tr('Resources:') %></span>
        </div>
        <div id="inspectorResourcesData"></div>
        <div id="inspectorNoResources" style="font-size: smaller; margin-top: 10px; display: none;"><%= tr('No resources') %></div>
      </div>
    </div>
  `)
})