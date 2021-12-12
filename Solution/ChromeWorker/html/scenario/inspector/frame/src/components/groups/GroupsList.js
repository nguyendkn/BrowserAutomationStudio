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
        :id="group.id"
        :name="group.name"
        :color="group.color"
        :items="group.items"
        :primary="group.primary"
        @remove="removeGroup"
        @update="updateGroup"
      >
        <draggable v-model="group.items" group="items">
          <template v-for="key in group.items">
            <json-tree-node
              v-if="has(source, key)"
              :key="key"
              :name="key"
              :path="[key]"
              :value="source[key]"
            >
              <template #label="{ label }">
                <button type="button">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5001 5.22034c-.73142 0-1.43289.29286-1.95009.81414-.5172.52129-.80775 1.22831-.80775 1.96552 0 .73721.29055 1.44423.80775 1.96552.25609.25808.56011.46288.89471.60258s.69322.2116 1.05538.2116h2.62332V12H4.5001c-.52116 0-1.03722-.1035-1.51872-.3045-.48149-.201-.91899-.4956-1.28751-.8671C.949614 10.0783.531494 9.06087.531494 8c0-1.06087.41812-2.07828 1.162376-2.82843C2.43813 4.42143 3.44756 4 4.5001 4h2.62332v1.22034H4.5001ZM8.93957 4h2.62333c.5212 0 1.0372.10346 1.5187.30448.4815.20102.919.49566 1.2875.86709.3685.37144.6609.81239.8603 1.2977.1994.4853.3021 1.00544.3021 1.53073s-.1027 1.04543-.3021 1.53073c-.1994.48527-.4918.92627-.8603 1.29767-.3685.3715-.806.6661-1.2875.8671-.4815.201-.9976.3045-1.5187.3045H8.93957v-1.2203h2.62333c.3622 0 .7208-.0719 1.0554-.2116.3346-.1397.6386-.3445.8947-.60258.2561-.25812.4592-.56455.5978-.90179s.2099-.6987.2099-1.06373c0-.36503-.0713-.72649-.2099-1.06373-.1386-.33724-.3417-.64367-.5978-.90179-.2561-.25811-.5601-.46286-.8947-.60255-.3346-.13969-.6932-.21159-1.0554-.21159H8.93957V4Z" fill="#606060" />
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M4.56745 7.38987h6.59195v1.22034H4.56745V7.38987Z" fill="#606060" />
                  </svg>
                </button>
                {{ label }}
              </template>
            </json-tree-node>
          </template>
        </draggable>
      </groups-item>
    </draggable>
  `,
};
