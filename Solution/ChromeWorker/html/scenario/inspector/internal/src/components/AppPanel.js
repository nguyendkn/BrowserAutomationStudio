window.AppPanel = {
  name: 'AppPanel',

  props: {

  },

  template: /*html*/`
    <div class='app-panel'>
      <Toolbar :filters.sync="filters" :sortings.sync="sortings" :query.sync="searchQuery" />
      <div v-show="!isEmpty" class="app-panel-content">
        <TreeView :data="source" />
      </div>
      <div v-show="isEmpty" class="app-panel-title" v-t="'tabs.variablesEmpty'"></div>
    </div>
  `
};