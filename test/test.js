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

describe('DecayingAccumulator', function(){
  describe('#currentValue()', function(){
    var dac, decayUnit = 1000;
    beforeEach(function() {
      dac = new DecayingAccumulator(decayUnit);
      freezeTime(0);
    });

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
        freezeTime(0);
        dac.nudge(1);
        freezeTime(decayUnit);
        assert.equal(dac.currentValue(), 0);
      });
      it('decays upward fully after one decay unit', function() {
        freezeTime(0);
        dac.nudge(-1);
        freezeTime(decayUnit);
        assert.equal(dac.currentValue(), 0);
      });
      it('if unmoved it remains at zero forever', function() {
        freezeTime(0);
        assert.equal(dac.currentValue(), 0);
        freezeTime(decayUnit * 1000000);
        assert.equal(dac.currentValue(), 0);
      });
      it('does not decay below zero once nudged', function() {
        freezeTime(0);
        dac.nudge(1);
        freezeTime(decayUnit * 2);
        assert.equal(dac.currentValue(), 0);
      });
      it('decays monotonically', function() {
        dac.nudge(1);

        var samples = _.map(
          [0, 0.25, 0.5, 1],
          function (t) {
            freezeTime(t);
            return dac.currentValue();
          }
        );

        _.each([0,1,2], function (i) {
          expect(samples[i]).to.be.above(samples[i+1]);
        });
      });
    });
  });
});
