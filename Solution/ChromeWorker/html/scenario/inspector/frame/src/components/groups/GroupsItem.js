'use strict';

window.GroupsItem = {
  name: 'GroupsItem',

  props: {
    allowRemove: {
      type: Boolean,
      default: false,
    },

    allowEdit: {
      type: Boolean,
      default: false,
    },

    isExpanded: {
      type: Boolean,
      default: false,
    },

    color: {
      type: String,
      required: true,
    },

    items: {
      type: Array,
      required: true,
    },

    name: {
      type: String,
      required: true,
    },
  },

  data() {
    return {
      colors: {
        green: '142, 196, 143',
        brown: '192, 189, 155',
        blue: '154, 203, 230',
        gray: '207, 207, 207',
        red: '246, 155, 147',
      },
      isEditing: false,
      newName: this.name,
      newColor: this.color,
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
    onMove({ to, from, relatedContext, draggedContext, willInsertAfter }) {
      const related = relatedContext.element;
      const dragged = draggedContext.element;

      if (related && !(dragged.fixed && related.fixed)) {
        if (to !== from) {
          if (related.fixed || dragged.fixed) {
            return (
              relatedContext.index === (related.fixed ? relatedContext.list.length - 1 : 0) &&
              willInsertAfter === related.fixed
            );
          }
          return true;
        }
        return draggedContext.index === draggedContext.futureIndex && -1;
      }
    },

    onAdd({ newIndex }) {
      if (!this.items[newIndex].fixed) {
        this.$emit('item-added');
      }
    },

    update(cancel) {
      if (!this.isEditing) return;

      if (!cancel && this.newName) {
        this.$emit('update', {
          color: this.newColor,
          name: this.newName,
        });
      } else {
        this.newColor = this.color;
        this.newName = this.name;
      }

      this.isEditing = false;
    },

    toggle(event) {
      if (this.isEditing) return;
      this.$emit('update:is-expanded', !this.isExpanded);
    },

    remove() {
      this.$confirm(this.$t('groups.confirm', { name: this.name }), result => {
        if (result) this.$emit('remove');
      });
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

  template: /*html*/ `
    <li class="group-item" :style="style">
      <div class="group-item-header" @click="toggle">
        <svg width="14" height="14" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 3.5v-2H0v12H16v-10H6Z" fill="#606060" stroke="#606060" />
        </svg>
        <div class="group-item-inputs" v-click-outside="accept">
          <input v-if="isEditing" ref="input" v-model.trim="newName" maxlength="30" spellcheck="false" type="text" @keydown.enter="accept" @keydown.esc="cancel">
          <span v-else>{{ name }}</span>
          <div class="group-item-controls" @click.stop>
            <template v-if="isEditing">
              <ul class="group-item-swatches">
                <li v-for="(value, key) in colors" :key="key" :style="{ borderColor: newColor === key ? 'rgb(' + value + ')' : 'transparent' }" class="group-item-swatch" @click="newColor = key">
                  <svg width="12" height="12" viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="6" cy="6" r="6" :fill="'rgb(' + value + ')'" />
                  </svg>
                </li>
              </ul>
              <button type="button" @click="accept">
                <svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg">
                  <path d="m6.25 10.6002-3.55-3.55-.7.7 3.55 3.55.7.7 7.05-7.05-.7-.75-6.35 6.4Z" fill="#606060" />
                </svg>
              </button>
            </template>
            <template v-else>
              <button v-if="allowRemove" type="button" @click="remove">
                <icon-delete />
              </button>
              <button v-if="allowEdit" type="button" @click="edit">
                <icon-edit />
              </button>
              <button type="button" @click="$emit('update:is-expanded', !isExpanded)">
                <icon-chevron :style="{ transform: isExpanded ? '' : 'rotate(180deg)' }" />
              </button>
            </template>
          </div>
        </div>
      </div>
      <draggable v-show="isExpanded" :style="{ '--title': JSON.stringify($t('groups.title')) }" class="group-item-content" handle=".jt-node-label" filter="button" group="items" :list="items" :move="onMove" @add="onAdd">
        <slot></slot>
      </draggable>
    </li>
  `,
};
