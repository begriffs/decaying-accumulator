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
    if(typeof this.lastNudgedAt === 'number') {
      var dampen = Math.min(
        Math.abs(this.val),
        (now - this.lastNudgedAt) / this.decaySpeed
      );
      this.val += (this.val > 0) ? -dampen : dampen;
    }
  };

  DecayingAccumulator.prototype.currentValue = function () {
    this.applyDecay();
    return this.val / (this.maxValueSeen || 1);
  };

  DecayingAccumulator.prototype.nudge = function (value) {
    this.applyDecay();
    this.lastNudgedAt = (new Date()).getTime();
    this.val += value;
    this.maxValueSeen = Math.max(this.maxValueSeen, Math.abs(this.val));
  };

  return DecayingAccumulator;
});
