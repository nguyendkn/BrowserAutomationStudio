window.TreeViewGroup = {
  name: 'TreeViewGroup',

  props: {
    name: {
      required: true,
      type: String
    }
  },

  data() {
    return {
      color: '#c0bd9B'
    }
  },

  computed: {
    style() {
      return {
        '--color': this.color
      }
    }
  },

  template: String.raw`
    <li :style="style" class="tree-view-group">
      <div class="tree-view-group-header">
        <img src="src/assets/icons/folder.svg" alt="icon">
        <div style="margin-left: 8px;" v-text="name"></div>
      </div>
      <div class="tree-view-group-content">
        Group content
      </div>
    </li>
  `
};