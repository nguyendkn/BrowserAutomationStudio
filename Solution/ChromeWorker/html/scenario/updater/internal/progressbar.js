(function ($) {
  function ProgressBar(element, options) {
    this.$element = $(element);

    this.options = _.extend({
      maxValue: this.$element.data('maxValue') || 100,
      minValue: this.$element.data('minValue') || 0,
      step: this.$element.data('step') || 1,
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

  ProgressBar.prototype.step = function (val) {
    if (!val) val = this.current + this.options.step;
    const min = this.options.minValue;
    const max = this.options.maxValue;

    if (val >= min && val <= max) {
      this.$label.text(`${this.current} / ${max}`);
      this.$inner.animate({
        width: `${Math.round((max / 100) * this.current)}%`
      }, 100);

      this.current = val;
    }
  };

  ProgressBar.prototype.setMaxValue = function (value) {
    this.options.maxValue = value;
  };

  ProgressBar.prototype.setMinValue = function (value) {
    this.options.minValue = value;
  };

  ProgressBar.prototype.setStep = function (value) {
    this.options.step = value;
  };

  ProgressBar.prototype.reset = function () {
    this.$inner.css('width', 0);
    this.$label.text('');
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