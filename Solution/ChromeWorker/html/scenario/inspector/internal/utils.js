function rgb(r, g, b) {
  var rgb = [r, g, b];
  var result = [];
  [255, 0, 0].forEach(function (el, q) {
    var count = parseInt((el - rgb[q]) / 5);
    var arr = [];
    for (var i = 0; i < 5; i++) {
      arr.push(rgb[q] + (count * i));
    };
    arr.push(el);
    result.push(arr);
  });
  var res = [];
  for (var i = 0; i < 6; i++) {
    res.push("rgb(" + result[0][i] + "," + result[1][i] + "," + result[2][i] + ")");
  }
  return res.join("\n");
}