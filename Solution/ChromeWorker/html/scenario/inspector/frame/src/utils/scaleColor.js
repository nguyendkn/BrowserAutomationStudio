function scaleColor(color, size = 6) {
  const scale = _.compose(color2K.parseToRgba, color2K.getScale('#ff0000', color));
  return _.range(size).map(n => `rgb(${scale(n / (size - 1)).slice(0, -1).join(', ')})`);
}

// colors: {
//   undefined: scaleColor('#8546bc'),
//   boolean: scaleColor('#2525cc'),
//   number: scaleColor('#d036d0'),
//   string: scaleColor('#2db669'),
//   date: scaleColor('#ce904a'),
//   null: scaleColor('#808080'),
// }