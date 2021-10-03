window.Toolbar = {
  name: 'Toolbar',

  props: {
    filters: {
      required: true,
      type: Array
    },
    sortings: {
      required: true,
      type: Array
    }
  },

  data: () => ({
    selectedFilters: [],
    selectedSorting: '',
    query: '',
  }),

  template: html`
    <div class="inspector-tools-panel">
      <input v-model="query" type="search" class="inspector-tools-input" :placeholder="{{ $t('toolbar.placeholder') + '...' }}">
      <div class="dropdown">
        <button data-toggle="dropdown" type="button" aria-expanded="false" aria-haspopup="true">
          <i class="fa fa-filter"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-right inspector-tools-menu">
          <li data-sorting="alphabetically">
            <a href="#">{{ $t('toolbar.sorting.alphabetically') }}</a>
          </li>
          <li data-sorting="frequency">
            <a href="#">{{ $t('toolbar.sorting.frequency') }}</a>
          </li>
          <li data-sorting="dateModified">
            <a href="#">{{ $t('toolbar.sorting.dateModified') }}</a>
          </li>
          <li data-sorting="dateCreated">
            <a href="#">{{ $t('toolbar.sorting.dateCreated') }}</a>
          </li>
        </ul>
      </div>
    </div>
    <button class="inspector-tools-toggle" type="button">
      <i class="fa fa-chevron-up"></i>
    </button>
  `
}