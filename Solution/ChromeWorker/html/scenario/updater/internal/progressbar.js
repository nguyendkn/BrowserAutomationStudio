(function ($) {
  function ProgressBar(element, options) {
    this.$element = $(element);

    this.options = _.extend({
      max: this.$element.data('max') || 100,
      min: this.$element.data('min') || 0,
      labelClass: 'progress-label',
      innerClass: 'progress-inner'
    }, options);

    this.$inner = $('<div>', {
      'class': this.options.innerClass
    }).appendTo(this.$element);

    this.$label = $('<div>', {
      'class': this.options.labelClass
    }).appendTo(this.$element);

    this.reset();
  };

  ProgressBar.prototype.setMax = function (value) {
    this.options.max = value;
  };

  ProgressBar.prototype.setMin = function (value) {
    this.options.min = value;
  };

  ProgressBar.prototype.step = function (val) {
    if (!val) val = this.current + 1;
    const min = this.options.min;
    const max = this.options.max;

    if (val >= min && val <= max) {
      this.$label.text(`${this.current} / ${max}`);
      this.$inner.animate({
        width: `${Math.round((max / 100) * this.current)}%`
      }, 100);

      this.current = val;
    }
  };

  ProgressBar.prototype.reset = function () {
    this.$label.text(`0 / ${this.options.max}`);
    this.$inner.width('0%');
    this.current = 0;
  };

  $.fn.progressBar = function (option, ...args) {
    return this.each(function () {
      const $element = $(this); let data = $element.data('bs.progress');

      if (!data && typeof (option) === 'object') {
        $element.data('bs.progress', (data = new ProgressBar(this, option)));
      }

      if (typeof (option) === 'string') data[option].call(data, args);
    })
  };

  $.fn.progressBar.Constructor = ProgressBar;
})(jQuery);