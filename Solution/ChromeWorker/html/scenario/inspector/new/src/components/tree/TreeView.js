window.TreeView = {
  name: 'TreeView',

  components: {
    TreeViewGroup
  },

  props: {
    data: {
      required: true,
      type: [Array, Object]
    }
  },

  data() {
    return {
      groups: [
        { name: 'Main', index: 0 },
        { name: 'Test', index: 1 },
      ]
    };
  },

  template: String.raw`
    <ul class="tree-view">
      <TreeViewGroup v-for="group in groups" :key="group.name" :name="group.name" />
    </ul>
  `
};