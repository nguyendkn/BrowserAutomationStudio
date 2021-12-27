'use strict';

window.JsonTreeNode = {
  name: 'JsonTreeNode',

  props: {
    value: {
      required: true,
    },

    name: {
      required: true,
      type: String,
    },

    path: {
      required: true,
      type: Array,
    },
  },

  data() {
    const colors = {
      undefined: '#808080',
      boolean: '#2525cc',
      string: '#2db669',
      number: '#d036d0',
      date: '#ce904a',
      null: '#8546bc',
    };

    return { colors, isExpanded: false };
  },

  computed: {
    keys() {
      const { value } = this;
      return value ? Object.keys(value) : [];
    },

    color() {
      return this.colors[this.type];
    },

    type() {
      return getType(this.value);
    },

    size() {
      return this.keys.length;
    },
  },

  methods: {
    toggle() {
      this.isExpanded = !this.isExpanded;
    },

    edit() {
      const message = {
        payload: {
          value: this.value,
          type: this.type,
          path: this.path,
          mode: this.$root.$children[0].tab.name.slice(0, -1), // TODO: use normal mode detection!
        },
        type: 'edit',
      };
      window.top.postMessage(message, '*');
    },

    formatDate(date) {
      return dayjs(date).format('YYYY-MM-DD HH:mm:ss [UTC]Z');
    },
  },

  template: `
    <div class="jt-node">
      <span class="jt-node-label"><slot name="label" :label="name">{{ name }}</slot><span>:&nbsp;</span></span>
      <span :style="{ color }" class="jt-node-value">
        <template v-if="type === 'undefined' || type === 'null'">{{ String(value) }}</template>
        <template v-else-if="type === 'string'">"{{ value }}"</template>
        <template v-else-if="type === 'object'">
          <span class="jt-node-bracket">{</span>
          <json-tree-node
            v-for="key in keys"
            v-show="isExpanded"
            :key="key"
            :value="value[key]"
            :name="key"
            :path="path.concat(key)"
          />
          <span v-show="!isExpanded" style="color: rgba(96, 96, 96, 0.65);">{{ $tc('items', size) }}</span>
          <span class="jt-node-bracket">}</span>
        </template>
        <template v-else-if="type === 'array'">
          <span class="jt-node-bracket">[</span>
          <json-tree-node
            v-for="key in keys"
            v-show="isExpanded"
            :key="key"
            :value="value[key]"
            :name="key"
            :path="path.concat(key)"
          />
          <span v-show="!isExpanded" style="color: rgba(96, 96, 96, 0.65);">{{ $tc('items', size) }}</span>
          <span class="jt-node-bracket">]</span>
        </template>
        <template v-else-if="type === 'date'">{{ formatDate(value) }}</template>
        <template v-else>{{ value }}</template>
      </span>
      <div class="jt-node-actions">
        <button type="button" @click="edit">
          <icon-edit />
        </button>
        <button v-if="(type === 'object' || type === 'array') && size" type="button" @click="toggle">
          <icon-chevron :style="{ transform: isExpanded ? '' : 'rotate(180deg)' }" />
        </button>
      </div>
    </div>
  `,
};
