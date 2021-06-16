(function (global, $) {
  _.mixin({
    rgbGradientToRed: function (rgb, size = 5) {
      if (typeof (rgb) === 'string') {
        rgb = rgb.replace(/[^\d,]/g, '').split(',').map((d) => parseInt(d));;
      }
      const result = [255, 0, 0].map((el, q) => {
        const count = parseInt((el - rgb[q]) / size);
        return _.range(size).map((i) => rgb[q] + (count * i)).concat(el);
      });
      return _.range(size + 1).map((i) => {
        return `rgb(${result[0][i]},${result[1][i]},${result[2][i]})`
      }).reverse();
    }
  })
})(window, jQuery);