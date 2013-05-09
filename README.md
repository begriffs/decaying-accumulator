## A nudgeable number that tends toward zero
[![Build Status](https://travis-ci.org/begriffs/decaying-accumulator.png)](https://travis-ci.org/begriffs/decaying-accumulator)

In applications such as realtime crowd voting or an audio VU meter, we
want a number which spikes upward but decays to zero over time. This
module captures exactly this, with no extra frills.

The file `demo/votes.html` lets you play with this module through an
HTML meter and voting buttons.
