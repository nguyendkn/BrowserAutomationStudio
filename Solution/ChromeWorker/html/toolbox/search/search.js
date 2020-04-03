function SearchManager() {
  let lastQuery = "";

  let maxItems = 8;
  let current = 0;
  let total = 0;

  let actions = [];
  let pages = [];

  const disableScrolling = () => {
    $("body").css("overflow-y", "hidden");
  };

  const enableScrolling = () => {
    $("body").css("overflow-y", "visible");
  };

  this.Test = function() {
    let itemHeight = $(".result-item").height();
    let itemWidth = $(".result-item").width();
    let windowHeight = $(window).height();
    let windowWidth = $(window).width();

    let maxColumns = Math.floor(windowWidth / itemWidth);
    let maxRows = Math.floor(windowHeight / itemHeight) - 1;
    console.log(maxColumns);
    console.log(maxRows);
  };

  this.Show = function() {
    disableScrolling();

    $("#pagination").show();
    $(".actions").hide();
    $(".search").show();

    this.Test();
    this.Recent();
  };

  this.Hide = function() {
    enableScrolling();

    $("#pagination").hide();
    $(".actions").show();
    $(".search").hide();

    $("#searchinput").val("");
  };

  this.Search = function(query) {
    let container = $("#results");
    container.unmark();
    container.empty();

    let items = actions.filter(el => {
      let queryLower = query.toLowerCase();
      let nameLower = el.name.toLowerCase();
      return nameLower.indexOf(queryLower) >= 0;
    });
    pages = _.chunk(items, maxItems);
    total = items.length;
    lastQuery = query;

    this.RenderPage(pages[0]);
  };

  this.Recent = function() {
    let container = $("#results");
    container.unmark();
    container.empty();

    let items = actions.filter(el => ActionHistory.includes(el.key));
    pages = _.chunk(items, maxItems);
    total = items.length;

    this.RenderPage(pages[0]);
  };

  this.RenderPage = function(page) {
    let container = $("#results");
    let countBox = $("#count");
    let pagesBox = $("#pages");
    container.empty();

    page.forEach(item => {
      container.append(
        template({
          icon:
            item.groupId && item.groupId.length > 0
              ? _G[item.groupId]["icon"]
              : "",
          description: item.description,
          groupId: item.groupId,
          name: item.name,
          key: item.key
        })
      );
    });

    $(".hit-action").click(function() {
      enableScrolling();
      
      let value = $(this).data("value");
      _Router.navigate(`#!/${value}`, true);
    });

    pagesBox.html(`${current + 1} - ${pages.length}`);
    countBox.html(`${total} results`);

    if (pages.length == 1) {
      $("#nextpage").prop("disabled", true);
      $("#prevpage").prop("disabled", true);
    } else if (current == pages.length - 1) {
      $("#nextpage").prop("disabled", true);
      $("#prevpage").prop("disabled", false);
    } else if (current == 0) {
      $("#prevpage").prop("disabled", true);
      $("#nextpage").prop("disabled", false);
    } else {
      $("#nextpage").prop("disabled", false);
      $("#prevpage").prop("disabled", false);
    }

    $("#results").mark(lastQuery);
  };

  this.Render = function() {
    console.log('rendered');
    $("#nextpage").click(() => {
      this.RenderPage(pages[++current]);
    });

    $("#prevpage").click(() => {
      this.RenderPage(pages[--current]);
    });

    $("#pagination").hide();
    $(".search").hide();
    actions = [];

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

        actions.push({
          description: el["description"],
          groupName: groupName,
          name: tr(el["name"]),
          groupId: groupId,
          key: key
        });
      }
    });
  };

  let template = _.template(`
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
    </li>
  `);
}
