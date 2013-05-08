var DecayingAccumulator = require('../DecayingAccumulator'),
  assert = require('assert');

describe('DecayingAccumulator', function(){
  describe('#currentValue()', function(){
    var dac;
    beforeEach(function() {
      dac = new DecayingAccumulator;
    });
    it('should start at zero', function() {
      assert.equal(dac.currentValue(), 0);
    });
    it('the first vote counts fully', function() {
      dac.nudge(1);
      assert.equal(dac.currentValue(), 1);
    });
    it('two initial votes count as one', function() {
      dac.nudge(1);
      dac.nudge(1);
      assert.equal(dac.currentValue(), 1);
    });
  });
});
