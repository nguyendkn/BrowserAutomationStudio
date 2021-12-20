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
        color: 'brown',
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

  watch: {
    source(source) {
      const keys = Object.keys(source);

      this.groups.slice(1).forEach(group => {
        group.items = keys.slice().filter((key, idx) => {
          if (group.items.includes(key)) {
            keys.splice(idx, 1);
            return true;
          }
          return false;
        });
      });

      this.groups[0].items = keys;
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
        color: 'brown',
        primary: false,
        items: [],
      });
    },

    has(obj, key) {
      return Object.prototype.hasOwnProperty.call(obj, key);
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
        :name="group.name"
        :color="group.color"
        :items="group.items"
        :primary="group.primary"
        @remove="removeGroup(group.id, $event)"
        @update="updateGroup(group.id, $event)"
      >
        <template v-for="key in group.items">
          <json-tree-node
            v-if="has(source, key)"
            :key="key"
            :name="key"
            :path="[key]"
            :value="source[key]"
          >
            <template #label="{ label }">
              <button type="button" style="margin: 0 8px; height: 16px; line-height: 16px;">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" style="vertical-align: sub;">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M3.99984 5.1665C3.24839 5.1665 2.52772 5.46501 1.99637 5.99637C1.46501 6.52772 1.1665 7.24839 1.1665 7.99984C1.1665 8.75128 1.46501 9.47195 1.99637 10.0033C2.25947 10.2664 2.57181 10.4751 2.91557 10.6175C3.25932 10.7599 3.62776 10.8332 3.99984 10.8332H6.49984V11.8332H3.99984C3.49644 11.8332 2.99797 11.734 2.53288 11.5414C2.0678 11.3487 1.64522 11.0664 1.28926 10.7104C0.570372 9.99152 0.166504 9.0165 0.166504 7.99984C0.166504 6.98317 0.570372 6.00815 1.28926 5.28926C2.00815 4.57037 2.98317 4.1665 3.99984 4.1665H6.49984V5.1665H3.99984ZM9.49984 4.1665H11.9998C12.5032 4.1665 13.0017 4.26566 13.4668 4.4583C13.9319 4.65094 14.3545 4.9333 14.7104 5.28926C15.0664 5.64522 15.3487 6.0678 15.5414 6.53288C15.734 6.99797 15.8332 7.49644 15.8332 7.99984C15.8332 8.50324 15.734 9.00171 15.5414 9.46679C15.3487 9.93187 15.0664 10.3545 14.7104 10.7104C14.3545 11.0664 13.9319 11.3487 13.4668 11.5414C13.0017 11.734 12.5032 11.8332 11.9998 11.8332H9.49984V10.8332H11.9998C12.3719 10.8332 12.7404 10.7599 13.0841 10.6175C13.4279 10.4751 13.7402 10.2664 14.0033 10.0033C14.2664 9.74021 14.4751 9.42786 14.6175 9.08411C14.7599 8.74035 14.8332 8.37192 14.8332 7.99984C14.8332 7.62776 14.7599 7.25932 14.6175 6.91557C14.4751 6.57181 14.2664 6.25947 14.0033 5.99637C13.7402 5.73327 13.4279 5.52457 13.0841 5.38218C12.7404 5.23979 12.3719 5.1665 11.9998 5.1665H9.49984V4.1665Z" fill="#606060" />
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M4.83317 7.49984H11.1665V8.49984H4.83317V7.49984Z" fill="#606060" />
                </svg>
              </button>
              <span>{{ label }}</span>
            </template>
          </json-tree-node>
        </template>
      </groups-item>
    </draggable>
  `,
};
