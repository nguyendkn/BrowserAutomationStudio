let searchTemplate = `
  <div class='container-fluid mainscreen'>
    <div class="pagination-container" id="pagination">

    </div>
    <div class="results-container" id="results">
    
    </div>
  </div>
`;

let itemTemplate = _.template(`
<li class="result-item" data-icon="<%= icon %>">
    <div class="hit hit-action" data-value='<%= k %>'>
      <%= name %>
    </div>
    <div class="hit hit-module">
      <%= groupId %>
    </div>
    <div class="hit hit-docs">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
    </div>
    <div class="hit hit-docs">
      {{sub}}
    </div>
</li>`);

function BrowserAutomationStudio_InitSearch() {
  $(".search")
    .append(searchTemplate)
    .hide();

  let keys = Object.keys(_A);
  let actions = [];

  keys.forEach(k => {
    let el = _A[k];
    if (el["class"] != "browser") {
      let groupName = "";
      let groupId = "";

      if (_A2G[k]) {
        groupId = _A2G[k];
        if (_G[groupId]) {
          groupName = _G[groupId]["name"] + " : ";
        }
      }

      if (el["suggestion"]) {
        actions.push({
          suggestionEn: el["suggestion"]["en"],
          suggestionRu: el["suggestion"]["ru"],
          groupName: groupName,
          name: tr(el["name"]),
          groupId: groupId,
          k: k
        });
      } else {
        actions.push({
          groupName: groupName,
          name: tr(el["name"]),
          groupId: groupId,
          k: k
        });
      }
    }
  });

  $("#searchinput").keyup(event => {
    $('#results').empty();

    let query = $("#searchinput").val();
    let results = actions.filter(el => {
      if (el.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
        return true;
      }
      return false;
    });

    console.log(query);
    console.log(results);

    let box = $('<ol class="result-list"></ol>')
    results.forEach((val) => {
      if (val.groupId && val.groupId.length > 0) {
        box.append(itemTemplate({
          icon: _G[val.groupId]['icon'],
          groupId: val.groupId,
          name: val.name,
          k: val.k
        }));
      } else {
        box.append(itemTemplate({
          groupId: val.groupId,
          name: val.name,
          k: val.k
        }));
      }

    });
    $('#results').append(box);
  });
}
