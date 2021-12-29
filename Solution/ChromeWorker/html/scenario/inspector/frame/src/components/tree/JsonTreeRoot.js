'use strict';

window.JsonTreeRoot = {
  name: 'JsonTreeRoot',

  components: {
    JsonTreeNode,
  },

  props: {
    data: {
      required: true,
    },

    name: {
      required: true,
    },
  },

  template: `
    <div class="jt-root">
      <json-tree-node :name="name" :path="[name]" :value="data">
        <template #label="{ label }">
          <slot name="label" :label="name">{{ name }}</slot>
        </template>
      </json-tree-node>
    </div>
  `,
};
