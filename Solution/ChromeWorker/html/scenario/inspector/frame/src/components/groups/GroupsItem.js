'use strict';

window.GroupsItem = {
  name: 'GroupsItem',

  props: {
    primary: {
      required: true,
      type: Boolean,
    },

    color: {
      required: true,
      type: String,
    },

    items: {
      required: true,
      type: Array,
    },

    name: {
      required: true,
      type: String,
    },

    id: {
      required: true,
      type: String,
    },
  },

  data() {
    return {
      newColor: this.color,
      newName: this.name,
      isExpanded: false,
      isEditing: false,
      colors: {
        gray: '209, 209, 209',
        brown: '192, 189, 155',
        blue: '154, 203, 230',
        green: '142, 196, 143',
        red: '246, 155, 147',
      },
    };
  },

  computed: {
    style() {
      return {
        '--color-rgb': this.colors[this.newColor],
      };
    },
  },

  methods: {
    update(cancel) {
      this.$emit('update', this.id, {
        color: cancel ? (this.newColor = this.color) : this.newColor,
        name: cancel ? (this.newName = this.name) : this.newName,
      });
      this.isEditing = false;
    },

    remove() {
      this.$emit('remove', this.id);
    },

    accept() {
      this.update(false);
    },

    cancel() {
      this.update(true);
    },

    edit() {
      this.isEditing = true;
      this.$nextTick(() => {
        this.$refs.input.focus();
      });
    },
  },

  template: html`
    <li class="group-item" :style="style">
      <div class="group-item-header">
        <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3.5v-2H0v12H16v-10H6Z" fill="#606060" stroke="#606060" />
        </svg>
        <input ref="input" v-model="newName" :disabled="!isEditing" maxlength="30" spellcheck="false" type="text" @keydown.enter="accept" @keydown.esc="cancel">
        <div v-if="isEditing" class="group-item-controls">
          <ul class="group-item-swatches">
            <li v-for="(value, key) in colors" class="group-item-swatch" :style="{ borderColor: newColor === key ? 'rgb(' + value + ')' : 'transparent' }" @click="newColor = key">
              <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style="display: block;">
                <circle cx="6" cy="6" r="6" :fill="'rgb(' + value + ')'" />
              </svg>
            </li>
          </ul>
          <button type="button" style="background: #fff; padding: 4px;" @click="accept">
            <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
              <path d="m6.25 10.6002-3.55-3.55-.7.7 3.55 3.55.7.7 7.05-7.05-.7-.75-6.35 6.4Z" fill="#606060" />
            </svg>
          </button>
        </div>
        <div v-else class="group-item-controls">
          <template v-if="!primary">
            <button type="button" @click="remove">
              <icon-delete />
            </button>
            <button type="button" @click="edit">
              <icon-edit />
            </button>
          </template>
          <button type="button" @click="isExpanded = !isExpanded">
            <icon-chevron :style="{ transform: isExpanded ? 'rotate(180deg)' : '' }" />
          </button>
        </div>
      </div>
      <draggable v-show="!isExpanded" class="group-item-content" :list="items" group="items" :disabled="true">
        <slot v-if="items.length"></slot>
        <template v-else slot="header">
          <div class="group-item-title" v-t="'groups.empty'"></div>
        </template>
      </draggable>
    </li>
  `,
};
