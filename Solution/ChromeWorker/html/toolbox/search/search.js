function SearchManager() {
  const excludedActions = ["httpclientgetcookiesforurl", "getcookiesforurl", "check"];

  const groups = _.filter(_TaskCollection.toJSON(), {type: "group"});

  let searchItems = [];
  let searchPages = [];

  let lastQuery = null;

  let current = 0;

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

    searchItems.push(action);
  });

  this.Search = function (query) {
    lastQuery = query;
    $(".results-recent").css("visibility", "hidden");
    renderSearch(_.filter(searchItems, (el) => {
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
    $(".results-recent").css("visibility", "visible");
    renderSearch(_.map(ActionHistory, (el) => {
      return _.find(searchItems, {key: el});
    }));
  };

  const getItemsCount = (rows) => {
    let screenWidth = $(window).width();
    if (screenWidth > 960) return 3 * rows;
    if (screenWidth > 480) return 2 * rows;
    return rows;
  };

  const renderSearch = (results, rows) => {
    rows = rows || Math.floor($(window).height() / 120);
    results = _.take(results, 100);
    searchPages = _.chunk(results, getItemsCount(rows));
    current = 0;

    let allInView = renderPage(searchPages[0]);
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
    $("#currentpage").html(current + 1);

    if (searchPages.length == 0) {
      $("#lastpage").html(searchPages.length + 1);
    } else {
      $("#lastpage").html(searchPages.length);
    }

    $("#nextpage").prop("disabled", () => {
      return searchPages.length <= 1 || current == searchPages.length - 1;
    });

    $("#prevpage").prop("disabled", () => {
      return searchPages.length <= 1 || current == 0;
    });

    $(".results-empty").toggle(searchPages.length == 0);
  };

  const renderPage = (page) => {
    let container = $("#results");
    container.unmark();
    container.empty();

    if (searchPages.length == 0) {
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
    $("#nextpage").click((e) => {
      e.preventDefault();
      renderPage(searchPages[++current]);
    });

    $("#prevpage").click((e) => {
      e.preventDefault();
      renderPage(searchPages[--current]);
    });  

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

  this.Toggle = function (hide) {
    $("#pagination, .search").toggle(!hide);
    $(".actions").toggle(hide);
    $("#searchinput").val("");
  }

  this.Show = function () {
    $(".search-clear").css("color", "#bf5d4e");
    $("#searchinput").focus();
    this.Toggle(false);
    this.Recent();
  };

  this.Hide = function () {
    $(".search-clear").css("color", "#f2f2f2");
    $("#searchinput").blur();
    this.Toggle(true);
  };

  let template = _.template(`
    <li class="result-item" data-value="<%= item.key %>" data-popup="<%= item.popup %>">
        <div class="result-item-left">
          <img class="item-icon" src="<%= item.icon %>">
          <span class="item-index">
            01
          </span>
        </div>
        <div class="result-item-right">
          <div>
            <div class="item-action">
              <%= item.name %>
            </div>
            <div class="item-description">
              <%= item.description %>
            </div>
          </div>
          <div class="item-module">
            <%= item.module %>
          </div>
        </div>
    </li>
  `);
}
