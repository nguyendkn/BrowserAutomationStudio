window.TreeView = {
  name: 'TreeView',

  components: {
    TreeViewGroup,
    TreeViewItem
  },

  props: {
    data: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      groups: [
        { name: 'Main', color: '#c0bd9b' }
      ]
    };
  },

  methods: {
    removeGroup(name) {
      const index = this.groups.findIndex(group => {
        return group.name === name;
      });

      this.groups.splice(index, 1);
    },

    updateGroup(name, data) {
      const index = this.groups.findIndex(group => {
        return group.name === name;
      });

      Object.assign(this.groups[index], data);
    },

    addGroup() {
      this.groups.push({
        name: uniqueId('Group '),
        color: '#c0bd9b'
      });
    },
  },

  template: /*html*/`
    <ul class="tree-view">
      <TreeViewGroup v-for="group in groups"
        :key="group.name"
        :name="group.name"
        :color="group.color"
        @remove="removeGroup"
        @update="updateGroup"
        @add="addGroup"
      >
        <TreeViewItem v-for="(item, key) in data" :key="key" :label="key" :value="item" />
      </TreeViewGroup>
    </ul>
  `
};