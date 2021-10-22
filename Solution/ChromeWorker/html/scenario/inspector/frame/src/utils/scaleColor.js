function scaleColor(color, size = 6) {
  const scale = _.compose(color2K.parseToRgba, color2K.getScale('#ff0000', color));
  return _.range(size).map(n => `rgb(${scale(n / (size - 1)).slice(0, -1).join(', ')})`);
}
