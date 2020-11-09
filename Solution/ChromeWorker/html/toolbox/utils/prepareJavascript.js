function prepareBrowserJavascript(source) {
  const variables = [...source.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => {
    const result = match[0].trim()
      .replace(/\[/g, '')
      .replace(/\]/g, '')

    source = source.replace(match[0], `;_BAS_HIDE(AsyncJsResult).vars['${result}']`); return result;
  });

  const vars = variables.map((name) => `"${name}": typeof(VAR_${name}) !== "undefined" ? VAR_${name} : null`);
  let args = `{${vars.join(',')}}`;
  args = `JSON.stringify(${args})`;
  args = `JSON.stringify(${args})`;
  args = `\"(\" + ${args} + \")\"`;

  return {
    variables, source: JSON.stringify(
      `((_BAS_VARS) => {  
        _BAS_HIDE(AsyncJsResult) = {
          vars: JSON.parse(_BAS_VARS),
          error: null,
          done: null,
        };

        (async function () {
          try { 
            ${source}
          } catch (err) {
            if (err instanceof Error) {
              _BAS_HIDE(AsyncJsResult).error = err.message;
            } else {
              _BAS_HIDE(AsyncJsResult).error = err;
            }
          }

          _BAS_HIDE(AsyncJsResult).done = true;
        })();

        return JSON.stringify(_BAS_HIDE(AsyncJsResult));
      })`)
      .replace(/\s\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .concat(' + ')
      .concat(args)
  };
}