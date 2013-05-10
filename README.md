## A nudgeable number that tends toward zero
[![Build Status](https://travis-ci.org/begriffs/decaying-accumulator.png)](https://travis-ci.org/begriffs/decaying-accumulator)

In applications such as realtime crowd voting or an audio VU meter, we
want a number which spikes upward but decays to zero over time. This
module captures exactly this, with no extra frills.

Try [a demo](http://begriffs.github.io/decaying-accumulator/) which ties
a graphical meter and voting buttons to this module.

## Running tests locally

    npm install
    node_modules/.bin/mocha

(Or `npm install -g mocha` to add it to your path.)
