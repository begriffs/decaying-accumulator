var DecayingAccumulator = require('../DecayingAccumulator'),
  chai       = require('chai'),
  assert     = chai.assert,
  expect     = chai.expect,
  sinon      = require('sinon'),
  _          = require('underscore'),
  freezeTime = function(epoch) {
    if(Date.prototype.getTime.restore) {
      Date.prototype.getTime.restore();
    }
    sinon.stub(Date.prototype, 'getTime', function() { return epoch; });
  };

describe('DecayingAccumulator', function() {
  var dac, decayUnit = 1000;
  beforeEach(function() {
    dac = new DecayingAccumulator({decaySpeed: decayUnit});
    freezeTime(0);
  });

  describe('#currentValue()', function() {
    context('when called initially', function() {
      it('should start at zero', function() {
        assert.equal(dac.currentValue(), 0);
      });
      it('the first vote counts fully', function() {
        dac.nudge(1);
        assert.equal(dac.currentValue(), 1);
      });
      it('two votes count as one', function() {
        dac.nudge(1);
        dac.nudge(1);
        assert.equal(dac.currentValue(), 1);
      });
      it('the first downvote counts fully', function() {
        dac.nudge(-1);
        assert.equal(dac.currentValue(), -1);
      });
      it('two downvotes count as one', function() {
        dac.nudge(-1);
        dac.nudge(-1);
        assert.equal(dac.currentValue(), -1);
      });
      it('conflicting votes cancel', function() {
        dac.nudge(1);
        dac.nudge(-1);
        assert.equal(dac.currentValue(), 0);
      });
      it('a large vote rescales the axis', function() {
        dac.nudge(2);
        dac.nudge(-1);
        assert.equal(dac.currentValue(), 0.5);
      });
      it('a large internal vote does not rescale', function() {
        dac.nudge(-1);
        dac.nudge(2);
        assert.equal(dac.currentValue(), 1);
      });
    });

    context('when called over time', function() {
      it('decays downward fully after one decay unit', function() {
        dac.nudge(1);
        freezeTime(decayUnit);
        assert.equal(dac.currentValue(), 0);
      });
      it('does not jitter at zero', function() {
        dac.nudge(1);
        freezeTime(decayUnit * 0.9);
        dac.currentValue();
        freezeTime(decayUnit * 1.001);
        assert.equal(dac.currentValue(), 0);
      });
      it('decays downward fully even with more nudges', function() {
        dac.nudge(1);
        dac.nudge(1);
        freezeTime(decayUnit);
        assert.equal(dac.currentValue(), 0);
      });
      it('decays upward fully after one decay unit', function() {
        dac.nudge(-1);
        freezeTime(decayUnit);
        assert.equal(dac.currentValue(), 0);
      });
      it('if unmoved it remains at zero forever', function() {
        assert.equal(dac.currentValue(), 0);
        freezeTime(decayUnit * 1000000);
        assert.equal(dac.currentValue(), 0);
      });
      it('does not decay below zero once nudged', function() {
        dac.nudge(1);
        freezeTime(decayUnit * 2);
        assert.equal(dac.currentValue(), 0);
      });
      it('decays monotonically', function() {
        dac.nudge(1);
        var samples = _.map(
          [0, 0.25, 0.5, 1],
          function (t) {
            freezeTime(t*decayUnit);
            return dac.currentValue();
          }
        );
        _.each([0,1,2], function (i) {
          expect(samples[i]).to.be.above(samples[i+1]);
        });
      });
      it('maxes out at one even after some decay', function() {
        dac.nudge(1);
        freezeTime(decayUnit / 2);
        dac.nudge(1);
        assert.equal(dac.currentValue(), 1);
      });
      it('builds tolerance after nudges', function() {
        dac.nudge(1);
        dac.nudge(1);
        dac.nudge(1);
        dac.nudge(1);
        freezeTime(decayUnit);
        dac.nudge(1);
        assert.equal(dac.currentValue(), 0.25);
      });
      it('does not change its rate of decay when observed', function() {
        var dac2 = new DecayingAccumulator(decayUnit);
        dac.nudge(1);
        dac2.nudge(1);
        freezeTime(decayUnit / 4);
        dac.currentValue();
        freezeTime(decayUnit / 3);
        dac.currentValue();
        freezeTime(decayUnit / 2);
        dac.currentValue();

        assert.equal(dac.currentValue(), dac2.currentValue());
      });
      it('does not change its rate of decay by vote frequency', function() {
        var dac2 = new DecayingAccumulator(decayUnit);
        dac.nudge(1);
        dac2.nudge(1);
        dac2.nudge(1);
        dac2.nudge(1);
        freezeTime(decayUnit / 2);
        assert.equal(dac.currentValue(), dac2.currentValue());
      });
    });

    context('constructed with extended options', function() {
      it('provides defaults if necessary', function() {
        dac = new DecayingAccumulator();
        dac.nudge(1);
        assert.equal(dac.currentValue(), 1);
      });
      it('can override the initial scale', function() {
        dac = new DecayingAccumulator({decaySpeed: decayUnit, currentScale: 4});
        dac.nudge(1);
        assert.equal(dac.currentValue(), 0.25);
      });
    });
  });

  describe('#nudge()', function() {
    context('cooldown', function() {
      beforeEach(function() {
        dac = new DecayingAccumulator({
          decaySpeed: decayUnit,
          cooldownSpeed: decayUnit * 3
        });
      });
      it('regains full strength after enough inactivity', function() {
        dac.nudge(2);
        freezeTime(decayUnit * 3);
        dac.nudge(1);
        assert.equal(dac.currentValue(), 1);
      });

      context('shorter than decay time', function() {
        beforeEach(function() {
          dac = new DecayingAccumulator({
            decaySpeed: decayUnit,
            cooldownSpeed: decayUnit / 2
          });
        });
        it('does not cause values greater than one', function() {
          dac.nudge(1);
          freezeTime(decayUnit * 3 / 4);
          dac.nudge(1);
          assert.equal(dac.currentValue(), 1);
        });
      });
    });
  });
});
