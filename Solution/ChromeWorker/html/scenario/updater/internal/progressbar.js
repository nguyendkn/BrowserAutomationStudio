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

    step(value, animate = true) {
      const max = this.max;
      const min = this.min;
      if (!this.current) this.current = min;
      if (value == null) value = this.current + 1;

      if (value >= min && value <= max) {
        const percent = Math.round((value / max) * this.$element.outerWidth());
        this.$inner.animate({ width: `${percent}px` }, {
          duration: animate ? 200 : 0,
          easing: 'swing',
          queue: false
        });
        this.$label.text(`${value} / ${max}`);
        this.current = value;
      }
    }

    finish(animate = false) {
      this.step(this.max, animate);
    }

    reset(animate = false) {
      this.step(this.min, animate);
    }

    get max() {
      const max = this.$element.data('max');
      return max != null ? max : 100;
    }

    get min() {
      const min = this.$element.data('min');
      return min != null ? min : 0;
    }
  };

  $.fn.progressBar = function (option, ...args) {
    return this.each(function () {
      const $element = $(this); let data = $element.data('progress');

      if (!data) {
        $element.data('progress', (data = new ProgressBar(this, _.extend({}, option))));
      }

      if (typeof (option) === 'string' && data[option]) {
        if (args.length) {
          data[option].apply(data, args);
        } else {
          data[option].apply(data, []);
        }
      }
    })
  };

  $.fn.progressBar.Constructor = ProgressBar;
})(jQuery);