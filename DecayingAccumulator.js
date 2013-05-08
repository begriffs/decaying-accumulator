if (typeof define !== 'function') {
  var define = require('amdefine')(module);
}

define([], function (exports) {
  function DecayingAccumulator(decaySpeed, sampleRate) {
    this.events         = [];
    this.maxValueSeen   = 0;
    this.decaySpeed     = decaySpeed;
    this.toleranceSpeed = decaySpeed / 10;
    this.sampleRate     = sampleRate;

    this.nudge = function () { };
  };

  DecayingAccumulator.prototype.currentValue = function () {
    return 0;
  };

  return DecayingAccumulator;
});
