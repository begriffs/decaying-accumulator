if (typeof define !== 'function') {
  /*jshint latedef:false */
  var define = require('amdefine')(module);
}

define(function () {
  function DecayingAccumulator(opts) {
    opts = opts || {};
    this.currentScale = opts.currentScale || 0;
    this.val          = opts.val || 0;
    this.decaySpeed   = opts.decaySpeed || 1000;
  }

  DecayingAccumulator.prototype.applyDecay = function () {
    var now = (new Date()).getTime();
    if(typeof this.lastAltered === 'number') {
      var dampen =
        Math.min(Math.abs(this.val),
          this.currentScale *
            Math.min(1, (now - this.lastAltered) / this.decaySpeed)
        );
      this.val += (this.val > 0) ? -dampen : dampen;
    }
    this.lastAltered = now;
  };

  DecayingAccumulator.prototype.currentValue = function () {
    this.applyDecay();
    return this.val / (this.currentScale || 1);
  };

  DecayingAccumulator.prototype.nudge = function (value) {
    this.applyDecay();
    this.val += value;
    this.currentScale = Math.max(this.currentScale, Math.abs(this.val));
  };

  return DecayingAccumulator;
});
