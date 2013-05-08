var DecayingAccumulator = require('../DecayingAccumulator'),
  assert = require('assert'),
  dac = new DecayingAccumulator;

describe('DecayingAccumulator', function(){
  describe('#currentValue()', function(){
    it('should start at zero', function(){
      assert.equal(dac.currentValue(), 0);
    });
  });
});
