## A nudgeable number that tends toward zero
[![Build Status](https://travis-ci.org/begriffs/decaying-accumulator.png)](https://travis-ci.org/begriffs/decaying-accumulator)

In applications such as realtime crowd voting or an audio VU meter, we
want a number which spikes upward but decays to zero over time. This
module captures exactly this, with no extra frills.

    // Create an accumulator that decays in one second
    var DecayingAccumulator = require('DecayingAccumulator'),
      dac = new DecayingAccumulator({decaySpeed: 1000});

    dac.nudge(1);
    // now dac.currentValue() === 1

    ...

    // some time later
    // 0 <= dac.currentValue() < 1

Individual nudges begin to count for less if they "bury the needle." The
`currentValue` method always returns within -1 and 1 inclusive. You can
specify an initial scale when constructing this class.

    new DecayingAccumulator({decaySpeed: 1000, currentScale: 4});
    // now currentValue() === 0.25 after nudge(1)

### Try [a demo](http://begriffs.github.io/decaying-accumulator/)

## Running tests locally

    npm install
    node_modules/.bin/mocha

(Or `npm install -g mocha` to add it to your path.)
