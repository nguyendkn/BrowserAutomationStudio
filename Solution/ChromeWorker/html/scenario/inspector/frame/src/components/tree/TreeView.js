'use strict';

window.TreeView = {
  name: 'TreeView',

  components: {
    draggable: window['vuedraggable'],
    GroupItem,
    TreeViewItem
  },

  props: {
    filters: {
      required: true,
      type: Array
    },

    query: {
      required: true,
      type: String
    },

    data: {
      required: true,
      type: Object
    }
  },

  data() {
    const main = {
      id: uniqueId(),
      name: 'Main',
      color: '#c0bd9b',
      primary: true
    };

    return { groups: [main] };
  },

  computed: {
    draggableDisabled() {
      return this.groups.length === 1;
    }
  },

  methods: {
    updateGroup(id, data) {
      const index = this.getGroupIndex(id);
      Object.assign(this.groups[index], data);
    },

    removeGroup(id, data) {
      const index = this.getGroupIndex(id);
      this.groups.splice(index, 1);
    },

    getGroupIndex(id) {
      return this.groups.findIndex(group => {
        return group.id === id;
      });
    },

    addGroup() {
      this.groups.push({
        id: uniqueId(),
        name: 'Group',
        color: '#c0bd9b',
        primary: false
      });
    },

    isVisible(val, key) {
      const type = Object.prototype.toString.call(val).slice(8, -1).toLowerCase();
      const query = this.query.toLowerCase();
      return this.filters.some(f => f.includes(type)) && key.toLowerCase().includes(query);
    }
  },

  template: /*html*/`
    <draggable
      handle=".tree-view-group-header"
      :disabled="draggableDisabled"
      class="tree-view"
      :list="groups"
      tag="ul"
    >
      <tree-view-group
        v-for="group in groups"
        :key="group.id"
        :id="group.id"
        :name="group.name"
        :color="group.color"
        :primary="group.primary"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <tree-view-item
          v-for="(val, key) in data"
          v-show="isVisible(val, key)"
          :key="key"
          :label="key"
          :value="val"
        />
      </tree-view-group>
    </draggable>
  `
};
