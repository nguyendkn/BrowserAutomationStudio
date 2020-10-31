function prepareBrowserJavascript(source) {
  const variables = [...source.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => {
    const result = match[0].trim()
      .replace(/\[/g, '')
      .replace(/\]/g, '')

    source = source.replace(match[0], `_BAS_VARS['${result}']`); return result;
  });

  let args = `{${variables.map((name) => `"${name}": VAR_${name}`).join(',')}}`;
  args = `JSON.stringify(${args})`;
  args = `JSON.stringify(${args})`;
  args = `\"(\" + ${args} + \")\"`;

  return {
    variables, source: JSON.stringify(
      `((_BAS_DATA) => {  
        const _BAS_VARS = JSON.parse(_BAS_DATA); let _BAS_ERROR = null;
        _BAS_HIDE(AsyncJsResult) = {
          error: _BAS_ERROR,
          vars: _BAS_VARS,
          done: false
        };

        (new Promise(async (resolve) => {
          try { 
            ${source}
          } catch (err) {
            _BAS_ERROR = err.message;
          }

          resolve();
        }).then(() => {
          _BAS_HIDE(AsyncJsResult).error = _BAS_ERROR;
          _BAS_HIDE(AsyncJsResult).vars = _BAS_VARS;
          _BAS_HIDE(AsyncJsResult).done = true;
        }));
      })`)
      .replace(/\s\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .concat(' + ')
      .concat(args)
  };
}