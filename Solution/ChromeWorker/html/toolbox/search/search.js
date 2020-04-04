function SearchManager() {
  let lastQuery = "";

  let actions = [];
  let pages = [];

  let current = 0;
  let total = 0;

  const getMaxItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) {
      return 3 * rows;
    }
    if (screenWidth > 480) {
      return 2 * rows;
    }
    return rows;
  };

  this.Search = function(query) {
    renderSearch(query, actions.filter(el => {
      let queryLower = query.toLowerCase();
      let nameLower = el.name.toLowerCase();
      return nameLower.indexOf(queryLower) >= 0;
    }));
  };

  this.Recent = function() {
    renderSearch("", actions.filter(el => {
      return ActionHistory.includes(el.key);
    }));
  };

  const renderSearch = (query, items, rows) => {
    rows = rows || Math.floor(window.innerHeight / 100);
    let maxItemsCount = getMaxItemsCount(rows);
    pages = _.chunk(items, maxItemsCount);
    total = items.length;
    lastQuery = query;
    current = 0;

    $(".results-recent").toggle(query == "");
    $(".results-empty").hide();
    
    let allInView = renderPage(pages[0]);
    if (maxItemsCount == 1) {
      return;
    }
    if (!allInView) {
      renderSearch(query, items, rows - 1);
    }
  };

  const inViewport = element => {
    let viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();

    let bounds = {};
    bounds.top = element.offset().top;
    bounds.bottom = bounds.top + element.outerHeight();

    return ((bounds.top >= viewport.top) && (bounds.bottom <= viewport.bottom)); 
  };

  const renderPage = page => {
    let container = $("#results");
    container.unmark();
    container.empty();
    if (total == 0) {
      $("#pages").html(`1 - 1`);
      $("#count").html(`0 results`);
      $(".results-empty").show();
      return true;
    }

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

    if (!inViewport(container)) {
      return false;
    }

    $(".result-item").click(function() {
      let value = $(this).data("value");
      $("body").css("overflow-y", "visible");
      _Router.navigate(`#!/${value}`, true);
    });

    $("#pages").html(`${current + 1} - ${pages.length}`);
    $("#count").html(`${total} results`);

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

    container.mark(lastQuery);
    return true;
  };

  this.Render = function() {
    $("#nextpage").click(() => renderPage(pages[++current]));
    $("#prevpage").click(() => renderPage(pages[--current]));

    $(window).resize(() => {
      if (lastQuery != "") {
        this.Search(lastQuery);
      } else {
        this.Recent();
      }
    });

    $("#pagination").hide();
    $(".results-recent").hide();
    $(".results-empty").hide();
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

  this.Show = function() {
    $("body").css("overflow-y", "hidden");
    $("#searchinput").focus();
    $("#pagination").show();
    $(".actions").hide();
    $(".search").show();

    this.Recent();
  };

  this.Hide = function() {
    $("body").css("overflow-y", "visible");
    $("#searchinput").blur();
    $("#pagination").hide();
    $(".actions").show();
    $(".search").hide();

    $("#searchinput").val("");
  };

  let template = _.template(`
    <li class="result-item" data-value="<%= key %>">
        <img src="<%= icon %>">
        <div class="hit hit-action">
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
