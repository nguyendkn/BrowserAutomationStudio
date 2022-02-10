'use strict';

(window.locales || (window.locales = {})).ru = {
  tabs: {
    variables: 'Переменные',
    resources: 'Ресурсы',
    callstack: 'Стек',
    variablesEmpty: 'Список переменных пуст',
    resourcesEmpty: 'Список ресурсов пуст',
    callstackEmpty: 'Стек вызовов пуст',
  },
  buttons: {
    search: 'Поиск',
    group: 'Создать группу',
    menu: 'Фильтры и сортировка',
  },
  menu: {
    sortings: {
      frequency: 'По частоте использования',
      dateModified: 'По дате изменения',
      dateCreated: 'По дате создания',
      alphabetically: 'По алфавиту',
    },
    filters: {
      undefined: 'Undefined',
      boolean: 'Булево',
      object: 'Объект',
      string: 'Строка',
      number: 'Число',
      array: 'Массив',
      date: 'Дата',
      null: 'Null',
      functions: 'Функции',
      actions: 'Действия',
    },
    options: {
      groups: 'Группы',
    },
  },
  search: {
    placeholder: 'Поиск по имени...',
  },
  groups: {
    title: 'Эта группа пуста. Вы можете перетащить элементы сюда',
    confirm: 'Вы действительно хотите удалить группу "{name}"?',
  },
  params: '{n} параметров | {n} параметр | {n} параметра | {n} параметров',
  items: '{n} элементов | {n} элемент | {n} элемента | {n} элементов',
};
