class SearchEngine {

  excludedEntries = ["httpclientgetcookiesforurl", "getcookiesforurl", "check"]

  searchItems = []

  constructor () {
    this._addActionItems();
    this._addVideoItems();
    this._addWikiItems();
  }

  search(query) {
    return _.filter(this.searchItems, item => {
      let itemNameLower = item.name.toLowerCase();
      let queryLower = query.toLowerCase();

      if (this.excludedEntries.includes(item.key)) {
        return false;
      }

      return itemNameLower.indexOf(queryLower) >= 0;
    });
  }

  recent() {
    return _.map(ActionHistory, item => {
      return _.find(this.searchItems, { key: item });
    });
  }

  /**
   * Add all action items to `searchItems` array.
   * @private
   */
  _addActionItems() {
    _.forOwn(_A, (value, key) => {
      let actionContent = $("#" + key).text();

      let defaultDesc = $(actionContent)
        .find(".tooltip-paragraph-first-fold");
      let shortDesc = $(actionContent)
        .find(".short-description");
      let description = null;

      if (defaultDesc.length)
        description = this._getTextContent(defaultDesc);
      if (shortDesc.length)
        description = this._getTextContent(shortDesc);

      let action = { name: tr(value.name), type: "action", description, key };

      if (value.class && value.class == "browser") {
        action.description += tr(" This action works only with element inside browser.");
        action.module = tr("Browser > Element");
        action.icon = "../icons/element.png";
        action.popup = true;
      } else {
        let group = this._getActionGroup(key);
        action.module = group.description;
        action.icon = group.icon;
        action.popup = false;
      }

      this.searchItems.push(action);
    });
  }

  /**
   * Add all video items to `searchItems` array.
   * @private
   */
  _addVideoItems() {
    _.forEach(_VIDEO, (video) => {
      if (_K == video["lang"])
        this.searchItems.push({
          icon: "../icons/youtube.png",
          name: video["name"],
          key: video["url"],
          type: "link",
        });
    });
  }

  /**
   * Add all wiki items to `searchItems` array.
   * @private
   */
  _addWikiItems() {
    _.forEach(_WIKI, (wiki) => {
      if (_K == wiki["lang"])
        this.searchItems.push({
          icon: "../icons/wiki.png",
          name: wiki["name"],
          key: wiki["url"],
          type: "link",
        });
    });
  }

  _getTextContent(element) {
    let html = tr(element.html());
    let node = $("<div/>");
    node.append(html);
    return node.text();
  }

  _getActionGroup(action) {
    let name = _A2G[action] || "browser";
    let tasks = _TaskCollection.toJSON();
    return _.find(tasks, { type: "group", name });
  }
}