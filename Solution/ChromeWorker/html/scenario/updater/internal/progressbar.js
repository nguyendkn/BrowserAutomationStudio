(function ($) {
  class ProgressBar {
    constructor (element) {
      this.$element = $(element);

      this.$inner = $('<div>', {
        'class': 'progress-inner'
      }).appendTo(this.$element);

      this.$label = $('<div>', {
        'class': 'progress-label'
      }).appendTo(this.$element);

      this.reset();
    }

    step(value) {
      const max = this.max;
      const min = this.min;
      if (!this.current) this.current = min;
      if (value == null) value = this.current + 1;

      if (value >= min && value <= max) {
        this.$label.text(`${value} / ${max}`);
        this.$inner.animate({
          width: `${Math.round((value * 100) / max)}%`
        }, 100);

        this.current = value;
      }
    }

    get max() {
      const max = this.$element.data('max');
      return max != null ? max : 100;
    }

    get min() {
      const min = this.$element.data('min');
      return min != null ? min : 0;
    }

    finish() {
      this.step(this.max);
    }

    reset() {
      this.step(this.min);
    }
  };

  $.fn.progressBar = function (option, ...args) {
    return this.each(function () {
      const $element = $(this); let data = $element.data('bs.progress');

      if (!data && typeof (option) === 'object') {
        $element.data('bs.progress', (data = new ProgressBar(this, option)));
      }

      if (typeof (option) === 'string') data[option](args[0]);
    })
  };

  $.fn.progressBar.Constructor = ProgressBar;
})(jQuery);