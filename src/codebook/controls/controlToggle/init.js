/*------------------------------------------------------------------------------------------------\
  Initialize controls container hide/show toggle.
\------------------------------------------------------------------------------------------------*/

import { select as d3select } from 'd3';

export function init(codebook) {
  //render the control
  var controlToggle = codebook.controls.wrap
    .append('button')
    .attr('class', 'control-toggle');

  //set the initial
  codebook.controls.controlToggle.set(codebook);

  controlToggle.on('click', function() {
    codebook.config.controlVisibility =
      d3select(this).text() == 'Hide'
        ? 'minimized' //click "-" to minimize controls
        : 'visible'; // click "+" to show controls

    codebook.controls.controlToggle.set(codebook);
  });
}
