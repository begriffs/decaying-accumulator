if (typeof define !== 'function') {
  /*jshint latedef:false */
  var define = require('amdefine')(module);
}

define(function () {
  function DecayingAccumulator(decaySpeed, sampleRate) {
    this.events         = [];
    this.maxValueSeen   = 0;
    this.val            = 0;
    this.decaySpeed     = decaySpeed;
    this.toleranceSpeed = decaySpeed / 10;
    this.sampleRate     = sampleRate;

    this.nudge = function (value) {
      this.val += value;
      this.maxValueSeen = Math.max(this.maxValueSeen, this.val);
    };
  }

  DecayingAccumulator.prototype.currentValue = function () {
    return this.val / (this.maxValueSeen || 1);
  };

  return DecayingAccumulator;
});
