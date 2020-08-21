class BasVariablesDialog extends BasModalDialog {
  constructor () {
    const globalVariablesCollection = _GlobalVariableCollection.toJSON();
    const variablesCollection = _VariableCollection.toJSON();

    super({
      itemType: 'variable',
      itemColor: 'green',
      items: [
        ...globalVariablesCollection.map(v => v.name),
        ...variablesCollection.map(v => v.name),
      ]
    });
  }
}