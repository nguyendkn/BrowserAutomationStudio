function prepareBrowserJavascript(source) {
  const variables = [...source.matchAll(/\[\[([^\]]+)\]\]/g)].map((match) => {
    const result = match[0].trim()
      .replace(/\[/g, "")
      .replace(/\]/g, "")

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
        ${source} 
        return JSON.stringify(_BAS_VARS); 
      })`)
      .replace(/\s\s+/g, ' ')
      .replace(/\n/g, '')
      .replace(/\r/g, '')
      .concat(` + `)
      .concat(args),
    javascriptResult: variables.map((name) => `VAR_${name} = result['${name}'];`).join('\n')
  };
}