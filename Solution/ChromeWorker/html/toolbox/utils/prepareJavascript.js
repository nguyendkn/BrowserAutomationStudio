function prepareBrowserJavascript(source) {
  const variables = [...source.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => {
    const result = match[0].trim()
      .replace(/\[/g, '')
      .replace(/\]/g, '')

    source = source.replace(match[0], `_BAS_HIDE(AsyncJsResult).vars['${result}']`); return result;
  });

  let args = `{${variables.map((name) => `"${name}": VAR_${name}`).join(',')}}`;
  args = `JSON.stringify(${args})`;
  args = `JSON.stringify(${args})`;
  args = `\"(\" + ${args} + \")\"`;

  return {
    variables, source: JSON.stringify(
      `((_BAS_DATA) => {  
        _BAS_HIDE(AsyncJsResult) = {
          vars: JSON.parse(_BAS_DATA),
          error: null,
          done: null,
        };

        (new Promise(async (resolve) => {
          try { 
            ${source}
          } catch (err) {
            _BAS_HIDE(AsyncJsResult).error = err.message;
          }

          resolve();
        }).then(() => {
          _BAS_HIDE(AsyncJsResult).done = true;
        }));

        return _BAS_HIDE(AsyncJsResult).done;
      })`)
      .replace(/\s\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .concat(' + ')
      .concat(args)
  };
}