function SearchManager() {

  this.actions = [];

  this.Show = function () {
    $("body").css("overflow-y", "hidden");
    $("#pagination").show();
    $(".actions").hide();
    $(".search").show();

    this.Recent();
  };

  this.Hide = function () {
    $("body").css("overfloy-y", "visible");
    $("#pagination").hide();
    $(".actions").show();
    $(".search").hide();

    $("#searchinput").val("");
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

    counter.html(`${items.length} results`);
  }

  this.Render = function () {
    $(".search").append(this.searchTemplate);
    $(".search").hide();
    $("#pagination").hide();

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
