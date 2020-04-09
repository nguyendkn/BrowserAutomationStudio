function SearchManager() {
  const excludedActions = ["httpclientgetcookiesforurl", "getcookiesforurl", "check"];

  const groups = _.filter(_TaskCollection.toJSON(), {type: "group"});
  
  let lastQuery = null;

  let actions = [];
  let pages = [];

  let current = 0;
  let total = 0;

  const getText = (element) => {
    let html = tr(element.html());
    let node = $("<div/>");
    node.append(html);
    return node.text();
  };

  _.forOwn(_A, (value, key) => {
    let actionContent = $("#" + key).text();

    let defaultDesc = $(actionContent)
      .find(".tooltip-paragraph-first-fold");
    let shortDesc = $(actionContent)
      .find(".short-description");
    let description = null;

    if (defaultDesc.length) 
      description = getText(defaultDesc);
    if (shortDesc.length) 
      description = getText(shortDesc);

    let group = _.find(groups, {name: _A2G[key] || "browser"});
    
    let action = {description, name: tr(value.name), key};

    if (value.class && value.class == "browser") {
      action.description += tr(" This action works only with element inside browser.");
      action.icon = "../icons/element.png";
      action.module = "Browser > Element";
      action.popup = true;
    } else {
      action.module = group.description;
      action.icon = group.icon;
      action.popup = false;
    }

    actions.push(action);
  });

  this.Search = function (query) {
    lastQuery = query;
    $(".results-recent").hide();
    renderSearch(_.filter(actions, (el) => {
      let queryLower = query.toLowerCase();
      let nameLower = el.name.toLowerCase();
      if (excludedActions.includes(el.key)) {
        return false;
      }
      return nameLower.indexOf(queryLower) >= 0;
    }));
  };

  this.Recent = function () {
    lastQuery = null;
    $(".results-recent").show();
    renderSearch(_.map(ActionHistory, (el) => {
      return _.find(actions, {key: el});
    }));
  };

  const getItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) return 3 * rows;
    if (screenWidth > 480) return 2 * rows;
    return rows;
  };

  const renderSearch = (results, rows) => {
    rows = rows || (Math.floor(window.innerHeight / 100) - 1);
    let itemsCount = getItemsCount(rows);
    results = _.take(results, 100);
    pages = _.chunk(results, itemsCount);
    total = results.length;
    current = 0;

    let allInView = renderPage(pages[0]);
    if (!allInView && rows > 1) {
      renderSearch(results, rows - 1);
    }
  };

  const inViewport = (element) => {
    let viewportTop = $(window).scrollTop();
    let viewportBottom = viewportTop + $(window).height();

    let boundsTop = element.offset().top;
    let boundsBottom = boundsTop + element.outerHeight();

    return boundsTop >= viewportTop && boundsBottom <= viewportBottom;
  };

  const renderPagination = () => {
    $("#count").html(`${total} results`);
    
    if (total == 0) {
      $("#pages").html(`${current + 1} - ${pages.length + 1}`);
    } else {
      $("#pages").html(`${current + 1} - ${pages.length}`);
    }

    $("#nextpage").prop("disabled", () => {
      return total == 0 || pages.length == 1 || current == pages.length - 1;
    });

    $("#prevpage").prop("disabled", () => {
      return total == 0 || pages.length == 1 || current == 0;
    });

    $(".results-empty").toggle(total == 0);
  };

  const renderPage = (page) => {
    let container = $("#results");
    container.unmark();
    container.empty();

    if (total == 0) {
      renderPagination();
      return true;
    }

    page.forEach((item) => container.append(template({item})));

    $(".result-item").click(function () {
      let action = $(this).find(".result-action").text().trim();
      let popup = $(this).data("popup");
      let value = $(this).data("value");

      if (popup) {
        BrowserAutomationStudio_Notify("search", action);
      } else {
        BrowserAutomationStudio_OpenAction(value);
      }
    });

    renderPagination();
    container.mark(lastQuery || "");
    return inViewport(container);
  };

  this.Render = function () {
    $("#nextpage").click(() => renderPage(pages[++current]));
    $("#prevpage").click(() => renderPage(pages[--current]));
    $(".results-recent").text(tr("Recent actions"));
    $(".results-empty").text(tr("Nothing found"));

    $(window).resize(() => {
      if ($(".search").is(":visible")) {
        if (lastQuery) {
          this.Search(lastQuery);
        } else {
          this.Recent();
        }
      }
    });

    $("#pagination").hide();
    $(".search").hide();
  };

  this.Show = function () {
    $("#pagination, .search").show();
    $("#searchinput").val("");
    $("#searchinput").focus();
    $(".actions").hide();

    this.Recent();
  };

  this.Hide = function () {
    $("#pagination, .search").hide();
    $("#searchinput").val("");
    $("#searchinput").blur();
    $(".actions").show();
  };

  let template = _.template(`
    <li class="result-item" data-value="<%= item.key %>" data-popup="<%= item.popup %>">
        <img src="<%= item.icon %>">
        <div class="result result-action">
          <%= item.name %>
        </div>
        <div class="result result-module">
          <%= item.module %>
        </div>
        <div class="result result-description">
          <%= item.description %>
        </div>
    </li>
  `);
}
