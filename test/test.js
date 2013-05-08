var DecayingAccumulator = require('../DecayingAccumulator'),
  assert = require('assert');

describe('DecayingAccumulator', function(){
  describe('#currentValue()', function(){
    context('when called initially', function() {
      var dac;
      beforeEach(function() {
        dac = new DecayingAccumulator();
      });
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
  });
});
