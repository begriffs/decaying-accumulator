if (typeof define !== 'function') {
  /*jshint latedef:false */
  var define = require('amdefine')(module);
}

define(function () {
  function DecayingAccumulator(decaySpeed) {
    this.maxValueSeen = 0;
    this.val          = 0;
    this.decaySpeed   = decaySpeed;
  }

  DecayingAccumulator.prototype.applyDecay = function () {
    var now = (new Date()).getTime();
    if(typeof this.lastAltered === 'number') {
      var dampen =
        Math.abs(this.maxValueSeen) *
        Math.min(1, (now - this.lastAltered) / this.decaySpeed);
      this.val += (this.val > 0) ? -dampen : dampen;
    }
    this.lastAltered = now;
  };

  DecayingAccumulator.prototype.currentValue = function () {
    this.applyDecay();
    return this.val / (this.maxValueSeen || 1);
  };

  DecayingAccumulator.prototype.nudge = function (value) {
    this.applyDecay();
    this.val += value;
    this.maxValueSeen = Math.max(this.maxValueSeen, Math.abs(this.val));
  };

  return DecayingAccumulator;
});
