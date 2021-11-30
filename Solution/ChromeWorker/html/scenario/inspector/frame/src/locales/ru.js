'use strict';

(window.locales || (window.locales = {})).ru = {
  toolbar: {
    placeholder: 'Поиск по имени',
    sortings: {
      frequency: 'По частоте использования',
      dateModified: 'По дате изменения',
      dateCreated: 'По дате создания',
      alphabetically: 'По алфавиту',
    },
    filters: {
      // Variables/resources
      undefined: 'Undefined',
      boolean: 'Булево',
      object: 'Объект',
      string: 'Строка',
      number: 'Число',
      array: 'Массив',
      date: 'Дата',
      null: 'Null',
      // Call stack
      functions: 'Функции',
      actions: 'Действия',
    },
  },
  tabs: {
    variables: 'Переменные',
    variablesEmpty: 'Список переменных пуст',
    resources: 'Ресурсы',
    resourcesEmpty: 'Список ресурсов пуст',
    callstack: 'Стек вызовов',
    callstackEmpty: 'Стек вызовов пуст',
  },
  items: '{n} элементов | {n} элемент | {n} элемента | {n} элементов',
};
