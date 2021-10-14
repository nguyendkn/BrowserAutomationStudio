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
        { name: 'Main' },
        { name: 'Test' },
      ]
    };
  },

  template: String.raw`
    <ul class="tree-view">
      <TreeViewGroup v-for="group in groups" :key="group.name" :name="group.name" />
    </ul>
  `
};