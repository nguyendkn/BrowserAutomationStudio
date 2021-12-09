'use strict';

window.GroupsList = {
  name: 'GroupsList',

  components: {
    GroupsItem,
    JsonTreeNode,
  },

  props: {
    source: {
      required: true,
      type: Object,
    },
  },

  data() {
    const groups = [
      {
        id: uniqueId(),
        name: 'Main',
        color: '#c0bd9b',
        primary: true,
        items: Object.keys(this.source),
      },
    ];

    return { groups };
  },

  computed: {
    draggableDisabled() {
      return true;
      // return this.groups.length === 1;
    },
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
      return this.groups.findIndex(group => group.id === id);
    },

    addGroup() {
      this.groups.push({
        id: uniqueId(),
        name: 'Group',
        color: '#c0bd9b',
        primary: false,
        items: [],
      });
    },
  },

  template: html`
    <draggable
      handle=".group-item-header"
      :disabled="draggableDisabled"
      class="group-list"
      :list="groups"
      tag="ul"
    >
      <groups-item
        v-for="group in groups"
        :key="group.id"
        :id="group.id"
        :name="group.name"
        :color="group.color"
        :items="group.items"
        :primary="group.primary"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <json-tree-node
          v-for="key in group.items"
          :key="key"
          :name="key"
          :path="[key]"
          :value="source[key]"
        >
          <template #label="{ name }">{{ name }}</template>
        </json-tree-node>
      </groups-item>
    </draggable>
  `,
};
