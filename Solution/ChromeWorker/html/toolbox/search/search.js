function SearchManager() {
  this.actions = [];

  this.Show = function () {
    $("body").css("overflow-y", "hidden");
    $(".actions").hide();
    $(".search").show();
  };

  this.Hide = function () {
    $("body").css("overfloy-y", "visible");
    $(".actions").show();
    $(".search").hide();
  };

  this.Search = function (query) {
    $("#results").empty();

    let items = this.actions
      .filter(el => {
        if (el.name.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
          return true;
        }
        return false;
      })
      .map(el => {
        let queryLower = query.toLowerCase();
        let nameLower = el.name.toLowerCase();
        let hStart = nameLower.indexOf(queryLower);
        let hEnd = hStart + queryLower.length;
        return {
          highlightStart: hStart,
          highlightEnd: hEnd,
          element: el
        };
      });

    this.RenderItems(items);
  };

  this.Recent = function () {
    $("#results").empty();

    let items = this.actions
      .filter(el => ActionHistory.includes(el.key))
      .map(el => {
        return {
          element: el
        };
      });

    this.RenderItems(items);
  }

  this.RenderItems = function (items) {
    let container = $("#results");
    let counter = $("#count");

    items.forEach(result => {
      let val = result.element;
      if (val.groupId && val.groupId.length > 0) {
        container.append(
          this.itemTemplate({
            icon: _G[val.groupId]["icon"],
            description: val.description,
            groupId: val.groupId,
            name: val.name,
            key: val.key
          })
        );
      } else {
        container.append(
          this.itemTemplate({
            description: val.description,
            groupId: val.groupId,
            name: val.name,
            key: val.key,
            icon: ""
          })
        );
      }
    });

    $(".hit-action").click(function () {
      _Router.navigate("#!/" + $(this).data("value"), true);
    });

    counter.html(`${results.length} results`);
  }

  this.Render = function () {
    $(".search").append(this.searchTemplate);
    $(".search").hide();

    this.actions = [];

    Object.keys(_A).forEach(key => {
      let el = _A[key];

      if (el["class"] != "browser") {
        let groupName = "";
        let groupId = "";

        if (_A2G[key]) {
          groupId = _A2G[key];
          if (_G[groupId]) {
            groupName = _G[groupId]["name"] + " : ";
          }
        }

        if (el["suggestion"]) {
          this.actions.push({
            suggestionEn: el["suggestion"]["en"],
            suggestionRu: el["suggestion"]["ru"],
            description: el["description"],
            groupName: groupName,
            name: tr(el["name"]),
            groupId: groupId,
            key: key
          });
        } else {
          this.actions.push({
            description: el["description"],
            groupName: groupName,
            name: tr(el["name"]),
            groupId: groupId,
            key: key
          });
        }
      }
    });
  }

  this.Highlight = function (str, element) {
    
  }

  this.searchTemplate = `
  <div class="container-fluid mainscreen">
    <span class="input-group pagination-container" id="pagination" style="display: none;">
      <p class="pagination-results" id="count">0 results</p>
      <nav>
        <button class="pagination-button-left pagination-button" data-value="" id="prevpage" aria-label="Previous results">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <line x1="19" y1="12" x2="5" y2="12" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
        </button>
        <button class="pagination-button-right pagination-button" data-value="" id="nextpage" aria-label="Next results">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <line x1="5" y1="12" x2="19" y2="12" />
            <polyline points="12 5 19 12 12 19" />
          </svg>
        </button>
      </nav>
      <p class="pagination-pages">1 - 9</p>
    </span>
    <ol class="results-container" id="results"></ol>
  </div>
`;

  this.itemTemplate = _.template(`
<li class="result-item">
    <img src="<%= icon %>">
    <div class="hit hit-action" data-value="<%= key %>">
      <%= name %>
    </div>
    <div class="hit hit-module">
      <%= groupId %>
    </div>
    <div class="hit hit-docs">
      <%= description %>
    </div>
</li>`);
}
