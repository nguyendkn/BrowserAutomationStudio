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
    javascriptSource: JSON.stringify(
      `((_BAS_DATA) => {  
        const _BAS_VARS = JSON.parse(_BAS_DATA);
        let _BAS_WAS_ERROR = false;
        let _BAS_LAST_ERROR = '';

        try { 
          ${source} 
        } catch (err) {
          _BAS_LAST_ERROR = err.message;
          _BAS_WAS_ERROR = true;
        }

        return JSON.stringify({
          lastError: _BAS_LAST_ERROR,
          wasError: _BAS_WAS_ERROR,
          vars: _BAS_VARS,
        }); 
      })`)
      .replace(/\s\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .concat(' + ')
      .concat(args),
    javascriptResult: variables.map((name) => `VAR_${name} = result["vars"]["${name}"];`).join('\n')
  };
}