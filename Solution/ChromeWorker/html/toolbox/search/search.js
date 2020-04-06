function SearchManager() {
  let lastQuery = "";

  let actions = [];
  let pages = [];

  let current = 0;
  let total = 0;

  _.forOwn(_A, (el, key) => {
    actions.push({
      description: el["description"],
      groupId: _A2G[key] || "browser",
      popup: !_.has(_A2G, key),
      name: tr(el["name"]),
      key: key,
    });
  });

  this.Search = function (query) {
    renderSearch(query, actions.filter((el) => {
        let queryLower = query.toLowerCase();
        let nameLower = el.name.toLowerCase();
        return nameLower.indexOf(queryLower) >= 0;
      })
    );
  };

  this.Recent = function () {
    renderSearch("", actions.filter((el) => {
        return ActionHistory.includes(el.key);
      })
    );
  };

  const getMaxItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) return 3 * rows;
    if (screenWidth > 480) return 2 * rows;
    return rows;
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
    console.log(rows);
    if (maxItemsCount == 1) {
      return;
    }
    if (!allInView) {
      renderSearch(query, items, rows - 1);
    }
  };

  const inViewport = (element) => {
    let viewport = {};
    viewport.top = $(window).scrollTop();
    viewport.bottom = viewport.top + $(window).height();

    let bounds = {};
    bounds.top = element.offset().top;
    bounds.bottom = bounds.top + element.outerHeight();

    return bounds.top >= viewport.top && bounds.bottom <= viewport.bottom;
  };

  const renderPage = (page) => {
    let container = $("#results");
    container.unmark();
    container.empty();

    if (total == 0) {
      $("#pages").html(`1 - 1`);
      $("#count").html(`0 results`);
      $(".results-empty").show();
      return true;
    }

    page.forEach((item) => {
      container.append(
        template({
          icon:
            item.groupId && item.groupId.length > 0
              ? _G[item.groupId]["icon"]
              : "../icons/browser.png",
          description: item.description,
          groupId: item.groupId,
          popup: item.popup,
          name: item.name,
          key: item.key,
        })
      );
    });

    if (!inViewport(container)) {
      return false;
    }

    $(".result-item").click(function () {
      let action = $(this).find(".result-action").text().trim();
      let popup = $(this).data("popup");
      let value = $(this).data("value");

      if (popup) {
        BrowserAutomationStudio_Notify("search", action);
      } else {
        $("body").css("overflow-y", "visible");
        _Router.navigate(`#!/${value}`, true);
      }
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

  this.Render = function () {
    $("#nextpage").click(() => renderPage(pages[++current]));
    $("#prevpage").click(() => renderPage(pages[--current]));

    $(window).resize(() => {
      if (lastQuery != "") {
        this.Search(lastQuery);
      } else {
        this.Recent();
      }
    });

    $(".results-recent").hide();
    $(".results-empty").hide();
    $("#pagination").hide();
    $(".search").hide();
  };

  this.Show = function () {
    $("body").css("overflow-y", "hidden");
    $("#searchinput").focus();
    $("#pagination").show();
    $(".actions").hide();
    $(".search").show();

    this.Recent();
  };

  this.Hide = function () {
    $("body").css("overflow-y", "visible");
    $("#searchinput").blur();
    $("#pagination").hide();
    $(".actions").show();
    $(".search").hide();

    $("#searchinput").val("");
  };

  let template = _.template(`
    <li class="result-item" data-value="<%= key %>" data-popup="<%= popup %>">
        <img src="<%= icon %>">
        <div class="result result-action">
          <%= name %>
        </div>
        <div class="result result-module">
          <%= groupId %>
        </div>
        <div class="result result-description">
          <%= description %>
        </div>
    </li>
  `);
}
