window.TreeView = {
  name: 'TreeView',

  components: {
    draggable: window['vuedraggable'],
    TreeViewGroup,
    TreeViewItem
  },

  props: {
    filters: {
      required: true,
      type: Array
    },

    data: {
      required: true,
      type: Object
    }
  },

  data() {
    return {
      groups: [{ name: 'Main', id: uniqueId(), color: '#c0bd9b' }]
    };
  },

  computed: {
    draggableDisabled() {
      return this.groups.length === 1;
    }
  },

  methods: {
    removeGroup(id) {
      const index = this.groups.findIndex(group => {
        return group.id === id;
      });

      this.groups.splice(index, 1);
    },

    updateGroup(id, data) {
      const index = this.groups.findIndex(group => {
        return group.id === id;
      });

      Object.assign(this.groups[index], data);
    },

    addGroup() {
      this.groups.push({
        id: uniqueId(),
        name: 'Group',
        color: '#c0bd9b'
      });
    }
  },

  template: /*html*/`
    <draggable
      :disabled="draggableDisabled"
      class="tree-view"
      :list="groups"
      tag="ul"
    >
      <TreeViewGroup
        v-for="group in groups"
        :key="group.id"
        :id="group.id"
        :name="group.name"
        :color="group.color"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <TreeViewItem
          v-for="(item, key) in data"
          :key="key"
          :label="key"
          :value="item"
        />
      </TreeViewGroup>
    </draggable>
  `
};
