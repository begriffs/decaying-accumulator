define(
  [
    'jquery',
    '../../DecayingAccumulator'
  ],
  function($, DecayingAccumulator) {
    $(function() {
      var dac = new DecayingAccumulator(3000);
      $('#yes').click(function () {
        dac.nudge(1);
      });
      $('#no').click(function () {
        dac.nudge(-1);
      });
      window.setInterval(
        function () {
          $('meter').val(dac.currentValue());
        },
        50
      );
    });
  }
);
